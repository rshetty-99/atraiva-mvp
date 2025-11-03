import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ActivityLogService } from "@/lib/activity-log-service";
import { NotificationService } from "@/lib/notification-service";

// Type for Clerk metadata
type ClerkOrgMeta = { primaryOrganization?: { role?: string; id?: string; name?: string } };
type ClerkPrivateMetadata = { primaryOrganizationId?: string; organizationId?: string; primaryRole?: string };

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
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

    // Only platform_admin and super_admin can view member details
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
    const { id: memberId } = await params;

    // Get member from Clerk
    const clerkUser = await client.users.getUser(memberId);

    // Get member data from Firestore
    const memberRef = doc(db, "users", memberId);
    const memberSnap = await getDoc(memberRef);
    const firestoreData = memberSnap.exists() ? memberSnap.data() : {};

    // Get organization data
    let organizationId = null;
    let organizationName = "No Organization";
    let role = "org_viewer";

    // Check multiple sources for organization data
    const primaryOrg = ((clerkUser.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta)
      .primaryOrganization;
    if (primaryOrg?.id && primaryOrg.id !== "temp") {
      organizationId = primaryOrg.id;
      organizationName = primaryOrg.name || "Unknown Org";
      role = primaryOrg.role || "org_viewer";
    } else if (clerkUser.privateMetadata?.primaryOrganizationId) {
      organizationId = clerkUser.privateMetadata.primaryOrganizationId;
    } else if (clerkUser.privateMetadata?.organizationId) {
      organizationId = clerkUser.privateMetadata.organizationId;
    } else if (
      firestoreData.organizations &&
      firestoreData.organizations.length > 0
    ) {
      organizationId = firestoreData.organizations[0].id;
    }

    // Get organization name if we have organizationId
    if (organizationId && organizationId !== "temp") {
      try {
        const org = await client.organizations.getOrganization({
          organizationId,
        });
        organizationName = org.name;
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    }

    // Get role from private metadata or fallback to firestore
    const privateMetadata = (clerkUser.privateMetadata ?? {}) as ClerkPrivateMetadata;
    const primaryRole = privateMetadata.primaryRole;
    if (typeof primaryRole === "string") {
      role = primaryRole;
    } else if (firestoreData.role) {
      role = firestoreData.role;
    }

    // Map Clerk organization roles to application roles
    if (role === "org:admin") role = "org_admin";
    if (role === "org:member") role = "org_viewer";

    // Get user's organization memberships
    const organizations = [];
    try {
      // Fetch organization memberships for the user
      const memberships = await client.users.getOrganizationMembershipList({
        userId: memberId,
      });

      for (const membership of memberships.data) {
        try {
          const org = await client.organizations.getOrganization({
            organizationId: membership.organization.id,
          });
          organizations.push({
            id: org.id,
            name: org.name,
            role: membership.role === "org:admin" ? "org_admin" : "org_viewer",
            status: membership.publicMetadata?.status || "active",
          });
        } catch (error) {
          console.error("Error fetching organization for membership:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching organization memberships:", error);
    }

    const memberDetails = {
      id: clerkUser.id,
      firstName: clerkUser.firstName || "",
      lastName: clerkUser.lastName || "",
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      imageUrl: clerkUser.imageUrl,
      role,
      organizationId,
      organizationName,
      createdAt: new Date(clerkUser.createdAt),
      lastSignInAt: clerkUser.lastSignInAt
        ? new Date(clerkUser.lastSignInAt)
        : null,
      isActive: !clerkUser.banned,
      twoFactorEnabled: clerkUser.twoFactorEnabled || false,
      phoneNumber:
        clerkUser.phoneNumbers[0]?.phoneNumber ||
        firestoreData.phoneNumber ||
        "",
      jobTitle: firestoreData.jobTitle || "",
      timezone: firestoreData.timezone || "America/New_York",
      locale: firestoreData.locale || "en-US",
      organizations,
      preferences: firestoreData.preferences || {
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
      },
    };

    return NextResponse.json(memberDetails);
  } catch (error) {
    console.error("Error fetching member details:", error);
    return NextResponse.json(
      { error: "Failed to fetch member details" },
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
      throw new Error("CLERK_SECRET_KEY is required for member updates");
    }

    console.log("Using Clerk Backend API with secret key for member update");

    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

    // Only platform_admin and super_admin can update members
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
    const { id: memberId } = await params;

    // Parse request body
    const updateData = await request.json();

    console.log(`Attempting to update member: ${memberId}`);
    console.log(`Update data:`, updateData);

    // Get existing member data for change tracking
    const memberDoc = await getDoc(doc(db, "users", memberId));
    const oldMemberData = memberDoc.data();

    // First, let's verify the member exists using the Backend API
    let existingMember;
    try {
      existingMember = await client.users.getUser(memberId);
      console.log(
        `Member found in Clerk:`,
        existingMember.emailAddresses[0]?.emailAddress
      );
    } catch (getError: unknown) {
      const errorMessage = getError instanceof Error ? getError.message : "Unknown error";
      console.error(`Error fetching member from Clerk:`, errorMessage);
      throw new Error(`Member not found in Clerk: ${errorMessage}`);
    }

    // Update member in Clerk using Backend API
    try {
      // Prepare the update data for Clerk
      const clerkUpdateData: { firstName: string; lastName: string; phoneNumber?: string } = {
        firstName: updateData.firstName,
        lastName: updateData.lastName,
      };

      // Add phone number if provided
      if (updateData.phoneNumber) {
        clerkUpdateData.phoneNumber = updateData.phoneNumber;
      }

      // Update user basic info
      const updateResult = await client.users.updateUser(
        memberId,
        clerkUpdateData
      );
      console.log(
        `Successfully updated member in Clerk: ${memberId}`,
        updateResult
      );

      // Update organization membership if organizationId changed
      if (updateData.organizationId) {
        try {
          // Get current memberships
          const currentMember = await client.users.getUser(memberId);

          // Remove from old organization if exists
          // Note: organizationMemberships may not be directly accessible, using API method instead
          const memberships = await client.users.getOrganizationMembershipList({ userId: memberId });
          if (memberships.data && memberships.data.length > 0) {
            for (const membership of memberships.data) {
              try {
                // Use the correct Clerk API method to remove membership
                await client.organizations.deleteOrganizationMembership({
                  organizationId: membership.organization.id,
                  userId: memberId,
                });
                console.log(
                  `Removed member from organization: ${membership.organization.id}`
                );
              } catch (error) {
                console.error("Error removing from old organization:", error);
              }
            }
          }

          // Add to new organization
          const clerkRole =
            updateData.role === "org_admin" ? "org:admin" : "org:member";
          // Use the correct Clerk API method to create membership
          await client.organizations.createOrganizationMembership({
            organizationId: updateData.organizationId,
            userId: memberId,
            role: clerkRole,
          });
          console.log(
            `Added member to organization: ${updateData.organizationId} with role: ${clerkRole}`
          );

          // Update user's public metadata with organization info
          await client.users.updateUserMetadata(memberId, {
            publicMetadata: {
              atraiva: {
                primaryOrganization: {
                  id: updateData.organizationId,
                  role: updateData.role,
                },
              },
            },
          });
          console.log(`Updated member metadata with organization info`);
        } catch (orgError: unknown) {
          const errorMessage = orgError instanceof Error ? orgError.message : "Unknown error";
          console.error(
            `Error updating organization membership:`,
            errorMessage
          );
          // Continue with other updates even if organization update fails
        }
      }
    } catch (clerkError: unknown) {
      const errorMessage = clerkError instanceof Error ? clerkError.message : "Unknown error";
      console.error(
        `Error updating member in Clerk:`,
        errorMessage,
        clerkError
      );
      // Continue with Firestore update even if Clerk fails
      console.log(`Continuing with Firestore update despite Clerk error`);
    }

    // Update member in Firestore
    const memberRef = doc(db, "users", memberId);
    await updateDoc(memberRef, {
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      jobTitle: updateData.jobTitle || "",
      phoneNumber: updateData.phoneNumber || "",
      timezone: updateData.timezone || "America/New_York",
      locale: updateData.locale || "en-US",
      role: updateData.role,
      isActive: updateData.isActive !== false,
      preferences: {
        notifications: {
          email: updateData.emailNotifications !== false,
          sms: updateData.smsNotifications || false,
          push: updateData.pushNotifications !== false,
        },
      },
      updatedAt: new Date(),
    });

    console.log(`Successfully updated member in Firestore: ${memberId}`);

    // Track changes and log activity
    const changes: { field: string; oldValue?: unknown; newValue?: unknown }[] = [];

    if (oldMemberData) {
      if (oldMemberData.firstName !== updateData.firstName) {
        changes.push({
          field: "first_name",
          oldValue: oldMemberData.firstName,
          newValue: updateData.firstName,
        });
      }
      if (oldMemberData.lastName !== updateData.lastName) {
        changes.push({
          field: "last_name",
          oldValue: oldMemberData.lastName,
          newValue: updateData.lastName,
        });
      }
      if (oldMemberData.jobTitle !== updateData.jobTitle) {
        changes.push({
          field: "job_title",
          oldValue: oldMemberData.jobTitle,
          newValue: updateData.jobTitle,
        });
      }
      if (oldMemberData.role !== updateData.role) {
        changes.push({
          field: "role",
          oldValue: oldMemberData.role,
          newValue: updateData.role,
        });
      }
      if (oldMemberData.isActive !== updateData.isActive) {
        changes.push({
          field: "account_status",
          oldValue: oldMemberData.isActive ? "active" : "inactive",
          newValue: updateData.isActive ? "active" : "inactive",
        });
      }
    }

    // Log the member update activity
    const organizationId =
      updateData.organizationId || oldMemberData?.organizationId || "";
    await ActivityLogService.logUserProfileUpdated({
      organizationId,
      userId: memberId,
      userName: `${updateData.firstName} ${updateData.lastName}`,
      userEmail: existingMember.emailAddresses[0]?.emailAddress || "",
      changes,
    });

    // Notify the user about profile changes made by platform admin
    if (changes.length > 0) {
      await NotificationService.notifyUserProfileUpdate({
        userId: memberId,
        userName: `${updateData.firstName} ${updateData.lastName}`,
        userEmail: existingMember.emailAddresses[0]?.emailAddress || "",
        organizationId,
        actionBy: authData.userId,
        actionByName:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.emailAddresses[0]?.emailAddress ||
          "Platform Admin",
        actionByEmail: user.emailAddresses[0]?.emailAddress || "",
        changes,
      });

      // If role changed, send separate notification
      const roleChange = changes.find((c) => c.field === "role");
      if (roleChange && roleChange.oldValue !== roleChange.newValue) {
        // Get organization name for the notification
        let orgName = "your organization";
        try {
          if (organizationId && organizationId !== "unknown") {
            const org = await client.organizations.getOrganization({
              organizationId,
            });
            orgName = org.name;
          }
        } catch (error) {
          console.error("Error fetching org name for notification:", error);
        }

        await NotificationService.notifyRoleChange({
          userId: memberId,
          userName: `${updateData.firstName} ${updateData.lastName}`,
          organizationId,
          organizationName: orgName,
          oldRole: roleChange.oldValue,
          newRole: roleChange.newValue,
          actionBy: authData.userId,
          actionByName:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.emailAddresses[0]?.emailAddress ||
            "Platform Admin",
          actionByEmail: user.emailAddresses[0]?.emailAddress || "",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
    });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      {
        error: "Failed to update member",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
