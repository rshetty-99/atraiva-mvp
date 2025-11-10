import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";

import {
  SupportTicketService,
  TicketCreationParams,
  TicketQueryOptions,
} from "@/lib/support-ticket-service";
import type {
  SupportTicketPriority,
  SupportTicketStatus,
} from "@/lib/firestore/types";

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

const createTicketSchema = z.object({
  subject: z.string().min(3),
  description: z.string().min(5),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  organizationId: z.string().optional(),
  organizationName: z.string().optional(),
  attachmentUrls: z.array(z.string().url()).optional(),
});

const STATUS_VALUES: readonly SupportTicketStatus[] = [
  "open",
  "in_progress",
  "awaiting_customer",
  "resolved",
  "closed",
] as const;

const PRIORITY_VALUES: readonly SupportTicketPriority[] = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

const isSupportStatus = (value: string): value is SupportTicketStatus =>
  STATUS_VALUES.includes(value as SupportTicketStatus);

const isSupportPriority = (value: string): value is SupportTicketPriority =>
  PRIORITY_VALUES.includes(value as SupportTicketPriority);

function buildQueryOptions(
  request: NextRequest,
  role: string,
  organizationId?: string
): TicketQueryOptions {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const statusParam = searchParams.get("status") ?? "all";
  const priorityParam = searchParams.get("priority") ?? "all";

  const options: TicketQueryOptions = {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize:
      Number.isFinite(pageSize) && pageSize > 0 ? Math.min(pageSize, 100) : 10,
  };

  if (statusParam !== "all" && isSupportStatus(statusParam)) {
    options.status = statusParam;
  }
  if (priorityParam !== "all" && isSupportPriority(priorityParam)) {
    options.priority = priorityParam;
  }

  if (PLATFORM_ROLES.has(role)) {
    const orgId = searchParams.get("organizationId");
    if (orgId) {
      options.organizationId = orgId;
    }
  } else if (organizationId) {
    options.organizationId = organizationId;
  }

  return options;
}

export async function GET(request: NextRequest) {
  try {
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

    const options = buildQueryOptions(request, role, primaryOrg?.id);

    const tickets = PLATFORM_ROLES.has(role)
      ? await SupportTicketService.getTicketsForPlatform(options)
      : await SupportTicketService.getTicketsForOrganization(
          primaryOrg?.id ?? "",
          options
        );

    return NextResponse.json({
      tickets,
      meta: {
        page: options.page ?? 1,
        pageSize: options.pageSize ?? 10,
        count: tickets.length,
      },
    });
  } catch (error) {
    console.error("[support] Failed to fetch tickets", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
            "Only platform or organization roles can create support tickets.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = createTicketSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload = parsed.data;

    let organizationId = payload.organizationId;
    let organizationName = payload.organizationName;

    if (ORG_ROLES.has(role)) {
      organizationId = primaryOrg?.id;
      organizationName = primaryOrg?.name;
    } else if (!organizationId) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: { organizationId: ["organizationId is required"] },
        },
        { status: 400 }
      );
    }

    if (!organizationId) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: {
            organizationId: [
              "Unable to determine organization context for ticket",
            ],
          },
        },
        { status: 400 }
      );
    }

    const ticketParams: TicketCreationParams = {
      organizationId,
      organizationName: organizationName ?? undefined,
      subject: payload.subject,
      description: payload.description,
      priority: payload.priority,
      createdById: userId,
      createdByName:
        user.fullName ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        user.emailAddresses[0]?.emailAddress ||
        "Unknown User",
      createdByEmail: user.emailAddresses[0]?.emailAddress,
      attachmentUrls: payload.attachmentUrls,
    };

    const ticket = await SupportTicketService.createTicket(ticketParams);

    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    console.error("[support] Failed to create ticket", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

