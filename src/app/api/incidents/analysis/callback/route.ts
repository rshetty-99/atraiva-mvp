// Webhook callback for Cloud Run analysis results
import { NextRequest, NextResponse } from "next/server";
import {
  updateAnalysisResults,
  markAnalysisFailed,
} from "@/lib/services/incident-analysis";
import type { IncidentStatus } from "@/lib/firestore/types";

// Webhook secret for validation (should be in environment variables)
const WEBHOOK_SECRET = process.env.CLOUD_RUN_WEBHOOK_SECRET || "";

/**
 * Validate webhook signature (if implemented by Cloud Run)
 */
function validateWebhookSignature(
  _signature: string | null,
  _payload: string
): boolean {
  if (!WEBHOOK_SECRET) {
    // If no secret configured, allow all (for development)
    return true;
  }

  // Implement HMAC validation if needed
  // const expectedSignature = createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
  // return signature === expectedSignature;

  return true; // Placeholder - implement proper validation
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-webhook-signature");
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Validate webhook signature
    if (!validateWebhookSignature(signature, payload)) {
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 401 }
      );
    }

    const { statusId, results, error: analysisError } = body;

    if (!statusId) {
      return NextResponse.json(
        { error: "statusId is required" },
        { status: 400 }
      );
    }

    if (analysisError) {
      // Mark analysis as failed
      await markAnalysisFailed(statusId, analysisError);
      return NextResponse.json({ success: true });
    }

    // Update with results
    const analysisResults: IncidentStatus["analysisResults"] = {
      insights: results.insights || [],
      risks: results.risks || [],
      recommendations: results.recommendations || [],
      complianceGaps: results.complianceGaps || [],
      dataClassification: results.dataClassification,
    };

    await updateAnalysisResults(statusId, analysisResults);

    // Update incident status to "simulation_completed" after analysis is done
    try {
      // Get the incidentId from the status document
      const { incidentStatusService, incidentService } = await import(
        "@/lib/firestore/collections"
      );
      const { Timestamp: FirestoreTimestamp } = await import(
        "firebase/firestore"
      );
      const statusDoc = await incidentStatusService.getById(statusId);

      if (!statusDoc) {
        console.error(`Status document ${statusId} not found`);
        // Don't return early - continue to return success for the webhook
        // but log the error so we know the incident won't be updated
      } else if (!statusDoc.incidentId) {
        console.error(`Status document ${statusId} missing incidentId`);
        // Don't return early - continue to return success for the webhook
      } else {
        // Update the incident status to simulation_completed
        await incidentService.update(statusDoc.incidentId, {
          status: "simulation_completed" as const,
          completedAt: FirestoreTimestamp.now() as unknown as Date,
          // updatedAt will be set automatically by the update method using serverTimestamp()
        } as Partial<import("@/lib/firestore/types").IncidentSimulation>);

        console.log(
          `Successfully updated incident ${statusDoc.incidentId} to simulation_completed`
        );
      }
    } catch (error) {
      console.error(
        "Error updating incident status to simulation_completed:",
        error
      );
      // Don't fail the callback if status update fails, but log the error
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing analysis callback:", error);
    return NextResponse.json(
      { error: "Failed to process callback" },
      { status: 500 }
    );
  }
}
