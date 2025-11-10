import { fetchArcjetMetrics } from "./arcjet";
import { fetchAnalyticsMetrics } from "./analytics";
import { getCacheMetadata, getFromCache, setCache } from "./cache";
import { fetchClerkMetrics } from "./clerk";
import { platformHealthConfig } from "./config";
import {
  fetchCloudRunMetrics,
  fetchFirebaseHostingMetrics,
  fetchFirestoreMetrics,
} from "./gcp";
import { fetchSearchConsoleCoverage } from "./search-console";
import {
  AlertItem,
  PlatformHealthSnapshot,
  Severity,
  ServiceStatus,
} from "./types";

const CACHE_KEY = "platform_health_snapshot";

const buildAlerts = (
  services: ServiceStatus[],
  securitySeverity: Map<string, Severity>
): AlertItem[] => {
  const alerts: AlertItem[] = [];
  const now = new Date().toISOString();

  services.forEach((service) => {
    if (service.status === "degraded" || service.status === "outage") {
      alerts.push({
        id: `service-${service.id}`,
        source: service.provider ?? service.name,
        title: `${service.name} ${
          service.status === "outage" ? "Outage" : "Degraded"
        }`,
        description:
          service.details ??
          `${service.name} reported ${service.status} status.`,
        severity: service.status === "outage" ? "critical" : "warning",
        status: "open",
        createdAt: now,
      });
    }
  });

  securitySeverity.forEach((severity, key) => {
    if (severity === "warning" || severity === "critical") {
      alerts.push({
        id: `security-${key}`,
        source: "Security",
        title: severity === "critical" ? "Security Alert" : "Security Warning",
        description: `Security metric "${key}" reported ${severity} severity.`,
        severity,
        status: "open",
        createdAt: now,
      });
    }
  });

  return alerts;
};

export interface PlatformHealthOptions {
  forceRefresh?: boolean;
}

export const getPlatformHealthSnapshot = async (
  options: PlatformHealthOptions = {}
): Promise<PlatformHealthSnapshot> => {
  const start = Date.now();
  if (!options.forceRefresh) {
    const cached = getFromCache<PlatformHealthSnapshot>(CACHE_KEY);
    if (cached) {
      const cacheMeta = getCacheMetadata(CACHE_KEY);
      return {
        ...cached.data,
        generatedInMs: Date.now() - start,
        cache: {
          ...cached.data.cache,
          isCached: cacheMeta.isCached,
          ttlSeconds: cacheMeta.ttlSeconds,
          expiresAt: cacheMeta.expiresAt,
        },
      };
    }
  }

  const [
    clerkResult,
    firestoreResult,
    cloudRunResult,
    hostingResult,
    arcjetResult,
    analyticsResult,
    coverageResult,
  ] = await Promise.all([
    fetchClerkMetrics().catch((error) => ({
      service: {
        id: "clerk",
        name: "Clerk Authentication",
        status: "degraded" as const,
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Clerk",
        details: `Clerk metrics failed: ${(error as Error).message}`,
      },
      security: [],
    })),
    fetchFirestoreMetrics().catch((error) => ({
      service: {
        id: "firestore",
        name: "Firestore",
        status: "degraded" as const,
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Google Cloud",
        details: `Firestore metrics failed: ${(error as Error).message}`,
      },
      resources: [],
      dataPipeline: [],
      security: [],
    })),
    fetchCloudRunMetrics().catch((error) => ({
      service: {
        id: "cloud_run",
        name: "Cloud Run",
        status: "degraded" as const,
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Google Cloud",
        details: `Cloud Run metrics failed: ${(error as Error).message}`,
      },
      resources: [],
    })),
    fetchFirebaseHostingMetrics().catch((error) => ({
      service: {
        id: "firebase_hosting",
        name: "Firebase Hosting",
        status: "degraded" as const,
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Firebase",
        details: `Firebase Hosting metrics failed: ${(error as Error).message}`,
      },
      resources: [],
    })),
    fetchArcjetMetrics().catch((error) => ({
      service: {
        id: "arcjet",
        name: "Arcjet Protection",
        status: "degraded" as const,
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Arcjet",
        details: `Arcjet metrics failed: ${(error as Error).message}`,
      },
      security: [],
    })),
    fetchAnalyticsMetrics().catch((error) => ({
      service: {
        id: "ga4",
        name: "GA4 Analytics",
        status: "degraded" as const,
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt: new Date().toISOString(),
        provider: "Google Analytics",
        details: `Analytics metrics failed: ${(error as Error).message}`,
      },
      coreWebVitals: {
        lcpMs: null,
        fidMs: null,
        inpMs: null,
        cls: null,
        source: "unknown",
        collectedAt: new Date().toISOString(),
      },
    })),
    fetchSearchConsoleCoverage().catch((error) => ({
      totalPages: null,
      valid: null,
      warnings: null,
      errors: null,
      updatedAt: new Date().toISOString(),
      details: `Search Console metrics failed: ${(error as Error).message}`,
    })),
  ]);

  const realtimeServices: ServiceStatus[] = [
    clerkResult.service,
    firestoreResult.service,
    hostingResult.service,
    cloudRunResult.service,
    arcjetResult.service,
    analyticsResult.service,
  ];

  const resourceMetrics = [
    ...(firestoreResult.resources ?? []),
    ...(cloudRunResult.resources ?? []),
    ...(hostingResult.resources ?? []),
  ];

  const securitySeverity = new Map<string, Severity>();
  const securityMetrics = [
    ...(clerkResult.security ?? []),
    ...(firestoreResult.security ?? []),
    ...(arcjetResult.security ?? []),
  ].map((metric) => {
    securitySeverity.set(metric.name, metric.status);
    return metric;
  });

  const dataPipelineMetrics = [...(firestoreResult.dataPipeline ?? [])];

  const alerts = buildAlerts(realtimeServices, securitySeverity);

  const generatedAt = new Date().toISOString();
  const generatedInMs = Date.now() - start;
  const cacheTtlMs = platformHealthConfig.cacheTtlMs;
  const snapshot: PlatformHealthSnapshot = {
    generatedAt,
    generatedInMs,
    cache: {
      isCached: false,
      ttlSeconds: Math.floor(cacheTtlMs / 1000),
      expiresAt: new Date(Date.now() + cacheTtlMs).toISOString(),
    },
    realtime: {
      services: realtimeServices,
    },
    resources: {
      metrics: resourceMetrics,
    },
    security: {
      metrics: securityMetrics,
    },
    dataPipeline: {
      metrics: dataPipelineMetrics,
    },
    seo: {
      coverage: coverageResult,
      coreWebVitals: analyticsResult.coreWebVitals,
    },
    alerts: {
      totalOpen: alerts.length,
      items: alerts,
    },
  };

  setCache(CACHE_KEY, snapshot, cacheTtlMs);

  return snapshot;
};
