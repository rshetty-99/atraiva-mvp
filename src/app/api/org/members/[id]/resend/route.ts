import { NextResponse } from "next/server";
import { getOrgContext } from "@/lib/server/org-context";
import { ActivityLogService } from "@/lib/activity-log-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { client, user, organizationId, authUserId } = await getOrgContext({
      requireAdmin: true,
    });
    const { id: memberId } = await params;

    const clerkUser = await client.users.getUser(memberId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        {
          error: "Cannot resend invitation",
          details: "Member does not have a primary email address.",
        },
        { status: 400 }
      );
    }

    const invitation: Record<string, unknown> = {
      emailAddress: email,
    };
    if (process.env.CLERK_INVITE_REDIRECT_URL) {
      invitation.redirectUrl = process.env.CLERK_INVITE_REDIRECT_URL;
    }
    await client.invitations.createInvitation(
      invitation as Parameters<
        typeof client.invitations.createInvitation
      >[0]
    );

    await ActivityLogService.logActivity({
      organizationId,
      userId: authUserId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Organization Admin",
      userEmail: user.emailAddresses[0]?.emailAddress || "",
      action: "member_invite_resent",
      category: "user_management",
      resourceType: "member",
      resourceId: memberId,
      description: `Resent invitation to ${email}`,
      severity: "info",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Response) {
      return error;
    }
    console.error("Error resending member invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to resend invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

