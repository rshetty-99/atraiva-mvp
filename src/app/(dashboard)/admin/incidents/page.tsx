"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, FolderLock, FolderPlus, ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBreaches } from "@/hooks/useBreachData";
import type { BreachRecord, BreachSeverity, BreachLifecycleStatus } from "@/types/breach";

interface IncidentRow {
  id: string;
  organization: string;
  severity: BreachSeverity | "unknown";
  status: BreachLifecycleStatus | "unknown";
  jurisdictions: string[];
  upcomingDeadline?: string;
  notificationsCompleted: number;
  notificationsTotal: number;
  evidenceCount: number;
  updatedAt: string;
}

const FALLBACK_ROWS: IncidentRow[] = [
  {
    id: "INC-957302",
    organization: "org_101",
    severity: "critical",
    status: "reported",
    jurisdictions: ["CA", "NY", "TX"],
    upcomingDeadline: "2025-07-29T00:00:00.000Z",
    notificationsCompleted: 1,
    notificationsTotal: 3,
    evidenceCount: 2,
    updatedAt: "2025-07-14T09:15:22.000Z",
  },
  {
    id: "INC-957301",
    organization: "org_102",
    severity: "medium",
    status: "resolved",
    jurisdictions: ["MA", "CT"],
    upcomingDeadline: "2025-08-09T00:00:00.000Z",
    notificationsCompleted: 3,
    notificationsTotal: 3,
    evidenceCount: 5,
    updatedAt: "2025-07-10T14:45:10.000Z",
  },
  {
    id: "INC-957300",
    organization: "org_103",
    severity: "high",
    status: "contained",
    jurisdictions: ["FL"],
    upcomingDeadline: "2025-07-20T00:00:00.000Z",
    notificationsCompleted: 0,
    notificationsTotal: 2,
    evidenceCount: 0,
    updatedAt: "2025-06-20T11:12:30.000Z",
  },
];

const severityStyles: Record<
  BreachSeverity | "unknown",
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-600 text-white dark:bg-red-500",
  },
  high: {
    label: "High",
    className: "bg-amber-500 text-white dark:bg-amber-500",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-500 text-white dark:bg-blue-500",
  },
  low: {
    label: "Low",
    className: "bg-slate-500 text-white dark:bg-slate-500",
  },
  unknown: {
    label: "Unknown",
    className: "bg-slate-400 text-white dark:bg-slate-600",
  },
};

