import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Testing Clerk-Firestore integration for user:", userId);

    // Test 1: Get user with organizations
    const userWithOrgs =
      await ClerkFirestoreIntegration.getUserWithOrganizations(userId);

    if (!userWithOrgs) {
      // User doesn't exist in Firestore, sync from Clerk
      console.log("User not found in Firestore, syncing from Clerk...");
      const syncedUser = await ClerkFirestoreIntegration.syncUserToFirestore(
        userId
      );

      if (!syncedUser) {
        return NextResponse.json(
          {
            error: "Failed to sync user from Clerk",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "User synced from Clerk successfully",
        user: syncedUser,
        test: "sync-user",
      });
    }

    // Test 2: Check if user has organizations
    const hasOrganizations =
      userWithOrgs.organizations && userWithOrgs.organizations.length > 0;

    // Test 3: Check user data structure
    const userDataValid = !!(
      userWithOrgs.id &&
      userWithOrgs.auth?.email &&
      userWithOrgs.profile?.firstName &&
      userWithOrgs.profile?.lastName
    );

    return NextResponse.json({
      success: true,
      message: "Integration test passed",
      user: {
        id: userWithOrgs.id,
        email: userWithOrgs.auth?.email,
        name: userWithOrgs.profile?.displayName,
        organizations: userWithOrgs.organizations?.length || 0,
        createdAt: userWithOrgs.createdAt,
        lastLoginAt: userWithOrgs.lastLoginAt,
      },
      tests: {
        "user-exists": true,
        "user-data-valid": userDataValid,
        "has-organizations": hasOrganizations,
        "organizations-count": userWithOrgs.organizations?.length || 0,
      },
    });
  } catch (error) {
    console.error("Integration test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Integration test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "sync-user":
        console.log("Syncing user from Clerk...");
        const syncedUser = await ClerkFirestoreIntegration.syncUserToFirestore(
          userId
        );

        return NextResponse.json({
          success: true,
          message: "User synced successfully",
          user: syncedUser,
        });

      case "sync-all":
        console.log("Syncing all data from Clerk...");
        await ClerkFirestoreIntegration.syncAllData();

        return NextResponse.json({
          success: true,
          message: "All data synced successfully",
        });

      case "cleanup":
        console.log("Cleaning up deleted data...");
        await ClerkFirestoreIntegration.cleanupDeletedData();

        return NextResponse.json({
          success: true,
          message: "Cleanup completed successfully",
        });

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Supported actions: sync-user, sync-all, cleanup",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Test action failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Test action failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
