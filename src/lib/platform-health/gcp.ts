import { platformHealthConfig } from "./config";
import { runMonitoringQuery } from "./google-monitoring";
import {
  DataPipelineMetric,
  SecurityMetric,
  ServiceStatus,
  UtilizationMetric,
} from "./types";

const buildCloudRunFilter = (metricType: string) => {
  const {
    gcp: { cloudRunService },
  } = platformHealthConfig;
  const base = [
    `metric.type="${metricType}"`,
    `resource.type="cloud_run_revision"`,
  ];
  if (cloudRunService) {
    base.push(`resource.label.service_name="${cloudRunService}"`);
  }
  return base.join(" AND ");
};

const buildFirestoreFilter = (metricType: string) => {
  const {
    gcp: { projectId },
  } = platformHealthConfig;
  const base = [
    `metric.type="${metricType}"`,
    `resource.type="firestore_instance"`,
  ];
  if (projectId) {
    base.push(`resource.label.project_id="${projectId}"`);
  }
  return base.join(" AND ");
};

const buildFirebaseHostingFilter = (metricType: string) => {
  const {
    gcp: { firebaseSite },
  } = platformHealthConfig;
  const base = [
    `metric.type="${metricType}"`,
    `resource.type="firebase_hosting_site"`,
  ];
  if (firebaseSite) {
    base.push(`resource.label.site_id="${firebaseSite}"`);
  }
  return base.join(" AND ");
};

export interface CloudRunMetrics {
  service: ServiceStatus;
  resources: UtilizationMetric[];
}

export interface FirestoreMetrics {
  service: ServiceStatus;
  resources: UtilizationMetric[];
  dataPipeline: DataPipelineMetric[];
  security: SecurityMetric[];
}

export interface FirebaseHostingMetrics {
  service: ServiceStatus;
  resources: UtilizationMetric[];
}

export const fetchCloudRunMetrics = async (): Promise<CloudRunMetrics> => {
  const updatedAt = new Date().toISOString();
  try {
    const latency = await runMonitoringQuery({
      filter: buildCloudRunFilter("run.googleapis.com/request_latencies"),
      aligner: "ALIGN_PERCENTILE_95",
    });

    const requestCount = await runMonitoringQuery({
      filter: buildCloudRunFilter("run.googleapis.com/request_count"),
      aligner: "ALIGN_SUM",
    });

    const errorCount = await runMonitoringQuery({
      filter: `${buildCloudRunFilter(
        "run.googleapis.com/request_count"
      )} AND metric.label.response_code_class="5xx"`,
      aligner: "ALIGN_SUM",
    });

    const cpuUtilization = await runMonitoringQuery({
      filter: buildCloudRunFilter(
        "run.googleapis.com/container/cpu/utilizations"
      ),
      aligner: "ALIGN_MEAN",
    });

    const memoryUtilization = await runMonitoringQuery({
      filter: buildCloudRunFilter(
        "run.googleapis.com/container/memory/utilizations"
      ),
      aligner: "ALIGN_MEAN",
    });

    const errorRatePercent =
      requestCount.value && errorCount.value
        ? Number(
            (
              (errorCount.value / Math.max(requestCount.value, 1)) *
              100
            ).toFixed(2)
          )
        : null;

    const status: ServiceStatus = {
      id: "cloud_run",
      name: "Cloud Run",
      status:
        typeof latency.value === "number" && latency.value > 2500
          ? "degraded"
          : typeof errorRatePercent === "number" && errorRatePercent > 5
          ? "degraded"
          : "operational",
      latencyMs:
        typeof latency.value === "number"
          ? Number(latency.value.toFixed(0))
          : null,
      errorRatePercent,
      incidents: null,
      updatedAt,
      provider: "Google Cloud",
      details:
        requestCount.value !== null
          ? `${Math.round(requestCount.value)} requests in the last window`
          : undefined,
    };

    const resources: UtilizationMetric[] = [
      {
        id: "cloud_run_cpu",
        name: "CPU Utilization",
        value:
          typeof cpuUtilization.value === "number"
            ? Number((cpuUtilization.value * 100).toFixed(1))
            : null,
        unit: "%",
        status:
          typeof cpuUtilization.value === "number"
            ? cpuUtilization.value > 0.85
              ? "warning"
              : "normal"
            : "unknown",
        updatedAt,
        details: "Average Cloud Run CPU utilization",
      },
      {
        id: "cloud_run_memory",
        name: "Memory Utilization",
        value:
          typeof memoryUtilization.value === "number"
            ? Number((memoryUtilization.value * 100).toFixed(1))
            : null,
        unit: "%",
        status:
          typeof memoryUtilization.value === "number"
            ? memoryUtilization.value > 0.85
              ? "warning"
              : "normal"
            : "unknown",
        updatedAt,
        details: "Average Cloud Run memory utilization",
      },
    ];

    return {
      service: status,
      resources,
    };
  } catch (error) {
    return {
      service: {
        id: "cloud_run",
        name: "Cloud Run",
        status: "degraded",
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Google Cloud",
        details: `Failed to fetch Cloud Run metrics: ${
          (error as Error).message
        }`,
      },
      resources: [],
    };
  }
};

