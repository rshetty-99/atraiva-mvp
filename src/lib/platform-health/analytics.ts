import { google } from "googleapis";

import { platformHealthConfig } from "./config";
import { getGoogleAuthClient } from "./google-auth";
import { ServiceStatus, CoreWebVitals } from "./types";

let cachedPropertyId: string | null = null;

const resolveGaPropertyId = async () => {
  if (cachedPropertyId) {
    return cachedPropertyId;
  }

  const {
    analytics: { propertyId, measurementId },
  } = platformHealthConfig;

  if (propertyId) {
    cachedPropertyId = propertyId;
    return cachedPropertyId;
  }

  if (!measurementId) {
    return null;
  }

  const auth = await getGoogleAuthClient([
    "https://www.googleapis.com/auth/analytics.readonly",
  ]);
  const admin = google.analyticsadmin({
    version: "v1beta",
    auth,
  });

  const accountsResponse = await admin.accounts.list({ pageSize: 200 });
  const accounts = accountsResponse.data.accounts ?? [];

  for (const account of accounts) {
    const accountName = account.name;
    if (!accountName) {
      continue;
    }
    const propertiesResponse = await admin.properties.list({
      filter: `parent:${accountName}`,
      pageSize: 200,
    });
    const properties = propertiesResponse.data.properties ?? [];
    for (const property of properties) {
      if (!property.name) {
        continue;
      }

      const dataStreamsResponse = await admin.properties.dataStreams.list({
        parent: property.name,
        pageSize: 200,
      });
      const dataStreams = dataStreamsResponse.data.dataStreams ?? [];

      for (const stream of dataStreams) {
        const streamMeasurementId =
          stream.webStreamData?.measurementId ||
          stream.iosAppStreamData?.firebaseAppId ||
          stream.androidAppStreamData?.firebaseAppId;
        if (streamMeasurementId === measurementId) {
          cachedPropertyId = property.name;
          return cachedPropertyId;
        }
      }
    }
  }

  return null;
};

const fetchCoreWebVitals = async (): Promise<CoreWebVitals> => {
  const url =
    platformHealthConfig.analytics.siteUrl ??
    platformHealthConfig.searchConsole.siteUrl;

  if (!url) {
    return {
      lcpMs: null,
      fidMs: null,
      inpMs: null,
      cls: null,
      source: "unknown",
      collectedAt: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&strategy=DESKTOP`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error(`PageSpeed API responded with ${response.status}`);
    }

    const payload = await response.json();
    const audits = payload?.lighthouseResult?.audits ?? {};

    const lcp =
      audits["largest-contentful-paint"]?.numericValue ??
      audits["largest-contentful-paint"]?.numericValueInMs ??
      null;
    const fid =
      audits["max-potential-fid"]?.numericValue ??
      audits["max-potential-fid"]?.numericValueInMs ??
      null;
    const inp =
      audits["interactive"]?.numericValue ??
      audits["time-to-interactive"]?.numericValue ??
      null;
    const cls = audits["cumulative-layout-shift"]?.numericValue ?? null;

    return {
      lcpMs: typeof lcp === "number" ? Math.round(lcp) : null,
      fidMs: typeof fid === "number" ? Math.round(fid) : null,
      inpMs: typeof inp === "number" ? Math.round(inp) : null,
      cls: typeof cls === "number" ? Math.round(cls * 1000) / 1000 : null,
      source: "pagespeed",
      collectedAt: new Date().toISOString(),
    };
  } catch {
    return {
      lcpMs: null,
      fidMs: null,
      inpMs: null,
      cls: null,
      source: "pagespeed",
      collectedAt: new Date().toISOString(),
    };
  }
};

export interface AnalyticsServiceMetrics {
  service: ServiceStatus;
  coreWebVitals: CoreWebVitals;
}

export const fetchAnalyticsMetrics =
  async (): Promise<AnalyticsServiceMetrics> => {
    const updatedAt = new Date().toISOString();

    try {
      const propertyName = await resolveGaPropertyId();

      if (!propertyName) {
        return {
          service: {
            id: "ga4",
            name: "GA4 Analytics",
            status: "unknown",
            latencyMs: null,
            errorRatePercent: null,
            incidents: null,
            updatedAt,
            provider: "Google Analytics",
            details:
              "Unable to resolve GA property. Set GA_PROPERTY_ID or ensure the service account has access.",
          },
          coreWebVitals: await fetchCoreWebVitals(),
        };
      }

      const auth = await getGoogleAuthClient([
        "https://www.googleapis.com/auth/analytics.readonly",
      ]);
      const analytics = google.analyticsdata({
        version: "v1beta",
        auth,
      });

      const report = await analytics.properties.runReport({
        property: propertyName,
        requestBody: {
          metrics: [{ name: "totalUsers" }, { name: "sessions" }],
          dateRanges: [
            {
              startDate: "7daysAgo",
              endDate: "today",
            },
          ],
          limit: "1",
        },
      });

      const totals = report.data?.totals?.[0]?.metricValues ?? [];
      const totalUsers =
        totals.length > 0 ? Number(totals[0].value ?? 0) : null;
      const sessions = totals.length > 1 ? Number(totals[1].value ?? 0) : null;

      const service: ServiceStatus = {
        id: "ga4",
        name: "GA4 Analytics",
        status: "operational",
        latencyMs: null,
        errorRatePercent: null,
        incidents: null,
        updatedAt,
        provider: "Google Analytics",
        details:
          totalUsers !== null
            ? `${totalUsers.toLocaleString()} users / ${
                sessions?.toLocaleString() ?? "-"
              } sessions in last 7 days`
            : undefined,
      };

      const coreWebVitals = await fetchCoreWebVitals();

      return {
        service,
        coreWebVitals,
      };
    } catch (error) {
      return {
        service: {
          id: "ga4",
          name: "GA4 Analytics",
          status: "degraded",
          latencyMs: null,
          errorRatePercent: null,
          incidents: null,
          updatedAt: new Date().toISOString(),
          provider: "Google Analytics",
          details: `Failed to fetch GA4 metrics: ${(error as Error).message}`,
        },
        coreWebVitals: await fetchCoreWebVitals(),
      };
    }
  };
