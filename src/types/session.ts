import { User, Organization } from "./firestore";

/**
 * User session metadata that's stored in Clerk's user metadata
 * to avoid repeated Firestore calls during authentication
 */
export interface UserSessionData {
  // Core user info
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: string;
    status: "active" | "inactive" | "suspended" | "deleted";
    jobTitle?: string;
    department?: string;
    phone?: string;
    timezone?: string;
    locale?: string;
  };

  // Primary organization (most commonly used)
  primaryOrganization?: {
    id: string;
    name: string;
    type: "law_firm" | "enterprise" | "channel_partner" | "platform";
    role:
      | "super_admin"
      | "platform_admin"
      | "org_admin"
      | "org_manager"
      | "org_analyst"
      | "org_viewer"
      | "auditor"
      | "channel_partner";
    permissions: string[];
    plan: "starter" | "professional" | "enterprise" | "custom";
    status: "trial" | "active" | "suspended" | "cancelled";
    industry?: string;
    size?: "startup" | "small" | "medium" | "large" | "enterprise";
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    logoUrl?: string;
    website?: string;
    description?: string;
  };

  // All organization memberships (for quick access)
  organizations: {
    id: string;
    name: string;
    type: "law_firm" | "enterprise" | "channel_partner" | "platform";
    role:
      | "super_admin"
      | "platform_admin"
      | "org_admin"
      | "org_manager"
      | "org_analyst"
      | "org_viewer"
      | "auditor"
      | "channel_partner";
    permissions: string[];
    isPrimary: boolean;
    industry?: string;
    size?: "startup" | "small" | "medium" | "large" | "enterprise";
    plan?: "starter" | "professional" | "enterprise" | "custom";
    status?: "trial" | "active" | "suspended" | "cancelled";
  }[];

  // Client information (for channel partners and law firms)
  clients?: {
    id: string;
    name: string;
    type: "law_firm" | "enterprise" | "individual";
    status: "active" | "inactive" | "suspended" | "prospect";
    industry?: string;
    size?: "startup" | "small" | "medium" | "large" | "enterprise";
    plan?: "starter" | "professional" | "enterprise" | "custom";
    healthScore?: number; // 0-100
    lastActivity?: string; // ISO timestamp
    complianceScore?: number; // 0-100
    activeBreaches?: number;
    pendingActions?: number;
    logoUrl?: string;
    website?: string;
    contactInfo?: {
      primaryContact?: string;
      email?: string;
      phone?: string;
    };
  }[];

  // Current client context (for channel partners)
  currentClient?: {
    id: string;
    name: string;
    type: "law_firm" | "enterprise" | "individual";
    status: "active" | "inactive" | "suspended" | "prospect";
    industry?: string;
    size?: "startup" | "small" | "medium" | "large" | "enterprise";
    plan?: "starter" | "professional" | "enterprise" | "custom";
    healthScore?: number;
    lastActivity?: string;
    complianceScore?: number;
    activeBreaches?: number;
    pendingActions?: number;
    logoUrl?: string;
    website?: string;
    contactInfo?: {
      primaryContact?: string;
      email?: string;
      phone?: string;
    };
  };

  // User preferences (commonly accessed)
  preferences: {
    timezone?: string;
    language: string;
    theme?: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      sms: boolean;
      desktop: boolean;
      mobile: boolean;
    };
    dashboard: {
      layout?: "sidebar" | "top-nav" | "hybrid" | "mobile-first";
      compactMode?: boolean;
      sidebarCollapsed?: boolean;
      customWidgets?: string[];
      widgetOrder?: string[];
    };
  };

  // Security info
  security: {
    mfaEnabled: boolean;
    requirePasswordChange: boolean;
    lastPasswordChange?: string;
    loginAttempts?: number;
    accountLocked?: boolean;
    sessionTimeout?: string;
  };

  // Role-specific capabilities
  capabilities: {
    canManageUsers: boolean;
    canManageOrganizations: boolean;
    canViewAnalytics: boolean;
    canManageCompliance: boolean;
    canManageIncidents: boolean;
    canManageClients: boolean;
    canAccessAuditLogs: boolean;
    canManageSettings: boolean;
    canExportData: boolean;
    canCreateReports: boolean;
  };

  // User preferences and subscriptions
  preferences?: {
    newsletterSubscribed?: boolean;
    newsletterSubscribedAt?: string; // ISO timestamp
  };

  // Cache metadata
  cache: {
    lastUpdated: string; // ISO timestamp
    version: number; // For cache invalidation
  };
}

/**
 * Extended session data for admin/super admin users
 */
export interface AdminSessionData extends UserSessionData {
  adminAccess: {
    canManageAllOrgs: boolean;
    canAccessPlatformSettings: boolean;
    canViewAnalytics: boolean;
    managedOrgIds: string[];
  };
}

/**
 * Client session data for external API access
 */
export interface ClientSessionData {
  clientId: string;
  clientName: string;
  organizationId: string;
  permissions: string[];
  apiKeyId: string;
  expiresAt: string;
}

/**
 * Context data for the current session
 */
export interface SessionContext {
  user: UserSessionData["user"];
  currentOrganization: UserSessionData["primaryOrganization"];
  organizations: UserSessionData["organizations"];
  clients: UserSessionData["clients"];
  currentClient: UserSessionData["currentClient"];
  preferences: UserSessionData["preferences"];
  security: UserSessionData["security"];
  capabilities: UserSessionData["capabilities"];

  // Helper methods
  hasPermission: (permission: string, orgId?: string) => boolean;
  hasRole: (role: string, orgId?: string) => boolean;
  hasCapability: (capability: keyof UserSessionData["capabilities"]) => boolean;
  switchOrganization: (orgId: string) => Promise<void>;
  switchClient: (clientId: string) => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Organization quick access data
 */
export interface OrganizationQuickData {
  id: string;
  name: string;
  type: Organization["profile"]["type"];
  size: Organization["profile"]["size"];
  logo?: string;
  plan: Organization["subscription"]["plan"];
  status: Organization["subscription"]["status"];
  seats: {
    total: number;
    used: number;
  };
  userRole: "super_admin" | "admin" | "manager" | "analyst" | "viewer";
  userPermissions: string[];
}

/**
 * Login response data
 */
export interface LoginResponse {
  success: boolean;
  user?: UserSessionData;
  error?: string;
  requiresSetup?: boolean; // First-time login
  requiresOrgSelection?: boolean; // Multiple orgs, no primary
}
