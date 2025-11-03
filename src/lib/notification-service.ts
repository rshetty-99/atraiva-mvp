import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Notification } from "@/lib/firestore/types";

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(params: {
    userId: string;
    organizationId: string;
    type: Notification["type"];
    category: Notification["category"];
    priority: Notification["priority"];
    title: string;
    message: string;
    actionBy?: string;
    actionByName?: string;
    actionByEmail?: string;
    resourceType?: string;
    resourceId?: string;
    resourceName?: string;
    changes?: { field: string; oldValue?: unknown; newValue?: unknown }[];
    actionUrl?: string;
    expiresAt?: Date;
    metadata?: Record<string, unknown>;
  }): Promise<string> {
    try {
      const notification: Omit<Notification, "id" | "createdAt"> & {
        createdAt: ReturnType<typeof serverTimestamp>;
      } = {
        userId: params.userId,
        organizationId: params.organizationId,
        type: params.type,
        category: params.category,
        priority: params.priority,
        title: params.title,
        message: params.message,
        actionBy: params.actionBy,
        actionByName: params.actionByName,
        actionByEmail: params.actionByEmail,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        resourceName: params.resourceName,
        changes: params.changes,
        status: "unread",
        actionUrl: params.actionUrl,
        createdAt: serverTimestamp(),
        expiresAt: params.expiresAt,
        metadata: params.metadata,
      };

      const docRef = await addDoc(
        collection(db, "notifications"),
        notification
      );
      return docRef.id;
    } catch (error) {
      console.error("Failed to create notification:", error);
      // Don't throw - notification creation should never break the main operation
      return "";
    }
  }

  /**
   * Notify all organization members about organization changes
   */
  static async notifyOrganizationMembers(params: {
    organizationId: string;
    organizationName: string;
    excludeUserId?: string; // Don't notify the user who made the change
    type: Notification["type"];
    title: string;
    message: string;
    actionBy?: string;
    actionByName?: string;
    actionByEmail?: string;
    changes?: { field: string; oldValue?: unknown; newValue?: unknown }[];
    actionUrl?: string;
    memberIds: string[];
  }): Promise<string[]> {
    const notificationIds: string[] = [];

    for (const memberId of params.memberIds) {
      // Skip the user who made the change
      if (params.excludeUserId && memberId === params.excludeUserId) {
        continue;
      }

      try {
        const notificationId = await this.createNotification({
          userId: memberId,
          organizationId: params.organizationId,
          type: params.type,
          category: "organization",
          priority: "medium",
          title: params.title,
          message: params.message,
          actionBy: params.actionBy,
          actionByName: params.actionByName,
          actionByEmail: params.actionByEmail,
          resourceType: "organization",
          resourceId: params.organizationId,
          resourceName: params.organizationName,
          changes: params.changes,
          actionUrl:
            params.actionUrl || `/admin/organization/${params.organizationId}`,
        });

        if (notificationId) {
          notificationIds.push(notificationId);
        }
      } catch (error) {
        console.error(`Failed to notify member ${memberId}:`, error);
      }
    }

    return notificationIds;
  }

  /**
   * Notify a specific user about changes to their profile (by platform admin)
   */
  static async notifyUserProfileUpdate(params: {
    userId: string;
    userName: string;
    userEmail: string;
    organizationId: string;
    actionBy: string;
    actionByName: string;
    actionByEmail: string;
    changes: { field: string; oldValue?: unknown; newValue?: unknown }[];
  }): Promise<string> {
    const changesList = params.changes
      .map((c) => c.field.replace(/_/g, " "))
      .join(", ");

    return this.createNotification({
      userId: params.userId,
      organizationId: params.organizationId,
      type: "profile_updated",
      category: "user",
      priority: "high",
      title: "Your Profile Was Updated",
      message: `A platform administrator (${params.actionByName}) updated your profile. Changed fields: ${changesList}`,
      actionBy: params.actionBy,
      actionByName: params.actionByName,
      actionByEmail: params.actionByEmail,
      resourceType: "user",
      resourceId: params.userId,
      resourceName: params.userName,
      changes: params.changes,
      actionUrl: `/org/profile`,
    });
  }

  /**
   * Notify user about role change
   */
  static async notifyRoleChange(params: {
    userId: string;
    userName: string;
    organizationId: string;
    organizationName: string;
    oldRole: string;
    newRole: string;
    actionBy: string;
    actionByName: string;
    actionByEmail: string;
  }): Promise<string> {
    return this.createNotification({
      userId: params.userId,
      organizationId: params.organizationId,
      type: "role_changed",
      category: "user",
      priority: "high",
      title: "Your Role Has Changed",
      message: `Your role in ${params.organizationName} was changed from ${params.oldRole} to ${params.newRole} by ${params.actionByName}`,
      actionBy: params.actionBy,
      actionByName: params.actionByName,
      actionByEmail: params.actionByEmail,
      resourceType: "member",
      resourceId: params.userId,
      resourceName: params.userName,
      changes: [
        {
          field: "role",
          oldValue: params.oldRole,
          newValue: params.newRole,
        },
      ],
      actionUrl: `/org/profile`,
    });
  }

  /**
   * Notify user when added to organization
   */
  static async notifyMemberAdded(params: {
    userId: string;
    userName: string;
    userEmail: string;
    organizationId: string;
    organizationName: string;
    role: string;
    actionBy: string;
    actionByName: string;
    actionByEmail: string;
  }): Promise<string> {
    return this.createNotification({
      userId: params.userId,
      organizationId: params.organizationId,
      type: "member_added",
      category: "organization",
      priority: "high",
      title: `Welcome to ${params.organizationName}!`,
      message: `You've been added to ${params.organizationName} as ${params.role} by ${params.actionByName}`,
      actionBy: params.actionBy,
      actionByName: params.actionByName,
      actionByEmail: params.actionByEmail,
      resourceType: "organization",
      resourceId: params.organizationId,
      resourceName: params.organizationName,
      actionUrl: `/dashboard`,
      metadata: {
        role: params.role,
      },
    });
  }

  /**
   * Notify user when removed from organization
   */
  static async notifyMemberRemoved(params: {
    userId: string;
    userName: string;
    organizationId: string;
    organizationName: string;
    actionBy: string;
    actionByName: string;
    actionByEmail: string;
  }): Promise<string> {
    return this.createNotification({
      userId: params.userId,
      organizationId: params.organizationId,
      type: "member_removed",
      category: "organization",
      priority: "urgent",
      title: "Organization Access Removed",
      message: `You've been removed from ${params.organizationName} by ${params.actionByName}`,
      actionBy: params.actionBy,
      actionByName: params.actionByName,
      actionByEmail: params.actionByEmail,
      resourceType: "organization",
      resourceId: params.organizationId,
      resourceName: params.organizationName,
    });
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    limitCount: number = 50,
    statusFilter?: Notification["status"]
  ): Promise<Notification[]> {
    try {
      let q;
      if (statusFilter) {
        q = query(
          collection(db, "notifications"),
          where("userId", "==", userId),
          where("status", "==", statusFilter),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
      } else {
        q = query(
          collection(db, "notifications"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(limitCount)
        );
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt:
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
          readAt: data.readAt
            ? data.readAt instanceof Timestamp
              ? data.readAt.toDate()
              : new Date(data.readAt)
            : undefined,
          archivedAt: data.archivedAt
            ? data.archivedAt instanceof Timestamp
              ? data.archivedAt.toDate()
              : new Date(data.archivedAt)
            : undefined,
          expiresAt: data.expiresAt
            ? data.expiresAt instanceof Timestamp
              ? data.expiresAt.toDate()
              : new Date(data.expiresAt)
            : undefined,
        } as Notification;
      });
    } catch (error) {
      console.error("Failed to fetch user notifications:", error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await updateDoc(doc(db, "notifications", notificationId), {
        status: "read",
        readAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return false;
    }
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("status", "==", "unread")
      );

      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map((doc) =>
        updateDoc(doc.ref, {
          status: "read",
          readAt: serverTimestamp(),
        })
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      return false;
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        where("status", "==", "unread")
      );

      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error("Failed to get unread count:", error);
      return 0;
    }
  }
}
