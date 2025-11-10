import { platformHealthConfig } from "./config";
import { HealthStatus, SecurityMetric, ServiceStatus, Severity } from "./types";

const mapIndicatorToStatus = (indicator?: string): HealthStatus => {
  switch (indicator) {
    case "none":
    case "operational":
      return "operational";
    case "minor":
    case "degraded_performance":
      return "degraded";
    case "major":
    case "partial_outage":
      return "outage";
    case "critical":
    case "major_outage":
      return "outage";
    case "maintenance":
      return "maintenance";
    default:
      return "unknown";
  }
};

const toSeverity = (status: HealthStatus): Severity => {
  switch (status) {
    case "operational":
      return "normal";
    case "maintenance":
      return "warning";
    case "degraded":
      return "warning";
    case "outage":
      return "critical";
    default:
      return "unknown";
  }
};

const buildAuthHeader = (secretKey?: string) => {
  if (!secretKey) {
    return undefined;
  }

  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
};

const buildClerkUrl = (base: string, path: string) => {
  const normalizedBase = base.endsWith("/") ? base : `${base}/`;
  return new URL(path, normalizedBase).toString();
};

const fetchJson = async (url: string, headers?: Record<string, string>) => {
  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }
  return response.json();
};

export interface ClerkMetrics {
  service: ServiceStatus;
  security: SecurityMetric[];
}

export const fetchClerkMetrics = async (): Promise<ClerkMetrics> => {
  const { clerk } = platformHealthConfig;

  const headers = buildAuthHeader(clerk.secretKey);

  let latencyMs: number | null = null;
  let apiStatus: HealthStatus = "unknown";
  let errorRatePercent: number | null = null;
  let incidents: number | null = null;
  let details: string | undefined;
  let signInFailures = 0;
  let mfaChallenges = 0;
  const updatedAt = new Date().toISOString();

  try {
    const statusPayload = await fetchJson(clerk.statusPageUrl);
    const indicator: string | undefined = statusPayload?.status?.indicator;
    const description: string | undefined = statusPayload?.status?.description;
    const activeIncidents: unknown[] = Array.isArray(statusPayload?.incidents)
      ? statusPayload?.incidents
      : [];

    incidents = activeIncidents.length;
    apiStatus = mapIndicatorToStatus(indicator);
    details =
      description ||
      (activeIncidents.length > 0
        ? activeIncidents
            .map((incident: unknown) => {
              if (incident && typeof incident === "object") {
                const value = (incident as Record<string, unknown>).name;
                if (typeof value === "string") {
                  return value;
                }
              }
              return "Incident";
            })
            .join(", ")
        : undefined);
  } catch (error) {
    apiStatus = "unknown";
    details = `Status lookup failed: ${(error as Error).message}`;
  }

  if (headers) {
    try {
      const url = new URL(buildClerkUrl(clerk.apiUrl, "users"));
      url.searchParams.set("limit", "1");

      const start = Date.now();
      const response = await fetch(url.toString(), {
        headers,
        cache: "no-store",
      });
      latencyMs = Date.now() - start;

      if (!response.ok) {
        apiStatus = "degraded";
        details = `Clerk API responded with ${response.status}`;
      } else {
        const responseJson = await response.json();
        const totalCount =
          typeof responseJson?.total_count === "number"
            ? responseJson.total_count
            : Array.isArray(responseJson?.data)
            ? responseJson.data.length
            : null;

        // Use a tiny heuristic to estimate error rate. Without explicit metrics we keep this null.
        errorRatePercent = totalCount === 0 ? 0 : null;
      }
    } catch (error) {
      apiStatus = "degraded";
      details = `Clerk API probe failed: ${(error as Error).message}`;
    }

    try {
      const url = new URL(buildClerkUrl(clerk.apiUrl, "sign_ins"));
      url.searchParams.set("limit", "50");
      url.searchParams.set("order_by", "-created_at");

      const response = await fetch(url.toString(), {
        headers,
        cache: "no-store",
      });

      if (response.ok) {
        const payload = await response.json();
        const records: unknown[] = Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : [];

        signInFailures = records.filter((entry) => {
          if (!entry || typeof entry !== "object") {
            return false;
          }
          const status = (entry as Record<string, unknown>).status;
          if (typeof status !== "string") {
            return false;
          }
          return status === "abandoned" || status === "blocked";
        }).length;

        mfaChallenges = records.filter((entry) => {
          if (!entry || typeof entry !== "object") {
            return false;
          }
          const status = (entry as Record<string, unknown>).status;
          return typeof status === "string"
            ? status.includes("needs_second_factor")
            : false;
        }).length;
      }
    } catch (error) {
      // Surface in details but do not fail entirely.
      details = [
        details,
        `Failed to fetch sign-in metrics: ${(error as Error).message}`,
      ]
        .filter(Boolean)
        .join(" | ");
    }
  }

  const service: ServiceStatus = {
    id: "clerk",
    name: "Clerk Authentication",
    status: apiStatus,
    latencyMs,
    errorRatePercent,
    incidents,
    updatedAt,
    details,
    provider: "Clerk",
  };

  const security: SecurityMetric[] = [
    {
      id: "clerk_failed_signins",
      name: "Failed Sign-ins (last 50 attempts)",
      value: signInFailures,
      unit: "events",
      status:
        signInFailures > 15
          ? "critical"
          : signInFailures > 5
          ? "warning"
          : "normal",
      updatedAt,
      category: "authentication",
      details: signInFailures
        ? `${signInFailures} abandoned/blocked sign-in attempts detected`
        : "No failed sign-in attempts in the latest sample",
    },
    {
      id: "clerk_mfa_challenges",
      name: "MFA Challenges Required",
      value: mfaChallenges,
      unit: "events",
      status:
        mfaChallenges > 20
          ? "critical"
          : mfaChallenges > 5
          ? "warning"
          : "normal",
      updatedAt,
      category: "authentication",
      details: mfaChallenges
        ? `${mfaChallenges} sign-ins currently waiting for MFA`
        : "No MFA challenges pending",
    },
  ];

  if (!headers) {
    const severity = toSeverity(apiStatus);
    security.push({
      id: "clerk_metrics_disabled",
      name: "Clerk Metrics Access",
      value: null,
      status: severity === "critical" ? "critical" : "warning",
      updatedAt,
      category: "configuration",
      details:
        "Set CLERK_SECRET_KEY to enable live authentication metrics in platform health.",
    });
  }

  return {
    service,
    security,
  };
};
