import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  createRegistrationLink,
  sendRegistrationEmail,
} from "@/lib/registration-link-service";
import { auditService } from "@/lib/firestore/collections";
import { UserService } from "@/lib/firestore/utils";

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details from Firestore
    const user = await UserService.getByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has permission (must be super_admin or platform_admin)
    const userRole = user.role;
    if (userRole !== "super_admin" && userRole !== "platform_admin") {
      return NextResponse.json(
        {
          error:
            "Insufficient permissions. Only platform admins can create registration links.",
        },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
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
    const result = await createRegistrationLink({
      organizationData,
      primaryUserData,
      paymentReference,
      notes,
      createdBy: userId,
      createdByEmail: user.auth.email || "",
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Send email if requested
    let emailSent = false;
    let emailError = null;

    if (sendEmail && result.linkId && result.token) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      const emailResult = await sendRegistrationEmail(
        result.linkId,
        result.token,
        baseUrl
      );

      emailSent = emailResult.success;
      emailError = emailResult.error;
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
      } as any);
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    return NextResponse.json({
      success: true,
      message: "Registration link created successfully",
      linkId: result.linkId,
      token: result.token,
      emailSent,
      emailError,
    });
  } catch (error) {
    console.error("Error creating registration link:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
