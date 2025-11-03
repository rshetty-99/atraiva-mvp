import {
  Shield,
  AlertTriangle,
  FileText,
  Search,
  BarChart3,
  Users,
  Building,
  Eye,
  Database,
  TrendingUp,
  Activity,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Target,
  PieChart,
  Calendar,
  Settings,
  Bell,
  UserPlus,
  RefreshCw,
  Download,
  Plus,
  Zap,
} from "lucide-react";

export interface DashboardWidget {
  id: string;
  type: "chart" | "table" | "metric" | "list" | "custom" | "iframe";
  title: string;
  description?: string;
  position: { x: number; y: number; width: number; height: number };
  data: unknown;
  config: WidgetConfig;
  requiredPermission?: string;
  requiredRole?: string;
  refreshInterval?: number;
  customizable: boolean;
  resizable: boolean;
  icon?: string | React.ComponentType<unknown>;
  category?: string;
}

export interface WidgetConfig {
  chartType?: "line" | "bar" | "pie" | "area" | "scatter" | "doughnut";
  showLegend?: boolean;
  showGrid?: boolean;
  colorScheme?: string;
  dataSource?: string;
  filters?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RoleDashboardConfig {
  [role: string]: {
    layout: {
      template: "sidebar" | "top-nav" | "hybrid" | "mobile-first";
      gridColumns: number;
      theme: "light" | "dark" | "auto" | "custom";
      compactMode: boolean;
      sidebarCollapsible: boolean;
      headerHeight: number;
      footerEnabled: boolean;
    };
    widgets: DashboardWidget[];
    quickActions: QuickAction[];
  };
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string | React.ComponentType<unknown>;
  action: string;
  requiredPermission?: string;
  requiredRole?: string;
  color?: string;
}

// Role-based dashboard configuration based on the PRD
export const roleDashboardConfig: RoleDashboardConfig = {
  // Platform Super Admin Dashboard
  super_admin: {
    layout: {
      template: "sidebar",
      gridColumns: 12,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "platform-overview",
        type: "metric",
        title: "Platform Overview",
        description: "Total organizations and users across the platform",
        position: { x: 0, y: 0, width: 3, height: 2 },
        data: { value: 0, label: "Organizations", change: "+0%" },
        config: { colorScheme: "blue" },
        icon: Building,
        customizable: true,
        resizable: true,
        category: "overview",
      },
      {
        id: "active-users",
        type: "metric",
        title: "Active Users",
        description: "Currently active users across all organizations",
        position: { x: 3, y: 0, width: 3, height: 2 },
        data: { value: 0, label: "Users", change: "+0%" },
        config: { colorScheme: "green" },
        icon: Users,
        customizable: true,
        resizable: true,
        category: "overview",
      },
      {
        id: "system-health",
        type: "metric",
        title: "System Health",
        description: "Overall platform health status",
        position: { x: 6, y: 0, width: 3, height: 2 },
        data: { value: "100%", label: "Uptime", change: "0%" },
        config: { colorScheme: "green" },
        icon: Heart,
        customizable: true,
        resizable: true,
        category: "system",
      },
      {
        id: "security-alerts",
        type: "metric",
        title: "Security Alerts",
        description: "Active security alerts requiring attention",
        position: { x: 9, y: 0, width: 3, height: 2 },
        data: { value: 0, label: "Alerts", change: "0" },
        config: { colorScheme: "red" },
        icon: AlertTriangle,
        customizable: true,
        resizable: true,
        category: "security",
      },
      {
        id: "organization-chart",
        type: "chart",
        title: "Organizations by Type",
        description: "Distribution of organizations by type and status",
        position: { x: 0, y: 2, width: 6, height: 4 },
        data: {
          labels: ["Law Firms", "Enterprises", "Channel Partners"],
          values: [0, 0, 0],
        },
        config: { chartType: "pie", showLegend: true, colorScheme: "default" },
        icon: PieChart,
        customizable: true,
        resizable: true,
        category: "analytics",
      },
      {
        id: "platform-activity",
        type: "chart",
        title: "Platform Activity",
        description: "User activity trends over time",
        position: { x: 6, y: 2, width: 6, height: 4 },
        data: { labels: ["Last 7 days"], values: [0] },
        config: { chartType: "line", showGrid: true, colorScheme: "blue" },
        icon: Activity,
        customizable: true,
        resizable: true,
        category: "analytics",
      },
      {
        id: "recent-organizations",
        type: "table",
        title: "Recent Organizations",
        description: "Recently created or updated organizations",
        position: { x: 0, y: 6, width: 12, height: 4 },
        data: {
          headers: ["Name", "Type", "Status", "Created", "Users"],
          rows: [],
        },
        config: { sortable: true, filterable: true },
        icon: Building,
        customizable: true,
        resizable: true,
        category: "management",
      },
    ],
    quickActions: [
      {
        id: "create-organization",
        label: "Create Organization",
        description: "Add a new organization to the platform",
        icon: Plus,
        action: "/admin/organizations/create",
        color: "blue",
      },
      {
        id: "view-audit-log",
        label: "View Audit Log",
        description: "Review platform-wide audit trail",
        icon: Eye,
        action: "/admin/audit",
        color: "gray",
      },
      {
        id: "system-settings",
        label: "System Settings",
        description: "Configure platform-wide settings",
        icon: Settings,
        action: "/admin/settings",
        color: "gray",
      },
    ],
  },

