import { NextRequest, NextResponse } from "next/server";
import { validateRegistrationToken } from "@/lib/registration-link-service";

// POST - Validate registration token (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const result = await validateRegistrationToken(token);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, error: result.error },
        { status: 400 }
      );
    }

    // Return sanitized link data (without sensitive info)
    const { link } = result;
    const sanitizedLink = {
      organizationData: link!.organizationData,
      primaryUserData: {
        firstName: link!.primaryUserData.firstName,
        lastName: link!.primaryUserData.lastName,
        email: link!.primaryUserData.email,
        jobTitle: link!.primaryUserData.jobTitle,
        role: link!.primaryUserData.role,
      },
      expiresAt: link!.expiresAt,
    };

    return NextResponse.json({
      valid: true,
      link: sanitizedLink,
    });
  } catch (error) {
    console.error("Error validating registration token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
