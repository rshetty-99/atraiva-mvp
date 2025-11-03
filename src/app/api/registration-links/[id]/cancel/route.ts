import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { cancelRegistrationLink } from "@/lib/registration-link-service";
import { auditService } from "@/lib/firestore/collections";
import { UserService } from "@/lib/firestore/utils";

// POST - Cancel registration link
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserService.getByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userRole = user.role;
    if (userRole !== "super_admin" && userRole !== "platform_admin") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    // Await params in Next.js 15
    const { id } = await params;
    const result = await cancelRegistrationLink(id, userId, reason);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Create audit log
    try {
      await auditService.create({
        organizationId: "platform",
        userId,
        action: "registration_link_cancelled",
        resourceType: "registration_link",
        resourceId: id,
        changes: { reason },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        timestamp: new Date(),
        success: true,
      } as Record<string, unknown>);
    } catch (auditError) {
      console.error("Failed to create audit log:", auditError);
    }

    return NextResponse.json({
      success: true,
      message: "Registration link cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling registration link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