export const fetchFirestoreMetrics = async (): Promise<FirestoreMetrics> => {
  const updatedAt = new Date().toISOString();
  try {
    const readLatency = await runMonitoringQuery({
      filter: buildFirestoreFilter(
        "firestore.googleapis.com/document/read_latency"
      ),
      aligner: "ALIGN_PERCENTILE_95",
    });

    const writeLatency = await runMonitoringQuery({
      filter: buildFirestoreFilter(
        "firestore.googleapis.com/document/write_latency"
      ),
      aligner: "ALIGN_PERCENTILE_95",
    });

    const readCount = await runMonitoringQuery({
      filter: buildFirestoreFilter(
        "firestore.googleapis.com/document/read_count"
      ),
      aligner: "ALIGN_SUM",
    });

    const writeCount = await runMonitoringQuery({
      filter: buildFirestoreFilter(
        "firestore.googleapis.com/document/write_count"
      ),
      aligner: "ALIGN_SUM",
    });

    const deniedRequests = await runMonitoringQuery({
      filter: `${buildFirestoreFilter(
        "firestore.googleapis.com/request_count"
      )} AND metric.label.status_code="PERMISSION_DENIED"`,
      aligner: "ALIGN_SUM",
    });

    const serviceStatus: ServiceStatus = {
      id: "firestore",
      name: "Firestore",
      status:
        typeof readLatency.value === "number" && readLatency.value > 1200
          ? "degraded"
          : typeof writeLatency.value === "number" && writeLatency.value > 1200
          ? "degraded"
          : "operational",
      latencyMs:
        typeof readLatency.value === "number"
          ? Number(readLatency.value.toFixed(0))
          : null,
      errorRatePercent: null,
      incidents: null,
      updatedAt,
      provider: "Google Cloud",
      details: `Reads: ${Math.round(
        readCount.value ?? 0
      )} / Writes: ${Math.round(writeCount.value ?? 0)}`,
    };

    const resources: UtilizationMetric[] = [
      {
        id: "firestore_reads",
        name: "Read Operations",
        value:
          typeof readCount.value === "number"
            ? Number(readCount.value.toFixed(0))
            : null,
        unit: "ops",
        status: "normal",
        updatedAt,
        details: "Firestore reads in the latest monitoring window",
      },
      {
        id: "firestore_writes",
        name: "Write Operations",
        value:
          typeof writeCount.value === "number"
            ? Number(writeCount.value.toFixed(0))
            : null,
        unit: "ops",
        status: "normal",
        updatedAt,
        details: "Firestore writes in the latest monitoring window",
      },
    ];

    const dataPipeline: DataPipelineMetric[] = [
      {
        id: "firestore_read_latency",
        name: "Read Latency (p95)",
        value:
          typeof readLatency.value === "number"
            ? Number(readLatency.value.toFixed(0))
            : null,
        unit: "ms",
        status:
          typeof readLatency.value === "number" && readLatency.value > 1200
            ? "warning"
            : "normal",
        updatedAt,
        details: "95th percentile read latency",
      },
      {
        id: "firestore_write_latency",
        name: "Write Latency (p95)",
        value:
          typeof writeLatency.value === "number"
            ? Number(writeLatency.value.toFixed(0))
            : null,
        unit: "ms",
        status:
          typeof writeLatency.value === "number" && writeLatency.value > 1200
            ? "warning"
            : "normal",
        updatedAt,
        details: "95th percentile write latency",
      },
    ];

    const security: SecurityMetric[] = [
      {
        id: "firestore_denied_requests",
        name: "Security Rule Denials",
        value:
          typeof deniedRequests.value === "number"
            ? Number(deniedRequests.value.toFixed(0))
            : null,
        unit: "requests",
        status:
          typeof deniedRequests.value === "number"
            ? deniedRequests.value > 0
              ? "warning"
              : "normal"
            : "unknown",
        updatedAt,
        category: "firestore_rules",
        details:
          typeof deniedRequests.value === "number"
            ? `${deniedRequests.value} Firestore requests denied by rules`
            : "No data on Firestore rule denials.",
      },
    ];

    return {
      service: serviceStatus,
      resources,
      dataPipeline,
      security,
    };
  } catch (error) {
    return {
      service: {
        id: "firestore",
        name: "Firestore",
        status: "degraded",
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Google Cloud",
        details: `Failed to fetch Firestore metrics: ${
          (error as Error).message
        }`,
      },
      resources: [],
      dataPipeline: [],
      security: [
        {
          id: "firestore_metrics_unavailable",
          name: "Firestore Metrics",
          value: null,
          status: "warning",
          updatedAt: new Date().toISOString(),
          category: "configuration",
          details:
            "Unable to retrieve Firestore metrics. Check Monitoring API access and service account permissions.",
        },
      ],
    };
  }
};

