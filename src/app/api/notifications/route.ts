import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { NotificationService } from "@/lib/notification-service";

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limitCount = parseInt(searchParams.get("limit") || "50");
    const statusFilter = searchParams.get("status") as any;

    // Fetch notifications for the current user
    const notifications = await NotificationService.getUserNotifications(
      authData.userId,
      limitCount,
      statusFilter
    );

    // Get unread count
    const unreadCount = await NotificationService.getUnreadCount(
      authData.userId
    );

    return NextResponse.json({
      notifications,
      unreadCount,
      count: notifications.length,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch notifications",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authData = await auth();

    if (!authData.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, action } = body;

    if (action === "mark_read") {
      await NotificationService.markAsRead(notificationId);
      return NextResponse.json({ success: true });
    }

    if (action === "mark_all_read") {
      await NotificationService.markAllAsRead(authData.userId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notification:", error);
    return NextResponse.json(
      {
        error: "Failed to update notification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
