import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import {
  validateRegistrationToken,
  markRegistrationLinkUsed,
} from "@/lib/registration-link-service";
import {
  organizationService,
  userService,
  registrationEmailService,
} from "@/lib/firestore/collections";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";
import { SessionService } from "@/lib/session";
import { ActivityLogService } from "@/lib/activity-log-service";
import { NotificationService } from "@/lib/notification-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, organizationData, primaryUserData, teamMembers } = body;

    // Validate required fields
    if (!token || !organizationData || !primaryUserData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate token one final time
    const validationResult = await validateRegistrationToken(token);
    if (!validationResult.valid || !validationResult.link) {
      return NextResponse.json(
        { error: validationResult.error || "Invalid registration link" },
        { status: 400 }
      );
    }

    const registrationLink = validationResult.link;

    // Step 1: Create Clerk user
    const client = await clerkClient();

    let clerkUser;
    try {
      clerkUser = await client.users.createUser({
        emailAddress: [primaryUserData.email],
        password: primaryUserData.password,
        firstName: primaryUserData.firstName,
        lastName: primaryUserData.lastName,
        username: primaryUserData.username,
        publicMetadata: {
          role: primaryUserData.role,
          jobTitle: primaryUserData.jobTitle,
          forcePasswordChange: true, // Force password change on first login
        },
        skipPasswordChecks: false,
        skipPasswordRequirement: false,
      });
    } catch (error: unknown) {
      console.error("Error creating Clerk user:", error);
      return NextResponse.json(
        { error: "Failed to create user account. Email may already exist." },
        { status: 400 }
      );
    }

    // Step 2: Create Clerk organization
    let clerkOrg;
    try {
      clerkOrg = await client.organizations.createOrganization({
        name: organizationData.name,
        createdBy: clerkUser.id,
        publicMetadata: {
          organizationType: organizationData.organizationType,
          industry: organizationData.industry,
          teamSize: organizationData.teamSize,
        },
      });
    } catch (error: unknown) {
      console.error("Error creating Clerk organization:", error);
      // Cleanup: delete created user
      try {
        await client.users.deleteUser(clerkUser.id);
      } catch (cleanupError) {
        console.error("Error cleaning up user:", cleanupError);
      }
      return NextResponse.json(
        { error: "Failed to create organization" },
        { status: 500 }
      );
    }

    // Step 3: Add primary user to organization with their role
    try {
      await client.organizations.createOrganizationMembership({
        organizationId: clerkOrg.id,
        userId: clerkUser.id,
        role: primaryUserData.role,
      });
    } catch (error: unknown) {
      console.error("Error adding user to organization:", error);
      // Continue anyway as user and org are created
    }

    // Step 4: Sync to Firestore
    try {
      // Sync user to Firestore
      const firestoreUser = await ClerkFirestoreIntegration.syncUserToFirestore(
        clerkUser.id
      );

      if (!firestoreUser) {
        throw new Error("Failed to sync user to Firestore");
      }

      // Create organization in Firestore
      const firestoreOrgId = await organizationService.create({
        clerkId: clerkOrg.id,
        name: organizationData.name,
        organizationType: organizationData.organizationType,
        industry: organizationData.industry,
        teamSize: organizationData.teamSize,
        website: organizationData.website,
        phone: organizationData.phone,
        address: organizationData.address?.street || "",
        city: organizationData.city || "",
        state: organizationData.state || "",
        zipCode: organizationData.zipCode || "",
        country: organizationData.country || "",
        description: "",
        settings: {
          applicableRegulations: [],
          subscriptionPlan:
            registrationLink.organizationData.subscriptionPlan || "basic",
          subscriptionStatus: "trialing",
          timezone: "UTC",
          locale: "en-US",
        },
        members: [
          {
            userId: clerkUser.id,
            role: primaryUserData.role,
            permissions: ["*"], // Full permissions for primary user
            joinedAt: new Date(),
            isActive: true,
          },
        ],
      } as Record<string, unknown>);

      // Update user with organization reference using proper membership structure
      const now = new Date();
      await userService.update(firestoreUser.id, {
        organizations: [
          {
            orgId: clerkOrg.id,
            role: "org:admin", // Primary user is always org admin
            permissions: ["*"], // Full permissions for primary user
            isPrimary: true,
            joinedAt: now,
            updatedAt: now,
          },
        ],
        role: primaryUserData.role,
        userType: organizationData.organizationType as
          | "law_firm"
          | "enterprise"
          | "channel_partner"
          | "platform_admin",
      } as Record<string, unknown>);

      // Step 5: Send invitations to team members
      if (teamMembers && teamMembers.length > 0) {
        for (const member of teamMembers) {
          try {
            await client.invitations.createInvitation({
              emailAddress: member.email,
              publicMetadata: {
                organizationId: clerkOrg.id,
                role: member.role,
                invitedBy: clerkUser.id,
                firstName: member.firstName,
                lastName: member.lastName,
              },
              redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/sign-up`,
            });
          } catch (inviteError) {
            console.error(
              "Error sending invitation to team member:",
              inviteError
            );
            // Continue with other invitations
          }
        }
      }

      // Step 6: Mark registration link as used
      await markRegistrationLinkUsed(
        registrationLink.id,
        clerkUser.id,
        clerkUser.id,
        clerkOrg.id,
        firestoreUser.id,
        firestoreOrgId
      );

      // Step 7: Update session metadata with proper organization data
      try {
        await SessionService.processLogin(clerkUser.id, true); // Force refresh
        console.log("Session metadata updated successfully");
      } catch (error) {
        console.warn("Failed to update session metadata:", error);
        // Don't fail the registration if session update fails
      }

      // Step 7.5: Log organization creation and user registration
      try {
        await ActivityLogService.logOrganizationCreated({
          organizationId: clerkOrg.id,
          organizationName: organizationData.name,
          userId: clerkUser.id,
          userName: `${primaryUserData.firstName} ${primaryUserData.lastName}`,
          userEmail: primaryUserData.email,
          metadata: {
            industry: organizationData.industry,
            size: organizationData.teamSize,
            country: organizationData.country,
            registrationType: "registration_link",
            registrationLinkId: registrationLink.id,
          },
        });

        // Log team member invitations
        if (teamMembers && teamMembers.length > 0) {
          for (const member of teamMembers) {
            await ActivityLogService.logActivity({
              organizationId: clerkOrg.id,
              userId: clerkUser.id,
              userName: `${primaryUserData.firstName} ${primaryUserData.lastName}`,
              userEmail: primaryUserData.email,
              action: "member_invited",
              category: "user",
              resourceType: "invitation",
              resourceId: member.email,
              resourceName: `${member.firstName} ${member.lastName}`,
              description: `Invited ${member.firstName} ${member.lastName} (${member.email}) to join as ${member.role}`,
              severity: "info",
              metadata: {
                invitedEmail: member.email,
                invitedRole: member.role,
              },
            });
          }
        }
      } catch (logError) {
        console.error("Failed to log registration activity:", logError);
        // Don't fail registration if logging fails
      }

      // Step 8: Create welcome notification for the new user
      try {
        await NotificationService.createNotification({
          userId: clerkUser.id,
          organizationId: clerkOrg.id,
          type: "organization_created",
          category: "organization",
          priority: "high",
          title: `Welcome to ${organizationData.name}!`,
          message: `Your organization ${organizationData.name} has been successfully created. Start by completing your organization profile and inviting team members.`,
          actionUrl: "/dashboard",
          resourceType: "organization",
          resourceId: clerkOrg.id,
          resourceName: organizationData.name,
        });
      } catch (notifError) {
        console.error("Error creating welcome notification:", notifError);
        // Don't fail registration if notification fails
      }

      // Step 9: Send welcome email
      try {
        const welcomeEmailData = {
          to: [primaryUserData.email],
          subject: `Welcome to Atraiva - ${organizationData.name}`,
          html: generateWelcomeEmailHTML(
            primaryUserData.firstName,
            organizationData.name,
            process.env.NEXT_PUBLIC_APP_URL || ""
          ),
          text: generateWelcomeEmailText(
            primaryUserData.firstName,
            organizationData.name,
            process.env.NEXT_PUBLIC_APP_URL || ""
          ),
          createdAt: new Date(),
          delivery: {
            state: "PENDING" as const,
            attempts: 0,
          },
        };

        await registrationEmailService.create(welcomeEmailData as Record<string, unknown>);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail the registration if email fails
      }

      return NextResponse.json({
        success: true,
        message: "Registration completed successfully",
        userId: clerkUser.id,
        organizationId: clerkOrg.id,
      });
    } catch (error: unknown) {
      console.error("Error syncing to Firestore:", error);
      return NextResponse.json(
        {
          error:
            "Account created but failed to complete setup. Please contact support.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error completing registration:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}

function generateWelcomeEmailHTML(
  firstName: string,
  organizationName: string,
  appUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Atraiva</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #5568d3; }
    .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to Atraiva!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      
      <p>Congratulations! Your account for <strong>${organizationName}</strong> has been successfully created on the Atraiva Compliance Platform.</p>
      
      <div style="text-align: center;">
        <a href="${appUrl}/sign-in" class="button">Sign In to Your Dashboard</a>
      </div>
      
      <div class="info-box">
        <strong>🚀 Getting Started:</strong>
        <ul>
          <li>Complete your organization profile</li>
          <li>Set up compliance frameworks</li>
          <li>Add team members and assign roles</li>
          <li>Start your first PII scan</li>
          <li>Configure notification preferences</li>
        </ul>
      </div>
      
      <p><strong>Need Help?</strong></p>
      <p>Visit our <a href="${appUrl}/resources">Resource Center</a> for guides, tutorials, and documentation. Our support team is also available to assist you.</p>
      
      <p>We're excited to have you on board and look forward to helping you achieve compliance excellence!</p>
      
      <p>Best regards,<br>The Atraiva Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Atraiva. All rights reserved.</p>
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateWelcomeEmailText(
  firstName: string,
  organizationName: string,
  appUrl: string
): string {
  return `
Welcome to Atraiva!

Hi ${firstName},

Congratulations! Your account for ${organizationName} has been successfully created on the Atraiva Compliance Platform.

Sign in to your dashboard: ${appUrl}/sign-in

Getting Started:
- Complete your organization profile
- Set up compliance frameworks
- Add team members and assign roles
- Start your first PII scan
- Configure notification preferences

Need Help?
Visit our Resource Center at ${appUrl}/resources for guides, tutorials, and documentation. Our support team is also available to assist you.

We're excited to have you on board and look forward to helping you achieve compliance excellence!

Best regards,
The Atraiva Team

© ${new Date().getFullYear()} Atraiva. All rights reserved.
This is an automated email. Please do not reply to this message.
  `.trim();
}