const statusStyles: Record<
  BreachLifecycleStatus | "unknown",
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  reported: {
    label: "Reported",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  },
  investigating: {
    label: "Investigating",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  },
  contained: {
    label: "Contained",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  resolved: {
    label: "Resolved",
    className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-200",
  },
  archived: {
    label: "Archived",
    className: "bg-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  },
  unknown: {
    label: "Unknown",
    className: "bg-muted text-muted-foreground",
  },
};

function mapBreachToRow(breach: BreachRecord): IncidentRow {
  const notifications = breach.notifications ?? [];

  const pendingNotification = notifications
    .map((notification) => {
      const due = notification.plannedDueAt ?? notification.statusHistory?.[0]?.updatedAt;
      const latestStatus =
        notification.statusHistory?.[notification.statusHistory.length - 1]?.status ??
        "pending";
      return {
        due,
        status: latestStatus,
      };
    })
    .filter((notification) => {
      const terminalStatuses = ["sent", "acknowledged", "waived", "failed"];
      return notification.due && !terminalStatuses.includes(notification.status);
    })
    .sort(
      (a, b) =>
        new Date(a.due ?? "").getTime() - new Date(b.due ?? "").getTime()
    )[0];

  const completedNotifications = notifications.filter((notification) => {
    const latestStatus =
      notification.statusHistory?.[notification.statusHistory.length - 1]?.status;
    return latestStatus === "sent" || latestStatus === "acknowledged";
  }).length;

  return {
    id: breach.id,
    organization: breach.organizationId,
    severity: breach.severity ?? "medium",
    status: breach.status ?? "reported",
    jurisdictions: breach.impact?.impactedJurisdictions ?? [],
    upcomingDeadline: pendingNotification?.due,
    notificationsCompleted: completedNotifications,
    notificationsTotal: notifications.length,
    evidenceCount: breach.evidence?.length ?? 0,
    updatedAt: breach.updatedAt,
  };
}

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jurisdictionFilter, setJurisdictionFilter] = useState("");

  const { data: breaches, isLoading, isFetching, isError, refetch } = useBreaches();

  const rows = useMemo(() => {
    if (breaches && breaches.length > 0) {
      return breaches.map(mapBreachToRow);
    }
    return FALLBACK_ROWS;
  }, [breaches]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        searchTerm.length === 0 ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.organization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeverity =
        severityFilter === "all" || row.severity === severityFilter;

      const matchesStatus =
        statusFilter === "all" || row.status === statusFilter;

      const matchesJurisdiction =
        jurisdictionFilter.length === 0 ||
        row.jurisdictions.some((j) =>
          j.toLowerCase().includes(jurisdictionFilter.toLowerCase())
        );

      return matchesSearch && matchesSeverity && matchesStatus && matchesJurisdiction;
    });
  }, [rows, searchTerm, severityFilter, statusFilter, jurisdictionFilter]);

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Breaches refreshed");
    } catch (error) {
      console.error(error);
      toast.error("Unable to refresh breach queue");
    }
  };

  return (
    <div
      className="p-6 space-y-6 bg-gray-100 dark:bg-gray-900"
      style={{ marginTop: "140px" }}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Incidents Queue
          </h1>
          <p className="text-sm text-muted-foreground">
            Track breach investigations, outstanding notifications, and evidence status.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={isFetching}
            onClick={handleRefresh}
          >
            {isFetching ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : null}
            Refresh
          </Button>
          <Button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            onClick={() => {
              console.log("Log new incident");
            }}
          >
            <Plus className="h-5 w-5 mr-2" />
            Log New Incident
          </Button>
        </div>
      </div>

      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Input
              type="text"
              placeholder="Search by breach ID or organization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="contained">Contained</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Filter by jurisdiction (e.g. CA)"
              value={jurisdictionFilter}
              onChange={(e) => setJurisdictionFilter(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Breach ID
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Severity
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Organization
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Jurisdictions
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Next Deadline
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Notifications
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Evidence
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Updated
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold uppercase text-gray-700 dark:text-gray-400">
                  Report
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="border-b dark:border-gray-700">
                    {Array.from({ length: 10 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex} className="px-6 py-4">
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    No breaches matched your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <TableCell className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      <Link href={`/admin/incidents/${row.id}`}>{row.id}</Link>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        className={`px-2 py-0.5 text-xs font-semibold ${severityStyles[row.severity]?.className}`}
                      >
                        {severityStyles[row.severity]?.label ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={`px-2 py-0.5 text-xs font-semibold ${statusStyles[row.status]?.className}`}
                      >
                        {statusStyles[row.status]?.label ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      {row.organization}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {row.jurisdictions.length > 0
                        ? row.jurisdictions.join(", ")
                        : "—"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      {row.upcomingDeadline
                        ? new Date(row.upcomingDeadline).toLocaleString()
                        : "No pending deadlines"}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      {row.notificationsTotal > 0 ? (
                        <span>
                          {row.notificationsCompleted}/{row.notificationsTotal} sent
                        </span>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="relative group flex items-center justify-center">
                        <Link
                          href={`/admin/incidents/${row.id}/evidence`}
                          className={`flex items-center justify-center ${
                            row.evidenceCount > 0
                              ? "text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                              : "text-gray-400 hover:text-blue-600 dark:text-gray-500 dark:hover:text-blue-400"
                          }`}
                        >
                          {row.evidenceCount > 0 ? (
                            <FolderLock className="h-5 w-5" />
                          ) : (
                            <FolderPlus className="h-5 w-5" />
                          )}
                        </Link>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2 py-1 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {row.evidenceCount > 0
                            ? `${row.evidenceCount} evidence items`
                            : "Start evidence log"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm">
                      {new Date(row.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Link
                        href={`/admin/incidents/${row.id}/report`}
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {isError ? (
          <div className="border-t border-dashed border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            Unable to load live breach data. Showing sample records until Firebase is configured.
          </div>
        ) : null}
      </Card>
    </div>
  );
}
