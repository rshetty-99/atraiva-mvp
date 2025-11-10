import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import { serverTimestamp } from "firebase/firestore";

import { SupportTicketService } from "@/lib/support-ticket-service";
import type { SupportTicketStatus } from "@/lib/firestore/types";

const PLATFORM_ROLES = new Set(["super_admin", "platform_admin"]);
const ORG_ROLES = new Set([
  "org_admin",
  "org_manager",
  "org_analyst",
  "org_viewer",
]);

type ClerkOrgMeta = {
  primaryOrganization?: {
    id?: string;
    name?: string;
    role?: string;
  };
};

const messageSchema = z.object({
  message: z.string().min(1),
  internal: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { params } = await context;
    const { ticketId } = params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const primaryOrg = metadata.primaryOrganization;
    const role = primaryOrg?.role ?? "";

    if (!PLATFORM_ROLES.has(role) && !ORG_ROLES.has(role)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details:
            "Only platform or organization roles can view ticket messages.",
        },
        { status: 403 }
      );
    }

    const ticket = await SupportTicketService.getTicketById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (
      ORG_ROLES.has(role) &&
      ticket.organizationId !== (primaryOrg?.id ?? "")
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: "You are not authorized to view this ticket.",
        },
        { status: 403 }
      );
    }

    const messages = await SupportTicketService.getMessages(ticketId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("[support] Failed to fetch ticket messages", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ ticketId: string }> }
) {
  try {
    const { params } = await context;
    const { ticketId } = params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const primaryOrg = metadata.primaryOrganization;
    const role = primaryOrg?.role ?? "";

    if (!PLATFORM_ROLES.has(role) && !ORG_ROLES.has(role)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details:
            "Only platform or organization roles can add ticket messages.",
        },
        { status: 403 }
      );
    }

    const ticket = await SupportTicketService.getTicketById(ticketId);
    if (!ticket) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    if (
      ORG_ROLES.has(role) &&
      ticket.organizationId !== (primaryOrg?.id ?? "")
    ) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: "You are not authorized to update this ticket.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = messageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const isInternalMessage =
      parsed.data.internal && PLATFORM_ROLES.has(role)
        ? parsed.data.internal
        : false;

    const message = await SupportTicketService.addMessage({
      ticketId,
      authorId: userId,
      authorName:
        user.fullName ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown User",
      authorEmail: user.emailAddresses[0]?.emailAddress,
      message: parsed.data.message,
      internal: isInternalMessage,
    });

    let nextStatus: SupportTicketStatus | null = null;

    if (!isInternalMessage) {
      if (PLATFORM_ROLES.has(role)) {
        if (
          ticket.status !== "closed" &&
          ticket.status !== "resolved" &&
          ticket.status !== "awaiting_customer"
        ) {
          nextStatus = "awaiting_customer";
        }
      } else if (ORG_ROLES.has(role)) {
        if (ticket.status !== "resolved" && ticket.status !== "closed") {
          nextStatus = "in_progress";
        }
      }
    }

    if (nextStatus && nextStatus !== ticket.status) {
      await SupportTicketService.updateTicket(ticketId, {
        status: nextStatus,
        lastActivityAt: serverTimestamp(),
      });
    }

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("[support] Failed to add ticket message", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

