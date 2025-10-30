import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting user-organization fix process...");

    // Get all users from Firestore
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const client = await clerkClient();
    let fixedCount = 0;
    let errorCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const clerkUserId = userData.id;

      try {
        console.log(`Processing user: ${clerkUserId}`);

        // Get user's organization memberships from Clerk
        const memberships = await client.users.getOrganizationMembershipList({
          userId: clerkUserId,
        });

        if (memberships.data.length > 0) {
          // Update user document with organization memberships
          const userOrganizations = memberships.data.map((membership) => ({
            orgId: membership.organization.id,
            role: membership.role,
            permissions: membership.permissions || [],
            isPrimary: membership.organization.id === userData.auth?.clerkId,
            joinedAt: new Date(membership.createdAt),
            updatedAt: new Date(membership.updatedAt),
          }));

          await updateDoc(doc(db, "users", clerkUserId), {
            organizations: userOrganizations,
            updatedAt: new Date(),
          });

          console.log(
            `Fixed user ${clerkUserId} with ${userOrganizations.length} organizations`
          );
          fixedCount++;
        } else {
          console.log(`User ${clerkUserId} has no organization memberships`);
        }
      } catch (error) {
        console.error(`Error fixing user ${clerkUserId}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `User-organization fix completed`,
      stats: {
        totalUsers: usersSnapshot.docs.length,
        fixedUsers: fixedCount,
        errors: errorCount,
      },
    });
  } catch (error) {
    console.error("Error in fix-user-organizations:", error);
    return NextResponse.json(
      { error: "Failed to fix user organizations" },
      { status: 500 }
    );
  }
}
