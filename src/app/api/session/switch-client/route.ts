import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { SessionService } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clerkId, clientId } = body;

    // Verify the clerk ID matches the authenticated user
    if (clerkId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Switch client context
    await SessionService.switchClientContext(clerkId, clientId);

    return NextResponse.json({
      success: true,
      message: "Client context switched successfully",
    });
  } catch (error) {
    console.error("Error switching client context:", error);
    return NextResponse.json(
      { error: "Failed to switch client context" },
      { status: 500 }
    );
  }
}
