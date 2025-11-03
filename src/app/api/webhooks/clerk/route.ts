import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";
import { SessionService } from "@/lib/session";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

// Types for Clerk webhook events
type ClerkWebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

type ClerkUserData = {
  id: string;
  [key: string]: unknown;
};

type ClerkOrgData = {
  id: string;
  [key: string]: unknown;
};

type ClerkSessionData = {
  user_id: string;
  [key: string]: unknown;
};

type ClerkMembershipData = {
  id: string;
  public_user_data: {
    user_id: string;
    [key: string]: unknown;
  };
  organization: {
    id: string;
    [key: string]: unknown;
  };
  role: string;
  permissions?: string[];
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  if (!webhookSecret) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret.
  const wh = new Webhook(webhookSecret);

  let evt: ClerkWebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log("Clerk webhook event:", eventType);

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated(evt.data);
        break;
      case "user.updated":
        await handleUserUpdated(evt.data);
        break;
      case "user.deleted":
        await handleUserDeleted(evt.data);
        break;
      case "organization.created":
        await handleOrganizationCreated(evt.data);
        break;
      case "organization.updated":
        await handleOrganizationUpdated(evt.data);
        break;
      case "organization.deleted":
        await handleOrganizationDeleted(evt.data);
        break;
      case "organizationMembership.created":
        await handleMembershipCreated(evt.data);
        break;
      case "organizationMembership.updated":
        await handleMembershipUpdated(evt.data);
        break;
      case "organizationMembership.deleted":
        await handleMembershipDeleted(evt.data);
        break;
      case "session.created":
        await handleSessionCreated(evt.data);
        break;
      case "session.ended":
        await handleSessionEnded(evt.data);
        break;
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Error processing webhook" },
      { status: 500 }
    );
  }
}

async function handleUserCreated(userData: ClerkUserData) {
  console.log("User created:", userData.id);

  try {
    // Sync user to Firestore using the integration service
    await ClerkFirestoreIntegration.syncUserToFirestore(userData.id);
    console.log("User created in Firestore:", userData.id);
  } catch (error) {
    console.error("Error creating user in Firestore:", error);
    throw error;
  }
}

async function handleUserUpdated(userData: ClerkUserData) {
  console.log("User updated:", userData.id);

  try {
    // Sync updated user to Firestore
    await ClerkFirestoreIntegration.syncUserToFirestore(userData.id);

    // Invalidate session cache to reflect updated profile
    await SessionService.invalidateSessionCache(userData.id);

    console.log("User updated in Firestore:", userData.id);
  } catch (error) {
    console.error("Error updating user in Firestore:", error);
    throw error;
  }
}

async function handleUserDeleted(userData: ClerkUserData) {
  console.log("User deleted:", userData.id);

  try {
    // Delete user from Firestore
    const { deleteDoc, doc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    await deleteDoc(doc(db, "users", userData.id));
    console.log("User deleted from Firestore:", userData.id);
  } catch (error) {
    console.error("Error deleting user from Firestore:", error);
    throw error;
  }
}

async function handleSessionCreated(sessionData: ClerkSessionData) {
  console.log("Session created for user:", sessionData.user_id);

  try {
    // Process login and build session metadata
    const userSessionData = await SessionService.processLogin(
      sessionData.user_id
    );
    console.log("Session metadata cached for user:", sessionData.user_id);
  } catch (error) {
    console.error("Error processing login session:", error);
    // Don't throw error - login should still succeed even if session cache fails
  }
}

async function handleSessionEnded(sessionData: ClerkSessionData) {
  console.log("Session ended for user:", sessionData.user_id);
  // Could track session duration, logout events, etc.
}

async function handleOrganizationCreated(orgData: ClerkOrgData) {
  console.log("Organization created:", orgData.id);

  try {
    await ClerkFirestoreIntegration.syncOrganizationToFirestore(orgData.id);
    console.log("Organization created in Firestore:", orgData.id);
  } catch (error) {
    console.error("Error creating organization in Firestore:", error);
    throw error;
  }
}

async function handleOrganizationUpdated(orgData: ClerkOrgData) {
  console.log("Organization updated:", orgData.id);

  try {
    await ClerkFirestoreIntegration.syncOrganizationToFirestore(orgData.id);
    console.log("Organization updated in Firestore:", orgData.id);
  } catch (error) {
    console.error("Error updating organization in Firestore:", error);
    throw error;
  }
}

async function handleOrganizationDeleted(orgData: ClerkOrgData) {
  console.log("Organization deleted:", orgData.id);

  try {
    const { deleteDoc, doc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    await deleteDoc(doc(db, "organizations", orgData.id));
    console.log("Organization deleted from Firestore:", orgData.id);
  } catch (error) {
    console.error("Error deleting organization from Firestore:", error);
    throw error;
  }
}

async function handleMembershipCreated(membershipData: ClerkMembershipData) {
  console.log("Membership created:", membershipData.id);

  try {
    await ClerkFirestoreIntegration.syncMembershipToFirestore(
      membershipData.public_user_data.user_id,
      membershipData.organization.id,
      membershipData.role,
      membershipData.permissions || []
    );
    console.log("Membership created in Firestore:", membershipData.id);
  } catch (error) {
    console.error("Error creating membership in Firestore:", error);
    throw error;
  }
}

async function handleMembershipUpdated(membershipData: ClerkMembershipData) {
  console.log("Membership updated:", membershipData.id);

  try {
    await ClerkFirestoreIntegration.syncMembershipToFirestore(
      membershipData.public_user_data.user_id,
      membershipData.organization.id,
      membershipData.role,
      membershipData.permissions || []
    );
    console.log("Membership updated in Firestore:", membershipData.id);
  } catch (error) {
    console.error("Error updating membership in Firestore:", error);
    throw error;
  }
}

async function handleMembershipDeleted(membershipData: ClerkMembershipData) {
  console.log("Membership deleted:", membershipData.id);

  try {
    await ClerkFirestoreIntegration.removeMembershipFromFirestore(
      membershipData.public_user_data.user_id,
      membershipData.organization.id
    );
    console.log("Membership deleted from Firestore:", membershipData.id);
  } catch (error) {
    console.error("Error deleting membership from Firestore:", error);
    throw error;
  }
}
