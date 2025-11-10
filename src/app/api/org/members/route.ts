import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOrgContext } from "@/lib/server/org-context";
import { ensureEmailIsValid } from "@/lib/arcjet";
import { memberFormSchema, MemberFormValues } from "@/lib/validators/member";
import {
  normalizeFirestoreMember,
  mapMemberResponse,
  parseMemberMetadata,
  buildMemberFirestorePayload,
  buildMemberClerkMetadata,
} from "@/lib/member-utils";
import { ActivityLogService } from "@/lib/activity-log-service";

const INVITED_STATUSES = new Set(["invited", "pending"]);

type ClerkUserLite = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl?: string | null;
};

export async function GET() {
  try {
    const { client, organizationId } = await getOrgContext();

    const memberships =
      await client.organizations.getOrganizationMembershipList({
        organizationId,
        limit: 100,
      });

    const members = await Promise.all(
      memberships.data.map(async (membership) => {
        const userId = membership.publicUserData?.userId || membership.id;

        const clerkUser = await client.users.getUser(userId);
        const memberDoc = await getDoc(doc(db, "users", userId));
        const normalizedMember = normalizeFirestoreMember(
          userId,
          memberDoc.exists() ? memberDoc.data() : {}
        );

        const mapped = mapMemberResponse(
          normalizedMember,
          clerkUser as ClerkUserLite,
          membership.organization.name || undefined
        );

        if (membership.publicMetadata?.status) {
          mapped.status = membership.publicMetadata.status as string;
        }

        mapped.organizationId = organizationId;
        mapped.organizationName =
          membership.organization.name || mapped.organizationName;

        return mapped;
      })
    );

    const stats = {
      total: members.length,
      active: members.filter((member) => member.status === "active").length,
      invited: members.filter((member) => INVITED_STATUSES.has(member.status))
        .length,
      admins: members.filter((member) =>
        ["org_admin", "org_manager"].includes(member.role)
      ).length,
    };

    return NextResponse.json({
      members,
      stats,
      total: members.length,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error fetching organization members:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch members",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { client, user, organizationId, authUserId } = await getOrgContext({
      requireAdmin: true,
    });

    const body = await request.json();
    const parsed = memberFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const values: MemberFormValues = {
      ...parsed.data,
      organizationId,
      status: "invited",
      sendInvite: parsed.data.sendInvite ?? true,
      allowDashboardAccess: parsed.data.allowDashboardAccess ?? true,
      requireMfa: parsed.data.requireMfa ?? false,
    };

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
        primaryOrganizationId: organizationId,
        primaryRole: values.role,
      },
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
    };

    const clerkUser = await client.users.createUser(createUserPayload);

    if (values.sendInvite) {
      try {
        const invitation: Record<string, unknown> = {
          emailAddress: values.email,
        };
        if (process.env.CLERK_INVITE_REDIRECT_URL) {
          invitation.redirectUrl = process.env.CLERK_INVITE_REDIRECT_URL;
        }
        await client.invitations.createInvitation(
          invitation as Parameters<
            typeof client.invitations.createInvitation
          >[0]
        );
      } catch (inviteError) {
        console.warn("Failed to send invitation email:", inviteError);
      }
    }

    await client.organizations.createOrganizationMembership({
      organizationId,
      userId: clerkUser.id,
      role: values.role === "org_admin" ? "org:admin" : "org:member",
    });

    const firestorePayload = {
      ...buildMemberFirestorePayload(values, parsedMetadata),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", clerkUser.id), firestorePayload, {
      merge: true,
    });

    await ActivityLogService.logActivity({
      organizationId,
      userId: authUserId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Organization Admin",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "member_invited",
      category: "user",
      resourceType: "member",
      resourceId: clerkUser.id,
      resourceName:
        `${values.firstName} ${values.lastName}`.trim() || values.email,
      description: `Invited ${values.email} to the organization`,
      severity: "info",
    });

    const normalizedMember = normalizeFirestoreMember(clerkUser.id, {
      ...firestorePayload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const responseMember = mapMemberResponse(
      normalizedMember,
      clerkUser as ClerkUserLite,
      undefined
    );

    responseMember.organizationId = organizationId;

    return NextResponse.json({
      success: true,
      member: responseMember,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error creating member:", error);
    return NextResponse.json(
      {
        error: "Failed to invite member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
