import { platformHealthConfig } from "./config";
import { SecurityMetric, ServiceStatus } from "./types";

export interface ArcjetMetrics {
  service: ServiceStatus;
  security: SecurityMetric[];
}

type ArcjetSummary = {
  totalRequests?: number;
  blockedRequests?: number;
  throttledRequests?: number;
  botBlocks?: number;
  rateLimitBlocks?: number;
  threatInsights?: {
    category?: string;
    count?: number;
  }[];
};

const attemptParseArcjet = (payload: unknown): ArcjetSummary => {
  if (!payload || typeof payload !== "object") {
    return {};
  }

  const data = payload as Record<string, unknown>;

  const decisions = (data.decisions as Record<string, unknown>) || {};
  const security = (data.security as Record<string, unknown>) || {};
  const blocking = (data.blocking as Record<string, unknown>) || {};

  const summary: ArcjetSummary = {
    totalRequests: Number(
      data.totalRequests ?? data.requests ?? decisions.total
    ),
    blockedRequests: Number(
      data.blockedRequests ??
        blocking.total ??
        decisions.blocked ??
        security.blocked
    ),
    throttledRequests: Number(blocking.rateLimited ?? decisions.rateLimited),
    botBlocks: Number(security?.bot ?? decisions?.bot),
    rateLimitBlocks: Number(blocking?.rateLimited ?? decisions?.rateLimited),
  };

  if (Array.isArray(data.threatInsights)) {
    summary.threatInsights = data.threatInsights
      .map((entry: unknown) => {
        if (!entry || typeof entry !== "object") {
          return null;
        }
        const threat = entry as Record<string, unknown>;
        const categoryRaw = threat.category ?? threat.type;
        const countRaw = threat.count ?? threat.value;
        return {
          category: typeof categoryRaw === "string" ? categoryRaw : "unknown",
          count:
            typeof countRaw === "number" ? countRaw : Number(countRaw) || 0,
        };
      })
      .filter((entry): entry is { category: string; count: number } =>
        Boolean(entry)
      );
  }

  return summary;
};

export const fetchArcjetMetrics = async (): Promise<ArcjetMetrics> => {
  const {
    arcjet: { apiKey, apiUrl, metricsEndpoint },
  } = platformHealthConfig;
  const updatedAt = new Date().toISOString();

  let latencyMs: number | null = null;
  let serviceStatus: ServiceStatus = {
    id: "arcjet",
    name: "Arcjet Protection",
    status: "unknown",
    latencyMs: null,
    errorRatePercent: null,
    incidents: null,
    updatedAt,
    provider: "Arcjet",
    details: undefined,
  };

  let securityMetrics: SecurityMetric[] = [];

  if (!apiKey) {
    serviceStatus = {
      ...serviceStatus,
      status: "unknown",
      details: "ARCJET_KEY is not configured. Unable to fetch Arcjet metrics.",
    };
    securityMetrics.push({
      id: "arcjet_metrics_disabled",
      name: "Arcjet Metrics Access",
      value: null,
      status: "warning",
      updatedAt,
      category: "configuration",
      details:
        "Set ARCJET_KEY (and ARCJET_METRICS_URL if using custom endpoint) to enable live Arcjet metrics.",
    });
    return {
      service: serviceStatus,
      security: securityMetrics,
    };
  }

  const targetUrl = metricsEndpoint
    ? metricsEndpoint
    : new URL("/metrics/summary", apiUrl).toString();

  try {
    const start = Date.now();
    const response = await fetch(targetUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    latencyMs = Date.now() - start;

    if (!response.ok) {
      throw new Error(`Arcjet metrics responded ${response.status}`);
    }

    const payload = await response.json();
    const summary = attemptParseArcjet(payload);

    const totalRequests = summary.totalRequests ?? null;
    const blocked = summary.blockedRequests ?? null;
    const botBlocks = summary.botBlocks ?? null;
    const rateLimited =
      summary.rateLimitBlocks ?? summary.throttledRequests ?? null;

    const errorRatePercent =
      totalRequests && blocked
        ? Number(((blocked / Math.max(totalRequests, 1)) * 100).toFixed(2))
        : null;

    serviceStatus = {
      id: "arcjet",
      name: "Arcjet Protection",
      status: "operational",
      latencyMs,
      errorRatePercent,
      incidents: null,
      updatedAt,
      provider: "Arcjet",
      details:
        totalRequests !== null
          ? `Processed ${totalRequests.toLocaleString()} requests in the last window`
          : undefined,
    };

    securityMetrics = [
      {
        id: "arcjet_blocked_requests",
        name: "Threats Blocked",
        value: blocked,
        unit: "requests",
        status:
          typeof blocked === "number"
            ? blocked > 1000
              ? "critical"
              : blocked > 250
              ? "warning"
              : "normal"
            : "unknown",
        updatedAt,
        category: "bot_protection",
        details:
          blocked !== null
            ? `${blocked.toLocaleString()} requests blocked by Arcjet`
            : "No blocking activity reported.",
      },
      {
        id: "arcjet_bot_blocks",
        name: "Bot Blocks",
        value: botBlocks,
        unit: "requests",
        status:
          typeof botBlocks === "number"
            ? botBlocks > 400
              ? "critical"
              : botBlocks > 100
              ? "warning"
              : "normal"
            : "unknown",
        updatedAt,
        category: "bot_protection",
        details:
          botBlocks !== null
            ? `${botBlocks.toLocaleString()} suspected bots blocked`
            : "No bot block metrics available.",
      },
      {
        id: "arcjet_rate_limits",
        name: "Rate Limiting Events",
        value: rateLimited,
        unit: "requests",
        status:
          typeof rateLimited === "number"
            ? rateLimited > 500
              ? "critical"
              : rateLimited > 100
              ? "warning"
              : "normal"
            : "unknown",
        updatedAt,
        category: "rate_limiting",
        details:
          rateLimited !== null
            ? `${rateLimited.toLocaleString()} requests throttled`
            : "No rate limiting metrics available.",
      },
    ];

    if (summary.threatInsights && summary.threatInsights.length > 0) {
      summary.threatInsights.forEach((insight, index) => {
        securityMetrics.push({
          id: `arcjet_insight_${index}`,
          name: `Threat Insight: ${insight.category ?? "unknown"}`,
          value: insight.count ?? null,
          unit: "events",
          status:
            typeof insight.count === "number" && insight.count > 50
              ? "warning"
              : "normal",
          updatedAt,
          category: "threat_intel",
          details: `Arcjet flagged ${insight.count ?? "0"} events in ${
            insight.category
          }`,
        });
      });
    }
  } catch (error) {
    serviceStatus = {
      ...serviceStatus,
      status: "degraded",
      latencyMs,
      details: `Arcjet metrics fetch failed: ${(error as Error).message}`,
    };
    securityMetrics.push({
      id: "arcjet_metrics_unavailable",
      name: "Arcjet Metrics Fetch",
      value: null,
      status: "warning",
      updatedAt,
      category: "configuration",
      details:
        "Unable to retrieve Arcjet metrics. Verify ARCJET_METRICS_URL and API permissions.",
    });
  }

  return {
    service: serviceStatus,
    security: securityMetrics,
  };
};
