import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  createRegistrationLink,
  sendRegistrationEmail,
} from "@/lib/registration-link-service";
import { auditService } from "@/lib/firestore/collections";
import { UserService } from "@/lib/firestore/utils";

export async function POST(request: NextRequest) {
  console.log("=== POST /api/registration-links/create - START ===");
  try {
    // Authenticate user
    const { userId } = await auth();
    console.log("POST /api/registration-links/create - User ID:", userId);

    if (!userId) {
      console.log("POST /api/registration-links/create - No user ID, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details from Firestore
    console.log("POST /api/registration-links/create - Fetching user from Firestore...");
    const user = await UserService.getByClerkId(userId);
    console.log("POST /api/registration-links/create - User found:", user ? "Yes" : "No");

    if (!user) {
      console.log("POST /api/registration-links/create - User not found, returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has permission (must be super_admin or platform_admin)
    const userRole = user.role;
    console.log("POST /api/registration-links/create - User role:", userRole);
    if (userRole !== "super_admin" && userRole !== "platform_admin") {
      console.log("POST /api/registration-links/create - Insufficient permissions, returning 403");
      return NextResponse.json(
        {
          error:
            "Insufficient permissions. Only platform admins can create registration links.",
        },
        { status: 403 }
      );
    }

    // Parse request body
    console.log("POST /api/registration-links/create - Parsing request body...");
    const body = await request.json();
    console.log("POST /api/registration-links/create - Request body parsed:", {
      hasOrganizationData: !!body.organizationData,
      hasPrimaryUserData: !!body.primaryUserData,
      organizationName: body.organizationData?.name,
      primaryUserEmail: body.primaryUserData?.email,
      sendEmail: body.sendEmail,
    });
    const {
      organizationData,
      primaryUserData,
      paymentReference,
      notes,
      sendEmail = true,
    } = body;

    // Validate required fields
    if (!organizationData || !primaryUserData) {
      return NextResponse.json(
        { error: "Organization data and primary user data are required" },
        { status: 400 }
      );
    }

    // Validate organization data
    if (
      !organizationData.name ||
      !organizationData.organizationType ||
      !organizationData.industry ||
      !organizationData.teamSize
    ) {
      return NextResponse.json(
        {
          error:
            "Organization name, type, industry, and team size are required",
        },
        { status: 400 }
      );
    }

    // Validate primary user data
    if (
      !primaryUserData.firstName ||
      !primaryUserData.lastName ||
      !primaryUserData.email ||
      !primaryUserData.role
    ) {
      return NextResponse.json(
        {
          error:
            "Primary user first name, last name, email, and role are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(primaryUserData.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Create registration link
    console.log("=== API Route: Creating Registration Link ===");
    console.log("Request body:", {
      organizationName: organizationData?.name,
      primaryUserEmail: primaryUserData?.email,
      sendEmail,
    });

    const result = await createRegistrationLink({
      organizationData,
      primaryUserData,
      paymentReference,
      notes,
      createdBy: userId,
      createdByEmail: user.auth.email || "",
    });

    console.log("Registration link creation result:", {
      success: result.success,
      linkId: result.linkId,
      hasToken: !!result.token,
      error: result.error,
    });

    if (!result.success) {
      console.error("Registration link creation failed:", result.error);
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (!result.linkId) {
      console.error("ERROR: Registration link creation returned success but no linkId!");
      return NextResponse.json(
        { error: "Registration link was created but no ID was returned. Please check Firestore." },
        { status: 500 }
      );
    }

    // Send email if requested
    let emailSent = false;
    let emailError = null;
    let emailDocId = null;

    if (sendEmail && result.linkId && result.token) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      console.log("Attempting to send registration email...");
      console.log("Base URL:", baseUrl);
      console.log("Link ID:", result.linkId);
      
      const emailResult = await sendRegistrationEmail(
        result.linkId,
        result.token,
        baseUrl
      );

      emailSent = emailResult.success;
      emailError = emailResult.error;
      emailDocId = (emailResult as any).emailDocId || null;
      
      console.log("Email sending result:", {
        success: emailSent,
        error: emailError,
        emailDocId,
      });
    }

    // Create audit log
    try {
      await auditService.create({
        organizationId: "platform", // Platform-level action
        userId,
        action: "registration_link_created",
        resourceType: "registration_link",
        resourceId: result.linkId || "",
        changes: {
          organizationName: organizationData.name,
          primaryUserEmail: primaryUserData.email,
          emailSent,
        },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        timestamp: new Date(),
        success: true,
      } as Record<string, unknown>);
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    console.log("=== POST /api/registration-links/create - SUCCESS ===");
    console.log("Response:", {
      success: true,
      linkId: result.linkId,
      hasToken: !!result.token,
      emailSent,
      emailError,
    });

    return NextResponse.json({
      success: true,
      message: "Registration link created successfully",
      linkId: result.linkId,
      token: result.token,
      emailSent,
      emailError,
      emailDocId,
      warning: emailSent && !emailError 
        ? "Email queued for delivery. Verify Firebase Extension is configured to actually send emails."
        : null,
    });
  } catch (error) {
    console.error("=== POST /api/registration-links/create - ERROR ===");
    console.error("Error creating registration link:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", {
      message: errorMessage,
      stack: errorStack,
      error,
    });
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}. Please check the console for details.` },
      { status: 500 }
    );
  }
}
