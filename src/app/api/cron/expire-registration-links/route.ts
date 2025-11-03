import { NextRequest, NextResponse } from "next/server";
import {
  registrationLinkQueries,
  registrationLinkService,
} from "@/lib/firestore/collections";

/**
 * Cron job to auto-expire registration links
 *
 * This API route should be called by a scheduled task (e.g., Vercel Cron)
 * to automatically expire registration links that have passed their expiration date.
 *
 * For Vercel Cron, add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/expire-registration-links",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 *
 * This runs daily at midnight UTC
 */

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON] Starting registration link expiration check...");

    // Get all expired links that haven't been marked as expired yet
    const expiredLinks = await registrationLinkQueries.getExpiredLinks();

    console.log(`[CRON] Found ${expiredLinks.length} expired links to process`);

    let successCount = 0;
    let errorCount = 0;

    // Mark each expired link
    for (const link of expiredLinks) {
      try {
        await registrationLinkService.update(link.id, {
          status: "expired",
        } as Record<string, unknown>);

        successCount++;
        console.log(
          `[CRON] Expired link ${link.id} for ${link.primaryUserData.email}`
        );
      } catch (error) {
        errorCount++;
        console.error(`[CRON] Failed to expire link ${link.id}:`, error);
      }
    }

    console.log(
      `[CRON] Completed: ${successCount} expired, ${errorCount} errors`
    );

    return NextResponse.json({
      success: true,
      processed: expiredLinks.length,
      expired: successCount,
      errors: errorCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CRON] Error in expire-registration-links:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggering
export async function POST(request: NextRequest) {
  return GET(request);
}
