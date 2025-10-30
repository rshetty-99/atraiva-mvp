import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId: targetUserId, organizationId } = body;

    switch (action) {
      case "sync-user":
        if (!targetUserId) {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 400 }
          );
        }

        const user = await ClerkFirestoreIntegration.syncUserToFirestore(
          targetUserId
        );
        return NextResponse.json({
          success: true,
          message: "User synced successfully",
          user,
        });

      case "sync-organization":
        if (!organizationId) {
          return NextResponse.json(
            { error: "Organization ID required" },
            { status: 400 }
          );
        }

        const organization =
          await ClerkFirestoreIntegration.syncOrganizationToFirestore(
            organizationId
          );
        return NextResponse.json({
          success: true,
          message: "Organization synced successfully",
          organization,
        });

      case "sync-membership":
        const { userId: membershipUserId, orgId, role, permissions } = body;

        if (!membershipUserId || !orgId) {
          return NextResponse.json(
            {
              error: "User ID and Organization ID required",
            },
            { status: 400 }
          );
        }

        await ClerkFirestoreIntegration.syncMembershipToFirestore(
          membershipUserId,
          orgId,
          role || "member",
          permissions || []
        );

        return NextResponse.json({
          success: true,
          message: "Membership synced successfully",
        });

      case "sync-all":
        await ClerkFirestoreIntegration.syncAllData();
        return NextResponse.json({
          success: true,
          message: "All data synced successfully",
        });

      case "cleanup":
        await ClerkFirestoreIntegration.cleanupDeletedData();
        return NextResponse.json({
          success: true,
          message: "Cleanup completed successfully",
        });

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: sync-user, sync-organization, sync-membership, sync-all, cleanup",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in sync API:", error);
    return NextResponse.json({ error: "Failed to sync data" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "user":
        const targetUserId = searchParams.get("userId") || userId;
        const user = await ClerkFirestoreIntegration.getUserWithOrganizations(
          targetUserId
        );

        if (!user) {
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          user,
        });

      default:
        return NextResponse.json(
          {
            error: "Invalid action. Supported actions: user",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in sync GET API:", error);
    return NextResponse.json({ error: "Failed to get data" }, { status: 500 });
  }
}
