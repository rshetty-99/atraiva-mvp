"use client";

import { useUser } from "@clerk/nextjs";
import { useSession, useRole } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  getDashboardForRole,
  getQuickActionsForRole,
} from "@/lib/rbac/dashboard-widgets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  BarChart3,
  Users,
  Eye,
  UserCheck,
  List,
  Table,
  Loader2,
  Zap,
} from "lucide-react";

/**
 * Organization Dashboard
 * For org_admin, org_manager, org_analyst, org_user, org_viewer, auditor roles
 * Features: Organization-specific compliance, team management, data analysis
 */
export default function OrgDashboard() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { session } = useSession();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not loaded or not authenticated
    if (clerkLoaded && !clerkUser) {
      router.push("/sign-in");
    }

    // Redirect if admin or partner role
    if (
      clerkLoaded &&
      role &&
      (role === "super_admin" ||
        role === "platform_admin" ||
        role === "channel_partner")
    ) {
      router.push("/dashboard"); // Will redirect to appropriate dashboard
    }
  }, [clerkUser, clerkLoaded, role, router]);

  // Show loading while authenticating
  if (!clerkLoaded || !role) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect non-org users
  const orgRoles = [
    "org_admin",
    "org_manager",
    "org_analyst",
    "org_user",
    "org_viewer",
    "auditor",
  ];
  if (!orgRoles.includes(role)) {
    return null;
  }

  // Use session data if available, otherwise fallback to Clerk data
  const displayUser = session?.user || {
    firstName: clerkUser?.firstName || "",
    lastName: clerkUser?.lastName || "",
    displayName:
      clerkUser?.fullName || clerkUser?.emailAddresses[0]?.emailAddress || "",
    email: clerkUser?.emailAddresses[0]?.emailAddress || "",
    jobTitle: "",
    department: "",
  };

  const currentOrganization = session?.currentOrganization;
  const currentRole = role || "org_viewer";
  const currentPermissions = session?.currentOrganization?.permissions || [];

  // Get role-specific dashboard configuration
  const dashboardConfig = getDashboardForRole(currentRole);
  const quickActions = getQuickActionsForRole(currentRole, currentPermissions);

  // Get role display information
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<
      string,
      {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        color: string;
        description: string;
      }
    > = {
      org_admin: {
        label: "Organization Admin",
        icon: UserCheck,
        color: "text-blue-600",
        description: "Organization management and compliance oversight",
      },
      org_manager: {
        label: "Manager",
        icon: Users,
        color: "text-green-600",
        description: "Team management and incident response",
      },
      org_analyst: {
        label: "Analyst",
        icon: BarChart3,
        color: "text-yellow-600",
        description: "Data analysis and reporting",
      },
      org_user: {
        label: "User",
        icon: Users,
        color: "text-gray-600",
        description: "Organization member",
      },
      org_viewer: {
        label: "Viewer",
        icon: Eye,
        color: "text-gray-600",
        description: "Read-only access to organization data",
      },
      auditor: {
        label: "Auditor",
        icon: Eye,
        color: "text-orange-600",
        description: "Audit and compliance review",
      },
    };
    return (
      roleMap[role] || {
        label: "User",
        icon: Users,
        color: "text-gray-600",
        description: "Basic access",
      }
    );
  };

  const roleDisplay = getRoleDisplay(currentRole);
  const RoleIcon = roleDisplay.icon;

  // Render widget based on type
  const renderWidget = (widget: {
    id: string;
    type: string;
    title: string;
    description?: string;
    icon?: React.ComponentType<{ className?: string }>;
    data: {
      value?: string | number;
      label?: string;
      change?: string;
      [key: string]: unknown;
    };
    position: { x: number; y: number; width: number; height: number };
  }) => {
    const WidgetIcon = widget.icon || BarChart3;

    switch (widget.type) {
      case "metric":
        return (
          <Card key={widget.id} className="relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {widget.title}
              </CardTitle>
              {WidgetIcon && (
                <WidgetIcon className="h-4 w-4 text-muted-foreground" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.data.value}</div>
              <p className="text-xs text-muted-foreground">
                {widget.data.label}
              </p>
              {widget.data.change && (
                <p className="text-xs text-muted-foreground mt-1">
                  {widget.data.change} from last period
                </p>
              )}
            </CardContent>
          </Card>
        );

      case "chart":
        return (
          <Card key={widget.id} className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {WidgetIcon && <WidgetIcon className="h-5 w-5" />}
                {widget.title}
              </CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                  <p>Chart placeholder</p>
                  <p className="text-sm">
                    Data visualization will be implemented
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "table":
        return (
          <Card key={widget.id} className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {WidgetIcon && <WidgetIcon className="h-5 w-5" />}
                {widget.title}
              </CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <Table className="h-8 w-8 mx-auto mb-2" />
                <p>Table placeholder</p>
                <p className="text-sm">Data table will be implemented</p>
              </div>
            </CardContent>
          </Card>
        );

      case "list":
        return (
          <Card key={widget.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {WidgetIcon && <WidgetIcon className="h-5 w-5" />}
                {widget.title}
              </CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-4">
                <List className="h-6 w-6 mx-auto mb-2" />
                <p>List placeholder</p>
                <p className="text-sm">Data list will be implemented</p>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: "140px" }}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {displayUser.firstName}!
          </h2>
          <p className="text-muted-foreground mt-2">
            {roleDisplay.description} • Monitor your organization&apos;s data
            protection and compliance status
          </p>
          {displayUser.jobTitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {displayUser.jobTitle}
              {displayUser.department && ` • ${displayUser.department}`}
            </p>
          )}
        </div>
        {currentOrganization && (
          <div className="text-right bg-card border rounded-lg p-4">
            <div className="text-sm text-muted-foreground">
              Current Organization
            </div>
            <div className="font-semibold text-lg">
              {currentOrganization.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="flex items-center gap-1">
                <RoleIcon className="h-3 w-3" />
                {roleDisplay.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentOrganization.plan} Plan
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Status:{" "}
              <span className="capitalize text-green-600">
                {currentOrganization.status}
              </span>
              {currentOrganization.industry && (
                <span className="ml-2">• {currentOrganization.industry}</span>
              )}
            </div>
          </div>
        )}
        {!currentOrganization && (
          <div className="text-right border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
            <div className="text-sm text-yellow-700 dark:text-yellow-400">
              Organization Setup
            </div>
            <div className="font-semibold text-yellow-800 dark:text-yellow-300">
              Setup Required
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
              Create or join an organization to get started
            </div>
            <button className="mt-2 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-md hover:bg-primary/90">
              Setup Organization
            </button>
          </div>
        )}
      </div>

      {!currentOrganization && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            🚀 Welcome to Atraiva.ai!
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            To get started with compliance management, you&apos;ll need to set
            up your organization profile.
          </p>
          <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Create a new organization or join an existing one</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>
                Configure your compliance frameworks (GDPR, CCPA, HIPAA)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Start monitoring your data and privacy compliance</span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Create Organization
            </button>
            <button className="bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 px-4 py-2 rounded-md hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
              Join Organization
            </button>
          </div>
        </div>
      )}

      {/* Role-specific Dashboard Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardConfig.widgets
          .filter((widget) => widget.position.y === 0) // Top row widgets
          .map(renderWidget)}
      </div>

      {/* Middle row widgets */}
      {dashboardConfig.widgets.filter((widget) => widget.position.y === 2)
        .length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {dashboardConfig.widgets
            .filter((widget) => widget.position.y === 2)
            .map(renderWidget)}
        </div>
      )}

      {/* Bottom row widgets */}
      {dashboardConfig.widgets.filter((widget) => widget.position.y === 6)
        .length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {dashboardConfig.widgets
            .filter((widget) => widget.position.y === 6)
            .map(renderWidget)}
        </div>
      )}

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks for your role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      className="h-auto p-4 text-left justify-start"
                      onClick={() => {
                        if (action.action.startsWith("/")) {
                          router.push(action.action);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <ActionIcon
                          className={`h-5 w-5 mt-0.5 ${
                            action.color === "blue"
                              ? "text-blue-600"
                              : action.color === "green"
                              ? "text-green-600"
                              : action.color === "red"
                              ? "text-red-600"
                              : action.color === "yellow"
                              ? "text-yellow-600"
                              : action.color === "purple"
                              ? "text-purple-600"
                              : "text-gray-600"
                          }`}
                        />
                        <div>
                          <div className="font-medium">{action.label}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {action.description}
                          </div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
