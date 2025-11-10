"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Loader2, Plus, TicketIcon } from "lucide-react";

import { useSession } from "@/hooks/useSession";
import type {
  SupportTicket,
  SupportTicketMessage,
} from "@/lib/firestore/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const STATUS_LABELS: Record<SupportTicket["status"], string> = {
  open: "Open",
  in_progress: "In Progress",
  awaiting_customer: "Awaiting Customer",
  resolved: "Resolved",
  closed: "Closed",
};

const PRIORITY_BADGES: Record<SupportTicket["priority"], string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

const STATUS_BADGES: Record<SupportTicket["status"], string> = {
  open: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  awaiting_customer:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  resolved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const PRIORITY_OPTIONS: Array<{
  label: string;
  value: SupportTicket["priority"];
}> = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

const STATUS_OPTIONS: Array<{ label: string; value: SupportTicket["status"] }> =
  [
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in_progress" },
    { label: "Awaiting Customer", value: "awaiting_customer" },
    { label: "Resolved", value: "resolved" },
    { label: "Closed", value: "closed" },
  ];

const PRIORITY_VALUES = ["low", "medium", "high", "urgent"] as const;
const STATUS_VALUES = [
  "open",
  "in_progress",
  "awaiting_customer",
  "resolved",
  "closed",
] as const;

const isPriorityValue = (
  value: unknown
): value is SupportTicket["priority"] =>
  typeof value === "string" &&
  (PRIORITY_VALUES as readonly string[]).includes(value);

const isStatusValue = (value: unknown): value is SupportTicket["status"] =>
  typeof value === "string" &&
  (STATUS_VALUES as readonly string[]).includes(value);

const getString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

const getStringWithFallback = (value: unknown, fallback: string): string =>
  getString(value) ?? fallback;

const getStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value.filter(
        (entry): entry is string =>
          typeof entry === "string" && entry.trim().length > 0
      )
    : undefined;

const getBoolean = (value: unknown): boolean =>
  typeof value === "boolean" ? value : false;

const parseDate = (value: unknown): Date => {
  if (!value) {
    return new Date();
  }
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const deserializeTicket = (raw: Record<string, unknown>): SupportTicket => {
  const priorityValue: SupportTicket["priority"] = isPriorityValue(
    raw["priority"]
  )
    ? (raw["priority"] as SupportTicket["priority"])
    : "medium";
  const statusValue: SupportTicket["status"] = isStatusValue(raw["status"])
    ? (raw["status"] as SupportTicket["status"])
    : "open";

  return {
    id: getStringWithFallback(raw["id"], ""),
    organizationId: getStringWithFallback(raw["organizationId"], ""),
    organizationName: getString(raw["organizationName"]),
    subject: getStringWithFallback(raw["subject"], "Untitled Ticket"),
    description: getStringWithFallback(raw["description"], ""),
    priority: priorityValue,
    status: statusValue,
    createdById: getStringWithFallback(raw["createdById"], ""),
    createdByName: getStringWithFallback(raw["createdByName"], "User"),
    createdByEmail: getString(raw["createdByEmail"]),
    createdAt: parseDate(raw["createdAt"]),
    updatedAt: parseDate(raw["updatedAt"]),
    lastActivityAt: parseDate(raw["lastActivityAt"] ?? raw["updatedAt"]),
    assignedToId: getString(raw["assignedToId"]),
    assignedToName: getString(raw["assignedToName"]),
    assignedToEmail: getString(raw["assignedToEmail"]),
    tags: getStringArray(raw["tags"]),
    isEscalated: getBoolean(raw["isEscalated"]),
    latestMessageSnippet: getString(raw["latestMessageSnippet"]),
    attachmentUrls: getStringArray(raw["attachmentUrls"]),
    resolutionSummary: getString(raw["resolutionSummary"]),
    messageCount:
      typeof raw["messageCount"] === "number" ? (raw["messageCount"] as number) : undefined,
  };
};

const deserializeMessage = (
  raw: Record<string, unknown>
): SupportTicketMessage => ({
  id: getStringWithFallback(raw["id"], ""),
  ticketId: getStringWithFallback(raw["ticketId"], ""),
  authorId: getStringWithFallback(raw["authorId"], ""),
  authorName: getStringWithFallback(raw["authorName"], "User"),
  authorEmail: getString(raw["authorEmail"]),
  message: getStringWithFallback(raw["message"], ""),
  createdAt: parseDate(raw["createdAt"]),
  internal: getBoolean(raw["internal"]),
});

export default function OrgSupportPage() {
  const { session } = useSession();
  const organizationName = useMemo(
    () => session?.currentOrganization?.name ?? "Your Organization",
    [session?.currentOrganization?.name]
  );

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [creatingTicket, setCreatingTicket] = useState(false);
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("medium");
  const [description, setDescription] = useState("");
  const [attachmentUrls, setAttachmentUrls] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [selectedMessages, setSelectedMessages] = useState<
    SupportTicketMessage[]
  >([]);
  const [messageInput, setMessageInput] = useState("");
  const [postingMessage, setPostingMessage] = useState(false);

  const loadTickets = async () => {
    try {
      setLoadingTickets(true);
      setError(null);
      const params = new URLSearchParams();
      params.set("pageSize", String(pageSize));
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const response = await fetch(`/api/support/tickets?${params.toString()}`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to load tickets");
      }
      const data = await response.json();
      const list = Array.isArray(data.tickets)
        ? data.tickets
            .filter(
              (ticket): ticket is Record<string, unknown> =>
                Boolean(ticket) && typeof ticket === "object"
            )
            .map((ticket) => deserializeTicket(ticket))
        : [];
      setTickets(list);
    } catch (err) {
      setError((err as Error).message);
      toast.error("Unable to load support tickets");
    } finally {
      setLoadingTickets(false);
    }
  };

  const loadTicketDetail = async (ticketId: string) => {
    try {
      const [ticketRes, messagesRes] = await Promise.all([
        fetch(`/api/support/tickets/${ticketId}`),
        fetch(`/api/support/tickets/${ticketId}/messages`),
      ]);

      if (!ticketRes.ok) {
        const payload = await ticketRes.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to load ticket details");
      }
      if (!messagesRes.ok) {
        const payload = await messagesRes.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to load ticket messages");
      }
      const ticketPayload = await ticketRes.json();
      const messagesPayload = await messagesRes.json();
      if (
        !ticketPayload ||
        typeof ticketPayload.ticket !== "object" ||
        ticketPayload.ticket === null
      ) {
        throw new Error("Malformed ticket payload");
      }
      setSelectedTicket(
        deserializeTicket(ticketPayload.ticket as Record<string, unknown>)
      );
      setSelectedMessages(
        Array.isArray(messagesPayload.messages)
          ? messagesPayload.messages
              .filter(
                (message): message is Record<string, unknown> =>
                  Boolean(message) && typeof message === "object"
              )
              .map((message) => deserializeMessage(message))
          : []
      );
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleCreateTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      toast.error("Subject and description are required.");
      return;
    }
    try {
      setCreatingTicket(true);
      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          description,
          priority,
          attachmentUrls: attachmentUrls
            ? attachmentUrls
                .split("\n")
                .map((url) => url.trim())
                .filter(Boolean)
            : undefined,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to create support ticket");
      }
      toast.success("Support ticket submitted");
      setSubject("");
      setDescription("");
      setAttachmentUrls("");
      setPriority("medium");
      await loadTickets();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleStatusChange = async (
    ticketId: string,
    value: SupportTicket["status"]
  ) => {
    try {
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to update ticket status");
      }
      toast.success("Ticket updated");
      await loadTickets();
      if (selectedTicket?.id === ticketId) {
        await loadTicketDetail(ticketId);
      }
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !messageInput.trim()) {
      return;
    }
    try {
      setPostingMessage(true);
      const response = await fetch(
        `/api/support/tickets/${selectedTicket.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageInput }),
        }
      );
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to send message");
      }
      setMessageInput("");
      await loadTicketDetail(selectedTicket.id);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setPostingMessage(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, statusFilter]);

  return (
    <div className="space-y-8" style={{ marginTop: "140px" }}>
      <div className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold">Support Center</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Submit issues, request assistance, and track updates with the Atraiva
          platform team. Tickets entered here are automatically routed to the
          platform support engineers.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Open a Support Ticket</CardTitle>
            <p className="text-sm text-muted-foreground">
              Provide as much detail as possible to help us address the request
              quickly.
            </p>
          </div>
          <TicketIcon className="h-8 w-8 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief summary of the issue"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as SupportTicket["priority"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue, steps to reproduce, impacted users, timelines, or any other context that will be helpful."
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">
              Attachment URLs (optional, one per line)
            </Label>
            <Textarea
              id="attachments"
              placeholder="https://example.com/logs/stacktrace.txt"
              value={attachmentUrls}
              onChange={(event) => setAttachmentUrls(event.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleCreateTicket} disabled={creatingTicket}>
              {creatingTicket ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Ticket
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Ticket History</CardTitle>
            <p className="text-sm text-muted-foreground">
              All support requests submitted by {organizationName}.
            </p>
          </div>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[164px]">
              <SelectValue placeholder="Tickets per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Show 10 tickets</SelectItem>
              <SelectItem value="25">Show 25 tickets</SelectItem>
              <SelectItem value="50">Show 50 tickets</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Label className="text-sm">Filter by status</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Ticket</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingTickets ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading tickets…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      <div className="py-6 text-sm text-muted-foreground">
                        No support tickets yet.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/60"
                      onClick={async () => {
                        setDetailOpen(true);
                        await loadTicketDetail(ticket.id);
                      }}
                    >
                      <TableCell>
                        <div className="font-medium">#{ticket.id.slice(0, 8)}</div>
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
                      <TableCell>
                        <Badge className={PRIORITY_BADGES[ticket.priority]}>
                          {ticket.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_BADGES[ticket.status]}>
                          {STATUS_LABELS[ticket.status]}
                        </Badge>
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
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={(open) => setDetailOpen(open)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Ticket Details{" "}
              {selectedTicket ? `#${selectedTicket.id.slice(0, 8)}` : ""}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">
                    {selectedTicket.subject}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={PRIORITY_BADGES[selectedTicket.priority]}>
                      {selectedTicket.priority.toUpperCase()}
                    </Badge>
                    <Badge className={STATUS_BADGES[selectedTicket.status]}>
                      {STATUS_LABELS[selectedTicket.status]}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <p className="text-sm leading-relaxed">
                  {selectedTicket.description}
                </p>
                {selectedTicket.attachmentUrls &&
                  selectedTicket.attachmentUrls.length > 0 && (
                    <div className="space-y-2">
                      <Label>Attachments</Label>
                      <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                        {selectedTicket.attachmentUrls.map((url) => (
                          <li key={url}>
                            <a
                              href={url}
                              className="text-primary hover:underline"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <Label>Status</Label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        selectedTicket.id,
                        value as SupportTicket["status"]
                      )
                    }
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-lg border">
                <div className="border-b px-4 py-2 text-sm font-medium">
                  Conversation
                </div>
                <div className="max-h-64 space-y-4 overflow-y-auto px-4 py-3 text-sm">
                  {selectedMessages.length === 0 ? (
                    <p className="text-muted-foreground">No messages yet.</p>
                  ) : (
                    selectedMessages.map((message) => (
                      <div key={message.id} className="rounded-md border p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-medium">{message.authorName}</p>
                            {message.authorEmail && (
                              <p className="text-xs text-muted-foreground">
                                {message.authorEmail}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(message.createdAt, {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border p-4 space-y-3">
                <Label htmlFor="reply">Add an update</Label>
                <Textarea
                  id="reply"
                  placeholder="Share additional context or respond to the support team…"
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  rows={4}
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleSendMessage}
                    disabled={postingMessage || !messageInput.trim()}
                  >
                    {postingMessage ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Select a ticket to view details.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

