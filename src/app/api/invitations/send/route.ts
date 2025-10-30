import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { MemberInvitationService } from "@/lib/member-invitation-service";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk
    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    const user = await client.users.getUser(authData.userId);

    // Get user role
    const metadata = user.publicMetadata?.atraiva as any;
    const userRole = metadata?.primaryOrganization?.role as string;
    const userOrgId = metadata?.primaryOrganization?.id as string;

    const body = await request.json();
    const { organizationId, memberData } = body;

    // Validate required fields
    if (
      !organizationId ||
      !memberData ||
      !memberData.email ||
      !memberData.firstName ||
      !memberData.lastName ||
      !memberData.role
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check permissions - only org_admin or platform_admin can invite
    const canInvite =
      userRole === "platform_admin" ||
      userRole === "super_admin" ||
      (userRole === "org_admin" && userOrgId === organizationId);

    if (!canInvite) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: `You don't have permission to invite members to this organization. Your role: ${userRole}`,
        },
        { status: 403 }
      );
    }

    // Get organization details
    const organization = await client.organizations.getOrganization({
      organizationId,
    });

    // Create invitation
    const result = await MemberInvitationService.createInvitation({
      organizationId,
      organizationName: organization.name,
      memberData,
      invitedBy: authData.userId,
      invitedByName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown",
      invitedByEmail: user.emailAddresses[0]?.emailAddress || "",
      invitedByRole: userRole,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Send invitation email
    const invitationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${result.token}`;

    try {
      const emailData = {
        to: [memberData.email],
        subject: `You're invited to join ${organization.name} on Atraiva`,
        html: generateInvitationEmailHTML(
          memberData.firstName,
          organization.name,
          invitationUrl,
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Your colleague",
          memberData.role
        ),
        text: generateInvitationEmailText(
          memberData.firstName,
          organization.name,
          invitationUrl,
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            "Your colleague",
          memberData.role
        ),
        createdAt: new Date(),
        delivery: {
          state: "PENDING" as const,
          attempts: 0,
        },
      };

      await addDoc(collection(db, "registrationEmails"), emailData);

      // Mark invitation as sent
      await MemberInvitationService.markInvitationSent(
        result.invitationId!,
        false
      );
    } catch (emailError) {
      console.error("Error sending invitation email:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      invitationId: result.invitationId,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Error sending member invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to send invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

function generateInvitationEmailHTML(
  firstName: string,
  organizationName: string,
  invitationUrl: string,
  inviterName: string,
  role: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Join ${organizationName} on Atraiva</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white !important; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #5568d3; }
    .info-box { background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 You're Invited!</h1>
    </div>
    <div class="content">
      <p>Hi ${firstName},</p>
      
      <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on the Atraiva Compliance Platform as <strong>${role.replace(
    /_/g,
    " "
  )}</strong>.</p>
      
      <div style="text-align: center;">
        <a href="${invitationUrl}" class="button">Accept Invitation</a>
      </div>
      
      <div class="info-box">
        <strong>📋 What happens next:</strong>
        <ol>
          <li>Click the button above to accept the invitation</li>
          <li>Create your password</li>
          <li>Complete your profile setup</li>
          <li>Start using Atraiva!</li>
        </ol>
      </div>
      
      <p><strong>Organization:</strong> ${organizationName}</p>
      <p><strong>Your Role:</strong> ${role.replace(/_/g, " ")}</p>
      <p><strong>Link Expires:</strong> 7 days from now</p>
      
      <p>If you have any questions, please contact ${inviterName} or our support team.</p>
      
      <p>We look forward to having you on board!</p>
      
      <p>Best regards,<br>The Atraiva Team</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Atraiva. All rights reserved.</p>
      <p>This invitation link will expire in 7 days.</p>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    </div>
  </div>
</body>
</html>
`.trim();
}

function generateInvitationEmailText(
  firstName: string,
  organizationName: string,
  invitationUrl: string,
  inviterName: string,
  role: string
): string {
  return `
You're Invited to Join ${organizationName}!

Hi ${firstName},

${inviterName} has invited you to join ${organizationName} on the Atraiva Compliance Platform as ${role.replace(
    /_/g,
    " "
  )}.

Accept your invitation: ${invitationUrl}

What happens next:
1. Click the link above to accept the invitation
2. Create your password
3. Complete your profile setup
4. Start using Atraiva!

Organization: ${organizationName}
Your Role: ${role.replace(/_/g, " ")}
Link Expires: 7 days from now

If you have any questions, please contact ${inviterName} or our support team.

We look forward to having you on board!

Best regards,
The Atraiva Team

© ${new Date().getFullYear()} Atraiva. All rights reserved.
This invitation link will expire in 7 days.
If you didn't expect this invitation, you can safely ignore this email.
  `.trim();
}


