import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { MemberInvitation } from "@/lib/firestore/types";
import { randomBytes } from "crypto";

export class MemberInvitationService {
  /**
   * Generate a cryptographically secure random token
   */
  private static generateToken(): string {
    return randomBytes(32).toString("hex");
  }

  /**
   * Create a new member invitation
   */
  static async createInvitation(params: {
    organizationId: string;
    organizationName: string;
    memberData: {
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      jobTitle?: string;
      phoneNumber?: string;
    };
    invitedBy: string;
    invitedByName: string;
    invitedByEmail: string;
    invitedByRole: string;
  }): Promise<{
    success: boolean;
    invitationId?: string;
    token?: string;
    error?: string;
  }> {
    try {
      // Check if invitation already exists for this email + organization
      const existingQuery = query(
        collection(db, "memberInvitations"),
        where("memberData.email", "==", params.memberData.email),
        where("organizationId", "==", params.organizationId),
        where("status", "in", ["pending", "sent"])
      );

      const existingDocs = await getDocs(existingQuery);
      if (!existingDocs.empty) {
        return {
          success: false,
          error: "An active invitation already exists for this email",
        };
      }

      // Generate token and create invitation
      const token = this.generateToken();
      const invitationId = `inv_${Date.now()}_${randomBytes(8).toString(
        "hex"
      )}`;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      const invitation: Omit<MemberInvitation, "createdAt" | "expiresAt"> & {
        createdAt: ReturnType<typeof serverTimestamp> | Date;
        expiresAt: Date;
      } = {
        id: invitationId,
        token,
        organizationId: params.organizationId,
        organizationName: params.organizationName,
        memberData: params.memberData,
        status: "pending",
        invitedBy: params.invitedBy,
        invitedByName: params.invitedByName,
        invitedByEmail: params.invitedByEmail,
        invitedByRole: params.invitedByRole,
        createdAt: serverTimestamp(),
        expiresAt: expiresAt,
        emailSent: false,
        emailResendCount: 0,
      };

      await setDoc(doc(db, "memberInvitations", invitationId), invitation);

      return {
        success: true,
        invitationId,
        token,
      };
    } catch (error) {
      console.error("Error creating member invitation:", error);
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to create invitation",
      };
    }
  }

  /**
   * Validate invitation token
   */
  static async validateInvitationToken(token: string): Promise<{
    valid: boolean;
    invitation?: MemberInvitation;
    error?: string;
  }> {
    try {
      const invitationsQuery = query(
        collection(db, "memberInvitations"),
        where("token", "==", token)
      );

      const snapshot = await getDocs(invitationsQuery);

      if (snapshot.empty) {
        return { valid: false, error: "Invalid invitation link" };
      }

      const invitationDoc = snapshot.docs[0];
      const invitation = {
        ...invitationDoc.data(),
        id: invitationDoc.id,
        createdAt: invitationDoc.data().createdAt?.toDate(),
        expiresAt: invitationDoc.data().expiresAt?.toDate(),
        acceptedAt: invitationDoc.data().acceptedAt?.toDate(),
        emailSentAt: invitationDoc.data().emailSentAt?.toDate(),
        lastEmailSentAt: invitationDoc.data().lastEmailSentAt?.toDate(),
        cancelledAt: invitationDoc.data().cancelledAt?.toDate(),
      } as MemberInvitation;

      // Check if already used
      if (invitation.status === "accepted") {
        return { valid: false, error: "This invitation has already been used" };
      }

      // Check if cancelled
      if (invitation.status === "cancelled") {
        return { valid: false, error: "This invitation has been cancelled" };
      }

      // Check if expired
      if (invitation.expiresAt && new Date() > invitation.expiresAt) {
        // Mark as expired
        await updateDoc(doc(db, "memberInvitations", invitation.id), {
          status: "expired",
        });
        return { valid: false, error: "This invitation has expired" };
      }

      return { valid: true, invitation };
    } catch (error) {
      console.error("Error validating invitation token:", error);
      return {
        valid: false,
        error: "Failed to validate invitation link",
      };
    }
  }

  /**
   * Mark invitation as email sent
   */
  static async markInvitationSent(
    invitationId: string,
    isResend: boolean = false
  ): Promise<boolean> {
    try {
      const invitationRef = doc(db, "memberInvitations", invitationId);
      const invitationDoc = await getDoc(invitationRef);

      if (!invitationDoc.exists()) {
        throw new Error("Invitation not found");
      }

      const currentData = invitationDoc.data();

      await updateDoc(invitationRef, {
        status: "sent",
        emailSent: true,
        emailSentAt: isResend ? currentData.emailSentAt : serverTimestamp(),
        lastEmailSentAt: serverTimestamp(),
        emailResendCount: isResend
          ? (currentData.emailResendCount || 0) + 1
          : 0,
      });

      return true;
    } catch (error) {
      console.error("Error marking invitation as sent:", error);
      return false;
    }
  }

  /**
   * Mark invitation as accepted (used)
   */
  static async markInvitationAccepted(
    invitationId: string,
    clerkUserId: string,
    firestoreUserId: string
  ): Promise<boolean> {
    try {
      await updateDoc(doc(db, "memberInvitations", invitationId), {
        status: "accepted",
        acceptedAt: serverTimestamp(),
        acceptedBy: clerkUserId,
        clerkUserId,
        firestoreUserId,
      });

      return true;
    } catch (error) {
      console.error("Error marking invitation as accepted:", error);
      return false;
    }
  }

  /**
   * Cancel invitation
   */
  static async cancelInvitation(
    invitationId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<boolean> {
    try {
      await updateDoc(doc(db, "memberInvitations", invitationId), {
        status: "cancelled",
        cancelledAt: serverTimestamp(),
        cancelledBy,
        cancellationReason: reason || "Cancelled by admin",
      });

      return true;
    } catch (error) {
      console.error("Error cancelling invitation:", error);
      return false;
    }
  }

  /**
   * Get all invitations for an organization
   */
  static async getOrganizationInvitations(
    organizationId: string
  ): Promise<MemberInvitation[]> {
    try {
      const invitationsQuery = query(
        collection(db, "memberInvitations"),
        where("organizationId", "==", organizationId)
      );

      const snapshot = await getDocs(invitationsQuery);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt?.toDate(),
        expiresAt: doc.data().expiresAt?.toDate(),
        acceptedAt: doc.data().acceptedAt?.toDate(),
        emailSentAt: doc.data().emailSentAt?.toDate(),
        lastEmailSentAt: doc.data().lastEmailSentAt?.toDate(),
        cancelledAt: doc.data().cancelledAt?.toDate(),
      })) as MemberInvitation[];
    } catch (error) {
      console.error("Error fetching organization invitations:", error);
      return [];
    }
  }
}

