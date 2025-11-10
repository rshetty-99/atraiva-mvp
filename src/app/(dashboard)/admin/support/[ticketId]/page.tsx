"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Loader2, ShieldCheck, Users2 } from "lucide-react";

import { useRole, useSession } from "@/hooks/useSession";
import type {
  SupportTicket,
  SupportTicketMessage,
} from "@/lib/firestore/types";
import {
  PRIORITY_BADGES,
  PRIORITY_OPTIONS,
  STATUS_BADGES,
  STATUS_OPTIONS,
  deserializeMessage,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type TicketState = {
  ticket: SupportTicket | null;
  messages: SupportTicketMessage[];
};

export default function AdminSupportTicketPage() {
  const router = useRouter();
  const routeParams = useParams<{ ticketId: string }>();
  const ticketIdRaw = routeParams?.ticketId;
  const ticketId = Array.isArray(ticketIdRaw) ? ticketIdRaw[0] : ticketIdRaw;
  const { session, loading: sessionLoading } = useSession();
  const { role } = useRole();
  const isPlatformUser = role === "super_admin" || role === "platform_admin";

  const [state, setState] = useState<TicketState>({
    ticket: null,
    messages: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messageInternal, setMessageInternal] = useState(false);
  const [postingMessage, setPostingMessage] = useState(false);

  const isAssignedToCurrentUser = useMemo(() => {
    if (!state.ticket || !session?.user) {
      return false;
    }
    return (
      state.ticket.assignedToEmail === session.user.email ||
      state.ticket.assignedToId === session.user.id
    );
  }, [state.ticket, session?.user]);

  useEffect(() => {
    if (sessionLoading || !ticketId) {
      return;
    }

    let isMounted = true;

    const loadTicket = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ticketResponse, messagesResponse] = await Promise.all([
          fetch(`/api/support/tickets/${ticketId}`),
          fetch(`/api/support/tickets/${ticketId}/messages`),
        ]);

        if (!ticketResponse.ok) {
          const payload = await ticketResponse.json().catch(() => ({}));
          throw new Error(payload?.error ?? "Failed to load ticket");
        }

        if (!messagesResponse.ok) {
          const payload = await messagesResponse.json().catch(() => ({}));
          throw new Error(payload?.error ?? "Failed to load messages");
        }

        const ticketData = await ticketResponse.json();
        const messageData = await messagesResponse.json();

        const ticket = deserializeTicket(ticketData.ticket);
        const messages = Array.isArray(messageData.messages)
          ? messageData.messages
              .map((item) => deserializeMessage(item))
              .filter((message): message is SupportTicketMessage =>
                Boolean(message && message.id)
              )
          : [];

        if (isMounted) {
          setState({ ticket, messages });
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (isPlatformUser) {
      loadTicket();
    } else {
      toast.error("You do not have access to platform support tools.");
      router.push("/admin/support");
    }

    return () => {
      isMounted = false;
    };
  }, [ticketId, isPlatformUser, router, sessionLoading]);

  const refreshTicket = async () => {
    try {
      setUpdating(true);
      if (!ticketId) {
        throw new Error("Missing ticket identifier.");
      }
      const response = await fetch(`/api/support/tickets/${ticketId}`);
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to refresh ticket");
      }
      const data = await response.json();
      const ticket = deserializeTicket(data.ticket);
      setState((prev) => ({ ...prev, ticket }));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (updates: Partial<SupportTicket>) => {
    try {
      setUpdating(true);
      if (!ticketId) {
        throw new Error("Missing ticket identifier.");
      }
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to update ticket");
      }

      toast.success("Ticket updated");
      await refreshTicket();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      return;
    }
    const currentStatus = state.ticket?.status;
    if (currentStatus === "closed" || currentStatus === "resolved") {
      toast.error(
        currentStatus === "closed"
          ? "This ticket is closed. Reopen it to add new updates."
          : "This ticket is resolved. Reopen it to add additional updates."
      );
      return;
    }
    try {
      setPostingMessage(true);
      if (!ticketId) {
        throw new Error("Missing ticket identifier.");
      }
      const response = await fetch(
        `/api/support/tickets/${ticketId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: messageInput.trim(),
            internal: messageInternal,
          }),
        }
      );

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? "Failed to send message");
      }

      setMessageInput("");
      setMessageInternal(false);
      toast.success("Message sent");

      const messageData = await response.json();
      if (messageData?.message) {
        const deserialized = deserializeMessage(messageData.message);
        if (deserialized) {
          setState((prev) => ({
            ...prev,
            messages: [deserialized, ...prev.messages],
          }));
        } else {
          await refreshMessages();
        }
      } else {
        await refreshMessages();
      }

      await refreshTicket();

      if (isPlatformUser) {
        router.push("/admin/support");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setPostingMessage(false);
    }
  };

  const refreshMessages = async () => {
    try {
      if (!ticketId) {
        throw new Error("Missing ticket identifier.");
      }
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`);
      if (!response.ok) {
        throw new Error("Failed to refresh messages");
      }
      const data = await response.json();
      const messages = Array.isArray(data.messages)
        ? data.messages
            .map((item) => deserializeMessage(item))
            .filter((message): message is SupportTicketMessage =>
              Boolean(message && message.id)
            )
        : [];
      setState((prev) => ({ ...prev, messages }));
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const ticket = state.ticket;
  const isClosed = ticket?.status === "closed";
  const isResolved = ticket?.status === "resolved";
  const isUpdateLocked = Boolean(ticket && (isClosed || isResolved));

  if (sessionLoading || loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-lg border bg-card px-6 py-5 shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading ticket…</p>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto space-y-6 px-4 pb-10 pt-20 sm:px-6">
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <ShieldCheck className="h-5 w-5" />
              Unable to load ticket
            </CardTitle>
            <p className="text-sm text-destructive/80">
              {error ??
                "The ticket could not be found or you do not have access."}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive/70">
              Return to the support queue to manage other requests.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/admin/support")}
            >
              Back to Support Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-10 pt-20 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/support")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Support
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              Ticket #{ticket.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-muted-foreground">
              Raised by {ticket.createdByName} ·{" "}
              {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={PRIORITY_BADGES[ticket.priority]}>
            {ticket.priority.toUpperCase()}
          </Badge>
          <Badge className={STATUS_BADGES[ticket.status]}>
            {ticket.status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{ticket.subject}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-relaxed">{ticket.description}</p>
              {ticket.attachmentUrls && ticket.attachmentUrls.length > 0 && (
                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <ul className="list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                    {ticket.attachmentUrls.map((url) => (
                      <li key={url}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {url}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Conversation History</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshMessages}
                disabled={postingMessage}
              >
                Refresh
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No messages yet. Use the composer below to update the ticket.
                </p>
              ) : (
                state.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "rounded-md border p-3 text-sm",
                      message.internal
                        ? "border-amber-300/60 bg-amber-100/40 dark:border-amber-700/40 dark:bg-amber-900/20"
                        : "border-border"
                    )}
                  >
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
                    {message.internal && (
                      <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-300">
                        Internal note
                      </p>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Update</CardTitle>
              <div className="flex items-center gap-2">
                {isAssignedToCurrentUser && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users2 className="h-3.5 w-3.5" />
                    Assigned to you
                  </Badge>
                )}
                {isClosed && (
                  <Badge variant="destructive" className="text-xs">
                    Closed
                  </Badge>
                )}
                {isResolved && !isClosed && (
                  <Badge variant="outline" className="text-xs">
                    Resolved
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isPlatformUser && (
                <div className="flex items-center justify-between rounded-md border px-3 py-2">
                  <div>
                    <p className="text-sm font-medium">Internal note</p>
                    <p className="text-xs text-muted-foreground">
                      Visible only to platform users
                    </p>
                  </div>
                  <Switch
                    checked={messageInternal}
                    onCheckedChange={setMessageInternal}
                    disabled={isUpdateLocked}
                  />
                </div>
              )}
              <Textarea
                placeholder="Share an update or add an internal note…"
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                rows={4}
                disabled={isUpdateLocked}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSendMessage}
                  disabled={
                    isUpdateLocked || postingMessage || !messageInput.trim()
                  }
                >
                  {postingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              {isUpdateLocked && (
                <p className="text-xs text-muted-foreground">
                  {ticket?.status === "closed"
                    ? "This ticket is closed. Reopen it to add additional updates."
                    : "This ticket is resolved. Reopen it to add additional updates."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={ticket.status}
                  onValueChange={(value) =>
                    handleUpdate({ status: value as SupportTicket["status"] })
                  }
                  disabled={updating}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={ticket.priority}
                  onValueChange={(value) =>
                    handleUpdate({
                      priority: value as SupportTicket["priority"],
                    })
                  }
                  disabled={updating}
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

              <Separator />

              <div className="space-y-2">
                <Label>Assign To</Label>
                <Input
                  placeholder="Team member name"
                  defaultValue={ticket.assignedToName ?? ""}
                  onBlur={(event) =>
                    handleUpdate({
                      assignedToName: event.target.value || undefined,
                    })
                  }
                  disabled={updating}
                />
                <Input
                  type="email"
                  placeholder="Team member email"
                  defaultValue={ticket.assignedToEmail ?? ""}
                  onBlur={(event) =>
                    handleUpdate({
                      assignedToEmail: event.target.value || undefined,
                    })
                  }
                  disabled={updating}
                />
              </div>

              <div className="space-y-2">
                <Label>Resolution Summary</Label>
                <Textarea
                  placeholder="Document the resolution steps…"
                  defaultValue={ticket.resolutionSummary ?? ""}
                  onBlur={(event) =>
                    handleUpdate({
                      resolutionSummary: event.target.value || undefined,
                    })
                  }
                  rows={4}
                  disabled={updating}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Created{" "}
                <span className="font-medium text-foreground">
                  {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                </span>{" "}
                by {ticket.createdByName}
              </p>
              <p>
                Updated{" "}
                <span className="font-medium text-foreground">
                  {formatDistanceToNow(ticket.updatedAt, { addSuffix: true })}
                </span>
              </p>
              {ticket.lastActivityAt && (
                <p>
                  Last activity{" "}
                  <span className="font-medium text-foreground">
                    {formatDistanceToNow(ticket.lastActivityAt, {
                      addSuffix: true,
                    })}
                  </span>
                </p>
              )}
              {ticket.organizationName && (
                <p>
                  Organization{" "}
                  <span className="font-medium text-foreground">
                    {ticket.organizationName}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
