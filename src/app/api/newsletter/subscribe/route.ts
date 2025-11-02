// API route for newsletter subscription
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NewsletterService } from "@/lib/newsletter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Get user if logged in
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;

    // Get metadata
    const metadata = {
      referrer: request.headers.get("referer") || "direct",
      userAgent: request.headers.get("user-agent") || undefined,
    };

    // Subscribe with user info if available
    const result = await NewsletterService.subscribe(
      email,
      metadata,
      name || user?.fullName || user?.firstName || undefined,
      userId || undefined
    );

    // Update Clerk metadata if subscription was successful and user is logged in
    if (result.success && userId) {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const sessionData = (clerkUser.publicMetadata?.atraiva || {}) as any;
        
        // Update preferences in metadata
        sessionData.preferences = {
          ...sessionData.preferences,
          newsletterSubscribed: true,
          newsletterSubscribedAt: result.data?.subscribedAt instanceof Date
            ? result.data.subscribedAt.toISOString()
            : new Date().toISOString(),
        };
        
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            atraiva: sessionData,
          },
        });
      } catch (updateError) {
        // Don't fail the request if metadata update fails
        console.warn("Failed to update subscription in metadata:", updateError);
      }
    }

    if (result.success) {
      return NextResponse.json(result, { status: 200 });
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error) {
    console.error("Newsletter subscription API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to subscribe to newsletter. Please try again.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET - Check if user is subscribed (with session caching)
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const searchParams = request.nextUrl.searchParams;
    const emailParam = searchParams.get("email");
    const userIdParam = searchParams.get("userId");
    const forceRefresh = searchParams.get("refresh") === "true";

    // Use userId from auth if available, otherwise use param
    const userIdToCheck = userId || userIdParam;

    if (!userIdToCheck && !emailParam) {
      return NextResponse.json(
        { success: false, message: "User ID or email is required" },
        { status: 400 }
      );
    }

    // For logged-in users, check session metadata first (unless force refresh)
    if (userIdToCheck && !forceRefresh) {
      try {
        const { clerkClient } = await import("@clerk/nextjs/server");
        const client = await clerkClient();
        const user = await client.users.getUser(userIdToCheck);
        const sessionData = user.publicMetadata?.atraiva as any;

        if (sessionData?.preferences?.newsletterSubscribed !== undefined) {
          return NextResponse.json({
            success: true,
            isSubscribed: sessionData.preferences.newsletterSubscribed,
            subscription: sessionData.preferences.newsletterSubscribedAt
              ? {
                  id: undefined,
                  email: user.primaryEmailAddress?.emailAddress || emailParam || "",
                  subscribedAt: new Date(sessionData.preferences.newsletterSubscribedAt),
                  isActive: true,
                }
              : null,
            cached: true,
          });
        }
      } catch (metadataError) {
        // If metadata check fails, fall through to Firestore check
        console.warn("Failed to read subscription from metadata, checking Firestore:", metadataError);
      }
    }

    // If not in cache or force refresh, check Firestore
    let subscription = null;

    // Check by userId first (more reliable for logged-in users)
    if (userIdToCheck) {
      subscription = await NewsletterService.checkSubscriptionByUserId(userIdToCheck);
      
      // Update Clerk metadata with subscription status if found
      if (subscription && userIdToCheck === userId) {
        try {
          const { clerkClient } = await import("@clerk/nextjs/server");
          const client = await clerkClient();
          const user = await client.users.getUser(userIdToCheck);
          const sessionData = (user.publicMetadata?.atraiva || {}) as any;
          
          // Update preferences in metadata
          sessionData.preferences = {
            ...sessionData.preferences,
            newsletterSubscribed: true,
            newsletterSubscribedAt: subscription.subscribedAt instanceof Date 
              ? subscription.subscribedAt.toISOString()
              : subscription.subscribedAt,
          };
          
          await client.users.updateUserMetadata(userIdToCheck, {
            publicMetadata: {
              atraiva: sessionData,
            },
          });
        } catch (updateError) {
          // Don't fail the request if metadata update fails
          console.warn("Failed to update subscription in metadata:", updateError);
        }
      }
    }

    // Fallback to email check if userId didn't find anything
    if (!subscription && emailParam) {
      subscription = await NewsletterService.checkExistingSubscription(emailParam);
    }

    return NextResponse.json({
      success: true,
      isSubscribed: !!subscription,
      subscription: subscription || null,
      cached: false,
    });
  } catch (error) {
    console.error("Check subscription API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check subscription status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

