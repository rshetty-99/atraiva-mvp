import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ActivityLogService } from "@/lib/activity-log-service";
import { ensureEmailIsValid } from "@/lib/arcjet";
import { organizationFormSchema } from "@/lib/validators/organization";
import {
  normalizeFirestoreOrganization,
  mapOrganizationResponse,
  buildClerkOrganizationMetadata,
  buildFirestoreOrganizationPayload,
  parseOrganizationMetadata,
} from "@/lib/organization-utils";

type ClerkOrgMeta = { primaryOrganization?: { role?: string } };

export async function GET() {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(authData.userId);
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

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

    const organizationsSnapshot = await getDocs(
      collection(db, "organizations")
    );
    const firestoreOrgs = organizationsSnapshot.docs.map((snapshot) =>
      normalizeFirestoreOrganization(snapshot.id, snapshot.data())
    );

    const clerkOrgsResponse = await client.organizations.getOrganizationList({
      limit: 100,
    });
    const clerkOrgMap = new Map(
      clerkOrgsResponse.data.map((org) => [org.id, org])
    );

    const enrichedOrgs = firestoreOrgs.map((org) =>
      mapOrganizationResponse(org, clerkOrgMap.get(org.id) || undefined)
    );

    const registrationLinksRef = collection(db, "registrationLinks");
    const onboardingQuery = query(
      registrationLinksRef,
      where("status", "in", ["pending", "sent"]),
      where("paymentStatus", "==", "completed")
    );
    const onboardingSnapshot = await getDocs(onboardingQuery);

    const stats = {
      total: enrichedOrgs.length,
      active: enrichedOrgs.filter((org) => org.status === "active").length,
      onboarding: onboardingSnapshot.size,
      expired: enrichedOrgs.filter((org) => org.status === "inactive").length,
    };

    return NextResponse.json({
      organizations: enrichedOrgs,
      stats,
      total: enrichedOrgs.length,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
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

    const client = await clerkClient();
    const user = await client.users.getUser(authData.userId);
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

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

    const clerkOrg = await client.organizations.createOrganization({
      name: values.name,
      slug: values.slug,
    });

    await client.organizations.updateOrganization(clerkOrg.id, {
      name: values.name,
      slug: values.slug,
      publicMetadata: buildClerkOrganizationMetadata(values, parsedMetadata),
    });

    const firestorePayload = buildFirestoreOrganizationPayload(
      values,
      parsedMetadata
    );

    await setDoc(doc(db, "organizations", clerkOrg.id), {
      ...firestorePayload,
      createdAt: serverTimestamp(),
    });

    await ActivityLogService.logOrganizationCreated({
      organizationId: clerkOrg.id,
      organizationName: values.name,
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      metadata: {
        plan: values.plan,
        status: values.status,
        timezone: values.timezone,
        industry: values.industry,
        notifyOnIncidents: values.notifyOnIncidents,
        requireMfa: values.requireMfa,
        shareReports: values.shareReports,
      },
    });

    const normalizedOrg = normalizeFirestoreOrganization(clerkOrg.id, {
      ...firestorePayload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clerkDetails = await client.organizations.getOrganization({
      organizationId: clerkOrg.id,
    });

    const responseOrg = mapOrganizationResponse(normalizedOrg, clerkDetails);

    return NextResponse.json({
      success: true,
      organization: responseOrg,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
