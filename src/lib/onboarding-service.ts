import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";
import {
  User,
  Organization,
  OnboardingData,
  AuditLog,
} from "@/lib/firestore/types";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";
import { SessionService } from "@/lib/session";

/**
 * Onboarding Service
 * Handles the complete onboarding flow including Clerk user creation,
 * organization creation, and Firestore synchronization
 */
export class OnboardingService {
  /**
   * Complete onboarding process
   * 1. Create Clerk user
   * 2. Create Clerk organization
   * 3. Add user to organization
   * 4. Sync data to Firestore
   */
  static async completeOnboarding(
    onboardingData: OnboardingData
  ): Promise<{ userId: string; organizationId: string }> {
    try {
      // Step 1: Create user in Clerk
      const clerkUser = await this.createClerkUser(onboardingData);
      if (!clerkUser) {
        throw new Error("Failed to create Clerk user");
      }

      // Step 2: Create organization in Clerk
      const clerkOrg = await this.createClerkOrganization(onboardingData);
      if (!clerkOrg) {
        throw new Error("Failed to create Clerk organization");
      }

      // Step 3: Add user to organization
      await this.addUserToOrganization(
        clerkUser.id,
        clerkOrg.id,
        onboardingData.role
      );

      // Step 4: Sync user to Firestore
      const firestoreUser = await ClerkFirestoreIntegration.syncUserToFirestore(
        clerkUser.id
      );
      if (!firestoreUser) {
        throw new Error("Failed to sync user to Firestore");
      }

      // Step 5: Create organization in Firestore
      const firestoreOrg = await this.createFirestoreOrganization(
        clerkOrg.id,
        onboardingData,
        clerkUser.id
      );

      // Step 6: Update user with organization and onboarding data
      await this.updateUserWithOnboardingData(
        firestoreUser.id,
        onboardingData,
        firestoreOrg.id
      );

      // Step 7: Update session metadata with proper organization data
      try {
        await SessionService.processLogin(clerkUser.id, true); // Force refresh
        console.log("Session metadata updated successfully");
      } catch (error) {
        console.warn("Failed to update session metadata:", error);
        // Don't fail the onboarding process if session update fails
      }

      // Step 8: Create audit log for onboarding completion
      await this.createOnboardingAuditLog(
        clerkUser.id,
        firestoreOrg.id,
        onboardingData,
        "onboarding_completed"
      );

      return {
        userId: clerkUser.id,
        organizationId: clerkOrg.id,
      };
    } catch (error) {
      console.error("Onboarding failed:", error);
      throw error;
    }
  }

  /**
   * Create user in Clerk
   */
  private static async createClerkUser(onboardingData: OnboardingData) {
    try {
      const client = await clerkClient();

      // Log the data being sent (without password)
      console.log("Creating Clerk user with data:", {
        email: onboardingData.email,
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        username: onboardingData.username,
        hasPassword: !!onboardingData.password,
        userType: onboardingData.userType,
        role: onboardingData.role,
      });

      const user = await client.users.createUser({
        emailAddress: [onboardingData.email],
        firstName: onboardingData.firstName,
        lastName: onboardingData.lastName,
        username: onboardingData.username,
        password: onboardingData.password,
        publicMetadata: {
          userType: onboardingData.userType,
          role: onboardingData.role,
          jobTitle: onboardingData.jobTitle,
        },
        privateMetadata: {
          onboardingCompleted: false,
          mfaEnabled: onboardingData.mfaEnabled,
          mfaMethod: onboardingData.mfaMethod,
          sessionTimeout: onboardingData.sessionTimeout,
          passwordPolicy: onboardingData.passwordPolicy,
        },
        unsafeMetadata: {
          preferences: onboardingData.preferences,
        },
      });

      return user;
    } catch (error: unknown) {
      console.error("Failed to create Clerk user:", error);

      // Log detailed Clerk errors if available
      const clerkError = error && typeof error === "object" && "clerkError" in error && "errors" in error
        ? error as { clerkError: unknown; errors: unknown[] }
        : null;

      if (clerkError?.errors) {
        console.error(
          "Clerk validation errors:",
          JSON.stringify(clerkError.errors, null, 2)
        );

        // Create a more readable error message
        const errorMessages = clerkError.errors
          .map((e: unknown) => {
            if (e && typeof e === "object" && "code" in e && "message" in e) {
              const errObj = e as { code: unknown; message: unknown; meta?: { paramName?: unknown } };
              return `${String(errObj.code)}: ${String(errObj.message)} (${
                errObj.meta?.paramName || "unknown field"
              })`;
            }
            return String(e);
          })
          .join(", ");

        throw new Error(`Clerk validation failed: ${errorMessages}`);
      }

      throw error;
    }
  }

