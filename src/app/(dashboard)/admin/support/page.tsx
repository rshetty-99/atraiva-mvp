"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { AlertCircle, Loader2, ShieldCheck, Users2 } from "lucide-react";

import { useRole, useSession } from "@/hooks/useSession";
import type { SupportTicket } from "@/lib/firestore/types";
import {
  PRIORITY_BADGES,
  PRIORITY_OPTIONS,
  STATUS_BADGES,
  STATUS_OPTIONS,
  deserializeTicket,
} from "@/lib/support-ticket-helpers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type SupportTicketMeta = {
  page?: number;
  pageSize: number;
  count: number;
};

export default function AdminSupportPage() {
  const router = useRouter();
  const { session } = useSession();
  const { role } = useRole();
  const isPlatformUser = role === "super_admin" || role === "platform_admin";

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [meta, setMeta] = useState<SupportTicketMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [organizationFilter, setOrganizationFilter] = useState<string>("all");

  const organizations = useMemo(
    () => session?.organizations ?? [],
    [session?.organizations]
  );

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, organizationFilter, pageSize]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", String(pageSize));
        if (statusFilter !== "all") {
          params.set("status", statusFilter);
        }
        if (priorityFilter !== "all") {
          params.set("priority", priorityFilter);
        }
        if (isPlatformUser && organizationFilter !== "all") {
          params.set("organizationId", organizationFilter);
        }

        const response = await fetch(
          `/api/support/tickets?${params.toString()}`
        );
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error ?? "Failed to fetch tickets");
        }

        const data = await response.json();
        const deserialized = Array.isArray(data.tickets)
          ? data.tickets
              .map((item) => deserializeTicket(item))
              .filter(
                (ticket): ticket is SupportTicket =>
                  Boolean(ticket && ticket.id)
              )
          : [];

        setTickets(deserialized);
        setMeta({
          page: data.meta?.page ?? page,
          pageSize: data.meta?.pageSize ?? pageSize,
          count: data.meta?.count ?? deserialized.length,
        });
      } catch (err) {
        setError((err as Error).message);
        toast.error("Failed to load support tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [
    page,
    pageSize,
    statusFilter,
    priorityFilter,
    organizationFilter,
    isPlatformUser,
  ]);

  const ticketMetrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => ticket.status === "open").length;
    const inProgress = tickets.filter(
      (ticket) => ticket.status === "in_progress"
    ).length;
    const awaitingCustomer = tickets.filter(
      (ticket) => ticket.status === "awaiting_customer"
    ).length;

    return { total, open, inProgress, awaitingCustomer };
  }, [tickets]);

  const handleRefresh = () => {
    setPage(1);
  };

  const canGoNext = tickets.length === pageSize;

  return (
    <div className="space-y-8" style={{ marginTop: "140px" }}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Support Operations</h1>
          <p className="text-sm text-muted-foreground">
            Manage support tickets across all organizations, assign ownership,
            and coordinate follow-up responses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tickets per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Show 10 tickets</SelectItem>
              <SelectItem value="25">Show 25 tickets</SelectItem>
              <SelectItem value="50">Show 50 tickets</SelectItem>
              <SelectItem value="100">Show 100 tickets</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tickets
            </CardTitle>
            <Users2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketMetrics.total}</div>
            <p className="text-xs text-muted-foreground">
              Showing page {meta?.page ?? page}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {ticketMetrics.open}
            </div>
            <p className="text-xs text-muted-foreground">
              Tickets awaiting assignment
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Loader2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {ticketMetrics.inProgress}
            </div>
            <p className="text-xs text-muted-foreground">
              Tickets actively being handled
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Awaiting Customer
            </CardTitle>
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {ticketMetrics.awaitingCustomer}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending response from customer
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Support Tickets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Select
                value={priorityFilter}
                onValueChange={(value) => setPriorityFilter(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isPlatformUser && (
              <div className="flex flex-col gap-2">
                <Label>Organization</Label>
                <Select
                  value={organizationFilter}
                  onValueChange={(value) => setOrganizationFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Organizations</SelectItem>
                    {organizations.map((org) => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-col gap-2 md:col-span-2">
              <Label>Search</Label>
              <div className="relative">
                <Input
                  placeholder="Search tickets…"
                  value={""}
                  onChange={(event) => {
                    setError("Search is not yet implemented");
                    event.preventDefault();
                  }}
                  disabled
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  (coming soon)
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading tickets…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      <div className="py-6 text-sm text-muted-foreground">
                        No tickets found for the current filters.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/60"
                      onClick={() => router.push(`/admin/support/${ticket.id}`)}
                    >
                      <TableCell>
                        <div className="font-medium">
                          #{ticket.id.slice(0, 8)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created{" "}
                          {formatDistanceToNow(ticket.createdAt, {
                            addSuffix: true,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {ticket.description}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.organizationName ?? "—"}</TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_BADGES[ticket.priority]}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_BADGES[ticket.status]}>
                          {ticket.status.replace("_", " ").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {ticket.assignedToName ?? "Unassigned"}
                        </div>
                        {ticket.assignedToEmail && (
                          <div className="text-xs text-muted-foreground">
                            {ticket.assignedToEmail}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDistanceToNow(ticket.updatedAt, {
                            addSuffix: true,
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {error && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-between gap-4 border-t pt-4 sm:flex-row">
        <div className="text-sm text-muted-foreground">
          Page {meta?.page ?? page} · showing {tickets.length} ticket
          {tickets.length === 1 ? "" : "s"}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={loading || page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading || !canGoNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

