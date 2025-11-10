import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ActivityLogService } from "@/lib/activity-log-service";
import {
  normalizeFirestoreMember,
  mapMemberResponse,
  parseMemberMetadata,
  buildMemberFirestorePayload,
  buildMemberClerkMetadata,
} from "@/lib/member-utils";
import { memberFormSchema } from "@/lib/validators/member";

type ClerkOrgMeta = { primaryOrganization?: { role?: string } };

const authorizePlatformAdmin = async (userId: string) => {
  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("Missing Clerk secret key");
  }

  const client = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });
  const user = await client.users.getUser(userId);
  const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
  const role = metadata.primaryOrganization?.role ?? "";

  if (role !== "platform_admin" && role !== "super_admin") {
    throw new Error("forbidden");
  }

  return { client, user };
};

const getOrganizationName = async (client: ReturnType<typeof createClerkClient>, organizationId?: string | null) => {
  if (!organizationId) return undefined;
  try {
    const organization = await client.organizations.getOrganization({ organizationId });
    return organization.name;
  } catch (error) {
    console.error("Failed to fetch organization name:", error);
    return undefined;
  }
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

    const { client } = await authorizePlatformAdmin(authData.userId).catch((error) => {
      if (error instanceof Error && error.message === "forbidden") {
        throw new Response(
          JSON.stringify({
            error: "Forbidden",
            details: "Access denied. Required role: platform_admin or super_admin.",
          }),
          { status: 403 }
        );
      }
      throw error;
    });

    const { id: memberId } = await params;

    const clerkUser = await client.users.getUser(memberId);
    const memberDoc = await getDoc(doc(db, "users", memberId));
    const normalizedMember = normalizeFirestoreMember(
      memberId,
      memberDoc.exists() ? memberDoc.data() : {}
    );

    const organizationName = await getOrganizationName(client, normalizedMember.organizationId || null);

    const responseMember = mapMemberResponse(
      normalizedMember,
      clerkUser as any,
      organizationName
    );

    const memberships = await client.users.getOrganizationMembershipList({
      userId: memberId,
    });

    const organizations = await Promise.all(
      memberships.data.map(async (membership) => {
        let name = membership.organization.name;
        if (!name) {
          name = await getOrganizationName(client, membership.organization.id);
        }
        return {
          id: membership.organization.id,
          name: name || "Unknown Organization",
          role: membership.role === "org:admin" ? "org_admin" : "org_viewer",
          status: membership.publicMetadata?.status || "active",
        };
      })
    );

    return NextResponse.json({
      ...responseMember,
      phoneNumber: responseMember.phone,
      organizations,
      twoFactorEnabled: clerkUser.twoFactorEnabled || false,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error fetching member:", error);
    return NextResponse.json(
      { error: "Failed to fetch member", details: error instanceof Error ? error.message : "Unknown error" },
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

    const { client, user } = await authorizePlatformAdmin(authData.userId).catch((error) => {
      if (error instanceof Error && error.message === "forbidden") {
        throw new Response(
          JSON.stringify({
            error: "Forbidden",
            details: "Access denied. Required role: platform_admin or super_admin.",
          }),
          { status: 403 }
        );
      }
      throw error;
    });

    const { id: memberId } = await params;
    const body = await request.json();
    const parsed = memberFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const values = parsed.data;
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

    const existingDoc = await getDoc(doc(db, "users", memberId));
    const previousSnapshot = normalizeFirestoreMember(
      memberId,
      existingDoc.exists() ? existingDoc.data() : {}
    );

    const clerkPayload: Record<string, unknown> = {
      firstName: values.firstName,
      lastName: values.lastName,
      publicMetadata: buildMemberClerkMetadata(values, parsedMetadata),
    };

    await client.users.updateUser(memberId, clerkPayload);

    const memberships = await client.users.getOrganizationMembershipList({
      userId: memberId,
    });
    const currentMembership = memberships.data[0];
    const desiredOrgId = values.organizationId || null;
    const desiredClerkRole = values.role === "org_admin" ? "org:admin" : "org:member";

    if (currentMembership && currentMembership.organization.id !== desiredOrgId) {
      await client.organizations.deleteOrganizationMembership({
        organizationId: currentMembership.organization.id,
        userId: memberId,
      });
    }

    if (desiredOrgId) {
      if (
        !currentMembership ||
        currentMembership.organization.id !== desiredOrgId ||
        currentMembership.role !== desiredClerkRole
      ) {
        await client.organizations.createOrganizationMembership({
          organizationId: desiredOrgId,
          userId: memberId,
          role: desiredClerkRole,
        });
      }
    }

    const firestorePayload = buildMemberFirestorePayload(values, parsedMetadata);
    await updateDoc(doc(db, "users", memberId), firestorePayload);

    const updatedDoc = await getDoc(doc(db, "users", memberId));
    const updatedSnapshot = normalizeFirestoreMember(
      memberId,
      updatedDoc.exists() ? updatedDoc.data() : {}
    );
    const updatedClerkUser = await client.users.getUser(memberId);
    const organizationName = await getOrganizationName(client, updatedSnapshot.organizationId || null);

    const responseMember = mapMemberResponse(
      updatedSnapshot,
      updatedClerkUser as any,
      organizationName
    );

    const trackedFields: Array<keyof typeof previousSnapshot> = [
      "firstName",
      "lastName",
      "role",
      "status",
      "organizationId",
      "notifyAccess",
      "requireMfa",
    ];

    const changes = trackedFields
      .filter((field) => previousSnapshot[field] !== updatedSnapshot[field])
      .map((field) => ({
        field,
        oldValue: previousSnapshot[field],
        newValue: updatedSnapshot[field],
      }));

    if (changes.length > 0) {
      await ActivityLogService.logActivity({
        organizationId: updatedSnapshot.organizationId || "platform",
        userId: authData.userId,
        userName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.emailAddresses[0]?.emailAddress ||
          "Platform Admin",
        userEmail: user.emailAddresses[0]?.emailAddress || "",
        action: "member_updated",
        category: "user_management",
        resourceType: "member",
        resourceId: memberId,
        resourceName: `${values.firstName} ${values.lastName}`.trim() || values.email,
        description: `Member ${values.email} updated`,
        changes,
        severity: "info",
      });
    }

    return NextResponse.json({
      success: true,
      member: responseMember,
      changes,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Failed to update member", details: error instanceof Error ? error.message : "Unknown error" },
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

    const { client, user } = await authorizePlatformAdmin(authData.userId).catch((error) => {
      if (error instanceof Error && error.message === "forbidden") {
        throw new Response(
          JSON.stringify({
            error: "Forbidden",
            details: "Access denied. Required role: platform_admin or super_admin.",
          }),
          { status: 403 }
        );
      }
      throw error;
    });

    const { id: memberId } = await params;

    const memberships = await client.users.getOrganizationMembershipList({
      userId: memberId,
    });
    for (const membership of memberships.data) {
      await client.organizations.deleteOrganizationMembership({
        organizationId: membership.organization.id,
        userId: memberId,
      });
    }

    await deleteDoc(doc(db, "users", memberId));

    await ActivityLogService.logActivity({
      organizationId: "platform",
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Platform Admin",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "member_deleted",
      category: "user_management",
      resourceType: "member",
      resourceId: memberId,
      description: `Member ${memberId} removed by platform.`,
      severity: "warning",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error deleting member:", error);
    return NextResponse.json(
      { error: "Failed to delete member", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

