import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

export async function GET() {
  try {
    const authData = await auth();
    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(authData.userId);

    // Get Firestore user data
    const userDoc = await getDoc(doc(db, "users", authData.userId));
    const userData = userDoc.exists() ? userDoc.data() : {};

    return NextResponse.json({
      success: true,
      user: {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        phone: clerkUser.phoneNumbers[0]?.phoneNumber,
        imageUrl: clerkUser.imageUrl,
        profile: userData.profile || {},
        preferences: userData.preferences || {},
        security: {
          mfaEnabled: clerkUser.twoFactorEnabled || false,
        },
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch user profile", details: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authData = await auth();
    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, phone, profile, preferences } = body;

    const client = await clerkClient();

    // Update Clerk user
    const updateData: { firstName?: string; lastName?: string } = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;

    if (Object.keys(updateData).length > 0) {
      await client.users.updateUser(authData.userId, updateData);
    }

    // Update phone number if provided
    if (phone !== undefined && phone !== null) {
      try {
        // Get existing phone numbers
        const user = await client.users.getUser(authData.userId);
        const existingPhone = user.phoneNumbers[0];

        if (existingPhone) {
          // Update existing phone
          await client.phoneNumbers.updatePhoneNumber(existingPhone.id, {
            verified: false,
          });
        } else if (phone) {
          // Create new phone
          await client.phoneNumbers.createPhoneNumber({
            userId: authData.userId,
            phoneNumber: phone,
          });
        }
      } catch (phoneError) {
        console.error("Error updating phone number:", phoneError);
      }
    }

    // Update Firestore user data
    const userRef = doc(db, "users", authData.userId);
    const updateFields: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (profile) {
      updateFields["profile.title"] = profile.title || null;
      updateFields["profile.department"] = profile.department || null;
      updateFields["profile.phone"] = phone || null;
    }

    if (preferences) {
      if (preferences.notifications) {
        updateFields["preferences.notifications"] = preferences.notifications;
      }
      if (preferences.dashboard) {
        updateFields["preferences.dashboard"] = preferences.dashboard;
      }
    }

    await updateDoc(userRef, updateFields);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error: unknown) {
    console.error("Error updating user profile:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to update user profile", details: errorMessage },
      { status: 500 }
    );
  }
}
