// Cloud Run trigger service for incident analysis
import { updateAnalysisStatus } from "./incident-analysis";

const CLOUD_RUN_URL = process.env.NEXT_PUBLIC_CLOUD_RUN_ANALYSIS_URL || "";

export interface CloudRunAnalysisRequest {
  statusId: string;
  incidentId: string;
  organizationId: string;
  analysisType: "purview_scan" | "incident_data" | "combined";
  purviewScanUrl?: string;
  incidentData?: Record<string, unknown>;
}

/**
 * Trigger Cloud Run analysis job
 */
export async function triggerCloudRunAnalysis(
  request: CloudRunAnalysisRequest
): Promise<string> {
  if (!CLOUD_RUN_URL) {
    throw new Error("Cloud Run URL not configured");
  }

  try {
    // Update status to analyzing
    await updateAnalysisStatus(request.statusId, {
      status: "analyzing",
      startedAt: new Date(),
    });

    // Call Cloud Run endpoint
    const response = await fetch(CLOUD_RUN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authentication header if needed
        // Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        statusId: request.statusId,
        incidentId: request.incidentId,
        organizationId: request.organizationId,
        analysisType: request.analysisType,
        purviewScanUrl: request.purviewScanUrl,
        incidentData: request.incidentData,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cloud Run request failed: ${response.statusText}`);
    }

    const result = await response.json();
    const jobId = result.jobId || result.id || request.statusId;

    // Update status with job ID
    await updateAnalysisStatus(request.statusId, {
      cloudRunJobId: jobId,
    });

    return jobId;
  } catch (error) {
    console.error("Error triggering Cloud Run analysis:", error);

    // Mark as failed
    await updateAnalysisStatus(request.statusId, {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });

    throw error;
  }
}
