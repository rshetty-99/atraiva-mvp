import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { ActivityLogService } from "@/lib/activity-log-service";

// Type for Clerk metadata
type ClerkOrgMeta = { primaryOrganization?: { role?: string } };

export async function GET() {
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

    // Get all organizations from Firestore
    const organizationsRef = collection(db, "organizations");
    const organizationsSnapshot = await getDocs(organizationsRef);

    const firestoreOrgs = organizationsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "",
        industry: data.industry || "",
        size: data.size || "small",
        country: data.country || "",
        state: data.state || "",
        applicableRegulations: data.applicableRegulations || [],
        subscriptionPlan: data.subscriptionPlan || "free",
        subscriptionStatus: data.subscriptionStatus || "active",
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
      };
    });

    // Get Clerk organizations to enrich data
    const clerkOrgsResponse = await client.organizations.getOrganizationList({
      limit: 100,
    });

    // Merge Firestore and Clerk data
    const enrichedOrgs = firestoreOrgs.map((org) => {
      const clerkOrg = clerkOrgsResponse.data.find((co) => co.id === org.id);
      return {
        ...org,
        clerkName: clerkOrg?.name || org.name,
        clerkSlug: clerkOrg?.slug || "",
        membersCount: clerkOrg?.membersCount || 0,
        imageUrl: clerkOrg?.imageUrl || "",
      };
    });

    // Get registration links for onboarding count
    // Include both "pending" (not sent) and "sent" (email sent but not completed)
    // Exclude "used" (completed), "expired", and "cancelled"
    const registrationLinksRef = collection(db, "registrationLinks");
    const onboardingQuery = query(
      registrationLinksRef,
      where("status", "in", ["pending", "sent"]),
      where("paymentStatus", "==", "completed")
    );
    const onboardingSnapshot = await getDocs(onboardingQuery);
    const onboardingCount = onboardingSnapshot.size;

    // Calculate stats
    const stats = {
      total: enrichedOrgs.length,
      active: enrichedOrgs.filter((org) => org.subscriptionStatus === "active")
        .length,
      onboarding: onboardingCount,
      expired: enrichedOrgs.filter(
        (org) =>
          org.subscriptionStatus === "canceled" ||
          org.subscriptionStatus === "past_due"
      ).length,
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

    // Get user from Clerk to check role
    const client = await clerkClient();
    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

    // Only platform_admin and super_admin can create organizations
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

    // Create organization in Clerk first
    const clerkOrg = await client.organizations.createOrganization({
      name: body.name,
      slug: body.slug,
    });

    // Create organization in Firestore
    const orgRef = doc(db, "organizations", clerkOrg.id);

    await setDoc(orgRef, {
      name: body.name,
      industry: body.industry || "",
      size: body.size || "small",
      country: body.country || "",
      state: body.state || "",
      applicableRegulations: body.applicableRegulations || [],
      subscriptionPlan: body.subscriptionPlan || "free",
      subscriptionStatus: body.subscriptionStatus || "trialing",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Log organization creation activity
    await ActivityLogService.logOrganizationCreated({
      organizationId: clerkOrg.id,
      organizationName: body.name,
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      metadata: {
        industry: body.industry,
        size: body.size,
        country: body.country,
        subscriptionPlan: body.subscriptionPlan,
        subscriptionStatus: body.subscriptionStatus,
      },
    });

    return NextResponse.json({
      success: true,
      organizationId: clerkOrg.id,
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