  /**
   * Create organization in Clerk
   */
  private static async createClerkOrganization(onboardingData: OnboardingData) {
    try {
      const client = await clerkClient();
      const slug = this.generateSlug(onboardingData.organizationName);

      console.log("Creating Clerk organization with data:", {
        name: onboardingData.organizationName,
        slug: slug,
        organizationType: onboardingData.organizationType,
        industry: onboardingData.industry,
      });

      const organization = await client.organizations.createOrganization({
        name: onboardingData.organizationName,
        slug: slug,
        publicMetadata: {
          organizationType: onboardingData.organizationType,
          industry: onboardingData.industry,
          teamSize: onboardingData.teamSize,
          country: onboardingData.country,
          state: onboardingData.state,
        },
        privateMetadata: {
          website: onboardingData.website,
          phone: onboardingData.phone,
          address: onboardingData.address,
          city: onboardingData.city,
          zipCode: onboardingData.zipCode,
          description: onboardingData.description,
        },
      });

      console.log("Clerk organization created successfully:", {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      });

      return organization;
    } catch (error: unknown) {
      console.error("Failed to create Clerk organization:", error);

      // Log detailed Clerk errors if available
      const clerkError = error && typeof error === "object" && "clerkError" in error && "errors" in error
        ? error as { clerkError: unknown; errors: unknown[] }
        : null;

      if (clerkError?.errors) {
        console.error(
          "Clerk organization validation errors:",
          JSON.stringify(clerkError.errors, null, 2)
        );

        const errorMessages = clerkError.errors
          .map((e: unknown) => {
            if (e && typeof e === "object" && "code" in e && "message" in e) {
              const errObj = e as { code: unknown; message: unknown; meta?: { paramName?: unknown } };
              return `${String(errObj.code)}: ${String(errObj.message)} (${
                errObj.meta?.paramName || "unknown field"
              })`;
            }
            return String(e);
          })
          .join(", ");

        throw new Error(`Clerk organization creation failed: ${errorMessages}`);
      }

      throw error;
    }
  }

  /**
   * Add user to organization
   */
  private static async addUserToOrganization(
    userId: string,
    organizationId: string,
    role: string
  ) {
    try {
      const client = await clerkClient();

      // Map application roles to Clerk organization roles
      // Clerk uses "org:admin" and "org:member" as organization roles
      const clerkRole =
        role.includes("admin") || role === "admin" ? "org:admin" : "org:member";

      console.log("Adding user to organization:", {
        userId,
        organizationId,
        applicationRole: role,
        clerkRole: clerkRole,
      });

      await client.organizations.createOrganizationMembership({
        organizationId,
        userId,
        role: clerkRole,
      });

      console.log("User added to organization successfully");

      // Update user's private metadata with organization info
      await client.users.updateUser(userId, {
        privateMetadata: {
          primaryOrganizationId: organizationId,
          primaryRole: role,
        },
      });

      console.log("User metadata updated with organization info");
    } catch (error: unknown) {
      console.error("Failed to add user to organization:", error);

      // Log detailed Clerk errors if available
      const clerkError = error && typeof error === "object" && "clerkError" in error && "errors" in error
        ? error as { clerkError: unknown; errors: unknown[] }
        : null;

      if (clerkError?.errors) {
        console.error(
          "Clerk membership errors:",
          JSON.stringify(clerkError.errors, null, 2)
        );

        const errorMessages = clerkError.errors
          .map((e: unknown) => {
            if (e && typeof e === "object" && "code" in e && "message" in e) {
              const errObj = e as { code: unknown; message: unknown; meta?: { paramName?: unknown } };
              return `${String(errObj.code)}: ${String(errObj.message)} (${
                errObj.meta?.paramName || "unknown field"
              })`;
            }
            return String(e);
          })
          .join(", ");

        throw new Error(`Failed to add user to organization: ${errorMessages}`);
      }

      throw error;
    }
  }

