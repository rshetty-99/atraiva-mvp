import { clerkClient } from "@clerk/nextjs/server";
import { UserService, OrganizationService } from "@/lib/firestore/utils";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";
import { User, Organization } from "@/types/firestore";
import { UserSessionData, OrganizationQuickData } from "@/types/session";

/**
 * Session Service for managing user session metadata
 */
export class SessionService {
  /**
   * Build complete session data from user and organization data
   */
  static async buildSessionData(user: User): Promise<UserSessionData> {
    // Get all organizations the user belongs to
    const organizationPromises = user.organizations.map(
      async (orgMembership) => {
        const org = await OrganizationService.get(orgMembership.orgId);
        if (!org) return null;

        return {
          id: org.id,
          name: org.profile.name,
          type: org.profile.type,
          role: orgMembership.role as any, // Type conversion needed
          permissions: orgMembership.permissions,
          isPrimary: orgMembership.isPrimary,
          industry: org.profile.industry,
          size: org.profile.size,
          plan: org.subscription.plan,
          status: org.subscription.status,
        };
      }
    );

    const organizations = (await Promise.all(organizationPromises)).filter(
      Boolean
    ) as Array<{
      id: string;
      name: string;
      type: "law_firm" | "enterprise" | "channel_partner" | "platform";
      role: any;
      permissions: string[];
      isPrimary: boolean;
      industry?: string;
      size: "startup" | "small" | "medium" | "large" | "enterprise";
      plan: "starter" | "professional" | "enterprise" | "custom";
      status: "trial" | "active" | "suspended" | "cancelled";
    }>;

    // Find primary organization
    const primaryOrgMembership = user.organizations.find(
      (org) => org.isPrimary
    );
    let primaryOrganization = undefined;

    if (primaryOrgMembership) {
      const primaryOrg = await OrganizationService.get(
        primaryOrgMembership.orgId
      );
      if (primaryOrg) {
        primaryOrganization = {
          id: primaryOrg.id,
          name: primaryOrg.profile.name,
          type: primaryOrg.profile.type,
          role: (user.role || primaryOrgMembership.role) as any, // Use user.role first, fallback to membership role
          permissions: primaryOrgMembership.permissions,
          plan: primaryOrg.subscription.plan,
          status: primaryOrg.subscription.status,
          industry: primaryOrg.profile.industry,
          size: primaryOrg.profile.size,
          address: undefined, // Not available in current Organization interface
          logoUrl: primaryOrg.profile.logo,
          website: primaryOrg.profile.website,
          description: undefined, // Not available in current Organization interface
        };
      }
    }

    // Get role-specific capabilities
    const capabilities = this.getRoleCapabilities(
      user.role || primaryOrgMembership?.role || "org_viewer"
    );

    // Get client information for channel partners and law firms
    const clients = await this.getUserClients(
      user.id,
      primaryOrgMembership?.orgId
    );

    return {
      user: {
        id: user.id,
        email: user.auth.email,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        displayName: user.profile.displayName,
        avatar: user.profile.avatar,
        status: user.metadata?.deactivatedAt ? "inactive" : "active",
        jobTitle: user.profile.title,
        department: user.profile.department,
        phone: user.profile.phone,
        timezone: user.preferences?.timezone,
        locale: user.preferences?.language,
      },
      primaryOrganization,
      organizations,
      clients,
      currentClient: clients?.[0], // Default to first client
      preferences: {
        timezone: user.preferences?.timezone,
        language: user.preferences?.language || "en-US",
        theme: user.preferences?.dashboard?.theme,
        notifications: {
          email: user.preferences?.notifications?.email || true,
          sms: user.preferences?.notifications?.sms || false,
          desktop: user.preferences?.notifications?.desktop || true,
          mobile: user.preferences?.notifications?.mobile || true,
        },
        dashboard: {
          layout: "sidebar",
          compactMode: false,
          sidebarCollapsed: false,
          customWidgets: user.preferences?.dashboard?.widgets || [],
          widgetOrder: [],
        },
      },
      security: {
        mfaEnabled: user.security?.mfaEnabled || false,
        requirePasswordChange: user.security?.requirePasswordChange || false,
        lastPasswordChange: user.security?.passwordChangedAt
          ?.toDate()
          .toISOString(),
        loginAttempts: 0, // Not available in current User interface
        accountLocked: false, // Not available in current User interface
        sessionTimeout: undefined, // Not available in current User interface
      },
      capabilities,
      cache: {
        lastUpdated: new Date().toISOString(),
        version: 1,
      },
    };
  }

