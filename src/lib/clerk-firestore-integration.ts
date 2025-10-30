import { clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { User, Organization } from "@/types/firestore";

/**
 * Clerk-Firestore Integration Service
 * Handles synchronization between Clerk users/organizations and Firestore
 */

export interface ClerkUserData {
  id: string;
  emailAddresses: Array<{ emailAddress: string; id: string }>;
  firstName: string;
  lastName: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
  publicMetadata: Record<string, any>;
  privateMetadata: Record<string, any>;
  unsafeMetadata: Record<string, any>;
}

export interface ClerkOrganizationData {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
  publicMetadata: Record<string, any>;
  privateMetadata: Record<string, any>;
  membersCount: number;
  maxAllowedMemberships: number;
}

export interface ClerkMembershipData {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  permissions: string[];
  createdAt: number;
  updatedAt: number;
  publicMetadata: Record<string, any>;
  privateMetadata: Record<string, any>;
}

export class ClerkFirestoreIntegration {
  /**
   * Sync user from Clerk to Firestore
   */
  static async syncUserToFirestore(clerkUserId: string): Promise<User | null> {
    try {
      // Get user from Clerk
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(clerkUserId);

      if (!clerkUser) {
        console.error("User not found in Clerk:", clerkUserId);
        return null;
      }

      // Get user's organization memberships from Clerk
      let userOrganizations: any[] = [];
      try {
        const memberships = await client.users.getOrganizationMembershipList({
          userId: clerkUserId,
        });

        userOrganizations = memberships.data.map((membership) => ({
          orgId: membership.organization.id,
          role: membership.role,
          permissions: membership.permissions || [],
          isPrimary:
            membership.organization.id === clerkUser.primaryOrganizationId,
          joinedAt: new Date(membership.createdAt),
          updatedAt: new Date(membership.updatedAt),
        }));

        console.log(
          `Found ${userOrganizations.length} organization memberships for user ${clerkUserId}`
        );
      } catch (error: any) {
        // Handle rate limiting gracefully
        if (error?.status === 429) {
          console.warn(
            "Rate limited by Clerk API, skipping organization fetch"
          );
          // Continue with empty organizations array
        } else {
          console.error("Error fetching user organizations:", error);
        }
      }

      // Transform Clerk user to Firestore user format
      const userData: User = {
        id: clerkUser.id,
        auth: {
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          clerkId: clerkUser.id,
          lastSignIn: new Date(clerkUser.lastSignInAt || Date.now()),
          isActive: !clerkUser.banned,
        },
        profile: {
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          displayName: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`.trim(),
          imageUrl: clerkUser.imageUrl || "",
          timezone: "UTC",
          locale: "en-US",
          jobTitle: (clerkUser.publicMetadata?.jobTitle as string) || "",
          username: clerkUser.username || "",
        },
        preferences: {
          theme:
            (clerkUser.unsafeMetadata?.preferences?.theme as
              | "light"
              | "dark"
              | "system") || "system",
          notifications: {
            email:
              (clerkUser.unsafeMetadata?.preferences?.notifications
                ?.email as boolean) || true,
            push:
              (clerkUser.unsafeMetadata?.preferences?.notifications
                ?.push as boolean) || true,
            sms:
              (clerkUser.unsafeMetadata?.preferences?.notifications
                ?.sms as boolean) || false,
          },
          privacy: {
            profileVisibility: "organization",
            dataSharing: false,
          },
        },
        security: {
          mfaEnabled:
            (clerkUser.privateMetadata?.mfaEnabled as boolean) || false,
          lastPasswordChange: new Date(),
          loginAttempts: 0,
          accountLocked: false,
          sessionTimeout:
            (clerkUser.privateMetadata?.sessionTimeout as string) || "30",
          passwordPolicy:
            (clerkUser.privateMetadata?.passwordPolicy as string) || "standard",
        },
        organizations: userOrganizations, // Populated from Clerk memberships
        role: (clerkUser.publicMetadata?.role as string) || "org_viewer",
        userType:
          (clerkUser.publicMetadata?.userType as
            | "law_firm"
            | "enterprise"
            | "channel_partner"
            | "platform_admin") || "enterprise",
        createdAt: new Date(clerkUser.createdAt),
        updatedAt: new Date(clerkUser.updatedAt),
        lastLoginAt: clerkUser.lastSignInAt
          ? new Date(clerkUser.lastSignInAt)
          : new Date(),
        isActive: !clerkUser.banned,
      };

      // Save to Firestore
      const userRef = doc(db, "users", clerkUserId);
      await setDoc(
        userRef,
        {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastLoginAt: userData.lastLoginAt
            ? Timestamp.fromDate(userData.lastLoginAt)
            : null,
          "auth.lastSignIn": Timestamp.fromDate(userData.auth.lastSignIn),
          "security.lastPasswordChange": Timestamp.fromDate(
            userData.security.lastPasswordChange
          ),
        },
        { merge: true }
      );

      console.log("User synced to Firestore:", clerkUserId);
      return userData;
    } catch (error: any) {
      // Handle rate limiting gracefully
      if (error?.status === 429) {
        console.warn("Rate limited by Clerk API, skipping user sync");
        return null;
      }
      console.error("Error syncing user to Firestore:", error);
      throw error;
    }
  }

  /**
   * Sync organization from Clerk to Firestore
   */
  static async syncOrganizationToFirestore(
    clerkOrgId: string
  ): Promise<Organization | null> {
    try {
      // Get organization from Clerk
      const client = await clerkClient();
      const clerkOrg = await client.organizations.getOrganization({
        organizationId: clerkOrgId,
      });

      if (!clerkOrg) {
        console.error("Organization not found in Clerk:", clerkOrgId);
        return null;
      }

      // Transform Clerk organization to Firestore organization format
      const orgData: Organization = {
        id: clerkOrg.id,
        profile: {
          name: clerkOrg.name,
          slug: clerkOrg.slug,
          type: "company", // Default type
          industry: "technology", // Default industry
          size: "medium", // Default size
          description: "",
          website: "",
          logoUrl: clerkOrg.imageUrl || "",
          address: {
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "US",
          },
        },
        subscription: {
          plan: "free", // Default plan
          status: "active",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          cancelAtPeriodEnd: false,
          trialEndsAt: null,
        },
        settings: {
          allowInvitations: true,
          requireEmailVerification: true,
          allowSelfRegistration: false,
          defaultRole: "member",
          dataRetentionDays: 365,
        },
        compliance: {
          regulations: [],
          dataClassification: "internal",
          retentionPolicy: "standard",
          auditLogging: true,
        },
        createdAt: new Date(clerkOrg.createdAt),
        updatedAt: new Date(clerkOrg.updatedAt),
      };

      // Save to Firestore
      const orgRef = doc(db, "organizations", clerkOrgId);
      await setDoc(
        orgRef,
        {
          ...orgData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          "subscription.currentPeriodStart": Timestamp.fromDate(
            orgData.subscription.currentPeriodStart
          ),
          "subscription.currentPeriodEnd": Timestamp.fromDate(
            orgData.subscription.currentPeriodEnd
          ),
        },
        { merge: true }
      );

      console.log("Organization synced to Firestore:", clerkOrgId);
      return orgData;
    } catch (error) {
      console.error("Error syncing organization to Firestore:", error);
      throw error;
    }
  }

  /**
   * Sync organization membership from Clerk to Firestore
   */
  static async syncMembershipToFirestore(
    userId: string,
    organizationId: string,
    role: string = "member",
    permissions: string[] = []
  ): Promise<void> {
    try {
      // Get user document
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User not found in Firestore:", userId);
        return;
      }

      const userData = userDoc.data() as User;

      // Check if membership already exists
      const existingMembership = userData.organizations?.find(
        (org) => org.orgId === organizationId
      );

      if (existingMembership) {
        // Update existing membership
        const updatedOrganizations = userData.organizations.map((org) =>
          org.orgId === organizationId
            ? { ...org, role, permissions, updatedAt: new Date() }
            : org
        );

        await updateDoc(userRef, {
          organizations: updatedOrganizations,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Add new membership
        const newMembership = {
          orgId: organizationId,
          role,
          permissions,
          isPrimary: userData.organizations?.length === 0, // First org is primary
          joinedAt: new Date(),
          updatedAt: new Date(),
        };

        const updatedOrganizations = [
          ...(userData.organizations || []),
          newMembership,
        ];

        await updateDoc(userRef, {
          organizations: updatedOrganizations,
          updatedAt: serverTimestamp(),
        });
      }

      console.log("Membership synced to Firestore:", {
        userId,
        organizationId,
        role,
      });
    } catch (error) {
      console.error("Error syncing membership to Firestore:", error);
      throw error;
    }
  }

  /**
   * Remove organization membership from Firestore
   */
  static async removeMembershipFromFirestore(
    userId: string,
    organizationId: string
  ): Promise<void> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error("User not found in Firestore:", userId);
        return;
      }

      const userData = userDoc.data() as User;
      const updatedOrganizations =
        userData.organizations?.filter((org) => org.orgId !== organizationId) ||
        [];

      // If we removed the primary org, make the first remaining org primary
      if (
        userData.organizations?.some(
          (org) => org.orgId === organizationId && org.isPrimary
        )
      ) {
        if (updatedOrganizations.length > 0) {
          updatedOrganizations[0].isPrimary = true;
        }
      }

      await updateDoc(userRef, {
        organizations: updatedOrganizations,
        updatedAt: serverTimestamp(),
      });

      console.log("Membership removed from Firestore:", {
        userId,
        organizationId,
      });
    } catch (error) {
      console.error("Error removing membership from Firestore:", error);
      throw error;
    }
  }

  /**
   * Update user metadata in Clerk with Firestore data
   */
  static async updateClerkUserMetadata(
    userId: string,
    metadata: Record<string, any>
  ): Promise<void> {
    try {
      const client = await clerkClient();
      await client.users.updateUserMetadata(userId, {
        publicMetadata: {
          atraiva: metadata,
        },
      });

      console.log("Clerk user metadata updated:", userId);
    } catch (error) {
      console.error("Error updating Clerk user metadata:", error);
      throw error;
    }
  }

  /**
   * Get user with organizations from Firestore
   */
  static async getUserWithOrganizations(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data() as User;

      // Get organization details for each membership
      const orgPromises =
        userData.organizations?.map(async (membership) => {
          const orgRef = doc(db, "organizations", membership.orgId);
          const orgDoc = await getDoc(orgRef);

          if (orgDoc.exists()) {
            return {
              ...membership,
              organization: orgDoc.data() as Organization,
            };
          }

          return membership;
        }) || [];

      const organizationsWithDetails = await Promise.all(orgPromises);

      return {
        ...userData,
        organizations: organizationsWithDetails,
      };
    } catch (error) {
      console.error("Error getting user with organizations:", error);
      throw error;
    }
  }

  /**
   * Sync all users and organizations from Clerk to Firestore
   */
  static async syncAllData(): Promise<void> {
    try {
      console.log("Starting full sync from Clerk to Firestore...");

      // Get all users from Clerk
      const client = await clerkClient();
      const users = await client.users.getUserList({ limit: 100 });

      for (const user of users.data) {
        await this.syncUserToFirestore(user.id);

        // Get user's organization memberships
        const memberships = await client.users.getOrganizationMembershipList({
          userId: user.id,
        });

        for (const membership of memberships.data) {
          // Sync organization first
          await this.syncOrganizationToFirestore(membership.organization.id);

          // Then sync membership
          await this.syncMembershipToFirestore(
            user.id,
            membership.organization.id,
            membership.role,
            membership.permissions || []
          );
        }
      }

      console.log("Full sync completed successfully");
    } catch (error) {
      console.error("Error during full sync:", error);
      throw error;
    }
  }

  /**
   * Clean up deleted users and organizations
   */
  static async cleanupDeletedData(): Promise<void> {
    try {
      console.log("Starting cleanup of deleted data...");

      const client = await clerkClient();

      // Get all users from Firestore
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);

      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;

        try {
          // Check if user still exists in Clerk
          await client.users.getUser(userId);
        } catch (error) {
          // User doesn't exist in Clerk, delete from Firestore
          console.log("Deleting user from Firestore:", userId);
          await deleteDoc(doc(db, "users", userId));
        }
      }

      // Get all organizations from Firestore
      const orgsRef = collection(db, "organizations");
      const orgsSnapshot = await getDocs(orgsRef);

      for (const orgDoc of orgsSnapshot.docs) {
        const orgId = orgDoc.id;

        try {
          // Check if organization still exists in Clerk
          await client.organizations.getOrganization({
            organizationId: orgId,
          });
        } catch (error) {
          // Organization doesn't exist in Clerk, delete from Firestore
          console.log("Deleting organization from Firestore:", orgId);
          await deleteDoc(doc(db, "organizations", orgId));
        }
      }

      console.log("Cleanup completed successfully");
    } catch (error) {
      console.error("Error during cleanup:", error);
      throw error;
    }
  }
}
