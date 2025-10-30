import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { OnboardingMiddleware } from "@/lib/onboarding-middleware";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get onboarding progress
    const progress = await OnboardingMiddleware.getOnboardingProgress(userId);

    return NextResponse.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Failed to get onboarding progress:", error);

    return NextResponse.json(
      {
        error: "Failed to get onboarding progress",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
