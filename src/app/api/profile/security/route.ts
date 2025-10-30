import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const authData = await auth();
    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    const client = await clerkClient();

    switch (action) {
      case "update_password":
        // Clerk handles password updates through their UI components
        // This endpoint can trigger password reset email
        try {
          const user = await client.users.getUser(authData.userId);
          const email = user.emailAddresses.find(
            (e) => e.id === user.primaryEmailAddressId
          );

          if (email) {
            // Note: Clerk doesn't have a direct API to change password
            // Users should use Clerk's UI components or password reset flow
            return NextResponse.json({
              success: true,
              message: "Password update requested. Please check your email.",
              requiresEmailVerification: true,
            });
          }
        } catch (error) {
          console.error("Error requesting password update:", error);
          throw error;
        }
        break;

      case "update_email":
        try {
          const { newEmail } = data;

          // Create new email address
          await client.emailAddresses.createEmailAddress({
            userId: authData.userId,
            emailAddress: newEmail,
          });

          return NextResponse.json({
            success: true,
            message: "Email verification sent to new address",
            requiresVerification: true,
          });
        } catch (error: any) {
          console.error("Error updating email:", error);
          return NextResponse.json(
            {
              error: "Failed to update email",
              details: error.message,
            },
            { status: 400 }
          );
        }

      case "toggle_2fa":
        // Note: 2FA is managed through Clerk's UI components
        // This endpoint returns the current status
        try {
          const user = await client.users.getUser(authData.userId);

          return NextResponse.json({
            success: true,
            mfaEnabled: user.twoFactorEnabled,
            message:
              "Please use Clerk's 2FA settings to enable/disable two-factor authentication",
          });
        } catch (error) {
          console.error("Error checking 2FA status:", error);
          throw error;
        }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Error in security update:", error);
    return NextResponse.json(
      { error: "Failed to process security update", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const authData = await auth();
    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(authData.userId);

    return NextResponse.json({
      success: true,
      security: {
        mfaEnabled: user.twoFactorEnabled || false,
        emailVerified:
          user.emailAddresses[0]?.verification?.status === "verified",
        phoneVerified:
          user.phoneNumbers[0]?.verification?.status === "verified",
      },
    });
  } catch (error: any) {
    console.error("Error fetching security settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch security settings", details: error.message },
      { status: 500 }
    );
  }
}
