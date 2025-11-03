import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { AuditLog } from "@/lib/firestore/types";
import { NotificationService } from "@/lib/notification-service";

export class ActivityLogService {
  /**
   * Create a new activity log entry
   */
  static async logActivity(params: {
    organizationId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    action: string;
    category: AuditLog["category"];
    resourceType: string;
    resourceId: string;
    resourceName?: string;
    description: string;
    changes?: { field: string; oldValue?: unknown; newValue?: unknown }[];
    severity?: AuditLog["severity"];
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    success?: boolean;
    errorMessage?: string;
    metadata?: Record<string, unknown>;
  }): Promise<string> {
    try {
      const auditLog: Omit<AuditLog, "id" | "timestamp"> & {
        timestamp: ReturnType<typeof serverTimestamp>;
      } = {
        organizationId: params.organizationId,
        userId: params.userId,
        userName: params.userName,
        userEmail: params.userEmail,
        action: params.action,
        category: params.category,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        resourceName: params.resourceName,
        description: params.description,
        changes: params.changes,
        severity: params.severity || "info",
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        location: params.location,
        timestamp: serverTimestamp(),
        success: params.success ?? true,
        errorMessage: params.errorMessage,
        metadata: params.metadata,
      };

      const docRef = await addDoc(collection(db, "auditLogs"), auditLog);
      return docRef.id;
    } catch (error) {
      console.error("Failed to create activity log:", error);
      // Don't throw - logging should never break the main operation
      return "";
    }
  }

