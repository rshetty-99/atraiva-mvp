"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCcw, ShieldAlert, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { useRole, useSession } from "@/hooks/useSession";
import type {
  PlatformHealthSnapshot,
  ServiceStatus,
  UtilizationMetric,
  SecurityMetric,
  DataPipelineMetric,
} from "@/lib/platform-health/types";

const statusBadge = (status: ServiceStatus["status"]) => {
  switch (status) {
    case "operational":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "maintenance":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "degraded":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    case "outage":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const severityBadge = (severity: SecurityMetric["status"]) => {
  switch (severity) {
    case "critical":
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    case "warning":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    case "normal":
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

const formatNumber = (
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", options).format(value);
};

const formatMs = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${formatNumber(value)} ms`;
};

export default function PlatformHealthPage() {
  const router = useRouter();
  const { session, loading: sessionLoading } = useSession();
  const { role } = useRole();

  const [snapshot, setSnapshot] = useState<PlatformHealthSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const isAuthorized = role === "platform_admin" || role === "super_admin";

  const lastUpdated = useMemo(() => {
    if (!snapshot?.generatedAt) {
      return null;
    }
    const date = new Date(snapshot.generatedAt);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }, [snapshot?.generatedAt]);

  const loadSnapshot = async (force = false) => {
    try {
      if (force) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch(
        `/api/admin/platform-health${force ? "?refresh=true" : ""}`,
        {
          cache: force ? "no-store" : "default",
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          payload?.error ?? `Request failed (${response.status})`
        );
      }

      const data = (await response.json()) as PlatformHealthSnapshot;
      setSnapshot(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) {
      return;
    }

    if (!session) {
      router.push("/dashboard");
      return;
    }

    if (!role) {
      return;
    }

    if (!isAuthorized) {
      router.push("/dashboard");
      return;
    }

    if (!initialLoadDone) {
      loadSnapshot();
      setInitialLoadDone(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionLoading, session, role, isAuthorized, initialLoadDone]);

  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading platform health…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-destructive" />
              Unable to load platform health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button onClick={() => loadSnapshot(true)} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!snapshot) {
    return null;
  }

  const renderUtilizationMetric = (metric: UtilizationMetric) => (
    <div
      key={metric.id}
      className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
    >
      <div>
        <p className="font-medium">{metric.name}</p>
        <p className="text-sm text-muted-foreground">{metric.details}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">
          {metric.value !== null && metric.value !== undefined
            ? `${formatNumber(metric.value)} ${metric.unit}`
            : "—"}
        </p>
        <Badge className={severityBadge(metric.status)}>
          {metric.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );

  const renderSecurityMetric = (metric: SecurityMetric) => (
    <div
      key={metric.id}
      className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
    >
      <div>
        <p className="font-medium">{metric.name}</p>
        <p className="text-sm text-muted-foreground">{metric.details}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">
          {metric.value !== null && metric.value !== undefined
            ? metric.unit
              ? `${formatNumber(metric.value)} ${metric.unit}`
              : formatNumber(metric.value)
            : "—"}
        </p>
        <Badge className={severityBadge(metric.status)}>
          {metric.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );

  const renderPipelineMetric = (metric: DataPipelineMetric) => (
    <div
      key={metric.id}
      className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
    >
      <div>
        <p className="font-medium">{metric.name}</p>
        <p className="text-sm text-muted-foreground">{metric.details}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">
          {metric.value !== null && metric.value !== undefined
            ? metric.unit
              ? `${formatNumber(metric.value)} ${metric.unit}`
              : formatNumber(metric.value)
            : "—"}
        </p>
        <Badge className={severityBadge(metric.status)}>
          {metric.status.toUpperCase()}
        </Badge>
      </div>
    </div>
  );

  return (
    <div
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8"
      style={{ marginTop: "140px" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Platform Health</h1>
          <p className="text-sm text-muted-foreground">
            Live operational telemetry across Clerk, Firebase, Cloud Run,
            Arcjet, and SEO.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Last updated: {lastUpdated ?? "—"}{" "}
            {snapshot.cache.isCached && "(cached)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            Cache TTL: {snapshot.cache.ttlSeconds}s
          </Badge>
          <Button
            variant="outline"
            onClick={() => loadSnapshot(true)}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            {refreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Refreshing…
              </>
            ) : (
              <>
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Realtime Service Status</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {snapshot.realtime.services.map((service) => (
              <div
                key={service.id}
                className="border border-border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {service.provider}
                    </p>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                  </div>
                  <Badge className={statusBadge(service.status)}>
                    {service.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Latency: {formatMs(service.latencyMs)}</p>
                  <p>
                    Error Rate:{" "}
                    {service.errorRatePercent !== null &&
                    service.errorRatePercent !== undefined
                      ? `${service.errorRatePercent.toFixed(2)}%`
                      : "—"}
                  </p>
                  {service.incidents !== null && (
                    <p>Incidents: {service.incidents}</p>
                  )}
                </div>
                {service.details && (
                  <p className="text-xs text-muted-foreground">
                    {service.details}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.resources.metrics.length > 0 ? (
              snapshot.resources.metrics.map(renderUtilizationMetric)
            ) : (
              <p className="text-sm text-muted-foreground">
                No resource metrics available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security & Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.security.metrics.length > 0 ? (
              snapshot.security.metrics.map(renderSecurityMetric)
            ) : (
              <p className="text-sm text-muted-foreground">
                No security metrics available.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Pipeline Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.dataPipeline.metrics.length > 0 ? (
              snapshot.dataPipeline.metrics.map(renderPipelineMetric)
            ) : (
              <p className="text-sm text-muted-foreground">
                No data pipeline metrics available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO Monitoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-border p-3">
              <p className="font-medium">Coverage</p>
              <p className="text-sm text-muted-foreground">
                {snapshot.seo.coverage.details}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center mt-3">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Total Pages
                  </p>
                  <p className="text-lg font-semibold">
                    {formatNumber(snapshot.seo.coverage.totalPages)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Valid
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {formatNumber(snapshot.seo.coverage.valid)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Errors
                  </p>
                  <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                    {formatNumber(snapshot.seo.coverage.errors)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="font-medium">Core Web Vitals</p>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">LCP</p>
                  <p className="text-lg font-semibold">
                    {formatMs(snapshot.seo.coreWebVitals.lcpMs)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">FID</p>
                  <p className="text-lg font-semibold">
                    {formatMs(snapshot.seo.coreWebVitals.fidMs)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">INP</p>
                  <p className="text-lg font-semibold">
                    {formatMs(snapshot.seo.coreWebVitals.inpMs)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">CLS</p>
                  <p className="text-lg font-semibold">
                    {snapshot.seo.coreWebVitals.cls ?? "—"}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Source: {snapshot.seo.coreWebVitals.source.toUpperCase()} •{" "}
                Collected{" "}
                {new Date(
                  snapshot.seo.coreWebVitals.collectedAt
                ).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              Alert Center
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {snapshot.alerts.items.length > 0 ? (
              snapshot.alerts.items.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Source: {alert.source} •{" "}
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={severityBadge(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No active alerts.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
