"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  ArrowLeft,
  BarChart3,
  Users,
  Shield,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

interface DashboardPreviewStepProps {
  data: any;
  onDataUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  registrationToken?: string | null;
}

const dashboardTemplates = {
  law_firm_admin: {
    title: "Law Firm Admin Dashboard",
    description: "Complete oversight of client portfolio and team management",
    layout: "sidebar",
    widgets: [
      {
        id: "client-portfolio",
        title: "Client Portfolio",
        type: "chart",
        size: "large",
      },
      {
        id: "team-activity",
        title: "Team Activity",
        type: "list",
        size: "medium",
      },
      {
        id: "compliance-score",
        title: "Compliance Score",
        type: "metric",
        size: "small",
      },
      {
        id: "revenue-metrics",
        title: "Revenue Analytics",
        type: "chart",
        size: "medium",
      },
      {
        id: "upcoming-deadlines",
        title: "Upcoming Deadlines",
        type: "list",
        size: "small",
      },
      {
        id: "recent-incidents",
        title: "Recent Incidents",
        type: "table",
        size: "large",
      },
    ],
    menuItems: [
      { label: "Clients", icon: Users, active: true },
      { label: "Team", icon: Users },
      { label: "Compliance", icon: Shield },
      { label: "Billing", icon: TrendingUp },
      { label: "Reports", icon: BarChart3 },
      { label: "Settings", icon: Settings },
    ],
  },
  enterprise_admin: {
    title: "Enterprise Admin Dashboard",
    description: "Company-wide compliance monitoring and management",
    layout: "top-nav",
    widgets: [
      {
        id: "company-compliance",
        title: "Company Compliance Status",
        type: "metric",
        size: "large",
      },
      {
        id: "incident-trends",
        title: "Incident Trends",
        type: "chart",
        size: "large",
      },
      {
        id: "department-status",
        title: "Department Status",
        type: "table",
        size: "medium",
      },
      {
        id: "audit-activity",
        title: "Audit Activity",
        type: "list",
        size: "medium",
      },
      {
        id: "risk-assessment",
        title: "Risk Assessment",
        type: "chart",
        size: "small",
      },
      {
        id: "compliance-alerts",
        title: "Compliance Alerts",
        type: "list",
        size: "small",
      },
    ],
    menuItems: [
      { label: "Overview", icon: BarChart3, active: true },
      { label: "Incidents", icon: AlertTriangle },
      { label: "Compliance", icon: Shield },
      { label: "Users", icon: Users },
      { label: "Departments", icon: Users },
      { label: "Audit", icon: Eye },
    ],
  },
  channel_partner: {
    title: "Channel Partner Dashboard",
    description: "Multi-client management with white-label customization",
    layout: "hybrid",
    widgets: [
      {
        id: "client-selector",
        title: "Client Context Switcher",
        type: "custom",
        size: "large",
      },
      {
        id: "partner-overview",
        title: "Partner Performance",
        type: "metric",
        size: "medium",
      },
      {
        id: "client-health",
        title: "Client Health Score",
        type: "chart",
        size: "medium",
      },
      {
        id: "commission-tracker",
        title: "Commission Tracking",
        type: "chart",
        size: "large",
      },
      {
        id: "client-portfolio",
        title: "Client Portfolio",
        type: "table",
        size: "medium",
      },
      {
        id: "recent-activity",
        title: "Recent Activity",
        type: "list",
        size: "small",
      },
    ],
    menuItems: [
      { label: "Dashboard", icon: BarChart3, active: true },
      { label: "Clients", icon: Users },
      { label: "Branding", icon: Settings },
      { label: "Billing", icon: TrendingUp },
      { label: "Resources", icon: Download },
      { label: "Support", icon: Bell },
    ],
  },
};

