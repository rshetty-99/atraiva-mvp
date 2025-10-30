"use client";

import { useUser } from "@clerk/nextjs";
import { useRole } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

/**
 * Smart Dashboard Router
 * Redirects users to their role-specific dashboard
 *
 * Role Groups:
 * - super_admin, platform_admin → /admin/dashboard
 * - org_admin, org_manager, org_analyst, org_user → /org/dashboard
 * - channel_partner → /partner/dashboard
 * - auditor, org_viewer → /org/dashboard (read-only)
 */
export default function DashboardRouter() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Wait for Clerk to load
    if (!clerkLoaded) {
      return;
    }

    // Redirect to sign-in if not authenticated
    if (!clerkUser) {
      router.push("/sign-in");
      return;
    }

    // Wait for role to be available
    if (!role) {
      return;
    }

    // Redirect based on role
    const currentRole = role || "org_viewer";

    switch (currentRole) {
      case "super_admin":
      case "platform_admin":
        router.push("/admin/dashboard");
        break;

      case "channel_partner":
        router.push("/partner/dashboard");
        break;

      case "org_admin":
      case "org_manager":
      case "org_analyst":
      case "org_viewer":
      case "auditor":
      default:
        router.push("/org/dashboard");
        break;
    }
  }, [clerkUser, clerkLoaded, role, router]);

  // Show loading state
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    </div>
  );
}
