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
  Building,
  BarChart3,
  DollarSign,
  Heart,
  List,
  Table,
  Loader2,
  Zap,
} from "lucide-react";

/**
 * Channel Partner Dashboard
 * For channel_partner role
 * Features: Multi-client management, commission tracking, client health monitoring
 */
export default function PartnerDashboard() {
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { session } = useSession();
  const { role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not loaded or not authenticated
    if (clerkLoaded && !clerkUser) {
      router.push("/sign-in");
    }

    // Redirect if not partner role
    if (clerkLoaded && role && role !== "channel_partner") {
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

  // Redirect non-partner users
  if (role !== "channel_partner") {
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

  const currentClient = session?.currentClient;
  const currentOrganization = session?.currentOrganization;
  const currentRole = role || "channel_partner";
  const currentPermissions = session?.currentOrganization?.permissions || [];

  // Get role-specific dashboard configuration
  const dashboardConfig = getDashboardForRole(currentRole);
  const quickActions = getQuickActionsForRole(currentRole, currentPermissions);

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
      currentClient?: Record<string, unknown>;
      availableClients?: Array<Record<string, unknown>>;
      [key: string]: unknown;
    };
    position: { x: number; y: number; width: number; height: number };
    config?: {
      showSwitcher?: boolean;
      allowSwitch?: boolean;
      [key: string]: unknown;
    };
  }) => {
    const WidgetIcon = widget.icon || BarChart3;

    switch (widget.type) {
      case "custom":
        // Client context switcher
        if (widget.id === "client-selector") {
          return (
            <Card key={widget.id} className="col-span-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {WidgetIcon && <WidgetIcon className="h-5 w-5" />}
                  {widget.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Client
                      </p>
                      <p className="font-semibold">
                        {currentClient?.name || "No client selected"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Switch Client
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }
        return null;

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
          <Card key={widget.id}>
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
          <Card key={widget.id} className="col-span-full">
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
    <div style={{ marginTop: "140px" }} className="w-full max-w-full overflow-x-hidden px-4 sm:px-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Partner Dashboard
          </h2>
          <p className="text-muted-foreground mt-2">
            Multi-client management and performance tracking • Monitor client
            health and commission earnings
          </p>
          {displayUser.jobTitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {displayUser.jobTitle}
              {displayUser.department && ` • ${displayUser.department}`}
            </p>
          )}
        </div>
        <div className="text-right bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Welcome Back</div>
          <div className="font-semibold text-lg">
            {displayUser.firstName} {displayUser.lastName}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              Channel Partner
            </Badge>
          </div>
          {currentOrganization && (
            <div className="text-xs text-muted-foreground mt-1">
              {currentOrganization.name}
            </div>
          )}
        </div>
      </div>

      {/* Client Context Banner (if applicable) */}
      {currentClient && (
        <Card className="mb-6 border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Current Client Context
                  </p>
                  <p className="font-semibold text-lg">{currentClient.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {currentClient.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentClient.plan} Plan
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Health: {currentClient.healthScore || 0}%
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/clients/switch")}
              >
                Switch Client
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Role-specific Dashboard Widgets */}
      {/* Client Selector Widget */}
      {dashboardConfig.widgets
        .filter((widget) => widget.type === "custom" && widget.position.y === 0)
        .map(renderWidget)}

      {/* Metrics Row */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {dashboardConfig.widgets
          .filter(
            (widget) => widget.type === "metric" && widget.position.y === 1
          )
          .map(renderWidget)}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        {dashboardConfig.widgets
          .filter(
            (widget) => widget.type === "chart" && widget.position.y === 1
          )
          .map(renderWidget)}
      </div>

      {/* Table Row */}
      {dashboardConfig.widgets.filter(
        (widget) => widget.type === "table" && widget.position.y === 4
      ).length > 0 && (
        <div className="mb-6">
          {dashboardConfig.widgets
            .filter(
              (widget) => widget.type === "table" && widget.position.y === 4
            )
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
              <CardDescription>
                Common tasks for partner management
              </CardDescription>
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
