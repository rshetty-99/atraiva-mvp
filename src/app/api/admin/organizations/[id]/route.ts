import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ActivityLogService } from "@/lib/activity-log-service";
import { organizationFormSchema } from "@/lib/validators/organization";
import {
  normalizeFirestoreOrganization,
  mapOrganizationResponse,
  buildClerkOrganizationMetadata,
  buildFirestoreOrganizationPayload,
  parseOrganizationMetadata,
  type ClerkOrganizationLite,
} from "@/lib/organization-utils";

type ClerkOrgMeta = { primaryOrganization?: { role?: string } };

type ClerkUserLite = {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl?: string | null;
  createdAt?: number | string | Date | null;
  lastSignInAt?: number | string | Date | null;
};

const getClerkStatus = (error: unknown): number | undefined => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: number }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
};

const authorizePlatformAdmin = async (userId: string) => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is required for organization endpoints");
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { client } = await authorizePlatformAdmin(authData.userId);

    const { id: organizationId } = await params;

    const firestoreDoc = await getDoc(doc(db, "organizations", organizationId));
    const firestoreData = firestoreDoc.exists() ? firestoreDoc.data() : {};
    const normalizedOrg = normalizeFirestoreOrganization(
      organizationId,
      firestoreData
    );

    let clerkOrg: ClerkOrganizationLite | undefined;
    try {
      clerkOrg = await client.organizations.getOrganization({
        organizationId,
      });
    } catch (clerkError: unknown) {
      const status = getClerkStatus(clerkError);
      if (status === 404) {
        console.warn(
          `Clerk organization ${organizationId} not found; falling back to Firestore data.`
        );
      } else {
        throw clerkError;
      }
    }

    const organization = mapOrganizationResponse(normalizedOrg, clerkOrg);

    let members: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      imageUrl?: string;
      role: string;
      createdAt: Date;
      lastSignInAt: Date | null;
    }> = [];

    if (clerkOrg) {
      try {
        const membersResponse =
          await client.organizations.getOrganizationMembershipList({
            organizationId,
            limit: 100,
          });

        const fetchedMembers = await Promise.all(
          membersResponse.data.map(async (membership) => {
            const userId = membership.publicUserData?.userId;
            if (!userId) return null;
            try {
              const clerkUser = await client.users.getUser(userId);
              const member: ClerkUserLite = clerkUser;
              return {
                id: member.id,
                firstName: member.firstName || "",
                lastName: member.lastName || "",
                email: member.emailAddresses[0]?.emailAddress || "",
                imageUrl: member.imageUrl || undefined,
                role: membership.role,
                createdAt: member.createdAt
                  ? new Date(member.createdAt)
                  : new Date(),
                lastSignInAt: member.lastSignInAt
                  ? new Date(member.lastSignInAt)
                  : null,
              };
            } catch (memberError) {
              console.error("Error fetching member", memberError);
              return null;
            }
          })
        );

        members = fetchedMembers.filter(
          (member): member is NonNullable<typeof member> => member !== null
        );
      } catch (membershipError: unknown) {
        const status = getClerkStatus(membershipError);
        if (status === 404) {
          console.warn(
            `No membership list available for Clerk organization ${organizationId}.`
          );
        } else {
          throw membershipError;
        }
      }
    }

    return NextResponse.json({ organization, members });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json(
        {
          error: "Forbidden",
          details:
            "Access denied. Required role: platform_admin or super_admin.",
        },
        { status: 403 }
      );
    }
    console.error("Error fetching organization details:", error);
    return NextResponse.json(
      { error: "Failed to fetch organization details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { client, user } = await authorizePlatformAdmin(authData.userId);

    const { id: organizationId } = await params;

    const body = await request.json();
    const parsed = organizationFormSchema.safeParse(body);

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
    let parsedMetadata: Record<string, unknown> | null = null;
    try {
      parsedMetadata = parseOrganizationMetadata(values.metadata);
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

    const existingDoc = await getDoc(doc(db, "organizations", organizationId));
    const oldData = existingDoc.exists() ? existingDoc.data() : {};
    const oldNormalized = normalizeFirestoreOrganization(
      organizationId,
      oldData
    );

    await client.organizations.updateOrganization(organizationId, {
      name: values.name,
      slug: values.slug,
      publicMetadata: buildClerkOrganizationMetadata(values, parsedMetadata),
    });

    const firestorePayload = buildFirestoreOrganizationPayload(
      values,
      parsedMetadata
    );

    await updateDoc(doc(db, "organizations", organizationId), firestorePayload);

    const updatedDoc = await getDoc(doc(db, "organizations", organizationId));
    const updatedNormalized = normalizeFirestoreOrganization(
      organizationId,
      updatedDoc.exists() ? updatedDoc.data() : {}
    );

    const fieldsToCompare: Array<keyof typeof oldNormalized> = [
      "name",
      "plan",
      "status",
      "timezone",
      "industry",
      "primaryEmail",
      "phone",
      "description",
      "address",
    ];

    const changes: { field: string; oldValue?: unknown; newValue?: unknown }[] =
      [];

    fieldsToCompare.forEach((field) => {
      if (oldNormalized[field] !== updatedNormalized[field]) {
        changes.push({
          field,
          oldValue: oldNormalized[field],
          newValue: updatedNormalized[field],
        });
      }
    });

    if (
      oldNormalized.notifyOnIncidents !== updatedNormalized.notifyOnIncidents
    ) {
      changes.push({
        field: "notifyOnIncidents",
        oldValue: oldNormalized.notifyOnIncidents,
        newValue: updatedNormalized.notifyOnIncidents,
      });
    }

    if (oldNormalized.requireMfa !== updatedNormalized.requireMfa) {
      changes.push({
        field: "requireMfa",
        oldValue: oldNormalized.requireMfa,
        newValue: updatedNormalized.requireMfa,
      });
    }

    if (oldNormalized.shareReports !== updatedNormalized.shareReports) {
      changes.push({
        field: "shareReports",
        oldValue: oldNormalized.shareReports,
        newValue: updatedNormalized.shareReports,
      });
    }

    if (changes.length > 0) {
      await ActivityLogService.logOrganizationUpdated({
        organizationId,
        organizationName: updatedNormalized.name,
        userId: authData.userId,
        userName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.emailAddresses[0]?.emailAddress ||
          "Unknown",
        userEmail: user.emailAddresses[0]?.emailAddress || "",
        changes,
      });
    }

    let clerkOrg;
    try {
      clerkOrg = await client.organizations.getOrganization({
        organizationId,
      });
    } catch (clerkError: unknown) {
      const status = getClerkStatus(clerkError);
      if (status === 404) {
        console.warn(
          `Clerk organization ${organizationId} not found after update; response will use Firestore data.`
        );
      } else {
        throw clerkError;
      }
    }

    const responseOrg = mapOrganizationResponse(updatedNormalized, clerkOrg);

    return NextResponse.json({
      success: true,
      organization: responseOrg,
      changes,
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json(
        {
          error: "Forbidden",
          details:
            "Access denied. Required role: platform_admin or super_admin.",
        },
        { status: 403 }
      );
    }
    console.error("Error updating organization:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { client, user } = await authorizePlatformAdmin(authData.userId);
    const { id: organizationId } = await params;

    await client.organizations.deleteOrganization(organizationId);
    await deleteDoc(doc(db, "organizations", organizationId));

    await ActivityLogService.logActivity({
      organizationId,
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "organization_deleted",
      category: "organization",
      resourceType: "organization",
      resourceId: organizationId,
      description: `Organization ${organizationId} deleted by ${
        user.firstName || user.emailAddresses[0]?.emailAddress || "user"
      }`,
      severity: "critical",
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "forbidden") {
      return NextResponse.json(
        {
          error: "Forbidden",
          details:
            "Access denied. Required role: platform_admin or super_admin.",
        },
        { status: 403 }
      );
    }
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 }
    );
  }
}
