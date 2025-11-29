// API endpoint to sync incident status from incident_statuses to incidents collection
// This fixes incidents that have completed analysis but still show "simulation_initialized"
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  incidentStatusQueries,
  incidentService,
} from "@/lib/firestore/collections";
import { Timestamp } from "firebase/firestore";

export async function POST(request: NextRequest) {
  try {
    // Check for secret token in header (for programmatic access like curl)
    const secretToken = request.headers.get("x-sync-secret");
    const expectedSecret = process.env.INCIDENT_SYNC_SECRET;
    
    // Require either authentication OR secret token
    const { userId } = await auth();
    
    if (!userId && (!secretToken || secretToken !== expectedSecret)) {
      return NextResponse.json(
        { 
          error: "Unauthorized", 
          message: "Authentication required or valid sync secret token" 
        },
        { status: 401 }
      );
    }

    // Get all completed incident statuses
    const completedStatuses = await incidentStatusQueries.getByStatus(
      "completed"
    );

    let syncedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // For each completed status, update the corresponding incident
    for (const statusDoc of completedStatuses) {
      try {
        if (!statusDoc.incidentId) {
          errors.push(
            `Status ${statusDoc.id} missing incidentId - skipping`
          );
          errorCount++;
          continue;
        }

        // Check if incident exists and needs updating
        const incident = await incidentService.getById(statusDoc.incidentId);

        if (!incident) {
          errors.push(
            `Incident ${statusDoc.incidentId} not found - skipping`
          );
          errorCount++;
          continue;
        }

        // Only update if status is still "simulation_initialized"
        if (incident.status === "simulation_initialized") {
          await incidentService.update(statusDoc.incidentId, {
            status: "simulation_completed" as const,
            completedAt: statusDoc.completedAt || (Timestamp.now() as unknown as Date),
          } as Partial<import("@/lib/firestore/types").IncidentSimulation>);

          syncedCount++;
          console.log(
            `Synced incident ${statusDoc.incidentId} to simulation_completed`
          );
        } else if (incident.status !== "simulation_completed") {
          // Log if status is something unexpected
          console.log(
            `Incident ${statusDoc.incidentId} already has status: ${incident.status} - skipping`
          );
        }
      } catch (error) {
        const errorMsg = `Error syncing incident ${statusDoc.incidentId}: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
        errors.push(errorMsg);
        errorCount++;
        console.error(errorMsg, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync completed: ${syncedCount} incidents updated, ${errorCount} errors`,
      syncedCount,
      errorCount,
      totalCompletedStatuses: completedStatuses.length,
      errors: errors.slice(0, 10), // Return first 10 errors
    });
  } catch (error) {
    console.error("Error syncing incident statuses:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to sync statuses",
      },
      { status: 500 }
    );
  }
}

// Also support GET for easy testing
export async function GET() {
  return NextResponse.json({
    message:
      "POST to this endpoint to sync incident statuses from incident_statuses to incidents collection",
    usage: "POST /api/incidents/sync-status",
  });
}