  /**
   * Get activity logs for an organization
   */
  static async getOrganizationActivityLogs(
    organizationId: string,
    limitCount: number = 50
  ): Promise<AuditLog[]> {
    try {
      const q = query(
        collection(db, "auditLogs"),
        where("organizationId", "==", organizationId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp:
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : new Date(data.timestamp),
        } as AuditLog;
      });
    } catch (error) {
      console.error("Failed to fetch organization activity logs:", error);
      return [];
    }
  }

  /**
   * Get activity logs for a specific user
   */
  static async getUserActivityLogs(
    userId: string,
    organizationId?: string,
    limitCount: number = 50
  ): Promise<AuditLog[]> {
    try {
      let q;
      if (organizationId) {
        // User activities within a specific organization
        q = query(
          collection(db, "auditLogs"),
          where("userId", "==", userId),
          where("organizationId", "==", organizationId),
          orderBy("timestamp", "desc"),
          limit(limitCount)
        );
      } else {
        // All user activities across organizations
        q = query(
          collection(db, "auditLogs"),
          where("userId", "==", userId),
          orderBy("timestamp", "desc"),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp:
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : new Date(data.timestamp),
        } as AuditLog;
      });
    } catch (error) {
      console.error("Failed to fetch user activity logs:", error);
      return [];
    }
  }

  /**
   * Get activity logs by category
   */
  static async getActivityLogsByCategory(
    organizationId: string,
    category: AuditLog["category"],
    limitCount: number = 50
  ): Promise<AuditLog[]> {
    try {
      const q = query(
        collection(db, "auditLogs"),
        where("organizationId", "==", organizationId),
        where("category", "==", category),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp:
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : new Date(data.timestamp),
        } as AuditLog;
      });
    } catch (error) {
      console.error("Failed to fetch activity logs by category:", error);
      return [];
    }
  }

  /**
   * Get activity logs for a specific resource
   */
  static async getResourceActivityLogs(
    resourceType: string,
    resourceId: string,
    limitCount: number = 50
  ): Promise<AuditLog[]> {
    try {
      const q = query(
        collection(db, "auditLogs"),
        where("resourceType", "==", resourceType),
        where("resourceId", "==", resourceId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          timestamp:
            data.timestamp instanceof Timestamp
              ? data.timestamp.toDate()
              : new Date(data.timestamp),
        } as AuditLog;
      });
    } catch (error) {
      console.error("Failed to fetch resource activity logs:", error);
      return [];
    }
  }

  /**
   * Helper to log organization creation
   */
  static async logOrganizationCreated(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "created",
      category: "organization",
      resourceType: "organization",
      resourceId: params.organizationId,
      resourceName: params.organizationName,
      description: `Organization "${params.organizationName}" was created`,
      severity: "info",
      metadata: params.metadata,
    });
  }

  /**
   * Helper to log organization updates
   */
  static async logOrganizationUpdated(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    changes: { field: string; oldValue?: unknown; newValue?: unknown }[];
    memberIds?: string[]; // Organization members to notify
  }) {
    // Log the activity
    const logId = await this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "updated",
      category: "organization",
      resourceType: "organization",
      resourceId: params.organizationId,
      resourceName: params.organizationName,
      description: `Organization "${params.organizationName}" was updated`,
      changes: params.changes,
      severity: "info",
    });

    // Notify organization members if provided
    if (params.memberIds && params.memberIds.length > 0) {
      const changesList = params.changes
        .map((c) => c.field.replace(/_/g, " "))
        .join(", ");

      await NotificationService.notifyOrganizationMembers({
        organizationId: params.organizationId,
        organizationName: params.organizationName,
        excludeUserId: params.userId, // Don't notify the admin who made the change
        type: "organization_updated",
        title: `${params.organizationName} Updated`,
        message: `Organization details were updated by ${params.userName}. Changes: ${changesList}`,
        actionBy: params.userId,
        actionByName: params.userName,
        actionByEmail: params.userEmail,
        changes: params.changes,
        memberIds: params.memberIds,
      });
    }

    return logId;
  }

  /**
   * Helper to log member added to organization
   */
  static async logMemberAdded(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    newMemberId: string;
    newMemberName: string;
    newMemberEmail: string;
    role: string;
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "member_added",
      category: "user",
      resourceType: "member",
      resourceId: params.newMemberId,
      resourceName: params.newMemberName,
      description: `${params.newMemberName} (${params.newMemberEmail}) was added as ${params.role}`,
      severity: "info",
      metadata: {
        role: params.role,
        memberEmail: params.newMemberEmail,
      },
    });
  }

  /**
   * Helper to log member removed from organization
   */
  static async logMemberRemoved(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    removedMemberId: string;
    removedMemberName: string;
    removedMemberEmail: string;
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "member_removed",
      category: "user",
      resourceType: "member",
      resourceId: params.removedMemberId,
      resourceName: params.removedMemberName,
      description: `${params.removedMemberName} (${params.removedMemberEmail}) was removed from the organization`,
      severity: "warning",
      metadata: {
        memberEmail: params.removedMemberEmail,
      },
    });
  }

  /**
   * Helper to log member role change
   */
  static async logMemberRoleChanged(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    memberId: string;
    memberName: string;
    memberEmail: string;
    oldRole: string;
    newRole: string;
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "role_changed",
      category: "user",
      resourceType: "member",
      resourceId: params.memberId,
      resourceName: params.memberName,
      description: `${params.memberName}'s role changed from ${params.oldRole} to ${params.newRole}`,
      changes: [
        {
          field: "role",
          oldValue: params.oldRole,
          newValue: params.newRole,
        },
      ],
      severity: "info",
    });
  }

  /**
   * Helper to log user profile update
   */
  static async logUserProfileUpdated(params: {
    organizationId: string;
    userId: string;
    userName: string;
    userEmail: string;
    changes: { field: string; oldValue?: any; newValue?: any }[];
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "profile_updated",
      category: "user",
      resourceType: "user",
      resourceId: params.userId,
      resourceName: params.userName,
      description: `${params.userName} updated their profile`,
      changes: params.changes,
      severity: "info",
    });
  }

  /**
   * Helper to log security event
   */
  static async logSecurityEvent(params: {
    organizationId: string;
    userId: string;
    userName: string;
    userEmail: string;
    action: string;
    description: string;
    severity?: AuditLog["severity"];
    metadata?: Record<string, unknown>;
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: params.action,
      category: "security",
      resourceType: "security",
      resourceId: params.userId,
      resourceName: params.userName,
      description: params.description,
      severity: params.severity || "warning",
      metadata: params.metadata,
    });
  }

  /**
   * Helper to log subscription change
   */
  static async logSubscriptionChanged(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    oldPlan: string;
    newPlan: string;
    oldStatus?: string;
    newStatus?: string;
  }) {
    const changes = [
      {
        field: "plan",
        oldValue: params.oldPlan,
        newValue: params.newPlan,
      },
    ];

    if (params.oldStatus && params.newStatus) {
      changes.push({
        field: "status",
        oldValue: params.oldStatus,
        newValue: params.newStatus,
      });
    }

    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "subscription_changed",
      category: "billing",
      resourceType: "subscription",
      resourceId: params.organizationId,
      resourceName: params.organizationName,
      description: `Subscription changed from ${params.oldPlan} to ${params.newPlan}`,
      changes,
      severity: "info",
    });
  }

  /**
   * Helper to log settings update
   */
  static async logSettingsUpdated(params: {
    organizationId: string;
    organizationName: string;
    userId: string;
    userName: string;
    userEmail: string;
    settingType: string;
    changes: { field: string; oldValue?: any; newValue?: any }[];
  }) {
    return this.logActivity({
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      userEmail: params.userEmail,
      action: "settings_updated",
      category: "settings",
      resourceType: params.settingType,
      resourceId: params.organizationId,
      resourceName: params.organizationName,
      description: `${params.settingType} settings were updated`,
      changes: params.changes,
      severity: "info",
    });
  }
}
