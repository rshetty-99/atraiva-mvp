"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { UserSessionData, SessionContext } from "@/types/session";

/**
 * Custom hook for accessing user session data with organization context
 * Leverages Clerk's cached metadata to avoid repeated Firestore calls
 */
export function useSession(): {
  session: SessionContext | null;
  loading: boolean;
  error: string | null;
  refreshSession: () => Promise<void>;
} {
  const { user: clerkUser, isLoaded } = useUser();
  const [sessionData, setSessionData] = useState<UserSessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract session data from Clerk user metadata
  useEffect(() => {
    if (!isLoaded) return;

    try {
      if (clerkUser?.publicMetadata?.atraiva) {
        const metadata = clerkUser.publicMetadata.atraiva as UserSessionData;
        setSessionData(metadata);
        setError(null);
      } else if (clerkUser) {
        // User exists but no cached session data - might be first login
        setError("Session data not available");
      } else {
        // No user logged in
        setSessionData(null);
        setError(null);
      }
    } catch (err) {
      console.error("Error parsing session data:", err);
      setError("Error parsing session data");
    } finally {
      setLoading(false);
    }
  }, [clerkUser, isLoaded]);

  // Force refresh session data from server
  const refreshSession = useCallback(async () => {
    if (!clerkUser?.id) return;

    setLoading(true);
    try {
      const response = await fetch("/api/session/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clerkId: clerkUser.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh session");
      }

      // Reload Clerk user to get updated metadata
      await clerkUser.reload();
    } catch (err) {
      console.error("Error refreshing session:", err);
      setError("Failed to refresh session");
    } finally {
      setLoading(false);
    }
  }, [clerkUser]);

  // Switch to a different organization
  const switchOrganization = useCallback(
    async (orgId: string) => {
      if (!clerkUser?.id || !sessionData) return;

      try {
        const response = await fetch("/api/session/switch-organization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: clerkUser.id, orgId }),
        });

        if (!response.ok) {
          throw new Error("Failed to switch organization");
        }

        // Refresh session to get updated data
        await refreshSession();
      } catch (err) {
        console.error("Error switching organization:", err);
        throw err;
      }
    },
    [clerkUser?.id, sessionData, refreshSession]
  );

  // Permission checking helper
  const hasPermission = useCallback(
    (permission: string, orgId?: string): boolean => {
      if (!sessionData) return false;

      const targetOrgId = orgId || sessionData.primaryOrganization?.id;
      if (!targetOrgId) return false;

      const org = sessionData.organizations.find((o) => o.id === targetOrgId);
      if (!org) return false;

      // Super admin has all permissions
      if (org.role === "super_admin") return true;

      // Check specific permission
      return (
        org.permissions.includes(permission) || org.permissions.includes("*")
      );
    },
    [sessionData]
  );

  // Role checking helper
  const hasRole = useCallback(
    (role: string, orgId?: string): boolean => {
      if (!sessionData) return false;

      const targetOrgId = orgId || sessionData.primaryOrganization?.id;
      if (!targetOrgId) return false;

      const org = sessionData.organizations.find((o) => o.id === targetOrgId);
      return org?.role === role;
    },
    [sessionData]
  );

  // Capability checking helper
  const hasCapability = useCallback(
    (capability: keyof UserSessionData["capabilities"]): boolean => {
      if (!sessionData?.capabilities) return false;
      return sessionData.capabilities[capability] || false;
    },
    [sessionData]
  );

  // Switch client context
  const switchClient = useCallback(
    async (clientId: string) => {
      if (!clerkUser?.id || !sessionData) return;

      try {
        const response = await fetch("/api/session/switch-client", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: clerkUser.id, clientId }),
        });

        if (!response.ok) {
          throw new Error("Failed to switch client");
        }

        // Refresh session to get updated data
        await refreshSession();
      } catch (err) {
        console.error("Error switching client:", err);
        throw err;
      }
    },
    [clerkUser?.id, sessionData, refreshSession]
  );

  // Build session context object
  const session: SessionContext | null = sessionData
    ? {
        user: sessionData.user,
        currentOrganization: sessionData.primaryOrganization,
        organizations: sessionData.organizations,
        clients: sessionData.clients,
        currentClient: sessionData.currentClient,
        preferences: sessionData.preferences,
        security: sessionData.security,
        capabilities: sessionData.capabilities,
        hasPermission,
        hasRole,
        hasCapability,
        switchOrganization,
        switchClient,
        refreshSession,
      }
    : null;

  return {
    session,
    loading,
    error,
    refreshSession,
  };
}

/**
 * Hook for accessing current organization data
 */
export function useCurrentOrganization() {
  const { session } = useSession();

  return {
    organization: session?.currentOrganization,
    hasOrganization: !!session?.currentOrganization,
    isMultiOrg: (session?.organizations.length || 0) > 1,
  };
}

/**
 * Hook for checking permissions in current organization
 */
export function usePermissions(permissions: string | string[]) {
  const { session } = useSession();

  const permissionList = Array.isArray(permissions)
    ? permissions
    : [permissions];

  const hasAllPermissions = permissionList.every(
    (permission) => session?.hasPermission(permission) || false
  );

  const hasAnyPermission = permissionList.some(
    (permission) => session?.hasPermission(permission) || false
  );

  return {
    hasAllPermissions,
    hasAnyPermission,
    checkPermission: session?.hasPermission || (() => false),
  };
}

/**
 * Hook for role-based access control
 */
export function useRole(role?: string) {
  const { session } = useSession();

  const currentRole = session?.currentOrganization?.role;
  const hasRole = role ? session?.hasRole(role) || false : false;

  // Role hierarchy for comparison
  const roleHierarchy = {
    viewer: 1,
    analyst: 2,
    manager: 3,
    admin: 4,
    super_admin: 5,
  };

  const hasMinimumRole = (minimumRole: string): boolean => {
    if (!currentRole) return false;
    const currentLevel =
      roleHierarchy[currentRole as keyof typeof roleHierarchy] || 0;
    const minimumLevel =
      roleHierarchy[minimumRole as keyof typeof roleHierarchy] || 0;
    return currentLevel >= minimumLevel;
  };

  return {
    role: currentRole,
    hasRole,
    hasMinimumRole,
    isAdmin: currentRole === "admin" || currentRole === "super_admin",
    isSuperAdmin: currentRole === "super_admin",
  };
}