const mockData = {
  "company-compliance": {
    type: "metric",
    data: { value: 94, trend: "+2%", status: "excellent" },
  },
  "incident-trends": {
    type: "chart",
    data: [
      { name: "Jan", value: 12, color: "#3B82F6" },
      { name: "Feb", value: 8, color: "#10B981" },
      { name: "Mar", value: 15, color: "#F59E0B" },
      { name: "Apr", value: 6, color: "#EF4444" },
      { name: "May", value: 9, color: "#8B5CF6" },
      { name: "Jun", value: 4, color: "#06B6D4" },
    ],
  },
  "department-status": {
    type: "table",
    data: [
      {
        client: "Legal Department",
        status: "Compliant",
        lastUpdate: "2 hours ago",
      },
      {
        client: "IT Security",
        status: "Review Needed",
        lastUpdate: "1 day ago",
      },
      { client: "HR", status: "Compliant", lastUpdate: "3 hours ago" },
    ],
  },
  "audit-activity": {
    type: "list",
    data: [
      {
        name: "Security Audit",
        action: "Completed Q2 review",
        time: "2 hours ago",
        status: "success",
      },
      {
        name: "Compliance Check",
        action: "Updated policies",
        time: "1 day ago",
        status: "success",
      },
      {
        name: "Risk Assessment",
        action: "New vulnerabilities found",
        time: "2 days ago",
        status: "warning",
      },
    ],
  },
  "risk-assessment": {
    type: "chart",
    data: [
      { name: "Low", value: 65, color: "#10B981" },
      { name: "Medium", value: 25, color: "#F59E0B" },
      { name: "High", value: 10, color: "#EF4444" },
    ],
  },
  "compliance-alerts": {
    type: "list",
    data: [
      {
        name: "Policy Update",
        action: "New GDPR requirements",
        time: "1 hour ago",
        status: "info",
      },
      {
        name: "Deadline Alert",
        action: "Quarterly report due",
        time: "3 hours ago",
        status: "warning",
      },
    ],
  },
};

