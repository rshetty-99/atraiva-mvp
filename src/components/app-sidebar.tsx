"use client";

import * as React from "react";
import { LifeBuoy, Send, HelpCircle } from "lucide-react";
import { Logo } from "@/components/logo";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { roleMenuConfig } from "@/lib/rbac/menu-config";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  organizations?: Array<{
    name: string;
    plan: string;
    id: string;
    role: string;
  }>;
  permissions?: string[];
}

export function AppSidebar({
  user,
  organizations,
  permissions,
  ...props
}: AppSidebarProps) {
  const userRole = user?.role || "org_viewer";

  // Get menu configuration for current role
  const menuConfig = roleMenuConfig[userRole] || roleMenuConfig.org_viewer;

  // Filter menu items based on permissions
  const filteredMainMenu = menuConfig.mainMenu
    .filter((item) => {
      if (!item.requiredPermission) return true;
      return permissions?.includes(item.requiredPermission);
    })
    .sort((a, b) => a.order - b.order);

  // Transform menu items to NavMain format using role-based configuration
  const navMainItems = filteredMainMenu.map((item) => ({
    title: item.label,
    url: item.route,
    icon: item.icon,
    isActive: false, // Will be determined by current route
    category: item.category, // Pass category for grouping
    items: item.children?.map((child) => ({
      title: child.label,
      url: child.route,
    })),
  }));

  // Transform projects to NavProjects format using role-based configuration
  const projects =
    menuConfig.projects?.map((project) => ({
      name: project.label,
      url: project.route,
      icon: project.icon,
    })) || [];

  // Secondary navigation - common support items for all roles
  const supportUrl =
    userRole === "super_admin" || userRole === "platform_admin"
      ? "/admin/support"
      : "/org/support";

  const navSecondary = [
    {
      title: "Support",
      url: supportUrl,
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
    {
      title: "Help",
      url: "/help",
      icon: HelpCircle,
    },
  ];

  // Prepare teams for TeamSwitcher
  const teams =
    organizations?.map((org) => ({
      name: org.name,
      logo: ({ className }: { className?: string }) => (
        <div
          className={`${className} bg-gradient-to-br from-purple-600 to-purple-800 rounded flex items-center justify-center text-white font-bold text-xs`}
        >
          A
        </div>
      ),
      plan: org.plan,
    })) || [];

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader className="border-b border-border py-4 mb-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/home" className="flex items-center justify-center">
                <Logo
                  width={160}
                  height={64}
                  className="w-[160px] h-[64px] object-contain"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pt-2">
        <NavMain items={navMainItems} />
        {projects.length > 0 && <NavProjects projects={projects} />}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={
            user || {
              name: "Guest",
              email: "guest@atraiva.ai",
              avatar: undefined,
              role: "org_viewer",
            }
          }
        />
      </SidebarFooter>
    </Sidebar>
  );
}
