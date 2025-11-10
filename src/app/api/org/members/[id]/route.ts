import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOrgContext } from "@/lib/server/org-context";
import {
  memberFormSchema,
  MemberFormValues,
} from "@/lib/validators/member";
import {
  normalizeFirestoreMember,
  mapMemberResponse,
  parseMemberMetadata,
  buildMemberFirestorePayload,
  buildMemberClerkMetadata,
} from "@/lib/member-utils";
import { ActivityLogService } from "@/lib/activity-log-service";

const NOT_FOUND_RESPONSE = new Response(
  JSON.stringify({ error: "Member not found in organization" }),
  { status: 404 }
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client, organizationId } = await getOrgContext();
    const { id: memberId } = await params;

    const memberships = await client.users.getOrganizationMembershipList({
      userId: memberId,
      limit: 100,
    });

    const membership = memberships.data.find(
      (membership) => membership.organization.id === organizationId
    );

    if (!membership) {
      throw NOT_FOUND_RESPONSE;
    }

    const clerkUser = await client.users.getUser(memberId);
    const memberDoc = await getDoc(doc(db, "users", memberId));
    const normalizedMember = normalizeFirestoreMember(
      memberId,
      memberDoc.exists() ? memberDoc.data() : {}
    );

    const member = mapMemberResponse(
      normalizedMember,
      clerkUser as any,
      membership.organization.name || undefined
    );

    member.status =
      (membership.publicMetadata?.status as string | undefined) ||
      member.status;

    const organizations = memberships.data.map((record) => ({
      id: record.organization.id,
      name: record.organization.name,
      role: record.role === "org:admin" ? "org_admin" : "org_viewer",
      status: record.publicMetadata?.status as string | undefined,
    }));

    return NextResponse.json({
      ...member,
      phoneNumber: member.phone,
      organizations,
      twoFactorEnabled: clerkUser.twoFactorEnabled ?? false,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error retrieving organization member:", error);
    return NextResponse.json(
      {
        error: "Failed to load member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client, user, organizationId, authUserId } = await getOrgContext({
      requireAdmin: true,
    });
    const { id: memberId } = await params;

    const memberships = await client.users.getOrganizationMembershipList({
      userId: memberId,
      limit: 100,
    });

    const membership = memberships.data.find(
      (membership) => membership.organization.id === organizationId
    );

    if (!membership) {
      throw NOT_FOUND_RESPONSE;
    }

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
      status: parsed.data.status || membership.publicMetadata?.status || "active",
      sendInvite: false,
    };

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

    const clerkPayload: Record<string, unknown> = {
      firstName: values.firstName,
      lastName: values.lastName,
      publicMetadata: buildMemberClerkMetadata(values, parsedMetadata),
    };

    await client.users.updateUser(memberId, clerkPayload);

    const desiredRole =
      values.role === "org_admin" ? "org:admin" : "org:member";
    if (membership.role !== desiredRole) {
      await client.organizations.updateOrganizationMembership({
        organizationId,
        userId: memberId,
        role: desiredRole,
      });
    }

    const firestorePayload = buildMemberFirestorePayload(
      values,
      parsedMetadata
    );

    await updateDoc(doc(db, "users", memberId), firestorePayload);

    const updatedDoc = await getDoc(doc(db, "users", memberId));
    const updatedMember = normalizeFirestoreMember(
      memberId,
      updatedDoc.exists() ? updatedDoc.data() : {}
    );
    const clerkUser = await client.users.getUser(memberId);

    const responseMember = mapMemberResponse(
      updatedMember,
      clerkUser as any,
      membership.organization.name || undefined
    );

    responseMember.status = values.status;

    await ActivityLogService.logActivity({
      organizationId,
      userId: authUserId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Organization Admin",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "member_updated",
      category: "user_management",
      resourceType: "member",
      resourceId: memberId,
      resourceName: `${values.firstName} ${values.lastName}`.trim() || values.email,
      description: `Updated member ${values.email}`,
      severity: "info",
    });

    return NextResponse.json({
      success: true,
      member: responseMember,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error updating organization member:", error);
    return NextResponse.json(
      {
        error: "Failed to update member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client, user, organizationId, authUserId } = await getOrgContext({
      requireAdmin: true,
    });
    const { id: memberId } = await params;

    const memberships = await client.users.getOrganizationMembershipList({
      userId: memberId,
      limit: 100,
    });

    const membership = memberships.data.find(
      (membership) => membership.organization.id === organizationId
    );

    if (!membership) {
      throw NOT_FOUND_RESPONSE;
    }

    await client.organizations.deleteOrganizationMembership({
      organizationId,
      userId: memberId,
    });

    const memberDoc = await getDoc(doc(db, "users", memberId));
    if (memberDoc.exists()) {
      const data = memberDoc.data();
      const organizations = Array.isArray(data.organizations)
        ? (data.organizations as Array<Record<string, unknown>>).filter(
            (org) => org && org.id !== organizationId
          )
        : [];

      await updateDoc(doc(db, "users", memberId), {
        organizations,
        updatedAt: serverTimestamp(),
      });
    }

    await ActivityLogService.logActivity({
      organizationId,
      userId: authUserId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Organization Admin",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "member_removed",
      category: "user_management",
      resourceType: "member",
      resourceId: memberId,
      description: `Removed member ${memberId} from organization`,
      severity: "warning",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error removing organization member:", error);
    return NextResponse.json(
      {
        error: "Failed to remove member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

