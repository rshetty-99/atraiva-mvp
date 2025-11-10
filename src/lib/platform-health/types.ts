export type HealthStatus =
  | "operational"
  | "degraded"
  | "outage"
  | "maintenance"
  | "unknown";

export type Severity = "normal" | "warning" | "critical" | "unknown";

export type TrendDirection = "up" | "down" | "flat" | "unknown";

export interface Trend {
  direction: TrendDirection;
  value?: number | null;
  unit?: string;
  period?: string;
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: HealthStatus;
  latencyMs?: number | null;
  errorRatePercent?: number | null;
  incidents?: number | null;
  updatedAt: string;
  details?: string;
  provider?: string;
}

export interface UtilizationMetric {
  id: string;
  name: string;
  value: number | null;
  unit: string;
  limit?: number | null;
  status: Severity;
  trend?: Trend;
  updatedAt: string;
  details?: string;
}

export interface SecurityMetric {
  id: string;
  name: string;
  value: number | null;
  unit?: string;
  category?: string;
  status: Severity;
  updatedAt: string;
  details?: string;
}

export interface DataPipelineMetric {
  id: string;
  name: string;
  value: number | null;
  unit?: string;
  status: Severity;
  updatedAt: string;
  details?: string;
}

export interface SeoCoverage {
  totalPages: number | null;
  valid: number | null;
  warnings: number | null;
  errors: number | null;
  updatedAt: string;
  details?: string;
}

export interface CoreWebVitals {
  lcpMs: number | null;
  fidMs: number | null;
  inpMs: number | null;
  cls: number | null;
  source: "ga4" | "pagespeed" | "lighthouse" | "unknown";
  collectedAt: string;
}

export interface AlertItem {
  id: string;
  source: string;
  title: string;
  description: string;
  severity: Severity;
  status: "open" | "acknowledged" | "resolved";
  createdAt: string;
  link?: string;
}

export interface PlatformHealthSnapshot {
  generatedAt: string;
  generatedInMs: number;
  cache: {
    isCached: boolean;
    ttlSeconds: number;
    expiresAt: string;
  };
  realtime: {
    services: ServiceStatus[];
  };
  resources: {
    metrics: UtilizationMetric[];
  };
  security: {
    metrics: SecurityMetric[];
  };
  dataPipeline: {
    metrics: DataPipelineMetric[];
  };
  seo: {
    coverage: SeoCoverage;
    coreWebVitals: CoreWebVitals;
  };
  alerts: {
    totalOpen: number;
    items: AlertItem[];
  };
}


