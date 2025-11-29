// Incident analysis service for triggering Cloud Run analysis
import { Timestamp } from "firebase/firestore";
import { incidentStatusService } from "@/lib/firestore/collections";
import type { IncidentStatus } from "@/lib/firestore/types";

export interface AnalysisRequest {
  incidentId: string;
  organizationId: string;
  analysisType: "purview_scan" | "incident_data" | "combined";
  purviewScanUrl?: string;
  incidentData?: Record<string, unknown>;
}

/**
 * Create an analysis request and status document
 */
export async function createAnalysisRequest(
  request: AnalysisRequest
): Promise<string> {
  try {
    const statusData: Omit<IncidentStatus, "id" | "createdAt" | "updatedAt"> = {
      incidentId: request.incidentId,
      organizationId: request.organizationId,
      status: "pending",
      analysisType: request.analysisType,
      triggeredAt: Timestamp.now() as unknown as Date,
      metadata: {
        purviewScanUrl: request.purviewScanUrl,
        incidentData: request.incidentData,
      },
    } as Omit<IncidentStatus, "id" | "createdAt" | "updatedAt">;

    const statusId = await incidentStatusService.create(statusData);
    return statusId;
  } catch (error) {
    console.error("Error creating analysis request:", error);
    throw new Error("Failed to create analysis request");
  }
}

/**
 * Update analysis status
 */
export async function updateAnalysisStatus(
  statusId: string,
  updates: Partial<IncidentStatus>
): Promise<void> {
  try {
    const updateData: Partial<IncidentStatus> = {
      ...updates,
      updatedAt: Timestamp.now() as unknown as Date,
    };
    await incidentStatusService.update(statusId, updateData);
  } catch (error) {
    console.error("Error updating analysis status:", error);
    throw new Error("Failed to update analysis status");
  }
}

/**
 * Update analysis results
 */
export async function updateAnalysisResults(
  statusId: string,
  results: IncidentStatus["analysisResults"]
): Promise<void> {
  try {
    const updateData: Partial<IncidentStatus> = {
      analysisResults: results,
      status: "completed",
      completedAt: Timestamp.now() as unknown as Date,
      updatedAt: Timestamp.now() as unknown as Date,
    };
    await incidentStatusService.update(statusId, updateData);
  } catch (error) {
    console.error("Error updating analysis results:", error);
    throw new Error("Failed to update analysis results");
  }
}

/**
 * Mark analysis as failed
 */
export async function markAnalysisFailed(
  statusId: string,
  error: string
): Promise<void> {
  try {
    const updateData: Partial<IncidentStatus> = {
      status: "failed",
      error,
      updatedAt: Timestamp.now() as unknown as Date,
    };
    await incidentStatusService.update(statusId, updateData);
  } catch (error) {
    console.error("Error marking analysis as failed:", error);
    throw new Error("Failed to mark analysis as failed");
  }
}
