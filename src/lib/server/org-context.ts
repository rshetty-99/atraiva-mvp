import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

type ClerkOrgMeta = {
  primaryOrganization?: {
    id?: string;
    role?: string;
  };
};

type ClerkPrivateMeta = {
  primaryOrganizationId?: string;
  organizationId?: string;
  primaryRole?: string;
};

export interface OrgContext {
  authUserId: string;
  client: ReturnType<typeof createClerkClient>;
  user: Awaited<ReturnType<ReturnType<typeof createClerkClient>["users"]["getUser"]>>;
  organizationId: string;
  role: string;
}

const ADMIN_ROLES = new Set([
  "org_admin",
  "org_manager",
  "platform_admin",
  "super_admin",
]);

export async function getOrgContext(options: { requireAdmin?: boolean } = {}): Promise<OrgContext> {
  const { requireAdmin = false } = options;

  const authData = await auth();
  if (!authData.userId) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("CLERK_SECRET_KEY is not configured");
  }

  const client = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const user = await client.users.getUser(authData.userId);

  const publicMeta = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
  const privateMeta = (user.privateMetadata ?? {}) as ClerkPrivateMeta;

  const organizationId =
    (publicMeta.primaryOrganization?.id &&
      publicMeta.primaryOrganization.id !== "temp" &&
      publicMeta.primaryOrganization.id) ||
    privateMeta.primaryOrganizationId ||
    privateMeta.organizationId;

  if (!organizationId) {
    throw new Response(
      JSON.stringify({ error: "No organization context", details: "User is not associated with an organization." }),
      { status: 400 }
    );
  }

  const role =
    publicMeta.primaryOrganization?.role ||
    privateMeta.primaryRole ||
    "org_viewer";

  if (requireAdmin && !ADMIN_ROLES.has(role)) {
    throw new Response(
      JSON.stringify({
        error: "Forbidden",
        details: "Organization admin or manager role required for this action.",
      }),
      { status: 403 }
    );
  }

  return {
    authUserId: authData.userId,
    client,
    user,
    organizationId,
    role,
  };
}