  /**
   * Create organization in Firestore
   */
  private static async createFirestoreOrganization(
    clerkOrgId: string,
    onboardingData: OnboardingData,
    ownerId: string
  ): Promise<Organization> {
    try {
      // Map organization type properly
      const organizationType = this.mapOrganizationType(
        onboardingData.organizationType
      );
      const teamSize = this.mapTeamSize(onboardingData.teamSize);

      const orgData: Organization = {
        id: clerkOrgId,
        clerkId: clerkOrgId,
        name: onboardingData.organizationName,
        organizationType,
        industry: onboardingData.industry,
        teamSize,
        website: onboardingData.website || "",
        phone: onboardingData.phone || "",
        address: onboardingData.address || "",
        city: onboardingData.city || "",
        state: onboardingData.state || "",
        zipCode: onboardingData.zipCode || "",
        country: onboardingData.country || "",
        description: onboardingData.description || "",
        settings: {
          applicableRegulations: this.getDefaultRegulations(organizationType),
          subscriptionPlan: "free",
          subscriptionStatus: "active",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
          locale: "en-US",
        },
        members: [
          {
            userId: ownerId,
            role: onboardingData.role,
            permissions: this.getRolePermissions(onboardingData.role),
            joinedAt: new Date(),
            isActive: true,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const orgRef = doc(db, "organizations", clerkOrgId);

      // Remove undefined values before writing to Firestore (recursively)
      const cleanedData = this.removeUndefinedFields({
        ...orgData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        "members.0.joinedAt": serverTimestamp(),
      });

      await setDoc(orgRef, cleanedData);

      return orgData;
    } catch (error) {
      console.error("Failed to create Firestore organization:", error);
      throw error;
    }
  }

  /**
   * Map organization type from onboarding data to Firestore enum
   */
  private static mapOrganizationType(
    type: string
  ):
    | "law_firm"
    | "enterprise"
    | "channel_partner"
    | "government"
    | "nonprofit" {
    const typeMap: Record<
      string,
      "law_firm" | "enterprise" | "channel_partner" | "government" | "nonprofit"
    > = {
      law_firm: "law_firm",
      enterprise: "enterprise",
      channel_partner: "channel_partner",
      government: "government",
      nonprofit: "nonprofit",
    };
    return typeMap[type] || "enterprise";
  }

  /**
   * Map team size from onboarding data to Firestore enum
   */
  private static mapTeamSize(
    size: string
  ): "1-10" | "11-50" | "51-200" | "201-1000" | "1000+" {
    const sizeMap: Record<
      string,
      "1-10" | "11-50" | "51-200" | "201-1000" | "1000+"
    > = {
      "1-10": "1-10",
      "11-50": "11-50",
      "51-200": "51-200",
      "201-1000": "201-1000",
      "1000+": "1000+",
    };
    return sizeMap[size] || "11-50";
  }

  /**
   * Update user with onboarding data
   */
  private static async updateUserWithOnboardingData(
    userId: string,
    onboardingData: OnboardingData,
    organizationId: string
  ) {
    try {
      const userRef = doc(db, "users", userId);
      const now = new Date();

      await updateDoc(userRef, {
        profile: {
          jobTitle: onboardingData.jobTitle,
          username: onboardingData.username,
        },
        role: onboardingData.role,
        userType: onboardingData.userType,
        organizations: [
          {
            orgId: organizationId,
            role: "org:admin", // Primary user from onboarding is always org admin
            permissions: ["*"], // Full permissions for primary user
            isPrimary: true,
            joinedAt: now,
            updatedAt: now,
          },
        ],
        security: {
          mfaEnabled: onboardingData.mfaEnabled,
          sessionTimeout: onboardingData.sessionTimeout,
          passwordPolicy: onboardingData.passwordPolicy,
        },
        preferences: {
          theme:
            onboardingData.preferences.theme === "auto"
              ? "system"
              : onboardingData.preferences.theme,
          notifications: {
            email: onboardingData.emailNotifications ?? true,
            push: onboardingData.preferences.notifications,
            sms: onboardingData.smsNotifications ?? false,
          },
          privacy: {
            profileVisibility: "organization",
            dataSharing: false,
          },
        },
        updatedAt: serverTimestamp(),
      });

      // Update Clerk user metadata to mark onboarding as completed
      const client = await clerkClient();
      await client.users.updateUser(userId, {
        privateMetadata: {
          onboardingCompleted: true,
          organizationId: organizationId,
        },
      });
    } catch (error) {
      console.error("Failed to update user with onboarding data:", error);
      throw error;
    }
  }

  /**
   * Generate organization slug from name
   */
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  /**
   * Get default regulations based on organization type
   */
  private static getDefaultRegulations(organizationType: string): string[] {
    const regulationMap: Record<string, string[]> = {
      law_firm: ["GDPR", "CCPA", "HIPAA", "SOX"],
      enterprise: ["GDPR", "CCPA", "HIPAA", "SOX", "PCI-DSS"],
      channel_partner: ["GDPR", "CCPA"],
      government: ["FISMA", "FedRAMP", "GDPR"],
      nonprofit: ["GDPR", "CCPA"],
    };

    return regulationMap[organizationType] || ["GDPR", "CCPA"];
  }

  /**
   * Remove undefined fields from an object (recursively)
   */
  private static removeUndefinedFields(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeUndefinedFields(item));
    }

    if (typeof obj === "object") {
      const cleaned: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = this.removeUndefinedFields(value);
        }
      }
      return cleaned;
    }

