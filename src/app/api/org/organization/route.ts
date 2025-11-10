import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getOrgContext } from "@/lib/server/org-context";
import { ensureEmailIsValid } from "@/lib/arcjet";
import {
  organizationFormSchema,
  OrganizationFormValues,
} from "@/lib/validators/organization";
import {
  normalizeFirestoreOrganization,
  mapOrganizationResponse,
  buildClerkOrganizationMetadata,
  buildFirestoreOrganizationPayload,
} from "@/lib/organization-utils";
import { ActivityLogService } from "@/lib/activity-log-service";

const parseMetadata = (metadata?: string | null) => {
  if (!metadata) return null;
  const trimmed = metadata.trim();
  if (!trimmed) return null;
  return JSON.parse(trimmed) as Record<string, unknown>;
};

export async function GET() {
  try {
    const { client, organizationId } = await getOrgContext();

    const clerkOrg = await client.organizations.getOrganization({
      organizationId,
    });
    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    const normalizedOrg = normalizeFirestoreOrganization(
      organizationId,
      orgDoc.exists() ? orgDoc.data() : {}
    );

    const organization = mapOrganizationResponse(normalizedOrg, clerkOrg);

    return NextResponse.json({ organization });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch organization",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { client, organizationId, user, authUserId } = await getOrgContext({
      requireAdmin: true,
    });

    const body = await request.json();
    const parsed = organizationFormSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const values: OrganizationFormValues = parsed.data;

    try {
      const arcjetRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
      });
      await ensureEmailIsValid(arcjetRequest, values.primaryEmail);
    } catch (validationError) {
      const status =
        (validationError as { status?: number } | undefined)?.status ?? 400;
      return NextResponse.json(
        {
          error: "Invalid organization email",
          details: (validationError as Error).message,
        },
        { status }
      );
    }

    const parsedMetadata = parseMetadata(values.metadata);

    await client.organizations.updateOrganization(organizationId, {
      name: values.name,
      slug: values.slug,
      publicMetadata: buildClerkOrganizationMetadata(values, parsedMetadata),
    });

    const firestorePayload = buildFirestoreOrganizationPayload(
      values,
      parsedMetadata
    );

    await updateDoc(doc(db, "organizations", organizationId), {
      ...firestorePayload,
      updatedAt: serverTimestamp(),
    });

    await ActivityLogService.logActivity({
      organizationId,
      userId: authUserId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Organization Admin",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "organization_updated",
      category: "organization",
      resourceType: "organization",
      resourceId: organizationId,
      resourceName: values.name,
      description: "Updated organization profile settings",
      severity: "info",
    });

    const clerkOrg = await client.organizations.getOrganization({
      organizationId,
    });
    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    const normalizedOrg = normalizeFirestoreOrganization(
      organizationId,
      orgDoc.exists() ? orgDoc.data() : {}
    );

    const organization = mapOrganizationResponse(normalizedOrg, clerkOrg);

    return NextResponse.json({
      success: true,
      organization,
    });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error updating organization:", error);
    return NextResponse.json(
      {
        error: "Failed to update organization",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
