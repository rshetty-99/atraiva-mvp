import { google } from "googleapis";

import { platformHealthConfig } from "./config";
import { getGoogleAuthClient } from "./google-auth";

export interface MonitoringQueryOptions {
  filter: string;
  aligner?:
    | "ALIGN_NONE"
    | "ALIGN_MEAN"
    | "ALIGN_PERCENTILE_50"
    | "ALIGN_PERCENTILE_95"
    | "ALIGN_MAX"
    | "ALIGN_SUM";
  reducer?:
    | "REDUCE_SUM"
    | "REDUCE_MEAN"
    | "REDUCE_MAX"
    | "REDUCE_PERCENTILE_95";
  lookbackSeconds?: number;
  alignmentSeconds?: number;
  perSeriesAligner?: boolean;
}

export interface MonitoringPoint {
  value: number | null;
  collectedAt: string | null;
}

const toTimestamp = (date: Date) => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanos: (date.getTime() % 1000) * 1_000_000,
});

export const runMonitoringQuery = async (
  options: MonitoringQueryOptions
): Promise<MonitoringPoint> => {
  const {
    gcp: { projectId, monitoringAlignmentSeconds, monitoringLookbackSeconds },
  } = platformHealthConfig;

  if (!projectId) {
    throw new Error(
      "GCP project id missing for platform health monitoring query"
    );
  }

  const lookback = options.lookbackSeconds ?? monitoringLookbackSeconds ?? 300;
  const alignment =
    options.alignmentSeconds ?? monitoringAlignmentSeconds ?? 60;

  const end = new Date();
  const start = new Date(end.getTime() - lookback * 1000);

  const auth = await getGoogleAuthClient([
    "https://www.googleapis.com/auth/monitoring.read",
  ]);
  const monitoring = google.monitoring({ version: "v3", auth });

  const response = await monitoring.projects.timeSeries.list({
    name: `projects/${projectId}`,
    filter: options.filter,
    interval: {
      startTime: toTimestamp(start),
      endTime: toTimestamp(end),
    },
    aggregation: {
      alignmentPeriod: `${alignment}s`,
      perSeriesAligner: options.aligner ?? "ALIGN_MEAN",
      crossSeriesReducer: options.reducer,
    },
  });

  const timeSeries = response.data.timeSeries;
  if (!timeSeries || timeSeries.length === 0) {
    return {
      value: null,
      collectedAt: null,
    };
  }

  const first = timeSeries[0];
  const point = first.points?.[0];

  if (!point) {
    return {
      value: null,
      collectedAt: null,
    };
  }

  const doubleValue = point.value?.doubleValue;
  const intValue = point.value?.int64Value;
  const distribution = point.value?.distributionValue;

  const numericalValue =
    doubleValue ??
    (typeof intValue === "string" ? Number(intValue) : intValue ?? null) ??
    distribution?.mean ??
    null;

  const collectedAt =
    point.interval?.endTime ?? point.interval?.startTime ?? null;

  return {
    value: typeof numericalValue === "number" ? numericalValue : null,
    collectedAt,
  };
};
