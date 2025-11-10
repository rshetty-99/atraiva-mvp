import { google } from "googleapis";

import { platformHealthConfig } from "./config";
import { getGoogleAuthClient } from "./google-auth";
import { SeoCoverage } from "./types";

const mapCoverageState = (state: string | undefined | null) => {
  if (!state) {
    return {
      valid: 0,
      warnings: 0,
      errors: 0,
    };
  }
  const normalized = state.toLowerCase();

  if (normalized.includes("indexed")) {
    return { valid: 1, warnings: 0, errors: 0 };
  }
  if (normalized.includes("pending") || normalized.includes("crawled")) {
    return { valid: 0, warnings: 1, errors: 0 };
  }
  if (
    normalized.includes("blocked") ||
    normalized.includes("error") ||
    normalized.includes("redirect") ||
    normalized.includes("not indexed")
  ) {
    return { valid: 0, warnings: 0, errors: 1 };
  }

  return { valid: 0, warnings: 0, errors: 0 };
};

export const fetchSearchConsoleCoverage = async (): Promise<SeoCoverage> => {
  const { searchConsole, analytics } = platformHealthConfig;
  const siteUrl = searchConsole.siteUrl ?? analytics.siteUrl;

  const defaultCoverage: SeoCoverage = {
    totalPages: null,
    valid: null,
    warnings: null,
    errors: null,
    updatedAt: new Date().toISOString(),
    details: siteUrl
      ? `Search Console site ${siteUrl} not configured or accessible`
      : "Search Console site URL not configured",
  };

  if (!siteUrl) {
    return defaultCoverage;
  }

  try {
    const auth = await getGoogleAuthClient([
      "https://www.googleapis.com/auth/webmasters.readonly",
    ]);

    const urlInspection = google.searchconsole({
      version: "v1",
      auth,
    });
    const webmasters = google.webmasters({
      version: "v3",
      auth,
    });

    const [inspectionResponse, crawlErrorsResponse] = await Promise.all([
      urlInspection.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: siteUrl,
          siteUrl,
        },
      }),
      webmasters.urlcrawlerrorscounts.query({
        siteUrl,
      }),
    ]);

    const inspectionResult =
      inspectionResponse.data?.inspectionResult?.indexStatusResult;
    const coverageState = inspectionResult?.coverageState ?? "Unknown";
    const { valid, warnings, errors } = mapCoverageState(coverageState);

    let totalErrorCount = 0;
    const entries = crawlErrorsResponse.data?.urlCrawlErrorCountsPerType ?? [];
    for (const entry of entries) {
      const counts = entry.entries ?? [];
      for (const count of counts) {
        totalErrorCount += count.count ?? 0;
      }
    }

    return {
      totalPages:
        typeof inspectionResult?.referringUrls === "object"
          ? Array.isArray(inspectionResult?.referringUrls)
            ? inspectionResult?.referringUrls.length
            : null
          : null,
      valid,
      warnings,
      errors: errors > 0 ? errors : totalErrorCount > 0 ? totalErrorCount : 0,
      updatedAt: new Date().toISOString(),
      details: coverageState,
    };
  } catch (error) {
    return {
      totalPages: null,
      valid: null,
      warnings: null,
      errors: null,
      updatedAt: new Date().toISOString(),
      details: `Failed to fetch Search Console coverage: ${
        (error as Error).message
      }`,
    };
  }
};
