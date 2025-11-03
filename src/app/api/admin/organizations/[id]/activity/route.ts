import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { ActivityLogService } from "@/lib/activity-log-service";

// Type for Clerk metadata
type ClerkOrgMeta = { primaryOrganization?: { role?: string } };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user from Clerk to check role using Backend API
    const client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY!,
    });
    const user = await client.users.getUser(authData.userId);

    // Get role from the correct metadata location
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const userRole = metadata.primaryOrganization?.role ?? "";

    // Only platform_admin and super_admin can access this
    if (userRole !== "platform_admin" && userRole !== "super_admin") {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: `Access denied. Your role: ${
            userRole || "unknown"
          }. Required: platform_admin or super_admin`,
        },
        { status: 403 }
      );
    }

    // Await params before accessing properties (Next.js 15 requirement)
    const { id: organizationId } = await params;

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");

    // Fetch activity logs
    let activityLogs;
    if (category) {
      activityLogs = await ActivityLogService.getActivityLogsByCategory(
        organizationId,
        category,
        limitCount
      );
    } else {
      activityLogs = await ActivityLogService.getOrganizationActivityLogs(
        organizationId,
        limitCount
      );
    }

    return NextResponse.json({
      activityLogs,
      count: activityLogs.length,
    });
  } catch (error) {
    console.error("Error fetching organization activity logs:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch activity logs",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
