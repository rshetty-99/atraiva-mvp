import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { MemberInvitationService } from "@/lib/member-invitation-service";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { SessionService } from "@/lib/session";
import { ActivityLogService } from "@/lib/activity-log-service";
import { NotificationService } from "@/lib/notification-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password, username } = body;

    // Validate required fields
    if (!token || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields (token, password, username)" },
        { status: 400 }
      );
    }

    // Validate username format
    if (username.length < 3 || !/^[a-z0-9]+$/.test(username)) {
      return NextResponse.json(
        {
          error:
            "Username must be at least 3 characters and contain only lowercase letters and numbers",
        },
        { status: 400 }
      );
    }

    // Validate invitation token
    const validationResult =
      await MemberInvitationService.validateInvitationToken(token);
    if (!validationResult.valid || !validationResult.invitation) {
      return NextResponse.json(
        { error: validationResult.error || "Invalid invitation" },
        { status: 400 }
      );
    }

    const invitation = validationResult.invitation;
    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    try {
      // Step 1: Check if user already exists
      let clerkUser;
      try {
        const existingUsers = await client.users.getUserList({
          emailAddress: [invitation.memberData.email],
        });

        if (existingUsers.data.length > 0) {
          return NextResponse.json(
            {
              error: "User already exists",
              details:
                "An account with this email already exists. Please sign in instead.",
            },
            { status: 400 }
          );
        }
      } catch (checkError) {
        console.error("Error checking existing user:", checkError);
      }

      // Step 1: Create user in Clerk
      try {
        clerkUser = await client.users.createUser({
          emailAddress: [invitation.memberData.email],
          username: username,
          firstName: invitation.memberData.firstName,
          lastName: invitation.memberData.lastName,
          password,
          publicMetadata: {
            role: invitation.memberData.role,
            atraiva: {
              user: {
                jobTitle: invitation.memberData.jobTitle || "",
                phoneNumber: invitation.memberData.phoneNumber || "",
              },
              primaryOrganization: {
                id: invitation.organizationId,
                name: invitation.organizationName,
                role: invitation.memberData.role,
              },
            },
          },
          privateMetadata: {
            organizationId: invitation.organizationId,
            primaryRole: invitation.memberData.role,
            onboardingCompleted: true,
          },
        });
      } catch (clerkError: unknown) {
        console.error("Clerk user creation error:", clerkError);
        const errorDetails = clerkError && typeof clerkError === "object" && "errors" in clerkError ? clerkError.errors : undefined;
        console.error("Clerk error details:", errorDetails);

        let errorMessage = "Failed to create user account";
        if (Array.isArray(errorDetails) && errorDetails.length > 0) {
          errorMessage = errorDetails
            .map((e: unknown) => {
              if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
                return e.message;
              }
              return String(e);
            })
            .join(", ");
        }

        return NextResponse.json(
          {
            error: "User creation failed",
            details: errorMessage,
          },
          { status: 500 }
        );
      }

      // Step 2: Add user to organization in Clerk
      let clerkMembership;
      try {
        const clerkRole =
          invitation.memberData.role === "org_admin"
            ? "org:admin"
            : "org:member";

        console.log(
          `Adding user ${clerkUser.id} to organization ${invitation.organizationId} with role ${clerkRole}`
        );

        // Use the correct method: createOrganizationMembership
        clerkMembership =
          await client.organizations.createOrganizationMembership({
            organizationId: invitation.organizationId,
            userId: clerkUser.id,
            role: clerkRole,
          });

        console.log("User added to organization successfully");
        console.log(
          "Membership details:",
          JSON.stringify(clerkMembership, null, 2)
        );
      } catch (membershipError: unknown) {
        console.error(
          "Error creating organization membership:",
          membershipError
        );
        const errorDetails = membershipError && typeof membershipError === "object" && "errors" in membershipError ? membershipError.errors : undefined;
        console.error("Membership error details:", errorDetails);

        // If membership fails, delete the user we just created
        try {
          await client.users.deleteUser(clerkUser.id);
          console.log("Rolled back user creation");
        } catch (deleteError) {
          console.error("Failed to rollback user creation:", deleteError);
        }

        return NextResponse.json(
          {
            error: "Failed to add user to organization",
            details:
              membershipError.errors?.[0]?.message ||
              membershipError.message ||
              "Organization membership failed",
          },
          { status: 500 }
        );
      }

      // Step 3: Get organization details to determine userType
      const orgRef = doc(db, "organizations", invitation.organizationId);
      const orgDoc = await getDoc(orgRef);
      const orgData = orgDoc.exists() ? orgDoc.data() : null;

      // Determine userType from organization type
      let userType:
        | "law_firm"
        | "enterprise"
        | "channel_partner"
        | "platform_admin" = "enterprise";
      if (orgData?.organizationType) {
        userType = orgData.organizationType as typeof userType;
      }

      // Step 4: Create user in Firestore with proper organization membership structure
      const userRef = doc(db, "users", clerkUser.id);
      const now = new Date();

      await setDoc(userRef, {
        id: clerkUser.id,
        auth: {
          email: invitation.memberData.email,
          clerkId: clerkUser.id,
          lastSignIn: now,
          isActive: true,
        },
        profile: {
          firstName: invitation.memberData.firstName,
          lastName: invitation.memberData.lastName,
          displayName: `${invitation.memberData.firstName} ${invitation.memberData.lastName}`,
          username: username,
          jobTitle: invitation.memberData.jobTitle || "",
          timezone: "America/New_York",
          locale: "en-US",
        },
        preferences: {
          theme: "system",
          notifications: {
            email: true,
            push: true,
            sms: false,
          },
          privacy: {
            profileVisibility: "organization",
            dataSharing: false,
          },
        },
        security: {
          mfaEnabled: false,
          lastPasswordChange: now,
          loginAttempts: 0,
          accountLocked: false,
          sessionTimeout: "30",
          passwordPolicy: "strong",
        },
        organizations: [
          {
            orgId: invitation.organizationId,
            role:
              clerkMembership?.role ||
              (invitation.memberData.role === "org_admin"
                ? "org:admin"
                : "org:member"),
            permissions: clerkMembership?.permissions || [],
            isPrimary: true,
            joinedAt: now,
            updatedAt: now,
          },
        ],
        role: invitation.memberData.role,
        userType: userType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        isActive: true,
      });

      // Step 5: Update organization members in Firestore
      if (orgDoc.exists()) {
        const currentMembers = orgDoc.data().members || [];
        await updateDoc(orgRef, {
          members: [
            ...currentMembers,
            {
              userId: clerkUser.id,
              role: invitation.memberData.role,
              permissions: [],
              joinedAt: new Date(),
              isActive: true,
            },
          ],
          updatedAt: serverTimestamp(),
        });
      }

      // Step 6: Mark invitation as accepted
      await MemberInvitationService.markInvitationAccepted(
        invitation.id,
        clerkUser.id,
        clerkUser.id
      );

      // Step 7: Update session metadata
      try {
        await SessionService.processLogin(clerkUser.id, true);
      } catch (error) {
        console.warn("Failed to update session metadata:", error);
      }

      // Step 8: Log activity
      try {
        await ActivityLogService.logActivity({
          organizationId: invitation.organizationId,
          userId: clerkUser.id,
          userName: `${invitation.memberData.firstName} ${invitation.memberData.lastName}`,
          userEmail: invitation.memberData.email,
          action: "member_joined",
          category: "user",
          resourceType: "member",
          resourceId: clerkUser.id,
          resourceName: `${invitation.memberData.firstName} ${invitation.memberData.lastName}`,
          description: `${invitation.memberData.firstName} ${invitation.memberData.lastName} joined ${invitation.organizationName}`,
          severity: "info",
          metadata: {
            role: invitation.memberData.role,
            invitedBy: invitation.invitedByName,
            invitationId: invitation.id,
          },
        });
      } catch (logError) {
        console.error("Failed to log member joining activity:", logError);
      }

      // Step 9: Create welcome notification
      try {
        await NotificationService.createNotification({
          userId: clerkUser.id,
          organizationId: invitation.organizationId,
          type: "member_added",
          category: "organization",
          priority: "high",
          title: `Welcome to ${invitation.organizationName}!`,
          message: `You've successfully joined ${
            invitation.organizationName
          } as ${invitation.memberData.role.replace(
            /_/g,
            " "
          )}. Start exploring the platform!`,
          actionBy: invitation.invitedBy,
          actionByName: invitation.invitedByName,
          actionByEmail: invitation.invitedByEmail,
          resourceType: "organization",
          resourceId: invitation.organizationId,
          resourceName: invitation.organizationName,
          actionUrl: "/dashboard",
          metadata: {
            role: invitation.memberData.role,
          },
        });
      } catch (notifError) {
        console.error("Failed to create welcome notification:", notifError);
      }

      return NextResponse.json({
        success: true,
        message: "Account created successfully",
        userId: clerkUser.id,
        organizationId: invitation.organizationId,
      });
    } catch (error: unknown) {
      console.error("Error completing member invitation:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        {
          error: "Failed to create account",
          details: errorMessage || "Please try again",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to process invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