export default function DashboardPreviewStep({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
  isFirstStep,
}: DashboardPreviewStepProps) {
  const [selectedLayout, setSelectedLayout] = useState("sidebar");
  const [isLoading, setIsLoading] = useState(true);

  const userType = data.userType || "law_firm";
  const role = data.role || "law_firm_admin";

  // Get the appropriate dashboard template
  const dashboardTemplate =
    dashboardTemplates[role as keyof typeof dashboardTemplates] ||
    dashboardTemplates.law_firm_admin;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLayoutChange = (layout: string) => {
    setSelectedLayout(layout);
    onDataUpdate({
      preferences: { ...data.preferences, dashboardLayout: layout },
    });
  };

  const renderWidget = (widget: any) => {
    const mockWidgetData = mockData[widget.id as keyof typeof mockData];

    return (
      <Card key={widget.id} className="h-full bg-card border-border">
        <CardHeader className="pb-2 px-3 pt-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-foreground">
              {widget.title}
            </CardTitle>
            <div className="flex items-center space-x-1">
              <RefreshCw className="h-2 w-2 text-muted-foreground" />
              <Eye className="h-2 w-2 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 px-3 pb-3">
          {widget.type === "chart" && (
            <div className="space-y-2">
              {mockWidgetData?.data && Array.isArray(mockWidgetData.data) ? (
                <div className="space-y-1">
                  {mockWidgetData.data
                    .slice(0, 3)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color || "#3B82F6" }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-foreground">
                          {item.value}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="h-16 bg-muted rounded flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
          )}

          {widget.type === "list" && (
            <div className="space-y-1">
              {mockWidgetData?.data && Array.isArray(mockWidgetData.data) ? (
                mockWidgetData.data
                  .slice(0, 2)
                  .map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-2 p-1 rounded hover:bg-muted/50"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          item.status === "success"
                            ? "bg-green-500"
                            : item.status === "warning"
                            ? "bg-yellow-500"
                            : item.status === "info"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="space-y-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-muted rounded-full" />
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded w-3/4 mb-1" />
                        <div className="h-1 bg-muted/50 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {widget.type === "metric" && (
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {mockWidgetData?.data?.value || "94"}
              </div>
              <div className="text-xs text-muted-foreground">
                {mockWidgetData?.data?.trend || "+2%"} this month
              </div>
              <Badge
                variant="outline"
                className="mt-1 text-xs text-green-600 border-green-200 dark:text-green-400 dark:border-green-800"
              >
                {mockWidgetData?.data?.status || "Excellent"}
              </Badge>
            </div>
          )}

          {widget.type === "table" && (
            <div className="space-y-1">
              <div className="grid grid-cols-3 gap-1 text-xs text-muted-foreground font-medium">
                <div>Client</div>
                <div>Status</div>
                <div>Update</div>
              </div>
              {mockWidgetData?.data && Array.isArray(mockWidgetData.data)
                ? mockWidgetData.data
                    .slice(0, 2)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        className="grid grid-cols-3 gap-1 text-xs"
                      >
                        <div className="text-foreground truncate">
                          {item.client}
                        </div>
                        <div
                          className={`${
                            item.status === "Compliant"
                              ? "text-green-600 dark:text-green-400"
                              : "text-yellow-600 dark:text-yellow-400"
                          }`}
                        >
                          {item.status}
                        </div>
                        <div className="text-muted-foreground truncate">
                          {item.lastUpdate}
                        </div>
                      </div>
                    ))
                : [1, 2].map((i) => (
                    <div key={i} className="grid grid-cols-3 gap-1 text-xs">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded" />
                    </div>
                  ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Preparing Your Dashboard
          </h3>
          <p className="text-muted-foreground">
            Customizing your experience based on your role and preferences...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Your Personalized Dashboard
        </h3>
        <p className="text-muted-foreground">
          Here's a preview of your dashboard tailored to your role and
          organization
        </p>
      </div>

      {/* Layout Selection */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-foreground">
          Choose Your Layout
        </h4>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              id: "sidebar",
              name: "Sidebar",
              description: "Navigation on the left",
            },
            {
              id: "top-nav",
              name: "Top Navigation",
              description: "Navigation at the top",
            },
            { id: "hybrid", name: "Hybrid", description: "Combined layout" },
          ].map((layout) => (
            <Card
              key={layout.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedLayout === layout.id
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950 dark:ring-blue-400 shadow-lg"
                  : "hover:shadow-md hover:ring-1 hover:ring-gray-300 dark:hover:ring-gray-600"
              }`}
              onClick={() => handleLayoutChange(layout.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="w-20 h-14 mx-auto mb-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 relative shadow-sm">
                  {layout.id === "sidebar" && (
                    <>
                      {/* Sidebar navigation */}
                      <div className="absolute left-1 top-1 w-3 h-12 bg-blue-500 rounded-sm shadow-sm"></div>
                      {/* Main content area */}
                      <div className="absolute right-1 top-1 left-5 w-14 h-12 bg-gray-50 dark:bg-gray-700 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                      {/* Content lines */}
                      <div className="absolute right-2 top-3 left-6 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                      <div className="absolute right-2 top-4 left-6 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                      <div className="absolute right-2 top-5 left-6 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                    </>
                  )}
                  {layout.id === "top-nav" && (
                    <>
                      {/* Top navigation */}
                      <div className="absolute top-1 left-1 right-1 h-3 bg-blue-500 rounded-sm shadow-sm"></div>
                      {/* Navigation items */}
                      <div className="absolute top-1.5 left-2 w-2 h-2 bg-white rounded-sm"></div>
                      <div className="absolute top-1.5 left-5 w-2 h-2 bg-white rounded-sm"></div>
                      <div className="absolute top-1.5 left-8 w-2 h-2 bg-white rounded-sm"></div>
                      {/* Main content area */}
                      <div className="absolute bottom-1 left-1 right-1 h-10 bg-gray-50 dark:bg-gray-700 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                      {/* Content lines */}
                      <div className="absolute bottom-3 left-2 right-2 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                      <div className="absolute bottom-4 left-2 right-2 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                      <div className="absolute bottom-5 left-2 right-2 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                    </>
                  )}
                  {layout.id === "hybrid" && (
                    <>
                      {/* Top navigation */}
                      <div className="absolute top-1 left-1 right-1 h-2 bg-blue-500 rounded-sm shadow-sm"></div>
                      {/* Top nav items */}
                      <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-white rounded-sm"></div>
                      <div className="absolute top-1.5 left-4 w-1.5 h-1.5 bg-white rounded-sm"></div>
                      <div className="absolute top-1.5 left-6 w-1.5 h-1.5 bg-white rounded-sm"></div>
                      {/* Sidebar */}
                      <div className="absolute left-1 top-4 w-2 h-10 bg-blue-500 rounded-sm shadow-sm"></div>
                      {/* Main content area */}
                      <div className="absolute right-1 top-4 left-4 w-15 h-10 bg-gray-50 dark:bg-gray-700 rounded-sm border border-gray-200 dark:border-gray-600"></div>
                      {/* Content lines */}
                      <div className="absolute right-2 top-5 left-5 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                      <div className="absolute right-2 top-6 left-5 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                      <div className="absolute right-2 top-7 left-5 h-0.5 bg-gray-300 dark:bg-gray-500 rounded"></div>
                    </>
                  )}
                </div>
                <h5 className="font-medium text-foreground">{layout.name}</h5>
                <p className="text-sm text-muted-foreground">
                  {layout.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Dashboard Preview */}
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-700 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                {dashboardTemplate.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {dashboardTemplate.description}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-muted-foreground">
              Preview
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Layout-specific Dashboard Preview */}
          {selectedLayout === "sidebar" && (
            <div className="flex h-80 overflow-hidden rounded-lg border border-border">
              {/* Sidebar Navigation */}
              <div className="w-40 bg-muted/30 border-r border-border p-3 flex-shrink-0">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                    <Shield className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="font-semibold text-foreground text-xs">
                    Atraiva
                  </span>
                </div>
                <div className="space-y-0.5">
                  {dashboardTemplate.menuItems.map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 px-2 py-1.5 rounded text-xs transition-colors ${
                        item.active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {React.createElement(item.icon, {
                        className: "h-3 w-3",
                      })}
                      <span className="truncate">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-3 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Dashboard
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Overview of your compliance status
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Search className="h-3 w-3 text-muted-foreground" />
                    <Bell className="h-3 w-3 text-muted-foreground" />
                    <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-muted-foreground">
                        JD
                      </span>
                    </div>
                  </div>
                </div>

                {/* Widget Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full overflow-y-auto">
                  {dashboardTemplate.widgets.slice(0, 6).map((widget) => (
                    <div
                      key={widget.id}
                      className={`${
                        widget.size === "large"
                          ? "md:col-span-2"
                          : widget.size === "medium"
                          ? "md:col-span-1"
                          : "md:col-span-1"
                      }`}
                    >
                      {renderWidget(widget)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedLayout === "top-nav" && (
            <div className="h-80 overflow-hidden rounded-lg border border-border">
              {/* Top Navigation */}
              <div className="flex items-center justify-between p-3 bg-muted/30 border-b border-border">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-primary rounded flex items-center justify-center">
                      <Shield className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">
                      Atraiva
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {dashboardTemplate.menuItems.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                          item.active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {React.createElement(item.icon, {
                          className: "h-3 w-3",
                        })}
                        <span className="truncate">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  <Bell className="h-3 w-3 text-muted-foreground" />
                  <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      JD
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-3 h-full overflow-hidden">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Dashboard
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Overview of your compliance status
                  </p>
                </div>

                {/* Widget Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-full overflow-y-auto">
                  {dashboardTemplate.widgets.slice(0, 6).map((widget) => (
                    <div
                      key={widget.id}
                      className={`${
                        widget.size === "large"
                          ? "md:col-span-2"
                          : widget.size === "medium"
                          ? "md:col-span-1"
                          : "md:col-span-1"
                      }`}
                    >
                      {renderWidget(widget)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedLayout === "hybrid" && (
            <div className="h-80 overflow-hidden rounded-lg border border-border">
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between p-2 bg-primary/10 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
                      <Shield className="h-2.5 w-2.5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-foreground text-xs">
                      Atraiva
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {dashboardTemplate.menuItems
                      .slice(0, 4)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs transition-colors ${
                            item.active
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          }`}
                        >
                          {React.createElement(item.icon, {
                            className: "h-2.5 w-2.5",
                          })}
                          <span className="text-xs">{item.label}</span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Search className="h-2.5 w-2.5 text-muted-foreground" />
                  <Bell className="h-2.5 w-2.5 text-muted-foreground" />
                  <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground">
                      JD
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex h-full">
                {/* Left Sidebar */}
                <div className="w-24 bg-muted/30 border-r border-border p-1.5">
                  <div className="space-y-0.5">
                    {dashboardTemplate.menuItems.slice(4).map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-1 px-1.5 py-1 rounded text-xs transition-colors ${
                          item.active
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                      >
                        {React.createElement(item.icon, {
                          className: "h-2.5 w-2.5",
                        })}
                        <span className="text-xs">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 p-2 overflow-hidden">
                  <div className="mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Dashboard
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Hybrid layout with top nav + sidebar
                    </p>
                  </div>

                  {/* Widget Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1.5 h-full overflow-y-auto">
                    {dashboardTemplate.widgets.slice(0, 4).map((widget) => (
                      <div
                        key={widget.id}
                        className={`${
                          widget.size === "large"
                            ? "md:col-span-2"
                            : widget.size === "medium"
                            ? "md:col-span-1"
                            : "md:col-span-1"
                        }`}
                      >
                        {renderWidget(widget)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Highlight */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-6 border">
        <h4 className="text-lg font-semibold text-foreground mb-4">
          Dashboard Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground">Real-time Updates</h5>
              <p className="text-sm text-muted-foreground">
                Live data synchronization across all widgets
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground">
                Customizable Layout
              </h5>
              <p className="text-sm text-muted-foreground">
                Drag and drop widgets to personalize your view
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground">Role-based Access</h5>
              <p className="text-sm text-muted-foreground">
                See only the data and features relevant to your role
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <h5 className="font-medium text-foreground">Mobile Responsive</h5>
              <p className="text-sm text-muted-foreground">
                Access your dashboard from any device
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button onClick={onNext} className="flex items-center space-x-2">
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
