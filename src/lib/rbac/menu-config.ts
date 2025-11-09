import React from "react";
import {
  Shield,
  AlertTriangle,
  FileText,
  Search,
  BarChart3,
  Settings,
  Users,
  User,
  UserCheck,
  Building,
  Eye,
  Database,
  TrendingUp,
  Key,
  Activity,
  Lock,
  Monitor,
  Zap,
  Target,
  Calendar,
  Bell,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Download,
  Plus,
  HelpCircle,
  MessageSquare,
  Heart,
  DollarSign,
  Palette,
  CreditCard,
  Link2,
  UserPlus,
  AlertOctagon,
  ClipboardCheck,
  PieChart,
  Gavel,
  Archive,
  Building2,
  PlugZap,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

export interface MenuItem {
  id: string;
  label: string;
  name?: string; // For project items
  icon: React.ComponentType<any>;
  route: string;
  requiredPermission?: string;
  requiredRole?: string;
  badge?: string | number;
  children?: MenuItem[];
  isActive?: boolean;
  order: number;
  category?: string;
  description?: string;
}

export interface RoleMenuConfig {
  [role: string]: {
    mainMenu: MenuItem[];
    projects: MenuItem[];
    adminMenu?: MenuItem[];
  };
}

// Role-based menu configuration based on the PRD
export const roleMenuConfig: RoleMenuConfig = {
  // Platform Super Admin - Complete platform control
  super_admin: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "Platform-wide analytics and monitoring",
        category: "main",
      },
      // Risk & Compliance Section
      {
        id: "incidents",
        label: "Breach Simulation",
        icon: AlertOctagon,
        route: "/admin/incidents",
        order: 2,
        description: "Breach simulation and management",
        category: "Risk & Compliance",
      },
      {
        id: "compliance",
        label: "Compliance",
        icon: ClipboardCheck,
        route: "/admin/compliance",
        order: 3,
        description: "Platform compliance management",
        category: "Risk & Compliance",
      },
      {
        id: "exposure-analysis",
        label: "Exposure Analysis",
        icon: PieChart,
        route: "/admin/exposure-analysis",
        order: 4,
        description: "Analyze data exposure",
        category: "Risk & Compliance",
      },
      {
        id: "regulations",
        label: "Regulations",
        icon: Gavel,
        route: "/admin/regulations",
        order: 5,
        description: "Regulatory frameworks and updates",
        category: "Risk & Compliance",
      },
      // Business Intelligence Section
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        route: "/admin/analytics",
        order: 6,
        description: "Business intelligence and analytics",
        category: "Business Intelligence",
      },
      {
        id: "audits-reports",
        label: "Audits & Reports",
        icon: Archive,
        route: "/admin/audits-reports",
        order: 7,
        description: "Audit trails and reporting",
        category: "Business Intelligence",
      },
      // Management Section
      {
        id: "organization",
        label: "Organization",
        icon: Users,
        route: "/admin/organization",
        order: 8,
        description: "Organization management",
        category: "Management",
      },
      {
        id: "members",
        label: "Members",
        icon: Users,
        route: "/admin/members",
        order: 9,
        description: "Member management across organizations",
        category: "Management",
      },
      {
        id: "registration-management",
        label: "Registration Management",
        icon: UserPlus,
        route: "/admin/registration-management",
        order: 10,
        description: "Create and manage organization registration links",
        category: "Management",
      },
      {
        id: "blog",
        label: "Blog",
        icon: FileText,
        route: "/admin/blog",
        order: 11,
        description: "Manage blog content",
        category: "Management",
      },
      {
        id: "state-regulations",
        label: "State Regulations",
        icon: Gavel,
        route: "/admin/reference/state-regulations",
        order: 12,
        description: "State data breach notification laws and regulations",
        category: "Reference",
      },
      {
        id: "pii-elements",
        label: "PII Elements",
        icon: Shield,
        route: "/admin/reference/pii-elements",
        order: 13,
        description: "Manage PII element reference database",
        category: "Reference",
      },
      // System Section
      {
        id: "integrations-licenses",
        label: "Integrations and Licenses",
        icon: PlugZap,
        route: "/admin/integrations-licenses",
        order: 14,
        description: "System integrations and license management",
        category: "System",
      },
    ],
    projects: [
      {
        id: "platform-monitoring",
        label: "Platform Monitoring",
        name: "Platform Monitoring",
        icon: Activity,
        route: "/admin/monitoring",
        order: 1,
      },
      {
        id: "system-health",
        label: "System Health",
        name: "System Health",
        icon: Heart,
        route: "/admin/health",
        order: 2,
      },
      {
        id: "performance",
        label: "Performance",
        name: "Performance",
        icon: TrendingUp,
        route: "/admin/performance",
        order: 3,
      },
    ],
  },

  // Platform Admin - Platform operations and support
  platform_admin: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "Platform operations overview",
        category: "main",
      },
      // Risk & Compliance Section
      {
        id: "incidents",
        label: "Breach Simulation",
        icon: AlertOctagon,
        route: "/admin/incidents",
        order: 2,
        description: "Breach simulation and management",
        category: "Risk & Compliance",
      },
      {
        id: "compliance",
        label: "Compliance",
        icon: ClipboardCheck,
        route: "/admin/compliance",
        order: 3,
        description: "Platform compliance management",
        category: "Risk & Compliance",
      },
      {
        id: "exposure-analysis",
        label: "Exposure Analysis",
        icon: PieChart,
        route: "/admin/exposure-analysis",
        order: 4,
        description: "Analyze data exposure",
        category: "Risk & Compliance",
      },
      {
        id: "regulations",
        label: "Regulations",
        icon: Gavel,
        route: "/admin/regulations",
        order: 5,
        description: "Regulatory frameworks and updates",
        category: "Risk & Compliance",
      },
      // Business Intelligence Section
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        route: "/admin/analytics",
        order: 6,
        description: "Business intelligence and analytics",
        category: "Business Intelligence",
      },
      {
        id: "audits-reports",
        label: "Audits & Reports",
        icon: Archive,
        route: "/admin/audits-reports",
        order: 7,
        description: "Audit trails and reporting",
        category: "Business Intelligence",
      },
      // Management Section
      {
        id: "organization",
        label: "Organization",
        icon: Users,
        route: "/admin/organization",
        order: 8,
        description: "Organization management",
        category: "Management",
      },
      {
        id: "members",
        label: "Members",
        icon: Users,
        route: "/admin/members",
        order: 9,
        description: "Member management across organizations",
        category: "Management",
      },
      {
        id: "registration-management",
        label: "Registration Management",
        icon: UserPlus,
        route: "/admin/registration-management",
        order: 10,
        description: "Create and manage organization registration links",
        category: "Management",
      },
      {
        id: "blog",
        label: "Blog",
        icon: FileText,
        route: "/admin/blog",
        order: 11,
        description: "Manage blog content",
        category: "Management",
      },
      {
        id: "state-regulations",
        label: "State Regulations",
        icon: Gavel,
        route: "/admin/reference/state-regulations",
        order: 12,
        description: "State data breach notification laws and regulations",
        category: "Reference",
      },
      {
        id: "pii-elements",
        label: "PII Elements",
        icon: Shield,
        route: "/admin/reference/pii-elements",
        order: 13,
        description: "Manage PII element reference database",
        category: "Reference",
      },
      // System Section
      {
        id: "integrations-licenses",
        label: "Integrations and Licenses",
        icon: PlugZap,
        route: "/admin/integrations-licenses",
        order: 14,
        description: "System integrations and license management",
        category: "System",
      },
    ],
    projects: [
      {
        id: "platform-health",
        label: "Platform Health",
        name: "Platform Health",
        icon: Heart,
        route: "/admin/health",
        order: 1,
      },
      {
        id: "user-support",
        label: "User Support",
        name: "User Support",
        icon: Users,
        route: "/admin/support",
        order: 2,
      },
    ],
  },

  // Organization Admin - Complete organization control
  org_admin: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "Organization dashboard and analytics",
        category: "main",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        route: "/org/profile",
        order: 2,
        description: "Organization profile and settings",
        category: "main",
      },
      {
        id: "reports",
        label: "Reports",
        icon: BarChart3,
        route: "/org/reports",
        order: 3,
        description: "Compliance and data reports",
        category: "main",
      },
      {
        id: "incidents",
        label: "Breach Simulation",
        icon: AlertOctagon,
        route: "/org/incidents",
        order: 4,
        description: "Breach simulation and management",
        category: "main",
        children: [
          {
            id: "view-incidents",
            label: "View Incidents",
            icon: AlertOctagon,
            route: "/org/incidents",
            order: 1,
          },
          {
            id: "report-incident",
            label: "Report Incident",
            icon: Plus,
            route: "/org/incident",
            order: 2,
          },
        ],
      },
      {
        id: "breach-exposure",
        label: "Breach Exposure",
        icon: ShieldCheck,
        route: "/org/breach-exposure",
        order: 5,
        description: "Monitor exposure and response readiness",
        category: "main",
      },
      {
        id: "users",
        label: "Users",
        icon: Users,
        route: "/org/users",
        order: 6,
        description: "User management and roles",
        category: "main",
      },
      {
        id: "payment",
        label: "Payment",
        icon: CreditCard,
        route: "/org/payment",
        order: 7,
        description: "Billing and subscription",
        category: "main",
      },
    ],
    projects: [],
  },

  // Organization Manager - Operational management
  org_manager: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "Operations dashboard and analytics",
        category: "main",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        route: "/org/profile",
        order: 2,
        description: "Your profile and settings",
        category: "main",
      },
      {
        id: "reports",
        label: "Reports",
        icon: BarChart3,
        route: "/org/reports",
        order: 3,
        description: "View and generate reports",
        category: "main",
      },
      {
        id: "incidents",
        label: "Breach Simulation",
        icon: AlertOctagon,
        route: "/org/incidents",
        order: 4,
        description: "Breach simulation and management",
        category: "main",
        children: [
          {
            id: "view-incidents",
            label: "View Incidents",
            icon: AlertOctagon,
            route: "/org/incidents",
            order: 1,
          },
          {
            id: "report-incident",
            label: "Report Incident",
            icon: Plus,
            route: "/org/incident",
            order: 2,
          },
        ],
      },
      {
        id: "users",
        label: "Users",
        icon: Users,
        route: "/org/users",
        order: 5,
        description: "View and manage team",
        category: "main",
      },
    ],
    projects: [],
  },

  // Organization Analyst - Data analysis and support
  org_analyst: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "Analytics dashboard",
        category: "main",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        route: "/org/profile",
        order: 2,
        description: "Your profile and settings",
        category: "main",
      },
      {
        id: "reports",
        label: "Reports",
        icon: BarChart3,
        route: "/org/reports",
        order: 3,
        description: "View and analyze reports",
        category: "main",
      },
      {
        id: "incidents",
        label: "Breach Simulation",
        icon: AlertOctagon,
        route: "/org/incidents",
        order: 4,
        description: "Breach simulation and management",
        category: "main",
      },
    ],
    projects: [],
  },

  // Organization Viewer - Basic dashboard access
  org_viewer: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "View dashboard",
        category: "main",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        route: "/org/profile",
        order: 2,
        description: "Your profile",
        category: "main",
      },
      {
        id: "reports",
        label: "Reports",
        icon: BarChart3,
        route: "/org/reports",
        order: 3,
        description: "View reports",
        category: "main",
      },
    ],
    projects: [],
  },

  // Auditor - Time-limited audit access
  auditor: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: "/dashboard",
        order: 1,
        description: "Audit dashboard",
        category: "main",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        route: "/org/profile",
        order: 2,
        description: "Your profile",
        category: "main",
      },
      {
        id: "reports",
        label: "Reports",
        icon: BarChart3,
        route: "/org/reports",
        order: 3,
        description: "Audit reports",
        category: "main",
      },
      {
        id: "incidents",
        label: "Breach Simulation",
        icon: AlertOctagon,
        route: "/org/incidents",
        order: 4,
        description: "Breach simulation and management",
        category: "main",
      },
    ],
    projects: [],
  },

  // Channel Partner - Multi-client management
  channel_partner: {
    mainMenu: [
      {
        id: "dashboard",
        label: "Partner Dashboard",
        icon: BarChart3,
        route: "/dashboard",
        order: 1,
        description: "Multi-client management overview",
      },
      {
        id: "clients",
        label: "Clients",
        icon: Building,
        route: "/clients",
        order: 2,
        children: [
          {
            id: "client-list",
            label: "Client List",
            icon: Building,
            route: "/clients",
            order: 1,
          },
          {
            id: "client-switcher",
            label: "Switch Client",
            icon: RefreshCw,
            route: "/clients/switch",
            order: 2,
          },
        ],
      },
      {
        id: "compliance",
        label: "Compliance",
        icon: Shield,
        route: "/compliance",
        order: 3,
        children: [
          {
            id: "client-compliance",
            label: "Client Compliance",
            icon: Shield,
            route: "/compliance",
            order: 1,
          },
        ],
      },
      {
        id: "partner-analytics",
        label: "Partner Analytics",
        icon: TrendingUp,
        route: "/analytics",
        order: 4,
        children: [
          {
            id: "performance",
            label: "Performance",
            icon: BarChart3,
            route: "/analytics/performance",
            order: 1,
          },
          {
            id: "commission",
            label: "Commission",
            icon: DollarSign,
            route: "/analytics/commission",
            order: 2,
          },
        ],
      },
      {
        id: "settings",
        label: "Partner Settings",
        icon: Settings,
        route: "/settings",
        order: 5,
        children: [
          {
            id: "branding",
            label: "Branding",
            icon: Palette,
            route: "/settings/branding",
            order: 1,
          },
          {
            id: "billing",
            label: "Billing",
            icon: CreditCard,
            route: "/settings/billing",
            order: 2,
          },
        ],
      },
    ],
    projects: [
      {
        id: "client-health",
        label: "Client Health",
        name: "Client Health",
        icon: Heart,
        route: "/clients/health",
        order: 1,
      },
      {
        id: "commission-tracking",
        label: "Commission Tracking",
        name: "Commission Tracking",
        icon: DollarSign,
        route: "/commission",
        order: 2,
      },
    ],
  },
};

// Helper function to get menu items for a specific role
export function getMenuForRole(role: string): {
  mainMenu: MenuItem[];
  projects: MenuItem[];
  adminMenu?: MenuItem[];
} {
  return roleMenuConfig[role] || roleMenuConfig["org_viewer"];
}

// Helper function to check if a menu item is accessible for a role
export function isMenuItemAccessible(
  menuItem: MenuItem,
  userRole: string,
  userPermissions: string[] = []
): boolean {
  // Check role requirement
  if (menuItem.requiredRole && menuItem.requiredRole !== userRole) {
    return false;
  }

  // Check permission requirement
  if (
    menuItem.requiredPermission &&
    !userPermissions.includes(menuItem.requiredPermission)
  ) {
    return false;
  }

  return true;
}

// Helper function to filter menu items based on role and permissions
export function filterMenuItems(
  menuItems: MenuItem[],
  userRole: string,
  userPermissions: string[] = []
): MenuItem[] {
  return menuItems
    .filter((item) => isMenuItemAccessible(item, userRole, userPermissions))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterMenuItems(item.children, userRole, userPermissions)
        : undefined,
    }))
    .filter((item) => !item.children || item.children.length > 0); // Remove items with no accessible children
}
