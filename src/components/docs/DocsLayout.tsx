"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  X,
  ChevronRight,
  Home,
  BookOpen,
  HelpCircle,
  Shield,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const publicNavigation: NavItem[] = [
  {
    title: "Home",
    href: "/docs/public",
    icon: <Home className="w-4 h-4" />,
  },
  {
    title: "Getting Started",
    href: "/docs/public/getting-started",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      {
        title: "Introduction",
        href: "/docs/public/getting-started/introduction",
      },
      {
        title: "Quick Start",
        href: "/docs/public/getting-started/quick-start",
      },
      { title: "Key Features", href: "/docs/public/getting-started/features" },
    ],
  },
  {
    title: "User Guide",
    href: "/docs/public/user-guide",
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    title: "FAQ",
    href: "/docs/public/faq",
    icon: <HelpCircle className="w-4 h-4" />,
  },
];

const supportNavigation: NavItem[] = [
  {
    title: "Support Home",
    href: "/docs/support",
    icon: <Home className="w-4 h-4" />,
  },
  {
    title: "Admin Guide",
    href: "/docs/support/admin-guide",
    icon: <Shield className="w-4 h-4" />,
    children: [
      {
        title: "User Management",
        href: "/docs/support/admin-guide/user-management",
        children: [
          {
            title: "Adding Users",
            href: "/docs/support/admin-guide/user-management#adding-users",
          },
          {
            title: "Managing Roles",
            href: "/docs/support/admin-guide/user-management#managing-roles",
          },
          {
            title: "Removing Users",
            href: "/docs/support/admin-guide/user-management#removing-users",
          },
          {
            title: "Bulk Operations",
            href: "/docs/support/admin-guide/user-management#bulk-operations",
          },
          {
            title: "Activity Monitoring",
            href: "/docs/support/admin-guide/user-management#activity-monitoring",
          },
          {
            title: "Best Practices",
            href: "/docs/support/admin-guide/user-management#best-practices",
          },
          {
            title: "Troubleshooting",
            href: "/docs/support/admin-guide/user-management#troubleshooting",
          },
        ],
      },
      {
        title: "Organization Setup",
        href: "/docs/support/admin-guide/organization-setup",
        children: [
          {
            title: "Initial Setup",
            href: "/docs/support/admin-guide/organization-setup#initial-setup",
          },
          {
            title: "Organization Information",
            href: "/docs/support/admin-guide/organization-setup#organization-information",
          },
          {
            title: "Breach Notification",
            href: "/docs/support/admin-guide/organization-setup#breach-notification",
          },
          {
            title: "Compliance Settings",
            href: "/docs/support/admin-guide/organization-setup#compliance",
          },
          {
            title: "Data Classification",
            href: "/docs/support/admin-guide/organization-setup#data-classification",
          },
          {
            title: "Integrations",
            href: "/docs/support/admin-guide/organization-setup#integrations",
          },
          {
            title: "Notification Templates",
            href: "/docs/support/admin-guide/organization-setup#notification-templates",
          },
          {
            title: "Best Practices",
            href: "/docs/support/admin-guide/organization-setup#best-practices",
          },
        ],
      },
      {
        title: "Permissions & Roles",
        href: "/docs/support/admin-guide/permissions",
        children: [
          {
            title: "Role Hierarchy",
            href: "/docs/support/admin-guide/permissions#role-hierarchy",
          },
          {
            title: "Permission Matrix",
            href: "/docs/support/admin-guide/permissions#permission-matrix",
          },
          {
            title: "Detailed Roles",
            href: "/docs/support/admin-guide/permissions#detailed-roles",
          },
          {
            title: "Assigning Permissions",
            href: "/docs/support/admin-guide/permissions#assigning-permissions",
          },
          {
            title: "Custom Permissions",
            href: "/docs/support/admin-guide/permissions#custom-permissions",
          },
          {
            title: "Best Practices",
            href: "/docs/support/admin-guide/permissions#best-practices",
          },
        ],
      },
    ],
  },
  {
    title: "Troubleshooting",
    href: "/docs/support/troubleshooting",
    icon: <HelpCircle className="w-4 h-4" />,
    children: [
      {
        title: "Common Issues",
        href: "/docs/support/troubleshooting/common-issues",
        children: [
          {
            title: "Authentication Issues",
            href: "/docs/support/troubleshooting/common-issues#authentication",
          },
          {
            title: "Incident Reporting",
            href: "/docs/support/troubleshooting/common-issues#incident-reporting",
          },
          {
            title: "Data & Reports",
            href: "/docs/support/troubleshooting/common-issues#data-reports",
          },
          {
            title: "Integration Issues",
            href: "/docs/support/troubleshooting/common-issues#integrations",
          },
          {
            title: "Performance Issues",
            href: "/docs/support/troubleshooting/common-issues#performance",
          },
        ],
      },
      {
        title: "Error Codes",
        href: "/docs/support/troubleshooting/error-codes",
        children: [
          {
            title: "Authentication Errors (1000-1999)",
            href: "/docs/support/troubleshooting/error-codes#authentication-errors",
          },
          {
            title: "Permission Errors (2000-2999)",
            href: "/docs/support/troubleshooting/error-codes#permission-errors",
          },
          {
            title: "Validation Errors (3000-3999)",
            href: "/docs/support/troubleshooting/error-codes#validation-errors",
          },
          {
            title: "Integration Errors (4000-4999)",
            href: "/docs/support/troubleshooting/error-codes#integration-errors",
          },
          {
            title: "System Errors (5000-5999)",
            href: "/docs/support/troubleshooting/error-codes#system-errors",
          },
        ],
      },
    ],
  },
  {
    title: "API Reference",
    href: "/docs/support/api-reference",
    icon: <BookOpen className="w-4 h-4" />,
    children: [
      {
        title: "Authentication",
        href: "/docs/support/api-reference/authentication",
        children: [
          {
            title: "Getting Started",
            href: "/docs/support/api-reference/authentication#getting-started",
          },
          {
            title: "Authentication Methods",
            href: "/docs/support/api-reference/authentication#authentication-methods",
          },
          {
            title: "Base URL & Endpoints",
            href: "/docs/support/api-reference/authentication#base-url",
          },
          {
            title: "Error Handling",
            href: "/docs/support/api-reference/authentication#error-handling",
          },
          {
            title: "Rate Limits",
            href: "/docs/support/api-reference/authentication#rate-limits",
          },
          {
            title: "Best Practices",
            href: "/docs/support/api-reference/authentication#best-practices",
          },
        ],
      },
      {
        title: "Incidents API",
        href: "/docs/support/api-reference/incidents",
        children: [
          {
            title: "List Incidents",
            href: "/docs/support/api-reference/incidents#list-incidents",
          },
          {
            title: "Create Incident",
            href: "/docs/support/api-reference/incidents#create-incident",
          },
          {
            title: "Get Incident",
            href: "/docs/support/api-reference/incidents#get-incident",
          },
          {
            title: "Update Incident",
            href: "/docs/support/api-reference/incidents#update-incident",
          },
          {
            title: "Delete Incident",
            href: "/docs/support/api-reference/incidents#delete-incident",
          },
        ],
      },
      {
        title: "Determinations API",
        href: "/docs/support/api-reference/determinations",
        children: [
          {
            title: "Get Determination",
            href: "/docs/support/api-reference/determinations#get-determination",
          },
          {
            title: "List Determinations",
            href: "/docs/support/api-reference/determinations#list-determinations",
          },
          {
            title: "Determination Types",
            href: "/docs/support/api-reference/determinations#determination-types",
          },
        ],
      },
      {
        title: "Reports API",
        href: "/docs/support/api-reference/reports",
        children: [
          {
            title: "Generate Report",
            href: "/docs/support/api-reference/reports#generate-report",
          },
          {
            title: "Download Report",
            href: "/docs/support/api-reference/reports#download-report",
          },
          {
            title: "Report Types",
            href: "/docs/support/api-reference/reports#report-types",
          },
        ],
      },
      {
        title: "Organizations API",
        href: "/docs/support/api-reference/organizations",
        children: [
          {
            title: "Get Organization",
            href: "/docs/support/api-reference/organizations#get-organization",
          },
          {
            title: "Update Organization",
            href: "/docs/support/api-reference/organizations#update-organization",
          },
          {
            title: "List Team Members",
            href: "/docs/support/api-reference/organizations#list-members",
          },
        ],
      },
      {
        title: "Webhooks",
        href: "/docs/support/api-reference/webhooks",
        children: [
          {
            title: "Overview",
            href: "/docs/support/api-reference/webhooks#overview",
          },
          {
            title: "Create Webhook",
            href: "/docs/support/api-reference/webhooks#create-webhook",
          },
          {
            title: "Available Events",
            href: "/docs/support/api-reference/webhooks#available-events",
          },
          {
            title: "Webhook Payload",
            href: "/docs/support/api-reference/webhooks#webhook-payload",
          },
          {
            title: "Verifying Webhooks",
            href: "/docs/support/api-reference/webhooks#verifying-webhooks",
          },
        ],
      },
    ],
  },
];

