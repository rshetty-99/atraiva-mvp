import type {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import type {
  SupportTicket,
  SupportTicketMessage,
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/firestore/types";

const SUPPORT_TICKETS_COLLECTION = "supportTickets";
const SUPPORT_TICKET_MESSAGES_SUBCOLLECTION = "messages";

export interface TicketCreationParams {
  organizationId: string;
  organizationName?: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  createdById: string;
  createdByName: string;
  createdByEmail?: string;
  attachmentUrls?: string[];
}

export interface TicketUpdateParams {
  status?: SupportTicketStatus;
  priority?: SupportTicketPriority;
  assignedToId?: string | null;
  assignedToName?: string | null;
  assignedToEmail?: string | null;
  resolutionSummary?: string | null;
  isEscalated?: boolean;
  tags?: string[];
  lastActivityAt?: Date | ReturnType<typeof serverTimestamp>;
}

export interface MessageParams {
  ticketId: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  message: string;
  internal?: boolean;
}

export interface TicketQueryOptions {
  page?: number;
  pageSize?: number;
  organizationId?: string;
  status?: SupportTicketStatus | "all";
  priority?: SupportTicketPriority | "all";
  assignedToId?: string;
}

const toDateValue = (value: unknown): Date => {
  if (value instanceof Date) {
    return value;
  }
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (typeof value === "number" || typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date();
};

const buildTicket = (id: string, data: DocumentData): SupportTicket => ({
  id,
  organizationId: data.organizationId ?? "",
  organizationName: data.organizationName ?? undefined,
  subject: data.subject ?? "",
  description: data.description ?? "",
  priority: (data.priority as SupportTicketPriority) ?? "medium",
  status: (data.status as SupportTicketStatus) ?? "open",
  createdById: data.createdById ?? "",
  createdByName: data.createdByName ?? "",
  createdByEmail: data.createdByEmail ?? undefined,
  createdAt: toDateValue(data.createdAt),
  updatedAt: toDateValue(data.updatedAt ?? data.createdAt),
  lastActivityAt: toDateValue(
    data.lastActivityAt ?? data.updatedAt ?? data.createdAt
  ),
  assignedToId: data.assignedToId ?? undefined,
  assignedToName: data.assignedToName ?? undefined,
  assignedToEmail: data.assignedToEmail ?? undefined,
  tags: Array.isArray(data.tags) ? (data.tags as string[]) : undefined,
  isEscalated: Boolean(data.isEscalated),
  latestMessageSnippet: data.latestMessageSnippet ?? undefined,
  attachmentUrls: Array.isArray(data.attachmentUrls)
    ? (data.attachmentUrls as string[])
    : undefined,
  resolutionSummary: data.resolutionSummary ?? undefined,
  messageCount:
    typeof data.messageCount === "number" ? data.messageCount : undefined,
});

const mapTicketFromDoc = (
  docSnapshot: QueryDocumentSnapshot<DocumentData>
): SupportTicket => buildTicket(docSnapshot.id, docSnapshot.data());

const mapTicketFromSnapshot = (
  docSnapshot: DocumentSnapshot<DocumentData>
): SupportTicket | null =>
  docSnapshot.exists() ? buildTicket(docSnapshot.id, docSnapshot.data()) : null;

const buildMessage = (
  id: string,
  data: DocumentData,
  ticketId: string
): SupportTicketMessage => ({
  id,
  ticketId,
  authorId: data.authorId ?? "",
  authorName: data.authorName ?? "",
  authorEmail: data.authorEmail ?? undefined,
  message: data.message ?? "",
  createdAt: toDateValue(data.createdAt),
  internal: Boolean(data.internal),
});

export class SupportTicketService {
  static async createTicket(
    params: TicketCreationParams
  ): Promise<SupportTicket> {
    const now = serverTimestamp();
    const ticketRef = await addDoc(collection(db, SUPPORT_TICKETS_COLLECTION), {
      organizationId: params.organizationId,
      organizationName: params.organizationName ?? null,
      subject: params.subject,
      description: params.description,
      priority: params.priority,
      status: "open",
      createdById: params.createdById,
      createdByName: params.createdByName,
      createdByEmail: params.createdByEmail ?? null,
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
      attachmentUrls: params.attachmentUrls ?? [],
      isEscalated: false,
      messageCount: 0,
    });

    const snapshot = await getDoc(ticketRef);
    const ticket = mapTicketFromSnapshot(snapshot);
    if (!ticket) {
      throw new Error("Failed to create support ticket");
    }
    return ticket;
  }

  static async getTicketsForPlatform(
    options: TicketQueryOptions = {}
  ): Promise<SupportTicket[]> {
    const pageSize = Math.min(options.pageSize ?? 100, 100);
    const page = Math.max(options.page ?? 1, 1);

    const constraints = [
      orderBy("lastActivityAt", "desc"),
      limit(pageSize * page),
    ];
    let ticketsQuery = query(
      collection(db, SUPPORT_TICKETS_COLLECTION),
      ...constraints
    );

    if (options.status && options.status !== "all") {
      ticketsQuery = query(
        collection(db, SUPPORT_TICKETS_COLLECTION),
        where("status", "==", options.status),
        ...constraints
      );
    }

    if (options.priority && options.priority !== "all") {
      ticketsQuery = query(
        collection(db, SUPPORT_TICKETS_COLLECTION),
        where("priority", "==", options.priority),
        ...constraints
      );
    }

    if (options.organizationId) {
      ticketsQuery = query(
        collection(db, SUPPORT_TICKETS_COLLECTION),
        where("organizationId", "==", options.organizationId),
        ...constraints
      );
    }

    const snapshot = await getDocs(ticketsQuery);
    const tickets = snapshot.docs.map(mapTicketFromDoc);
    const startIndex = (page - 1) * pageSize;
    return tickets.slice(startIndex, startIndex + pageSize);
  }

  static async getTicketsForOrganization(
    organizationId: string,
    options: TicketQueryOptions = {}
  ): Promise<SupportTicket[]> {
    const pageSize = Math.min(options.pageSize ?? 100, 100);
    const page = Math.max(options.page ?? 1, 1);

    const ticketsQuery = query(
      collection(db, SUPPORT_TICKETS_COLLECTION),
      where("organizationId", "==", organizationId),
      orderBy("lastActivityAt", "desc"),
      limit(pageSize * page)
    );

    const snapshot = await getDocs(ticketsQuery);
    const tickets = snapshot.docs.map(mapTicketFromDoc);
    const startIndex = (page - 1) * pageSize;
    return tickets.slice(startIndex, startIndex + pageSize);
  }

  static async getTicketById(ticketId: string): Promise<SupportTicket | null> {
    const ref = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    const snapshot = await getDoc(ref);
    return mapTicketFromSnapshot(snapshot);
  }

  static async updateTicket(
    ticketId: string,
    updates: TicketUpdateParams
  ): Promise<void> {
    const updatePayload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (updates.status) {
      updatePayload.status = updates.status;
    }
    if (updates.priority) {
      updatePayload.priority = updates.priority;
    }
    if (updates.assignedToId !== undefined) {
      updatePayload.assignedToId = updates.assignedToId;
    }
    if (updates.assignedToName !== undefined) {
      updatePayload.assignedToName = updates.assignedToName;
    }
    if (updates.assignedToEmail !== undefined) {
      updatePayload.assignedToEmail = updates.assignedToEmail;
    }
    if (updates.resolutionSummary !== undefined) {
      updatePayload.resolutionSummary = updates.resolutionSummary;
    }
    if (updates.isEscalated !== undefined) {
      updatePayload.isEscalated = updates.isEscalated;
    }
    if (updates.tags) {
      updatePayload.tags = updates.tags;
    }
    if (updates.lastActivityAt) {
      updatePayload.lastActivityAt = updates.lastActivityAt;
    }

    const ref = doc(db, SUPPORT_TICKETS_COLLECTION, ticketId);
    await updateDoc(ref, updatePayload);
  }

  static async addMessage(params: MessageParams): Promise<SupportTicketMessage> {
    const now = serverTimestamp();
    const messagesCollection = collection(
      doc(db, SUPPORT_TICKETS_COLLECTION, params.ticketId),
      SUPPORT_TICKET_MESSAGES_SUBCOLLECTION
    );

    const messageRef = await addDoc(messagesCollection, {
      authorId: params.authorId,
      authorName: params.authorName,
      authorEmail: params.authorEmail ?? null,
      message: params.message,
      internal: params.internal ?? false,
      createdAt: now,
    });

    await updateDoc(doc(db, SUPPORT_TICKETS_COLLECTION, params.ticketId), {
      lastActivityAt: now,
      latestMessageSnippet: params.message.slice(0, 280),
      messageCount: increment(1),
    });

    const snapshot = await getDoc(messageRef);
    const data = snapshot.data() ?? {};

    return {
      id: messageRef.id,
      ticketId: params.ticketId,
      authorId: data.authorId ?? params.authorId,
      authorName: data.authorName ?? params.authorName,
      authorEmail: data.authorEmail ?? params.authorEmail,
      message: data.message ?? params.message,
      createdAt: toDateValue(data.createdAt ?? new Date()),
      internal: Boolean(data.internal),
    };
  }

  static async getMessages(ticketId: string): Promise<SupportTicketMessage[]> {
    const messagesCollection = collection(
      doc(db, SUPPORT_TICKETS_COLLECTION, ticketId),
      SUPPORT_TICKET_MESSAGES_SUBCOLLECTION
    );

    const snapshot = await getDocs(
      query(messagesCollection, orderBy("createdAt", "asc"))
    );

    return snapshot.docs.map((docSnapshot) =>
      buildMessage(docSnapshot.id, docSnapshot.data(), ticketId)
    );
  }
}

