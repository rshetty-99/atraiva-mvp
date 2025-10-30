import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { registrationLinkService } from "@/lib/firestore/collections";
import { UserService } from "@/lib/firestore/utils";

// GET - Get single registration link by ID
export async function GET(
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

    // Await params in Next.js 15
    const { id } = await params;
    const link = await registrationLinkService.getById(id);

    if (!link) {
      return NextResponse.json(
        { error: "Registration link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      link,
    });
  } catch (error) {
    console.error("Error fetching registration link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete registration link (soft delete by marking as cancelled)
export async function DELETE(
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

    // Await params in Next.js 15
    const { id } = await params;
    const link = await registrationLinkService.getById(id);

    if (!link) {
      return NextResponse.json(
        { error: "Registration link not found" },
        { status: 404 }
      );
    }

    // Check if already used
    if (link.status === "used") {
      return NextResponse.json(
        { error: "Cannot delete a used registration link" },
        { status: 400 }
      );
    }

    // Soft delete by marking as cancelled
    await registrationLinkService.update(id, {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelledBy: userId,
      cancellationReason: "Deleted by admin",
    } as any);

    return NextResponse.json({
      success: true,
      message: "Registration link deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting registration link:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
