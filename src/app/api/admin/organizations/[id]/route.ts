import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ActivityLogService } from "@/lib/activity-log-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk to check role using Backend API
    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = user.publicMetadata?.atraiva as any;
    const userRole = metadata?.primaryOrganization?.role as string;

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

    // Await params before accessing properties (Next.js 15 requirement)
    const { id: organizationId } = await params;

    // Get organization from Clerk
    const clerkOrg = await client.organizations.getOrganization({
      organizationId,
    });

    // Get organization from Firestore
    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    const orgData = orgDoc.exists() ? orgDoc.data() : {};

    // Get organization members from Clerk
    const membersResponse =
      await client.organizations.getOrganizationMembershipList({
        organizationId,
        limit: 100,
      });

    // Enrich member data with user details
    const enrichedMembers = await Promise.all(
      membersResponse.data.map(async (membership) => {
        try {
          const memberUser = await client.users.getUser(
            membership.publicUserData?.userId || ""
          );
          return {
            id: memberUser.id,
            firstName: memberUser.firstName || "",
            lastName: memberUser.lastName || "",
            email: memberUser.emailAddresses[0]?.emailAddress || "No email",
            imageUrl: memberUser.imageUrl || undefined,
            role: membership.role,
            createdAt: memberUser.createdAt
              ? new Date(memberUser.createdAt)
              : new Date(),
            lastSignInAt: memberUser.lastSignInAt
              ? new Date(memberUser.lastSignInAt)
              : undefined,
          };
        } catch (error) {
          console.error("Error fetching member user:", error);
          return null;
        }
      })
    );

    // Filter out any failed member fetches
    const validMembers = enrichedMembers.filter((m) => m !== null);

    // Find account owner (first admin or first member)
    const accountOwner = validMembers.find((m) => m?.role === "org:admin");

    // Get public metadata from Clerk (if available)
    const clerkPublicMetadata = (clerkOrg.publicMetadata as any) || {};

    // Combine organization data - prioritize Clerk publicMetadata over Firestore
    const organization = {
      id: clerkOrg.id,
      name: clerkOrg.name,
      slug: clerkOrg.slug,
      imageUrl: clerkOrg.imageUrl || undefined,
      membersCount: clerkOrg.membersCount || validMembers.length,
      subscriptionPlan:
        clerkPublicMetadata.subscriptionPlan ||
        orgData.subscriptionPlan ||
        "free",
      subscriptionStatus:
        clerkPublicMetadata.subscriptionStatus ||
        orgData.subscriptionStatus ||
        "active",
      industry: clerkPublicMetadata.industry || orgData.industry || "",
      size: clerkPublicMetadata.size || orgData.size || "1-10",
      country: clerkPublicMetadata.country || orgData.country || "",
      state: clerkPublicMetadata.state || orgData.state || "",
      city: clerkPublicMetadata.city || orgData.city || "",
      address: clerkPublicMetadata.address || orgData.address || "",
      zipCode: clerkPublicMetadata.zipCode || orgData.zipCode || "",
      website: clerkPublicMetadata.website || orgData.website || "",
      phone: clerkPublicMetadata.phone || orgData.phone || "",
      description: clerkPublicMetadata.description || orgData.description || "",
      applicableRegulations:
        clerkPublicMetadata.applicableRegulations ||
        orgData.applicableRegulations ||
        [],
      settings: clerkPublicMetadata.settings ||
        orgData.settings || {
          timezone: "UTC",
          locale: "en-US",
          notifications: {
            email: true,
            sms: false,
            push: true,
          },
        },
      createdAt: orgData.createdAt?.toDate?.() || new Date(clerkOrg.createdAt),
      updatedAt:
        orgData.updatedAt?.toDate?.() ||
        new Date(clerkOrg.updatedAt || clerkOrg.createdAt),
      accountOwner: accountOwner
        ? {
            name: `${accountOwner.firstName} ${accountOwner.lastName}`,
            email: accountOwner.email,
          }
        : undefined,
    };

    return NextResponse.json({
      organization,
      members: validMembers,
    });
  } catch (error: any) {
    console.error("Error fetching organization details:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
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

    // Get user from Clerk to check role using Backend API
    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    // Debug: Check if secret key is available
    if (!process.env.CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY is not set in environment variables");
      throw new Error("CLERK_SECRET_KEY is required for organization updates");
    }

    console.log("Using Clerk Backend API with secret key");

    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = user.publicMetadata?.atraiva as any;
    const userRole = metadata?.primaryOrganization?.role as string;

    // Only platform_admin and super_admin can update organizations
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

    // Await params before accessing properties (Next.js 15 requirement)
    const { id: organizationId } = await params;

    // Parse request body
    const updateData = await request.json();

    console.log(`Attempting to update organization: ${organizationId}`);
    console.log(`Update data:`, updateData);

    // Get existing organization data for change tracking
    const orgDoc = await getDoc(doc(db, "organizations", organizationId));
    const oldOrgData = orgDoc.data();

    // First, let's verify the organization exists using the Backend API
    let existingOrg;
    try {
      existingOrg = await client.organizations.getOrganization({
        organizationId,
      });
      console.log(`Organization found in Clerk:`, existingOrg.name);
    } catch (getError: any) {
      console.error(
        `Error fetching organization from Clerk:`,
        getError.message
      );
      throw new Error(`Organization not found in Clerk: ${getError.message}`);
    }

    // Update organization in Clerk using Backend API
    try {
      // Try the correct method signature from Clerk docs
      const updateResult = await client.organizations.updateOrganization(
        organizationId,
        {
          name: updateData.name,
          publicMetadata: {
            industry: updateData.industry,
            size: updateData.size,
            country: updateData.country,
            state: updateData.state,
            city: updateData.city,
            address: updateData.address,
            zipCode: updateData.zipCode,
            website: updateData.website,
            phone: updateData.phone,
            description: updateData.description,
            subscriptionPlan: updateData.subscriptionPlan,
            subscriptionStatus: updateData.subscriptionStatus,
            applicableRegulations: updateData.applicableRegulations,
            settings: updateData.settings,
          },
        }
      );
      console.log(
        `Successfully updated organization in Clerk: ${organizationId}`,
        updateResult
      );
    } catch (clerkError: any) {
      console.error(
        `Error updating organization in Clerk:`,
        clerkError.message,
        clerkError
      );
      // Continue with Firestore update even if Clerk fails
      console.log(`Continuing with Firestore update despite Clerk error`);
    }

    // Update organization in Firestore
    const orgRef = doc(db, "organizations", organizationId);
    await updateDoc(orgRef, {
      name: updateData.name,
      industry: updateData.industry,
      size: updateData.size,
      country: updateData.country,
      state: updateData.state || "",
      city: updateData.city || "",
      address: updateData.address || "",
      zipCode: updateData.zipCode || "",
      website: updateData.website || "",
      phone: updateData.phone || "",
      description: updateData.description || "",
      subscriptionPlan: updateData.subscriptionPlan,
      subscriptionStatus: updateData.subscriptionStatus,
      applicableRegulations: updateData.applicableRegulations || [],
      settings: {
        timezone: updateData.settings?.timezone || "UTC",
        locale: updateData.settings?.locale || "en-US",
        notifications: {
          email: updateData.settings?.notifications?.email ?? true,
          sms: updateData.settings?.notifications?.sms ?? false,
          push: updateData.settings?.notifications?.push ?? true,
        },
      },
      updatedAt: serverTimestamp(),
    });

    // Track changes and log activity
    const changes: { field: string; oldValue?: any; newValue?: any }[] = [];

    if (oldOrgData) {
      if (oldOrgData.name !== updateData.name) {
        changes.push({
          field: "name",
          oldValue: oldOrgData.name,
          newValue: updateData.name,
        });
      }
      if (oldOrgData.industry !== updateData.industry) {
        changes.push({
          field: "industry",
          oldValue: oldOrgData.industry,
          newValue: updateData.industry,
        });
      }
      if (oldOrgData.size !== updateData.size) {
        changes.push({
          field: "size",
          oldValue: oldOrgData.size,
          newValue: updateData.size,
        });
      }
      if (oldOrgData.subscriptionPlan !== updateData.subscriptionPlan) {
        changes.push({
          field: "subscription_plan",
          oldValue: oldOrgData.subscriptionPlan,
          newValue: updateData.subscriptionPlan,
        });
      }
      if (oldOrgData.subscriptionStatus !== updateData.subscriptionStatus) {
        changes.push({
          field: "subscription_status",
          oldValue: oldOrgData.subscriptionStatus,
          newValue: updateData.subscriptionStatus,
        });
      }
      if (oldOrgData.country !== updateData.country) {
        changes.push({
          field: "country",
          oldValue: oldOrgData.country,
          newValue: updateData.country,
        });
      }
      if (oldOrgData.state !== updateData.state) {
        changes.push({
          field: "state",
          oldValue: oldOrgData.state,
          newValue: updateData.state,
        });
      }
    }

    // Get organization members to notify them
    const members = await client.organizations.getOrganizationMembershipList({
      organizationId,
    });
    const memberIds = members.data
      .filter((m) => m.publicUserData)
      .map((m) => m.publicUserData!.userId);

    // Log the organization update activity and notify members
    await ActivityLogService.logOrganizationUpdated({
      organizationId,
      organizationName: updateData.name,
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      changes,
      memberIds, // This will trigger notifications to all members
    });

    return NextResponse.json({
      success: true,
      message: "Organization updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