export const fetchFirebaseHostingMetrics =
  async (): Promise<FirebaseHostingMetrics> => {
    const updatedAt = new Date().toISOString();
    try {
      const latency = await runMonitoringQuery({
        filter: buildFirebaseHostingFilter(
          "firebasehosting.googleapis.com/https/request_latencies"
        ),
        aligner: "ALIGN_PERCENTILE_95",
      });

      const bandwidth = await runMonitoringQuery({
        filter: buildFirebaseHostingFilter(
          "firebasehosting.googleapis.com/https/response_bytes_count"
        ),
        aligner: "ALIGN_SUM",
      });

      const requests = await runMonitoringQuery({
        filter: buildFirebaseHostingFilter(
          "firebasehosting.googleapis.com/https/request_count"
        ),
        aligner: "ALIGN_SUM",
      });

      const status: ServiceStatus = {
        id: "firebase_hosting",
        name: "Firebase Hosting",
        status:
          typeof latency.value === "number" && latency.value > 2000
            ? "degraded"
            : "operational",
        latencyMs:
          typeof latency.value === "number"
            ? Number(latency.value.toFixed(0))
            : null,
        errorRatePercent: null,
        incidents: null,
        updatedAt,
        provider: "Firebase",
        details:
          typeof requests.value === "number"
            ? `${Math.round(
                requests.value
              )} requests served in the latest monitoring window`
            : undefined,
      };

      const resources: UtilizationMetric[] = [
        {
          id: "firebase_hosting_bandwidth",
          name: "Bandwidth Served",
          value:
            typeof bandwidth.value === "number"
              ? Number((bandwidth.value / (1024 * 1024)).toFixed(2))
              : null,
          unit: "MB",
          status: "normal",
          updatedAt,
          details: "Total response bytes served (converted to MB)",
        },
        {
          id: "firebase_hosting_requests",
          name: "Requests",
          value:
            typeof requests.value === "number"
              ? Number(requests.value.toFixed(0))
              : null,
          unit: "requests",
          status: "normal",
          updatedAt,
          details: "HTTP requests handled by Firebase Hosting",
        },
      ];

      return {
        service: status,
        resources,
      };
    } catch (error) {
      return {
        service: {
          id: "firebase_hosting",
          name: "Firebase Hosting",
          status: "degraded",
          latencyMs: null,
          errorRatePercent: null,
          incidents: null,
          updatedAt: new Date().toISOString(),
          provider: "Firebase",
          details: `Failed to fetch Firebase Hosting metrics: ${
            (error as Error).message
          }`,
        },
        resources: [],
      };
    }
  };
