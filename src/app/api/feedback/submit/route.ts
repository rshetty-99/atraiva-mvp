import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { CreateFeedbackRequest, Feedback } from "@/types/feedback";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body: CreateFeedbackRequest = await request.json();

    // Validate required fields
    if (!body.type || !body.title || !body.description) {
      return NextResponse.json(
        { error: "Missing required fields: type, title, description" },
        { status: 400 }
      );
    }

    // Get user's organization from Clerk metadata
    const userMetadata = user.publicMetadata?.atraiva as
      | {
          primaryOrganization?: {
            id?: string;
            name?: string;
            role?: string;
          };
        }
      | undefined;

    const userRole = userMetadata?.primaryOrganization?.role;
    const isPlatformRole =
      userRole === "platform_admin" || userRole === "super_admin";

    // Create feedback document
    const feedbackData: Omit<Feedback, "id"> = {
      // User information
      userId,
      userEmail:
        user.primaryEmailAddress?.emailAddress || user.emailAddresses[0]?.emailAddress || "",
      userName: user.fullName || user.firstName || "Unknown User",
      organizationId: userMetadata?.primaryOrganization?.id,
      organizationName: userMetadata?.primaryOrganization?.name,
      userRole: userMetadata?.primaryOrganization?.role,

      // Feedback details
      type: body.type,
      title: body.title,
      description: body.description,
      category: body.category,
      priority: "medium", // Default priority

      // Additional context
      page: body.page,
      userAgent: body.userAgent,
      screenResolution: body.screenResolution,

      // Status tracking
      status: "new",
      supportInitiated: isPlatformRole, // Tag if submitted by support

      // Metadata
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore
    const feedbackRef = collection(db, "feedback");
    const docRef = await addDoc(feedbackRef, {
      ...feedbackData,
      createdAt: serverTimestamp(),
    });

    console.log("Feedback submitted:", {
      id: docRef.id,
      userId,
      type: body.type,
      title: body.title,
    });

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        message: "Feedback submitted successfully",
        feedback: {
          ...feedbackData,
          id: docRef.id,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);

    return NextResponse.json(
      {
        error: "Failed to submit feedback",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

