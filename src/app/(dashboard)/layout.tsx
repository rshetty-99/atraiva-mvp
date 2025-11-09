"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { useUser } from "@clerk/nextjs";
import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface DashboardContentProps {
  children: React.ReactNode;
  sidebarUser?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  sidebarOrganizations?: Array<{
    name: string;
    plan: string;
    id: string;
  }>;
  currentPermissions?: string[];
}

function DashboardContent({
  children,
  sidebarUser,
  sidebarOrganizations,
  currentPermissions,
}: DashboardContentProps) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <SiteHeader />
      <div className="flex flex-1 mt-[var(--header-height,3.0625rem)] sm:mt-[var(--header-height-sm,4.0625rem)]">
        <AppSidebar
          user={sidebarUser}
          organizations={sidebarOrganizations}
          permissions={currentPermissions}
        />
        <SidebarInset className="flex flex-1 flex-col">
          <div className="flex-1 overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-6">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </div>
  );
}

export default function DashboardRootLayout({
  children,
}: DashboardLayoutProps) {
  const { session, loading: sessionLoading } = useSession();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const sidebarUser = session?.user
    ? {
        name:
          session.user.displayName ||
          `${session.user.firstName} ${session.user.lastName}`,
        email: session.user.email,
        avatar: session.user.avatar || undefined,
        role: session.currentOrganization?.role,
      }
    : clerkUser
    ? {
        name:
          clerkUser.fullName ||
          `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
          "User",
        email: clerkUser.emailAddresses[0]?.emailAddress || "user@example.com",
        avatar: clerkUser.imageUrl || undefined,
        role: "org_viewer", // Default role for Clerk users without session data
      }
    : {
        name: "Guest User",
        email: "guest@atraiva.ai",
        avatar: undefined,
        role: "org_viewer",
      };

  const sidebarOrganizations = session?.organizations?.map((org) => ({
    name: org.name,
    plan:
      org.role === "super_admin"
        ? "Enterprise"
        : org.role === "org_admin"
        ? "Professional"
        : org.role === "org_manager"
        ? "Business"
        : "Starter",
    id: org.id,
    role: org.role,
  }));

  // Get permissions for the current organization
  const currentPermissions = session?.currentOrganization?.permissions || [];

  // Show loading state while session is loading
  if (sessionLoading || !clerkLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardContent
        sidebarUser={sidebarUser}
        sidebarOrganizations={sidebarOrganizations}
        currentPermissions={currentPermissions}
      >
        {children}
      </DashboardContent>
    </SidebarProvider>
  );
}
