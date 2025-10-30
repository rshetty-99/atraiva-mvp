import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { OnboardingService } from "@/lib/onboarding-service";
import { OnboardingData } from "@/lib/firestore/types";

export async function POST(request: NextRequest) {
  try {
    // Parse the onboarding data from the request body first
    const onboardingData: OnboardingData = await request.json();

    // Validate required fields
    const requiredFields = [
      "email",
      "organizationName",
      "firstName",
      "lastName",
      "username",
      "password",
    ];
    const missingFields = requiredFields.filter(
      (field) => !onboardingData[field as keyof OnboardingData]
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          missingFields,
          details: `Please provide: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(onboardingData.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Complete the onboarding process (this creates the user and organization)
    const result = await OnboardingService.completeOnboarding(onboardingData);

    return NextResponse.json({
      success: true,
      userId: result.userId,
      organizationId: result.organizationId,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("Onboarding completion failed:", error);

    return NextResponse.json(
      {
        error: "Onboarding failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has completed onboarding
    const hasCompleted = await OnboardingService.hasCompletedOnboarding(userId);
    const primaryOrgId = await OnboardingService.getUserPrimaryOrganization(
      userId
    );

    return NextResponse.json({
      hasCompletedOnboarding: hasCompleted,
      primaryOrganizationId: primaryOrgId,
    });
  } catch (error) {
    console.error("Failed to check onboarding status:", error);

    return NextResponse.json(
      {
        error: "Failed to check onboarding status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