interface DocsLayoutProps {
  children: React.ReactNode;
  isSupport?: boolean;
}

export function DocsLayout({ children, isSupport = false }: DocsLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const navigation = isSupport ? supportNavigation : publicNavigation;

  // Check if user has Platform role (platform_admin or super_admin)
  const userMetadata = user?.publicMetadata?.atraiva as
    | { primaryOrganization?: { role?: string } }
    | undefined;
  const userRole = userMetadata?.primaryOrganization?.role;
  const isPlatformRole =
    userRole === "platform_admin" || userRole === "super_admin";

  return (
    <div
      className="flex min-h-screen w-full flex-col bg-background"
      style={
        {
          "--header-height": "150px",
          "--header-height-sm": "150px",
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-[150px] w-full items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex h-full items-center px-4 md:px-6 lg:px-8">
          {/* Left Side - Logo and Breadcrumb */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link href="/" className="flex items-center">
              <Logo width={140} height={45} />
            </Link>
            <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
              <ChevronRight className="w-4 h-4" />
              <span>
                {isSupport ? "Support Documentation" : "Documentation"}
              </span>
            </div>
          </div>

          {/* Center - Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <Link
              href="/docs/public"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Public Docs
            </Link>
            {isSignedIn && isPlatformRole && (
              <Link
                href="/docs/support"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Support Docs
              </Link>
            )}
            <Link
              href="/home"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Back to Site
            </Link>
          </nav>

          {/* Right Side - Theme Toggle and Avatar */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <ThemeToggle />

            {/* User Avatar or Sign In */}
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/50 hover:border-primary transition-colors">
                    <AvatarImage
                      src={user?.imageUrl}
                      alt={user?.fullName || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.firstName?.[0] || "U"}
                      {user?.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-medium text-sm px-4 py-2 rounded-full h-9 shadow-lg transition-all">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 mt-[var(--header-height,4rem)] md:mt-[var(--header-height-sm,4rem)]">
        {/* Sidebar */}
        <aside
          className={`fixed top-[var(--header-height,4rem)] left-0 z-30 h-[calc(100vh-var(--header-height,4rem))] w-[280px] shrink-0 border-r bg-background overflow-y-auto transition-transform duration-300 md:sticky md:top-0 md:h-[calc(100vh-var(--header-height-sm,4rem))] md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <div className="py-6 px-4 pr-6 lg:py-8">
            {/* Mobile User Info */}
            {isSignedIn && user && (
              <div className="mb-6 pb-6 border-b md:hidden">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.firstName?.[0] || "U"}
                      {user.lastName?.[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <p className="text-sm font-medium truncate">
                      {user.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/settings"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Sign In Button */}
            {!isSignedIn && (
              <div className="mb-6 pb-6 border-b md:hidden">
                <Link href="/sign-in" onClick={() => setSidebarOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#AB96F9] to-[#FF91C2] hover:opacity-90 text-white font-medium">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            <DocsSidebar
              navigation={navigation}
              onLinkClick={() => setSidebarOpen(false)}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col min-w-0">
          <div className="flex-1 overflow-x-hidden px-4 md:px-6 lg:px-8 pt-8 md:pt-12 pb-16">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