    return obj;
  }

  /**
   * Get permissions for a role
   */
  private static getRolePermissions(role: string): string[] {
    const permissionMap: Record<string, string[]> = {
      admin: ["read", "write", "delete", "manage_users", "manage_settings"],
      compliance_officer: ["read", "write", "manage_incidents"],
      analyst: ["read", "write"],
      viewer: ["read"],
      law_firm_admin: [
        "read",
        "write",
        "delete",
        "manage_users",
        "manage_clients",
      ],
      enterprise_admin: [
        "read",
        "write",
        "delete",
        "manage_users",
        "manage_integrations",
      ],
      channel_partner_admin: ["read", "write", "manage_partners"],
      platform_admin: ["read", "write", "delete", "manage_all"],
    };

    return permissionMap[role] || ["read"];
  }

  /**
   * Check if user has completed onboarding
   */
  static async hasCompletedOnboarding(clerkUserId: string): Promise<boolean> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(clerkUserId);
      return user.privateMetadata?.onboardingCompleted === true;
    } catch (error) {
      console.error("Failed to check onboarding status:", error);
      return false;
    }
  }

  /**
   * Get user's primary organization
   */
  static async getUserPrimaryOrganization(
    clerkUserId: string
  ): Promise<string | null> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(clerkUserId);
      return (user.privateMetadata?.primaryOrganizationId as string) || null;
    } catch (error) {
      console.error("Failed to get primary organization:", error);
      return null;
    }
  }

  /**
   * Create audit log for onboarding events
   */
  private static async createOnboardingAuditLog(
    userId: string,
    organizationId: string,
    onboardingData: OnboardingData,
    action: string
  ): Promise<void> {
    try {
      // Use the new ActivityLogService
      const { ActivityLogService } = await import("@/lib/activity-log-service");

      await ActivityLogService.logActivity({
        organizationId,
        userId,
        userName: `${onboardingData.firstName} ${onboardingData.lastName}`,
        userEmail: onboardingData.email,
        action: "onboarding_completed",
        category: "organization",
        resourceType: "onboarding",
        resourceId: userId,
        resourceName: onboardingData.organizationName,
        description: `Completed onboarding for ${onboardingData.organizationName}`,
        severity: "info",
        userAgent: "onboarding-service",
        metadata: {
          userType: onboardingData.userType,
          role: onboardingData.role,
          organizationName: onboardingData.organizationName,
          organizationType: onboardingData.organizationType,
          mfaEnabled: onboardingData.mfaEnabled,
          industry: onboardingData.industry,
          teamSize: onboardingData.teamSize,
        },
      });

      console.log("Onboarding activity logged successfully");
    } catch (error) {
      console.error("Failed to create onboarding activity log:", error);
      // Don't throw error as audit logging shouldn't block onboarding
    }
  }

  /**
   * Add member to organization (for future use)
   */
  static async addMemberToOrganization(
    organizationId: string,
    userId: string,
    role: string,
    permissions: string[]
  ): Promise<void> {
    try {
      const orgRef = doc(db, "organizations", organizationId);
      const orgDoc = await getDoc(orgRef);

      if (!orgDoc.exists()) {
        throw new Error("Organization not found");
      }

      const orgData = orgDoc.data() as Organization;
      const newMember = {
        userId,
        role,
        permissions,
        joinedAt: new Date(),
        isActive: true,
      };

      // Check if user is already a member
      const existingMemberIndex = orgData.members.findIndex(
        (m) => m.userId === userId
      );
      if (existingMemberIndex >= 0) {
        // Update existing member
        orgData.members[existingMemberIndex] = newMember;
      } else {
        // Add new member
        orgData.members.push(newMember);
      }

      await updateDoc(orgRef, {
        members: orgData.members,
        updatedAt: serverTimestamp(),
      });

      // Update user's organizations array
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        const orgExists = userData.organizations.some(
          (org) => org.orgId === organizationId
        );

        if (!orgExists) {
          const now = new Date();
          await updateDoc(userRef, {
            organizations: [
              ...userData.organizations,
              {
                orgId: organizationId,
                role: role || "org:member",
                permissions: permissions || [],
                isPrimary: userData.organizations.length === 0, // First org is primary
                joinedAt: now,
                updatedAt: now,
              },
            ],
            updatedAt: serverTimestamp(),
          });
        }
      }

      console.log("Member added to organization:", {
        organizationId,
        userId,
        role,
      });
    } catch (error) {
      console.error("Failed to add member to organization:", error);
      throw error;
    }
  }
}
