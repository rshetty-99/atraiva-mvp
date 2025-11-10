import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { ActivityLogService } from "@/lib/activity-log-service";

type ClerkOrgMeta = { primaryOrganization?: { role?: string } };

const ALLOWED_ROLES = new Set(["platform_admin", "super_admin"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authData = await auth();
    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error("CLERK_SECRET_KEY is not configured");
    }

    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const user = await client.users.getUser(authData.userId);
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const role = metadata.primaryOrganization?.role ?? "";

    if (!ALLOWED_ROLES.has(role)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: "Platform admin role required to resend invitations.",
        },
        { status: 403 }
      );
    }

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
      organizationId: "platform",
      userId: authData.userId,
      userName:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Platform Admin",
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
    console.error("Error resending invitation:", error);
    return NextResponse.json(
      {
        error: "Failed to resend invitation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

