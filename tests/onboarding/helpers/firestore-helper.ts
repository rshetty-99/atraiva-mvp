/**
 * Firestore Helper for Test Automation
 * Handles Firestore interactions for creating and verifying test data
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { MockUser, MockEnterprise } from '../fixtures/mock-data-generator';

export interface FirestoreCreationResult {
  success: boolean;
  id: string;
  error?: string;
}

/**
 * Create an enterprise/organization in Firestore
 */
export async function createFirestoreOrganization(
  enterprise: MockEnterprise,
  clerkOrgId?: string
): Promise<FirestoreCreationResult> {
  try {
    const orgRef = doc(db, 'organizations', enterprise.id);
    
    await setDoc(orgRef, {
      id: enterprise.id,
      name: enterprise.name,
      clerkOrganizationId: clerkOrgId || null,
      category: enterprise.category,
      industry: enterprise.industry,
      size: enterprise.size,
      domain: enterprise.domain,
      country: enterprise.country,
      state: enterprise.state,
      city: enterprise.city,
      address: enterprise.address,
      zipCode: enterprise.zipCode,
      phone: enterprise.phone,
      website: enterprise.website,
      taxId: enterprise.taxId,
      status: enterprise.status,
      createdAt: enterprise.createdAt,
      updatedAt: Timestamp.now(),
      settings: {
        complianceFrameworks: [],
        notificationPreferences: {
          email: true,
          sms: false,
          push: true,
        },
      },
      subscription: {
        plan: 'enterprise',
        status: 'active',
        startDate: enterprise.createdAt,
      },
      testData: true, // Mark as test data for easy cleanup
    });

    return {
      success: true,
      id: enterprise.id,
    };
  } catch (error) {
    return {
      success: false,
      id: enterprise.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a user in Firestore
 */
export async function createFirestoreUser(
  user: MockUser,
  clerkUserId?: string
): Promise<FirestoreCreationResult> {
  try {
    const userRef = doc(db, 'users', user.id);
    
    await setDoc(userRef, {
      id: user.id,
      clerkUserId: clerkUserId || null,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: `${user.firstName} ${user.lastName}`,
      role: user.role,
      phone: user.phone,
      department: user.department,
      title: user.title,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: Timestamp.now(),
      organizations: [
        {
          organizationId: user.enterpriseId,
          organizationName: user.enterpriseName,
          role: user.role,
          joinedAt: user.createdAt,
        },
      ],
      currentOrganization: {
        organizationId: user.enterpriseId,
        organizationName: user.enterpriseName,
        role: user.role,
      },
      preferences: {
        theme: 'dark',
        notifications: {
          email: true,
          push: true,
        },
      },
      onboardingCompleted: true,
      lastLogin: null,
      testData: true, // Mark as test data for easy cleanup
    });

    return {
      success: true,
      id: user.id,
    };
  } catch (error) {
    return {
      success: false,
      id: user.id,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Verify organization exists in Firestore
 */
export async function verifyFirestoreOrganization(orgId: string): Promise<boolean> {
  try {
    const orgRef = doc(db, 'organizations', orgId);
    const orgSnap = await getDoc(orgRef);
    return orgSnap.exists();
  } catch (error) {
    console.error('Error verifying Firestore organization:', error);
    return false;
  }
}

/**
 * Verify user exists in Firestore
 */
export async function verifyFirestoreUser(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error('Error verifying Firestore user:', error);
    return false;
  }
}

/**
 * Get all test organizations
 */
export async function getTestOrganizations(): Promise<string[]> {
  try {
    const orgsRef = collection(db, 'organizations');
    const q = query(orgsRef, where('testData', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error getting test organizations:', error);
    return [];
  }
}

/**
 * Get all test users
 */
export async function getTestUsers(): Promise<string[]> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('testData', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error getting test users:', error);
    return [];
  }
}

/**
 * Delete an organization from Firestore
 */
export async function deleteFirestoreOrganization(orgId: string): Promise<boolean> {
  try {
    const orgRef = doc(db, 'organizations', orgId);
    await deleteDoc(orgRef);
    return true;
  } catch (error) {
    console.error('Error deleting Firestore organization:', error);
    return false;
  }
}

/**
 * Delete a user from Firestore
 */
export async function deleteFirestoreUser(userId: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error('Error deleting Firestore user:', error);
    return false;
  }
}

/**
 * Cleanup all test data from Firestore
 */
export async function cleanupTestFirestoreData(): Promise<{
  deletedOrganizations: number;
  deletedUsers: number;
}> {
  const orgIds = await getTestOrganizations();
  const userIds = await getTestUsers();
  
  let deletedOrganizations = 0;
  let deletedUsers = 0;

  // Delete organizations
  for (const orgId of orgIds) {
    const deleted = await deleteFirestoreOrganization(orgId);
    if (deleted) deletedOrganizations++;
  }

  // Delete users
  for (const userId of userIds) {
    const deleted = await deleteFirestoreUser(userId);
    if (deleted) deletedUsers++;
  }

  return { deletedOrganizations, deletedUsers };
}

/**
 * Get organization data from Firestore
 */
export async function getFirestoreOrganization(orgId: string): Promise<any | null> {
  try {
    const orgRef = doc(db, 'organizations', orgId);
    const orgSnap = await getDoc(orgRef);
    return orgSnap.exists() ? orgSnap.data() : null;
  } catch (error) {
    console.error('Error getting Firestore organization:', error);
    return null;
  }
}

/**
 * Get user data from Firestore
 */
export async function getFirestoreUser(userId: string): Promise<any | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error getting Firestore user:', error);
    return null;
  }
}

/**
 * Verify user's organization membership
 */
export async function verifyUserOrganizationMembership(
  userId: string,
  organizationId: string
): Promise<boolean> {
  try {
    const userData = await getFirestoreUser(userId);
    if (!userData) return false;

    const organizations = userData.organizations || [];
    return organizations.some(
      (org: any) => org.organizationId === organizationId
    );
  } catch (error) {
    console.error('Error verifying user organization membership:', error);
    return false;
  }
}

