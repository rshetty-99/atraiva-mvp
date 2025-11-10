import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { db } from "@/lib/firebase";
import { ensureEmailIsValid } from "@/lib/arcjet";
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { memberFormSchema } from "@/lib/validators/member";
import {
  normalizeFirestoreMember,
  mapMemberResponse,
  parseMemberMetadata,
  buildMemberFirestorePayload,
  buildMemberClerkMetadata,
} from "@/lib/member-utils";
import { ActivityLogService } from "@/lib/activity-log-service";

// Minimal Clerk user shape used in this route
type ClerkOrgMeta = { primaryOrganization?: { id?: string; role?: string } };
type ClerkUserLite = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl?: string | null;
  createdAt?: string | number | Date | null;
  lastSignInAt?: string | number | Date | null;
  publicMetadata?: { atraiva?: ClerkOrgMeta } | Record<string, unknown>;
  privateMetadata?: Record<string, unknown> & {
    primaryOrganizationId?: string;
    organizationId?: string;
    primaryRole?: string;
  };
};

const authorizePlatformAdmin = async (userId: string) => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is required for member endpoints");
  }

  const client = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const user = await client.users.getUser(userId);
  const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
  const userRole = metadata.primaryOrganization?.role ?? "";

  if (userRole !== "platform_admin" && userRole !== "super_admin") {
    throw new Error("forbidden");
  }

  return { client, user } as const;
};

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk to check role
    const client = await clerkClient();
    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

    // Only platform_admin and super_admin can access this
    if (userRole !== "platform_admin" && userRole !== "super_admin") {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: `Access denied. Your role: ${
            userRole || "unknown"
          }. Required: platform_admin or super_admin`,
        },
        { status: 403 }
      );
    }

    // Get filter parameter
    const { searchParams } = new URL(request.url);
    const orgFilter = searchParams.get("organizationId");

    // Get all users from Clerk
    let allUsers: ClerkUserLite[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 100;

    while (hasMore) {
      const usersResponse = await client.users.getUserList({
        limit,
        offset,
      });

      allUsers = [...allUsers, ...usersResponse.data];
      hasMore = usersResponse.data.length === limit;
      offset += limit;

      // Safety limit to prevent infinite loops
      if (offset > 1000) break;
    }

    // Get all organizations to map org IDs to names
    const organizationsRef = collection(db, "organizations");
    const organizationsSnapshot = await getDocs(organizationsRef);
    const orgsMap = new Map<string, { name?: string; slug?: string }>();

    organizationsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      orgsMap.set(doc.id, {
        name: data.name,
        slug: data.slug,
      });
    });

    // Get Firestore user data
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);
    const firestoreUsersMap = new Map<
      string,
      ReturnType<typeof normalizeFirestoreMember>
    >();

    usersSnapshot.docs.forEach((docSnapshot) => {
      firestoreUsersMap.set(
        docSnapshot.id,
        normalizeFirestoreMember(docSnapshot.id, docSnapshot.data())
      );
    });

    // Enrich users with organization data
    const enrichedUsers = await Promise.all(
      allUsers.map(async (clerkUser) => {
        const firestoreData =
          firestoreUsersMap.get(clerkUser.id) ??
          normalizeFirestoreMember(clerkUser.id, {});

        let organizationId = firestoreData.organizationId || null;
        let role = firestoreData.role || "org_viewer";

        const userMetadata = (clerkUser.publicMetadata?.atraiva ??
          {}) as ClerkOrgMeta;
        if (
          !organizationId &&
          userMetadata?.primaryOrganization?.id &&
          userMetadata.primaryOrganization.id !== "temp"
        ) {
          organizationId = userMetadata.primaryOrganization.id;
          role = userMetadata.primaryOrganization.role || role;
        }

        if (
          !organizationId &&
          (clerkUser.privateMetadata?.primaryOrganizationId ||
            clerkUser.privateMetadata?.organizationId)
        ) {
          organizationId = String(
            clerkUser.privateMetadata?.primaryOrganizationId ||
              clerkUser.privateMetadata?.organizationId
          );
          role =
            (clerkUser.privateMetadata?.primaryRole as string | undefined) ||
            role;
        }

        if (!organizationId) {
          try {
            const memberships =
              await client.users.getOrganizationMembershipList({
                userId: clerkUser.id,
              });
            if (memberships.data && memberships.data.length > 0) {
              const membership = memberships.data[0];
              organizationId = membership.organization.id;
              role =
                membership.role === "org:admin"
                  ? "org_admin"
                  : role || "org_viewer";
            }
          } catch {
            console.log(
              `No organization memberships found for user ${clerkUser.id}`
            );
          }
        }

        const mergedMember = {
          ...firestoreData,
          firstName: firestoreData.firstName || clerkUser.firstName || "",
          lastName: firestoreData.lastName || clerkUser.lastName || "",
          email:
            firestoreData.email ||
            clerkUser.emailAddresses[0]?.emailAddress ||
            "No email",
          role,
          status:
            firestoreData.status ||
            ((clerkUser.publicMetadata as Record<string, unknown>)?.status as
              | string
              | undefined) ||
            "active",
          organizationId,
        };

        const organizationName = organizationId
          ? orgsMap.get(organizationId)?.name || "Unknown Org"
          : "No Organization";

        return mapMemberResponse(
          mergedMember,
          clerkUser as ClerkUserLite,
          organizationName
        );
      })
    );

    // Filter by organization if specified
    const filteredUsers = orgFilter
      ? enrichedUsers.filter((user) => user.organizationId === orgFilter)
      : enrichedUsers;

    // Get pending invitations count
    const invitationsQuery = query(
      collection(db, "memberInvitations"),
      where("status", "in", ["pending", "sent"])
    );
    const invitationsSnapshot = await getDocs(invitationsQuery);
    const pendingInvitationsCount = invitationsSnapshot.size;

    // Calculate stats
    const stats = {
      total: enrichedUsers.length,
      active: enrichedUsers.filter((user) => user.status === "active").length,
      admins: enrichedUsers.filter(
        (user) =>
          user.role === "super_admin" ||
          user.role === "platform_admin" ||
          user.role === "org_admin"
      ).length,
      noOrg: enrichedUsers.filter((user) => !user.organizationId).length,
      pendingInvitations: pendingInvitationsCount,
    };

    return NextResponse.json({
      members: filteredUsers,
      stats,
      total: filteredUsers.length,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { client, user } = await authorizePlatformAdmin(authData.userId);

    const body = await request.json();
    const parsed = memberFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const values = parsed.data;

    try {
      const arcjetRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
      });
      await ensureEmailIsValid(arcjetRequest, values.email);
    } catch (validationError) {
      const status =
        (validationError as { status?: number } | undefined)?.status ?? 400;
      return NextResponse.json(
        {
          error: "Invalid email address",
          details: (validationError as Error).message,
        },
        { status }
      );
    }

    let parsedMetadata: Record<string, unknown> | null = null;
    try {
      parsedMetadata = parseMemberMetadata(values.metadata);
    } catch (metadataError) {
      return NextResponse.json(
        {
          error: "Invalid metadata",
          details:
            metadataError instanceof Error
              ? metadataError.message
              : "Metadata must be valid JSON",
        },
        { status: 400 }
      );
    }

    const publicMetadata = buildMemberClerkMetadata(values, parsedMetadata);

    const createUserPayload: Parameters<typeof client.users.createUser>[0] = {
      emailAddress: [values.email],
      firstName: values.firstName,
      lastName: values.lastName,
      publicMetadata,
      privateMetadata: {
        primaryOrganizationId: values.organizationId ?? undefined,
        primaryRole: values.role,
      },
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
    };

    const clerkUser = await client.users.createUser(createUserPayload);

    if (values.sendInvite) {
      try {
        await client.invitations.createInvitation({
          emailAddress: values.email,
          redirectUrl: process.env.CLERK_INVITE_REDIRECT_URL,
        });
      } catch (inviteError) {
        console.warn("Failed to send invitation email:", inviteError);
      }
    }

    if (values.organizationId) {
      try {
        await client.organizations.createOrganizationMembership({
          organizationId: values.organizationId,
          userId: clerkUser.id,
          role: values.role === "org_admin" ? "org:admin" : "org:member",
        });
      } catch (membershipError) {
        console.error(
          "Failed to create organization membership:",
          membershipError
        );
      }
    }

    const firestorePayload = {
      ...buildMemberFirestorePayload(values, parsedMetadata),
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", clerkUser.id), firestorePayload, {
      merge: true,
    });

    let organizationName: string | undefined;
    if (values.organizationId) {
      try {
        const orgDoc = await getDoc(
          doc(db, "organizations", values.organizationId)
        );
        if (orgDoc.exists()) {
          organizationName = (orgDoc.data().name as string) || undefined;
        }
      } catch {
        // ignore
      }
    }

    await ActivityLogService.logActivity({
      organizationId: values.organizationId || "platform_admin",
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "member_created",
      category: "user",
      resourceType: "member",
      resourceId: clerkUser.id,
      resourceName: `${values.firstName} ${values.lastName}`.trim(),
      description: `Member ${values.email} created with role ${values.role}`,
      metadata: {
        organizationId: values.organizationId,
        role: values.role,
      },
    });

    const normalizedMember = normalizeFirestoreMember(clerkUser.id, {
      ...firestorePayload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const responseMember = mapMemberResponse(
      normalizedMember,
      clerkUser as ClerkUserLite,
      organizationName
    );

    return NextResponse.json({
      success: true,
      member: responseMember,
    });
  } catch (error) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
