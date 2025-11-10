import type {
  SupportTicket,
  SupportTicketMessage,
} from "@/lib/firestore/types";

const PRIORITY_VALUES = ["low", "medium", "high", "urgent"] as const;
const STATUS_VALUES = [
  "open",
  "in_progress",
  "awaiting_customer",
  "resolved",
  "closed",
] as const;

export const PRIORITY_OPTIONS: Array<{
  label: string;
  value: SupportTicket["priority"];
}> = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
  { label: "Urgent", value: "urgent" },
];

export const STATUS_OPTIONS: Array<{
  label: string;
  value: SupportTicket["status"];
}> = [
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Awaiting Customer", value: "awaiting_customer" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

export const PRIORITY_BADGES: Record<SupportTicket["priority"], string> = {
  low: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export const STATUS_BADGES: Record<SupportTicket["status"], string> = {
  open: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  awaiting_customer:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  resolved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  closed: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const getString = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim().length > 0 ? value : undefined;

const getStringWithFallback = (value: unknown, fallback: string): string =>
  getString(value) ?? fallback;

const getStringArray = (value: unknown): string[] | undefined =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim().length > 0
      )
    : undefined;

const getNumber = (value: unknown): number | undefined =>
  typeof value === "number" ? value : undefined;

const getBoolean = (value: unknown): boolean =>
  typeof value === "boolean" ? value : false;

const isPriorityValue = (
  value: unknown
): value is SupportTicket["priority"] =>
  typeof value === "string" &&
  (PRIORITY_VALUES as readonly string[]).includes(value);

const isStatusValue = (value: unknown): value is SupportTicket["status"] =>
  typeof value === "string" &&
  (STATUS_VALUES as readonly string[]).includes(value);

const parseDate = (value: unknown): Date => {
  if (!value) {
    return new Date();
  }
  const asDate =
    value instanceof Date ? value : new Date(getString(value) ?? value);
  return Number.isNaN(asDate.getTime()) ? new Date() : asDate;
};

export const deserializeTicket = (
  raw: unknown
): SupportTicket | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const data = raw as Record<string, unknown>;

  const priority: SupportTicket["priority"] = isPriorityValue(data.priority)
    ? data.priority
    : "medium";
  const status: SupportTicket["status"] = isStatusValue(data.status)
    ? data.status
    : "open";

  return {
    id: getStringWithFallback(data.id, ""),
    organizationId: getStringWithFallback(data.organizationId, ""),
    organizationName: getString(data.organizationName),
    subject: getStringWithFallback(data.subject, "Untitled Ticket"),
    description: getStringWithFallback(data.description, ""),
    priority,
    status,
    createdById: getStringWithFallback(data.createdById, ""),
    createdByName: getStringWithFallback(data.createdByName, "Unknown User"),
    createdByEmail: getString(data.createdByEmail),
    createdAt: parseDate(data.createdAt),
    updatedAt: parseDate(data.updatedAt),
    lastActivityAt: parseDate(data.lastActivityAt ?? data.updatedAt),
    assignedToId: getString(data.assignedToId),
    assignedToName: getString(data.assignedToName),
    assignedToEmail: getString(data.assignedToEmail),
    tags: getStringArray(data.tags),
    isEscalated: getBoolean(data.isEscalated),
    latestMessageSnippet: getString(data.latestMessageSnippet),
    attachmentUrls: getStringArray(data.attachmentUrls),
    resolutionSummary: getString(data.resolutionSummary),
    messageCount: getNumber(data.messageCount),
  };
};

export const deserializeMessage = (
  raw: unknown
): SupportTicketMessage | null => {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const data = raw as Record<string, unknown>;

  return {
    id: getStringWithFallback(data.id, ""),
    ticketId: getStringWithFallback(data.ticketId, ""),
    authorId: getStringWithFallback(data.authorId, ""),
    authorName: getStringWithFallback(data.authorName, "User"),
    authorEmail: getString(data.authorEmail),
    message: getStringWithFallback(data.message, ""),
    createdAt: parseDate(data.createdAt),
    internal: getBoolean(data.internal),
  };
};

