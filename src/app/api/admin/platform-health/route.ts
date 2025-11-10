import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { getPlatformHealthSnapshot } from "@/lib/platform-health";

type ClerkOrgMeta = {
  primaryOrganization?: {
    role?: string;
  };
};

const isAuthorizedRole = (role: string | undefined | null) =>
  role === "platform_admin" || role === "super_admin";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = (user.publicMetadata?.atraiva ?? {}) as ClerkOrgMeta;
    const role = metadata.primaryOrganization?.role ?? "";

    if (!isAuthorizedRole(role)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          details: `Access denied. Your role: ${
            role || "unknown"
          }. Required: platform_admin or super_admin`,
        },
        { status: 403 }
      );
    }

    const forceRefresh =
      request.nextUrl.searchParams.get("refresh") === "true" ||
      request.nextUrl.searchParams.get("force") === "true";

    const snapshot = await getPlatformHealthSnapshot({
      forceRefresh,
    });

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("[platform-health] Failed to fetch snapshot", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
