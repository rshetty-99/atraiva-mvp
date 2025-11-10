import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  SupportTicketService,
  TicketUpdateParams,
} from "@/lib/support-ticket-service";

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

const updateSchema = z.object({
  status: z
    .enum(["open", "in_progress", "awaiting_customer", "resolved", "closed"])
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedToId: z.string().optional(),
  assignedToName: z.string().optional(),
  assignedToEmail: z.string().email().optional(),
  resolutionSummary: z.string().nullable().optional(),
  isEscalated: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
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
            "Only platform or organization roles can access support tickets.",
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
          details: "You are not authorized to access this ticket.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("[support] Failed to fetch ticket", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
            "Only platform or organization roles can update support tickets.",
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
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updates = parsed.data as TicketUpdateParams;

    if (!PLATFORM_ROLES.has(role)) {
      // Organization users can only update status, priority, tags.
      delete updates.assignedToId;
      delete updates.assignedToName;
      delete updates.assignedToEmail;
      delete updates.resolutionSummary;
      delete updates.isEscalated;
    }

    await SupportTicketService.updateTicket(ticketId, updates);

    const updatedTicket = await SupportTicketService.getTicketById(ticketId);

    return NextResponse.json({ ticket: updatedTicket });
  } catch (error) {
    console.error("[support] Failed to update ticket", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

