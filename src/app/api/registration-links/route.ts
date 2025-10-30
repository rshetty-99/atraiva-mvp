import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  registrationLinkService,
  registrationLinkQueries,
} from "@/lib/firestore/collections";
import { UserService } from "@/lib/firestore/utils";

// GET - List all registration links
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();

    console.log("Registration Links API - User ID:", userId);
    console.log(
      "Registration Links API - Request headers:",
      Object.fromEntries(request.headers.entries())
    );

    if (!userId) {
      console.log("Registration Links API - No user ID found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user details from Firestore
    const user = await UserService.getByClerkId(userId);

    if (!user) {
      console.log("Registration Links API - User not found in Firestore");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Registration Links API - Firestore user data:", {
      id: user.id,
      role: user.role,
      userType: user.userType,
      organizations: user.organizations,
    });

    // Check if user has permission
    const userRole = user.role;
    console.log("Registration Links API - Checking role:", userRole);

    if (userRole !== "super_admin" && userRole !== "platform_admin") {
      console.log(
        "Registration Links API - Insufficient permissions, role:",
        userRole
      );
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    console.log(
      "Registration Links API - Permission granted for role:",
      userRole
    );

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") as any;
    const email = searchParams.get("email");
    const createdBy = searchParams.get("createdBy");

    let links;

    // Filter by query parameters
    if (status) {
      links = await registrationLinkQueries.getByStatus(status);
    } else if (email) {
      links = await registrationLinkQueries.getByEmail(email);
    } else if (createdBy) {
      links = await registrationLinkQueries.getByCreator(createdBy);
    } else {
      // Get all links
      links = await registrationLinkService.getAll();
    }

    return NextResponse.json({
      success: true,
      links,
      count: links.length,
    });
  } catch (error) {
    console.error("Error fetching registration links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
