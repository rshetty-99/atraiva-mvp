"use client";

import { useMemo } from "react";
import { useBreachTriggers, useBreachTaxonomies } from "@/hooks/useBreachData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Link as LinkIcon,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

const severityVariants: Record<string, string> = {
  low: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30",
  medium:
    "bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/30",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/30",
  critical:
    "bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/30",
};

export default function BreachTriggerReferencePage() {
  const {
    data: triggers,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useBreachTriggers();
  const { data: taxonomies } = useBreachTaxonomies();

  const taxonomyLookup = useMemo(() => {
    if (!taxonomies) return new Map<string, string>();
    return new Map(taxonomies.map((node) => [node.id, node.label]));
  }, [taxonomies]);

  const groupedByValidation = useMemo(() => {
    const groups = new Map<
      string,
      { label: string; description: string; items: typeof triggers }
    >();
    if (!triggers) return groups;

    groups.set("current", {
      label: "Current",
      description: "Triggers validated against the latest regulation snapshot.",
      items: [],
    });
    groups.set("needs_review", {
      label: "Needs Review",
      description:
        "Triggers flagged for re-validation after regulation changes.",
      items: [],
    });
    groups.set("outdated", {
      label: "Outdated",
      description:
        "Triggers no longer aligned with policy and should be archived.",
      items: [],
    });

    triggers.forEach((trigger) => {
      const status = trigger.validation?.status ?? "current";
      const group = groups.get(status);
      if (group) {
        group.items?.push(trigger);
      }
    });

    return groups;
  }, [triggers]);

  const handleRefetch = async () => {
    try {
      await refetch();
      toast.success("Triggers refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Unable to refresh triggers");
    }
  };

  return (
    <div className="container mx-auto space-y-6 px-4 pb-6 pt-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <ClipboardList className="h-8 w-8 text-primary" />
            Breach Triggers
          </h1>
          <p className="text-muted-foreground">
            Compliance obligations, recommended actions, and playbooks mapped to
            taxonomy nodes.
          </p>
        </div>
        <Button
          onClick={handleRefetch}
          disabled={isFetching}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </motion.div>

      {isError ? (
        <Card className="border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Failed to load trigger library
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-destructive">
            <p>
              Confirm the <code>breach_triggers</code> collection exists and the
              Firebase credentials are configured.
            </p>
            <Button variant="outline" size="sm" onClick={handleRefetch}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={`trigger-skeleton-${index}`}>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!isLoading && triggers && triggers.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No triggers defined</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Populate the <code>breach_triggers</code> collection to enable
              automation, notifications, and compliance guardrails.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {!isLoading && triggers && triggers.length > 0 ? (
        <div className="grid gap-6">
          {Array.from(groupedByValidation.values()).map(
            (group) =>
              group.items &&
              group.items.length > 0 && (
                <Card key={group.label}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">
                      {group.label}
                    </CardTitle>
                    <Badge variant="outline">
                      {group.items.length} triggers
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>{group.description}</p>
                    <div className="space-y-4">
                      {group.items
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((trigger) => (
                          <div
                            key={trigger.id}
                            className="rounded-lg border bg-card p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                          >
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <h2 className="text-base font-semibold">
                                    {trigger.title}
                                  </h2>
                                  {trigger.severity ? (
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${
                                        severityVariants[trigger.severity]
                                      }`}
                                    >
                                      {trigger.severity}
                                    </span>
                                  ) : null}
                                </div>
                                {trigger.summary ? (
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    {trigger.summary}
                                  </p>
                                ) : null}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  Taxonomy:
                                  <span className="ml-1 font-medium">
                                    {trigger.taxonomyIds?.length
                                      ? trigger.taxonomyIds
                                          .map(
                                            (id) => taxonomyLookup.get(id) ?? id
                                          )
                                          .join(", ")
                                      : taxonomyLookup.get(
                                          trigger.taxonomyId
                                        ) ?? trigger.taxonomyId}
                                  </span>
                                </Badge>
                                {trigger.validation?.status ===
                                "needs_review" ? (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Needs Review
                                  </Badge>
                                ) : null}
                                {trigger.validation?.status === "outdated" ? (
                                  <Badge
                                    variant="secondary"
                                    className="bg-muted text-xs"
                                  >
                                    Outdated
                                  </Badge>
                                ) : null}
                              </div>
                            </div>

                            <div className="mt-4 grid gap-3 md:grid-cols-2">
                              <div className="rounded-md border bg-muted/30 p-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <Activity className="h-4 w-4 text-primary" />
                                  Obligations
                                </div>
                                <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                                  {trigger.obligations?.length ? (
                                    trigger.obligations.map(
                                      (obligation, index) => (
                                        <li
                                          key={`${trigger.id}-obligation-${index}`}
                                        >
                                          <span className="font-semibold">
                                            {obligation.audience.toUpperCase()}
                                          </span>
                                          {obligation.deadline?.sla ? (
                                            <span className="ml-1">
                                              — {obligation.deadline.sla}
                                            </span>
                                          ) : null}
                                          <div>{obligation.description}</div>
                                        </li>
                                      )
                                    )
                                  ) : (
                                    <li>No obligations catalogued yet.</li>
                                  )}
                                </ul>
                              </div>
                              <div className="rounded-md border bg-muted/30 p-3">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                  <LinkIcon className="h-4 w-4 text-primary" />
                                  Regulations
                                </div>
                                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                  {trigger.regulations?.length ? (
                                    trigger.regulations.map((regulation) => (
                                      <li
                                        key={`${trigger.id}-${regulation.regulationId}`}
                                      >
                                        <span className="font-semibold">
                                          {regulation.title ??
                                            regulation.regulationCode}
                                        </span>
                                        {regulation.citation ? (
                                          <span className="ml-1">
                                            ({regulation.citation})
                                          </span>
                                        ) : null}
                                      </li>
                                    ))
                                  ) : (
                                    <li>No regulation snapshot stored.</li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                              {trigger.riskScore?.calculated !== undefined ? (
                                <Badge variant="outline" className="text-xs">
                                  Risk Score:{" "}
                                  {trigger.riskScore.calculated.toFixed(1)}
                                </Badge>
                              ) : null}
                              {trigger.playbooks?.length ? (
                                <Badge variant="outline" className="text-xs">
                                  Playbooks: {trigger.playbooks.length}
                                </Badge>
                              ) : null}
                              <span>
                                Updated{" "}
                                {new Date(trigger.updatedAt).toLocaleString()}
                                {trigger.updatedBy
                                  ? ` · by ${trigger.updatedBy}`
                                  : ""}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )
          )}
        </div>
      ) : null}
    </div>
  );
}
