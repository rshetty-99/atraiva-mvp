const DEFAULT_CACHE_TTL = 2 * 60 * 1000;

const normalizePrivateKey = (key?: string) =>
  key ? key.replace(/\\n/g, "\n") : undefined;

export interface PlatformHealthConfig {
  cacheTtlMs: number;
  clerk: {
    secretKey?: string;
    apiUrl: string;
    statusPageUrl: string;
  };
  gcp: {
    projectId?: string;
    clientEmail?: string;
    privateKey?: string;
    monitoringLookbackSeconds: number;
    monitoringAlignmentSeconds: number;
    cloudRunService?: string;
    firebaseSite?: string;
  };
  analytics: {
    measurementId?: string;
    propertyId?: string;
    siteUrl?: string;
  };
  searchConsole: {
    siteUrl?: string;
  };
  arcjet: {
    apiKey?: string;
    apiUrl: string;
    metricsEndpoint?: string;
  };
}

const env = process.env;

export const platformHealthConfig: PlatformHealthConfig = {
  cacheTtlMs:
    Number(env.PLATFORM_HEALTH_CACHE_TTL_MS) > 0
      ? Number(env.PLATFORM_HEALTH_CACHE_TTL_MS)
      : DEFAULT_CACHE_TTL,
  clerk: {
    secretKey: env.CLERK_SECRET_KEY,
    apiUrl: env.CLERK_API_URL ?? "https://api.clerk.com/v1",
    statusPageUrl:
      env.CLERK_STATUS_URL ?? "https://status.clerk.com/api/v2/status.json",
  },
  gcp: {
    projectId:
      env.GCP_PROJECT_ID ??
      env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
      env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: normalizePrivateKey(env.FIREBASE_PRIVATE_KEY),
    monitoringLookbackSeconds: Number(
      env.PLATFORM_HEALTH_MONITORING_LOOKBACK_SECONDS ?? 300
    ),
    monitoringAlignmentSeconds: Number(
      env.PLATFORM_HEALTH_MONITORING_ALIGNMENT_SECONDS ?? 60
    ),
    cloudRunService: env.CLOUD_RUN_SERVICE_NAME,
    firebaseSite:
      env.FIREBASE_HOSTING_SITE_ID ??
      env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
      env.GCP_DEFAULT_HOSTING_SITE,
  },
  analytics: {
    measurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    propertyId: env.GA_PROPERTY_ID,
    siteUrl:
      env.PLATFORM_HEALTH_SITE_URL ??
      env.NEXT_PUBLIC_SITE_URL ??
      env.NEXT_PUBLIC_APP_URL,
  },
  searchConsole: {
    siteUrl: env.SEARCH_CONSOLE_SITE_URL,
  },
  arcjet: {
    apiKey: env.ARCJET_KEY,
    apiUrl: env.ARCJET_API_URL ?? "https://api.arcjet.com/v1",
    metricsEndpoint: env.ARCJET_METRICS_URL,
  },
};

export const isPlatformHealthConfigured = () => {
  const {
    gcp: { projectId, clientEmail, privateKey },
  } = platformHealthConfig;
  return Boolean(projectId && clientEmail && privateKey);
};