  // Organization Admin Dashboard
  org_admin: {
    layout: {
      template: "sidebar",
      gridColumns: 12,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "compliance-score",
        type: "metric",
        title: "Compliance Score",
        description: "Overall compliance status for the organization",
        position: { x: 0, y: 0, width: 3, height: 2 },
        data: { value: "--", label: "Score", change: "0%" },
        config: { colorScheme: "yellow" },
        icon: Shield,
        customizable: true,
        resizable: true,
        category: "compliance",
      },
      {
        id: "active-breaches",
        type: "metric",
        title: "Active Breaches",
        description: "Currently active data breach incidents",
        position: { x: 3, y: 0, width: 3, height: 2 },
        data: { value: 0, label: "Breaches", change: "0" },
        config: { colorScheme: "red" },
        icon: AlertTriangle,
        customizable: true,
        resizable: true,
        category: "incidents",
      },
      {
        id: "pii-locations",
        type: "metric",
        title: "PII Locations",
        description: "Number of PII data locations discovered",
        position: { x: 6, y: 0, width: 3, height: 2 },
        data: { value: "--", label: "Locations", change: "0" },
        config: { colorScheme: "blue" },
        icon: Search,
        customizable: true,
        resizable: true,
        category: "data",
      },
      {
        id: "pending-actions",
        type: "metric",
        title: "Pending Actions",
        description: "Actions requiring immediate attention",
        position: { x: 9, y: 0, width: 3, height: 2 },
        data: { value: 0, label: "Actions", change: "0" },
        config: { colorScheme: "purple" },
        icon: Clock,
        customizable: true,
        resizable: true,
        category: "tasks",
      },
      {
        id: "client-portfolio",
        type: "chart",
        title: "Client Portfolio Summary",
        description: "Overview of client compliance status",
        position: { x: 0, y: 2, width: 6, height: 4 },
        data: {
          labels: ["Compliant", "At Risk", "Non-Compliant"],
          values: [0, 0, 0],
        },
        config: {
          chartType: "doughnut",
          showLegend: true,
          colorScheme: "default",
        },
        icon: PieChart,
        customizable: true,
        resizable: true,
        category: "analytics",
      },
      {
        id: "team-activity",
        type: "list",
        title: "Team Activity",
        description: "Recent team member activities",
        position: { x: 6, y: 2, width: 6, height: 4 },
        data: { items: [] },
        config: { maxItems: 10, showTimestamps: true },
        icon: Users,
        customizable: true,
        resizable: true,
        category: "team",
      },
      {
        id: "revenue-metrics",
        type: "chart",
        title: "Revenue Analytics",
        description: "Revenue trends and projections",
        position: { x: 0, y: 6, width: 8, height: 3 },
        data: { labels: ["Last 12 months"], values: [0] },
        config: { chartType: "line", showGrid: true, colorScheme: "green" },
        icon: TrendingUp,
        customizable: true,
        resizable: true,
        category: "business",
      },
      {
        id: "recent-activity",
        type: "list",
        title: "Recent Activity",
        description: "Latest system activities and events",
        position: { x: 8, y: 6, width: 4, height: 3 },
        data: { items: [] },
        config: { maxItems: 5, showTimestamps: true },
        icon: Activity,
        customizable: true,
        resizable: true,
        category: "activity",
      },
    ],
    quickActions: [
      {
        id: "run-pii-scan",
        label: "Run PII Scan",
        description: "Discover personal data across your systems",
        icon: Search,
        action: "/pii/scan",
        color: "blue",
      },
      {
        id: "create-breach-report",
        label: "Create Breach Report",
        description: "Document and track a data incident",
        icon: AlertTriangle,
        action: "/breaches/create",
        color: "red",
      },
      {
        id: "compliance-check",
        label: "Compliance Check",
        description: "Assess regulatory compliance status",
        icon: Shield,
        action: "/compliance/check",
        color: "yellow",
      },
      {
        id: "invite-user",
        label: "Invite User",
        description: "Add a new team member",
        icon: UserPlus,
        action: "/settings/users/invite",
        color: "green",
      },
    ],
  },

  // Organization Manager Dashboard
  org_manager: {
    layout: {
      template: "hybrid",
      gridColumns: 10,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "active-incidents",
        type: "table",
        title: "Active Incidents",
        description: "Currently active incidents requiring attention",
        position: { x: 0, y: 0, width: 6, height: 5 },
        data: {
          headers: ["Incident", "Priority", "Status", "Assignee", "Due Date"],
          rows: [],
        },
        config: { sortable: true, filterable: true, selectable: true },
        icon: AlertTriangle,
        customizable: true,
        resizable: true,
        category: "incidents",
      },
      {
        id: "upcoming-deadlines",
        type: "list",
        title: "Upcoming Deadlines",
        description: "Tasks and deadlines approaching soon",
        position: { x: 6, y: 0, width: 4, height: 5 },
        data: { items: [] },
        config: { maxItems: 8, showTimestamps: true, sortBy: "dueDate" },
        icon: Calendar,
        customizable: true,
        resizable: true,
        category: "tasks",
      },
      {
        id: "task-queue",
        type: "list",
        title: "My Task Queue",
        description: "Tasks assigned to you",
        position: { x: 0, y: 5, width: 5, height: 4 },
        data: { items: [] },
        config: { maxItems: 10, showTimestamps: true, sortBy: "priority" },
        icon: CheckCircle,
        customizable: true,
        resizable: true,
        category: "tasks",
      },
      {
        id: "team-workload",
        type: "chart",
        title: "Team Workload",
        description: "Current team workload distribution",
        position: { x: 5, y: 5, width: 5, height: 4 },
        data: { labels: ["Team Members"], values: [0] },
        config: { chartType: "bar", showLegend: true, colorScheme: "blue" },
        icon: Users,
        customizable: true,
        resizable: true,
        category: "team",
      },
    ],
    quickActions: [
      {
        id: "assign-task",
        label: "Assign Task",
        description: "Assign a task to a team member",
        icon: UserPlus,
        action: "/tasks/assign",
        color: "blue",
      },
      {
        id: "create-incident",
        label: "Create Incident",
        description: "Report a new incident",
        icon: AlertTriangle,
        action: "/incidents/create",
        color: "red",
      },
      {
        id: "team-report",
        label: "Team Report",
        description: "Generate team performance report",
        icon: FileText,
        action: "/reports/team",
        color: "gray",
      },
    ],
  },

  // Organization Analyst Dashboard
  org_analyst: {
    layout: {
      template: "sidebar",
      gridColumns: 12,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "data-overview",
        type: "metric",
        title: "Data Overview",
        description: "Total data sources and records analyzed",
        position: { x: 0, y: 0, width: 3, height: 2 },
        data: { value: "--", label: "Sources", change: "0%" },
        config: { colorScheme: "blue" },
        icon: Database,
        customizable: true,
        resizable: true,
        category: "data",
      },
      {
        id: "pii-discovered",
        type: "metric",
        title: "PII Discovered",
        description: "Personal data locations found",
        position: { x: 3, y: 0, width: 3, height: 2 },
        data: { value: "--", label: "Locations", change: "0" },
        config: { colorScheme: "yellow" },
        icon: Search,
        customizable: true,
        resizable: true,
        category: "data",
      },
      {
        id: "compliance-gaps",
        type: "metric",
        title: "Compliance Gaps",
        description: "Identified compliance issues",
        position: { x: 6, y: 0, width: 3, height: 2 },
        data: { value: "--", label: "Gaps", change: "0" },
        config: { colorScheme: "red" },
        icon: AlertTriangle,
        customizable: true,
        resizable: true,
        category: "compliance",
      },
      {
        id: "analysis-progress",
        type: "metric",
        title: "Analysis Progress",
        description: "Completion status of current analysis",
        position: { x: 9, y: 0, width: 3, height: 2 },
        data: { value: "0%", label: "Complete", change: "0%" },
        config: { colorScheme: "green" },
        icon: Target,
        customizable: true,
        resizable: true,
        category: "progress",
      },
      {
        id: "data-trends",
        type: "chart",
        title: "Data Trends",
        description: "Analysis trends over time",
        position: { x: 0, y: 2, width: 8, height: 4 },
        data: { labels: ["Last 30 days"], values: [0] },
        config: { chartType: "line", showGrid: true, colorScheme: "blue" },
        icon: TrendingUp,
        customizable: true,
        resizable: true,
        category: "analytics",
      },
      {
        id: "analysis-tools",
        type: "list",
        title: "Analysis Tools",
        description: "Available analysis tools and templates",
        position: { x: 8, y: 2, width: 4, height: 4 },
        data: { items: [] },
        config: { maxItems: 8, showTimestamps: false },
        icon: Target,
        customizable: true,
        resizable: true,
        category: "tools",
      },
      {
        id: "recent-exports",
        type: "list",
        title: "Recent Exports",
        description: "Recently exported data and reports",
        position: { x: 0, y: 6, width: 12, height: 3 },
        data: { items: [] },
        config: { maxItems: 5, showTimestamps: true, sortBy: "createdAt" },
        icon: Download,
        customizable: true,
        resizable: true,
        category: "exports",
      },
    ],
    quickActions: [
      {
        id: "start-analysis",
        label: "Start Analysis",
        description: "Begin a new data analysis",
        icon: Target,
        action: "/analysis/start",
        color: "blue",
      },
      {
        id: "export-data",
        label: "Export Data",
        description: "Export analysis results",
        icon: Download,
        action: "/analysis/export",
        color: "green",
      },
      {
        id: "create-report",
        label: "Create Report",
        description: "Generate analysis report",
        icon: FileText,
        action: "/reports/create",
        color: "gray",
      },
    ],
  },

  // Organization Viewer Dashboard
  org_viewer: {
    layout: {
      template: "sidebar",
      gridColumns: 12,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "compliance-status",
        type: "metric",
        title: "Compliance Status",
        description: "Current compliance status",
        position: { x: 0, y: 0, width: 4, height: 2 },
        data: { value: "--", label: "Status", change: "0%" },
        config: { colorScheme: "yellow" },
        icon: Shield,
        customizable: false,
        resizable: false,
        category: "compliance",
      },
      {
        id: "active-breaches",
        type: "metric",
        title: "Active Breaches",
        description: "Currently active breaches",
        position: { x: 4, y: 0, width: 4, height: 2 },
        data: { value: 0, label: "Breaches", change: "0" },
        config: { colorScheme: "red" },
        icon: AlertTriangle,
        customizable: false,
        resizable: false,
        category: "incidents",
      },
      {
        id: "pending-actions",
        type: "metric",
        title: "Pending Actions",
        description: "Actions requiring attention",
        position: { x: 8, y: 0, width: 4, height: 2 },
        data: { value: 0, label: "Actions", change: "0" },
        config: { colorScheme: "purple" },
        icon: Clock,
        customizable: false,
        resizable: false,
        category: "tasks",
      },
      {
        id: "basic-reports",
        type: "list",
        title: "Available Reports",
        description: "Reports you can access",
        position: { x: 0, y: 2, width: 12, height: 4 },
        data: { items: [] },
        config: { maxItems: 10, showTimestamps: false },
        icon: FileText,
        customizable: false,
        resizable: false,
        category: "reports",
      },
    ],
    quickActions: [
      {
        id: "view-reports",
        label: "View Reports",
        description: "Access available reports",
        icon: FileText,
        action: "/reports",
        color: "blue",
      },
    ],
  },

  // Auditor Dashboard
  auditor: {
    layout: {
      template: "sidebar",
      gridColumns: 12,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "audit-progress",
        type: "metric",
        title: "Audit Progress",
        description: "Current audit completion status",
        position: { x: 0, y: 0, width: 3, height: 2 },
        data: { value: "0%", label: "Complete", change: "0%" },
        config: { colorScheme: "blue" },
        icon: Target,
        customizable: false,
        resizable: false,
        category: "progress",
      },
      {
        id: "findings-count",
        type: "metric",
        title: "Findings",
        description: "Total audit findings identified",
        position: { x: 3, y: 0, width: 3, height: 2 },
        data: { value: 0, label: "Findings", change: "0" },
        config: { colorScheme: "red" },
        icon: AlertTriangle,
        customizable: false,
        resizable: false,
        category: "findings",
      },
      {
        id: "compliance-score",
        type: "metric",
        title: "Compliance Score",
        description: "Overall compliance assessment",
        position: { x: 6, y: 0, width: 3, height: 2 },
        data: { value: "--", label: "Score", change: "0%" },
        config: { colorScheme: "yellow" },
        icon: Shield,
        customizable: false,
        resizable: false,
        category: "compliance",
      },
      {
        id: "time-remaining",
        type: "metric",
        title: "Time Remaining",
        description: "Audit access time remaining",
        position: { x: 9, y: 0, width: 3, height: 2 },
        data: { value: "30 days", label: "Remaining", change: "0" },
        config: { colorScheme: "green" },
        icon: Clock,
        customizable: false,
        resizable: false,
        category: "time",
      },
      {
        id: "audit-trail",
        type: "table",
        title: "Audit Trail",
        description: "Comprehensive audit trail access",
        position: { x: 0, y: 2, width: 12, height: 6 },
        data: {
          headers: ["Timestamp", "User", "Action", "Resource", "Result"],
          rows: [],
        },
        config: { sortable: true, filterable: true, readOnly: true },
        icon: Eye,
        customizable: false,
        resizable: false,
        category: "audit",
      },
    ],
    quickActions: [
      {
        id: "export-audit",
        label: "Export Audit",
        description: "Export audit findings and trail",
        icon: Download,
        action: "/audit/export",
        color: "blue",
      },
      {
        id: "generate-report",
        label: "Generate Report",
        description: "Create compliance report",
        icon: FileText,
        action: "/audit/report",
        color: "gray",
      },
    ],
  },

  // Channel Partner Dashboard
  channel_partner: {
    layout: {
      template: "sidebar",
      gridColumns: 12,
      theme: "light",
      compactMode: false,
      sidebarCollapsible: true,
      headerHeight: 64,
      footerEnabled: true,
    },
    widgets: [
      {
        id: "client-selector",
        type: "custom",
        title: "Client Context",
        description: "Currently selected client context",
        position: { x: 0, y: 0, width: 12, height: 1 },
        data: { currentClient: null, availableClients: [] },
        config: { showSwitcher: true, allowSwitch: true },
        icon: Building,
        customizable: false,
        resizable: false,
        category: "context",
      },
      {
        id: "partner-performance",
        type: "metric",
        title: "Partner Performance",
        description: "Overall partner performance metrics",
        position: { x: 0, y: 1, width: 4, height: 3 },
        data: { value: "--", label: "Score", change: "0%" },
        config: { colorScheme: "blue" },
        icon: TrendingUp,
        customizable: true,
        resizable: true,
        category: "performance",
      },
      {
        id: "client-health",
        type: "chart",
        title: "Client Health Score",
        description: "Health status across all clients",
        position: { x: 4, y: 1, width: 4, height: 3 },
        data: { labels: ["Clients"], values: [0] },
        config: { chartType: "bar", showLegend: true, colorScheme: "green" },
        icon: Heart,
        customizable: true,
        resizable: true,
        category: "clients",
      },
      {
        id: "commission-tracker",
        type: "chart",
        title: "Commission Tracking",
        description: "Commission earnings and projections",
        position: { x: 8, y: 1, width: 4, height: 3 },
        data: { labels: ["Last 6 months"], values: [0] },
        config: { chartType: "line", showGrid: true, colorScheme: "green" },
        icon: DollarSign,
        customizable: true,
        resizable: true,
        category: "commission",
      },
      {
        id: "client-list",
        type: "table",
        title: "Client List",
        description: "All clients under management",
        position: { x: 0, y: 4, width: 12, height: 4 },
        data: {
          headers: ["Client", "Status", "Health", "Last Activity", "Actions"],
          rows: [],
        },
        config: { sortable: true, filterable: true, selectable: true },
        icon: Building,
        customizable: true,
        resizable: true,
        category: "clients",
      },
    ],
    quickActions: [
      {
        id: "switch-client",
        label: "Switch Client",
        description: "Change client context",
        icon: RefreshCw,
        action: "/clients/switch",
        color: "blue",
      },
      {
        id: "add-client",
        label: "Add Client",
        description: "Add a new client",
        icon: Plus,
        action: "/clients/add",
        color: "green",
      },
      {
        id: "commission-report",
        label: "Commission Report",
        description: "View commission details",
        icon: DollarSign,
        action: "/commission/report",
        color: "green",
      },
    ],
  },
};

