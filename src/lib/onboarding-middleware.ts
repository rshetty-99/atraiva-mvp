import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { OnboardingService } from "@/lib/onboarding-service";

/**
 * Onboarding Middleware
 * Checks if authenticated users have completed onboarding
 * and redirects them appropriately
 */
export class OnboardingMiddleware {
  /**
   * Check if user needs to complete onboarding
   */
  static async checkOnboardingStatus(
    request: NextRequest,
    userId: string
  ): Promise<NextResponse | null> {
    try {
      const pathname = request.nextUrl.pathname;

      // Skip onboarding check for certain routes
      const skipRoutes = [
        "/onboarding",
        "/sign-in",
        "/sign-up",
        "/api",
        "/_next",
        "/favicon.ico",
      ];

      if (skipRoutes.some((route) => pathname.startsWith(route))) {
        return null; // Continue with request
      }

      // Check if user has completed onboarding
      const hasCompleted = await OnboardingService.hasCompletedOnboarding(
        userId
      );

      if (!hasCompleted) {
        // User hasn't completed onboarding, redirect to onboarding
        const onboardingUrl = new URL("/onboarding", request.url);
        onboardingUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(onboardingUrl);
      }

      // User has completed onboarding, continue with request
      return null;
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // On error, allow the request to continue to avoid blocking access
      return null;
    }
  }

  /**
   * Get user's onboarding progress
   */
  static async getOnboardingProgress(userId: string): Promise<{
    completed: boolean;
    primaryOrganizationId: string | null;
    completedSteps: string[];
  }> {
    try {
      const hasCompleted = await OnboardingService.hasCompletedOnboarding(
        userId
      );
      const primaryOrgId = await OnboardingService.getUserPrimaryOrganization(
        userId
      );

      // Define the onboarding steps
      const allSteps = [
        "welcome",
        "organization-setup",
        "role-selection",
        "dashboard-preview",
        "security-setup",
        "completion",
      ];

      const completedSteps = hasCompleted ? allSteps : [];

      return {
        completed: hasCompleted,
        primaryOrganizationId: primaryOrgId,
        completedSteps,
      };
    } catch (error) {
      console.error("Error getting onboarding progress:", error);
      return {
        completed: false,
        primaryOrganizationId: null,
        completedSteps: [],
      };
    }
  }

  /**
   * Validate onboarding completion requirements
   */
  static validateOnboardingRequirements(data: Record<string, unknown>): {
    isValid: boolean;
    missingFields: string[];
    errors: string[];
  } {
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "username",
      "password",
      "organizationName",
      "organizationType",
      "industry",
      "role",
      "address",
      "city",
      "state",
      "zipCode",
      "country",
    ];

    const missingFields = requiredFields.filter(
      (field) =>
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "")
    );

    const errors: string[] = [];

    // Email validation
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push("Invalid email format");
    }

    // Password validation
    if (data.password && data.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    // Username validation
    if (data.username && data.username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    }

    return {
      isValid: missingFields.length === 0 && errors.length === 0,
      missingFields,
      errors,
    };
  }

  /**
   * Create onboarding redirect response
   */
  static createOnboardingRedirect(
    request: NextRequest,
    reason: string = "incomplete"
  ): NextResponse {
    const onboardingUrl = new URL("/onboarding", request.url);
    onboardingUrl.searchParams.set("reason", reason);
    onboardingUrl.searchParams.set("from", request.nextUrl.pathname);

    return NextResponse.redirect(onboardingUrl);
  }

  /**
   * Create dashboard redirect response after onboarding completion
   */
  static createDashboardRedirect(request: NextRequest): NextResponse {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }
}