  /**
   * Update Clerk user metadata with session data
   */
  static async updateClerkMetadata(
    clerkId: string,
    sessionData: UserSessionData
  ): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          atraiva: sessionData,
        },
      });
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error?.status === 429) {
        console.warn("Rate limited by Clerk API, skipping metadata update");
        return;
      }
      console.error("Failed to update Clerk metadata:", error);
      throw error;
    }
  }

  /**
   * Get session data from Clerk metadata
   */
  static async getClerkSessionData(
    clerkId: string
  ): Promise<UserSessionData | null> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(clerkId);
      const metadata = user.publicMetadata?.atraiva as UserSessionData;

      // Check if cache is still valid (24 hours)
      if (metadata?.cache?.lastUpdated) {
        const lastUpdated = new Date(metadata.cache.lastUpdated);
        const now = new Date();
        const hoursSinceUpdate =
          (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

        if (hoursSinceUpdate < 24) {
          return metadata;
        }
      }

      return null;
    } catch (error) {
      console.error("Failed to get Clerk metadata:", error);
      return null;
    }
  }

  /**
   * Process user login and build/cache session data
   */
  static async processLogin(
    clerkId: string,
    forceRefresh = false
  ): Promise<UserSessionData> {
    // Try to get cached session data first (unless force refresh)
    if (!forceRefresh) {
      const cachedData = await this.getClerkSessionData(clerkId);
      if (cachedData) {
        return cachedData;
      }
    }

    // Ensure user is synced to Firestore
    let user = await UserService.getByClerkId(clerkId);
    if (!user) {
      // User doesn't exist in Firestore, sync from Clerk
      console.log("User not found in Firestore, syncing from Clerk:", clerkId);
      user = await ClerkFirestoreIntegration.syncUserToFirestore(clerkId);

      if (!user) {
        throw new Error(`Failed to sync user for Clerk ID: ${clerkId}`);
      }
    }

    // Build fresh session data
    const sessionData = await this.buildSessionData(user);

    // Update Clerk metadata
    await this.updateClerkMetadata(clerkId, sessionData);

    // Update user last activity
    await UserService.updateLastActivity(user.id);
    await UserService.incrementLoginCount(user.id);

    return sessionData;
  }

  /**
   * Invalidate session cache (force refresh on next login)
   */
  static async invalidateSessionCache(clerkId: string): Promise<void> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(clerkId);
      const currentMetadata = user.publicMetadata?.atraiva as UserSessionData;

      if (currentMetadata) {
        currentMetadata.cache.lastUpdated = new Date(0).toISOString(); // Force refresh
        await this.updateClerkMetadata(clerkId, currentMetadata);
      }
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error?.status === 429) {
        console.warn("Rate limited by Clerk API, skipping cache invalidation");
        return;
      }
      console.error("Failed to invalidate session cache:", error);
    }
  }

  /**
   * Update organization membership in session cache
   */
  static async updateOrganizationMembership(
    clerkId: string,
    orgId: string,
    updates: Partial<UserSessionData["organizations"][0]>
  ): Promise<void> {
    const sessionData = await this.getClerkSessionData(clerkId);
    if (!sessionData) return;

    // Update organization in the list
    const orgIndex = sessionData.organizations.findIndex(
      (org) => org.id === orgId
    );
    if (orgIndex >= 0) {
      sessionData.organizations[orgIndex] = {
        ...sessionData.organizations[orgIndex],
        ...updates,
      };
    }

    // Update primary organization if it matches
    if (sessionData.primaryOrganization?.id === orgId) {
      sessionData.primaryOrganization = {
        ...sessionData.primaryOrganization,
        ...updates,
      } as UserSessionData["primaryOrganization"];
    }

    // Update cache timestamp
    sessionData.cache.lastUpdated = new Date().toISOString();
    sessionData.cache.version++;

    await this.updateClerkMetadata(clerkId, sessionData);
  }

  /**
   * Switch user's primary organization
   */
  static async switchPrimaryOrganization(
    clerkId: string,
    newPrimaryOrgId: string
  ): Promise<void> {
    const user = await UserService.getByClerkId(clerkId);
    if (!user) throw new Error("User not found");

    // Update in Firestore
    const updatedOrganizations = user.organizations.map((org) => ({
      ...org,
      isPrimary: org.orgId === newPrimaryOrgId,
    }));

    await UserService.update(user.id, {
      organizations: updatedOrganizations,
    });

    // Invalidate cache to force refresh
    await this.invalidateSessionCache(clerkId);
  }

  /**
   * Get organization quick data for dashboard
   */
  static async getOrganizationQuickData(
    orgId: string,
    userId: string
  ): Promise<OrganizationQuickData | null> {
    const [org, user] = await Promise.all([
      OrganizationService.get(orgId),
      UserService.get(userId),
    ]);

    if (!org || !user) return null;

    const userOrgMembership = user.organizations.find((o) => o.orgId === orgId);
    if (!userOrgMembership) return null;

    return {
      id: org.id,
      name: org.profile.name,
      type: org.profile.type,
      size: org.profile.size,
      logo: org.profile.logo,
      plan: org.subscription.plan,
      status: org.subscription.status,
      seats: {
        total: org.subscription.seats,
        used: org.subscription.usedSeats,
      },
      userRole: userOrgMembership.role,
      userPermissions: userOrgMembership.permissions,
    };
  }

  /**
   * Check if session needs refresh based on cache age
   */
  static shouldRefreshSession(sessionData: UserSessionData): boolean {
    if (!sessionData.cache?.lastUpdated) return true;

    const lastUpdated = new Date(sessionData.cache.lastUpdated);
    const now = new Date();
    const hoursSinceUpdate =
      (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60);

    // Refresh if older than 24 hours
    return hoursSinceUpdate >= 24;
  }

  /**
   * Bulk update multiple users' session cache
   * Useful for organization-wide changes
   */
  static async bulkInvalidateSessionCache(clerkIds: string[]): Promise<void> {
    const promises = clerkIds.map((clerkId) =>
      this.invalidateSessionCache(clerkId).catch((error) =>
        console.error(`Failed to invalidate cache for ${clerkId}:`, error)
      )
    );

    await Promise.all(promises);
  }

  /**
   * Get role-specific capabilities
   */
  private static getRoleCapabilities(
    role: string
  ): UserSessionData["capabilities"] {
    const capabilityMap: Record<string, UserSessionData["capabilities"]> = {
      super_admin: {
        canManageUsers: true,
        canManageOrganizations: true,
        canViewAnalytics: true,
        canManageCompliance: true,
        canManageIncidents: true,
        canManageClients: true,
        canAccessAuditLogs: true,
        canManageSettings: true,
        canExportData: true,
        canCreateReports: true,
      },
      platform_admin: {
        canManageUsers: true,
        canManageOrganizations: true,
        canViewAnalytics: true,
        canManageCompliance: true,
        canManageIncidents: true,
        canManageClients: false,
        canAccessAuditLogs: true,
        canManageSettings: true,
        canExportData: true,
        canCreateReports: true,
      },
      org_admin: {
        canManageUsers: true,
        canManageOrganizations: false,
        canViewAnalytics: true,
        canManageCompliance: true,
        canManageIncidents: true,
        canManageClients: true,
        canAccessAuditLogs: true,
        canManageSettings: true,
        canExportData: true,
        canCreateReports: true,
      },
      org_manager: {
        canManageUsers: false,
        canManageOrganizations: false,
        canViewAnalytics: true,
        canManageCompliance: true,
        canManageIncidents: true,
        canManageClients: true,
        canAccessAuditLogs: false,
        canManageSettings: false,
        canExportData: true,
        canCreateReports: true,
      },
      org_analyst: {
        canManageUsers: false,
        canManageOrganizations: false,
        canViewAnalytics: true,
        canManageCompliance: false,
        canManageIncidents: false,
        canManageClients: false,
        canAccessAuditLogs: false,
        canManageSettings: false,
        canExportData: true,
        canCreateReports: true,
      },
      org_viewer: {
        canManageUsers: false,
        canManageOrganizations: false,
        canViewAnalytics: false,
        canManageCompliance: false,
        canManageIncidents: false,
        canManageClients: false,
        canAccessAuditLogs: false,
        canManageSettings: false,
        canExportData: false,
        canCreateReports: false,
      },
      auditor: {
        canManageUsers: false,
        canManageOrganizations: false,
        canViewAnalytics: true,
        canManageCompliance: false,
        canManageIncidents: false,
        canManageClients: false,
        canAccessAuditLogs: true,
        canManageSettings: false,
        canExportData: true,
        canCreateReports: true,
      },
      channel_partner: {
        canManageUsers: false,
        canManageOrganizations: false,
        canViewAnalytics: true,
        canManageCompliance: true,
        canManageIncidents: true,
        canManageClients: true,
        canAccessAuditLogs: false,
        canManageSettings: false,
        canExportData: true,
        canCreateReports: true,
      },
    };

    return capabilityMap[role] || capabilityMap["org_viewer"];
  }

  /**
   * Get user's clients (for channel partners and law firms)
   */
  private static async getUserClients(
    userId: string,
    orgId?: string
  ): Promise<UserSessionData["clients"]> {
    // This would typically query a clients collection
    // For now, return empty array as placeholder
    return [];
  }

  /**
   * Switch user's current client context
   */
  static async switchClientContext(
    clerkId: string,
    clientId: string
  ): Promise<void> {
    const sessionData = await this.getClerkSessionData(clerkId);
    if (!sessionData || !sessionData.clients) return;

    const client = sessionData.clients.find((c) => c.id === clientId);
    if (!client) return;

    sessionData.currentClient = client;
    sessionData.cache.lastUpdated = new Date().toISOString();
    sessionData.cache.version++;

    await this.updateClerkMetadata(clerkId, sessionData);
  }
}