// Helper function to get dashboard configuration for a specific role
export function getDashboardForRole(role: string): {
  layout: RoleDashboardConfig[string]["layout"];
  widgets: DashboardWidget[];
  quickActions: QuickAction[];
} {
  return roleDashboardConfig[role] || roleDashboardConfig["org_viewer"];
}

// Helper function to check if a widget is accessible for a role
export function isWidgetAccessible(
  widget: DashboardWidget,
  userRole: string,
  userPermissions: string[] = []
): boolean {
  // Check role requirement
  if (widget.requiredRole && widget.requiredRole !== userRole) {
    return false;
  }

  // Check permission requirement
  if (
    widget.requiredPermission &&
    !userPermissions.includes(widget.requiredPermission)
  ) {
    return false;
  }

  return true;
}

// Helper function to filter widgets based on role and permissions
export function filterWidgets(
  widgets: DashboardWidget[],
  userRole: string,
  userPermissions: string[] = []
): DashboardWidget[] {
  return widgets.filter((widget) =>
    isWidgetAccessible(widget, userRole, userPermissions)
  );
}

// Helper function to get quick actions for a specific role
export function getQuickActionsForRole(
  role: string,
  userPermissions: string[] = []
): QuickAction[] {
  const config = getDashboardForRole(role);
  return config.quickActions
    .filter((action) => !action.requiredRole || action.requiredRole === role)
    .filter(
      (action) =>
        !action.requiredPermission ||
        userPermissions.includes(action.requiredPermission)
    );
}
