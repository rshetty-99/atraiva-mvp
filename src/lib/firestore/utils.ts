import { 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentReference,
  CollectionReference
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  Organization, 
  User, 
  OrganizationInput, 
  UserInput, 
  OrganizationUpdate, 
  UserUpdate,
  COLLECTIONS 
} from '@/types/firestore';

// Helper function to convert Firestore timestamps to Date objects
export const convertTimestampsToDate = <T extends Record<string, unknown>>(data: T): T => {
  const converted = { ...data };
  
  for (const key in converted) {
    const value = converted[key as keyof T] as unknown;
    if (value instanceof Timestamp) {
      (converted as Record<string, unknown>)[key] = value.toDate();
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (converted as Record<string, unknown>)[key] = convertTimestampsToDate(
        value as Record<string, unknown>
      );
    } else if (Array.isArray(value)) {
      (converted as Record<string, unknown>)[key] = (value as unknown[]).map(
        (item) =>
          item && typeof item === 'object'
            ? convertTimestampsToDate(item as Record<string, unknown>)
            : item
      );
    }
  }
  
  return converted;
};

// Helper function to convert Date objects to Firestore timestamps
export const convertDatesToTimestamp = <T extends Record<string, unknown>>(data: T): T => {
  const converted = { ...data };
  
  for (const key in converted) {
    const value = converted[key as keyof T] as unknown;
    if (value instanceof Date) {
      (converted as Record<string, unknown>)[key] = Timestamp.fromDate(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (converted as Record<string, unknown>)[key] = convertDatesToTimestamp(
        value as Record<string, unknown>
      );
    } else if (Array.isArray(value)) {
      (converted as Record<string, unknown>)[key] = (value as unknown[]).map(
        (item) =>
          item && typeof item === 'object'
            ? convertDatesToTimestamp(item as Record<string, unknown>)
            : item
      );
    }
  }
  
  return converted;
};

// Organization CRUD operations
export class OrganizationService {
  private static collection = collection(db, COLLECTIONS.ORGANIZATIONS) as CollectionReference<Organization>;

  static async create(id: string, data: OrganizationInput): Promise<Organization> {
    const now = Timestamp.now();
    const organizationData: Organization = {
      ...data,
      id,
      metadata: {
        createdAt: now,
        updatedAt: now,
        active: true,
        ...data.metadata
      }
    };

    const docRef = doc(this.collection, id);
    await setDoc(docRef, organizationData);
    return organizationData;
  }

  static async get(id: string): Promise<Organization | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Organization;
    }
    
    return null;
  }

  static async update(id: string, data: OrganizationUpdate): Promise<void> {
    const docRef = doc(this.collection, id);
    const updateData = {
      ...data,
      'metadata.updatedAt': Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }

  static async getByHierarchy(parentId?: string): Promise<Organization[]> {
    const q = parentId 
      ? query(this.collection, where('hierarchy.parentOrgId', '==', parentId))
      : query(this.collection, where('hierarchy.parentOrgId', '==', null));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
  }

  static async getActiveOrganizations(limitCount = 100): Promise<Organization[]> {
    const q = query(
      this.collection, 
      where('metadata.active', '==', true),
      orderBy('metadata.createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
  }
}

// User CRUD operations
export class UserService {
  private static collection = collection(db, COLLECTIONS.USERS) as CollectionReference<User>;

  static async create(id: string, data: UserInput): Promise<User> {
    const now = Timestamp.now();
    const userData: User = {
      ...data,
      id,
      metadata: {
        createdAt: now,
        updatedAt: now,
        status: 'active',
        ...data.metadata
      }
    };

    const docRef = doc(this.collection, id);
    await setDoc(docRef, userData);
    return userData;
  }

  static async get(id: string): Promise<User | null> {
    const docRef = doc(this.collection, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    
    return null;
  }

  static async getByClerkId(clerkId: string): Promise<User | null> {
    const q = query(this.collection, where('auth.clerkId', '==', clerkId), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    
    return null;
  }

  static async getByEmail(email: string): Promise<User | null> {
    const q = query(this.collection, where('auth.email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as User;
    }
    
    return null;
  }

  static async update(id: string, data: UserUpdate): Promise<void> {
    const docRef = doc(this.collection, id);
    const updateData = {
      ...data,
      'metadata.updatedAt': Timestamp.now()
    };
    
    await updateDoc(docRef, updateData);
  }

  static async delete(id: string): Promise<void> {
    const docRef = doc(this.collection, id);
    await deleteDoc(docRef);
  }

  static async getByOrganization(orgId: string): Promise<User[]> {
    const q = query(this.collection, where('organizations', 'array-contains-any', [{ orgId }]));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  static async updateLastActivity(id: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const updateData: Record<string, unknown> = {
      'activity.lastActiveAt': Timestamp.now()
    };
    
    if (ipAddress) {
      updateData['activity.lastIpAddress'] = ipAddress;
    }
    
    if (userAgent) {
      updateData['activity.lastUserAgent'] = userAgent;
    }
    
    await this.update(id, updateData);
  }

  static async incrementLoginCount(id: string): Promise<void> {
    const user = await this.get(id);
    if (user) {
      await this.update(id, {
        auth: {
          ...user.auth,
          lastLogin: Timestamp.now(),
          loginCount: user.auth.loginCount + 1
        }
      });
    }
  }
}

// Permission utilities
export const hasPermission = (user: User, permission: string, orgId?: string): boolean => {
  if (!orgId) return false;
  
  const orgMembership = user.organizations.find(org => org.orgId === orgId);
  if (!orgMembership) return false;
  
  // Super admin has all permissions
  if (orgMembership.role === 'super_admin') return true;
  
  // Check if user has specific permission
  return orgMembership.permissions.includes(permission) || 
         orgMembership.permissions.includes('*');
};

export const hasRole = (user: User, role: string, orgId?: string): boolean => {
  if (!orgId) return false;
  
  const orgMembership = user.organizations.find(org => org.orgId === orgId);
  return orgMembership?.role === role;
};

export const getUserPrimaryOrganization = (user: User): string | null => {
  const primaryOrg = user.organizations.find(org => org.isPrimary);
  return primaryOrg?.orgId || null;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
};

// Default data generators
export const createDefaultUserData = (
  email: string, 
  firstName: string, 
  lastName: string,
  clerkId?: string
): UserInput => ({
  auth: {
    email,
    emailVerified: false,
    clerkId,
    authProvider: 'email',
    loginCount: 0
  },
  profile: {
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`
  },
  organizations: [],
  preferences: {
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      desktop: true,
      mobile: true,
      categories: {}
    },
    dashboard: {
      theme: 'system'
    }
  },
  security: {
    mfaEnabled: false,
    requirePasswordChange: false
  },
  activity: {
    sessions: []
  }
});

export const createDefaultOrganizationData = (
  name: string,
  type: Organization['profile']['type'],
  createdBy: string
): OrganizationInput => ({
  profile: {
    name,
    type,
    size: 'small'
  },
  hierarchy: {
    childOrgIds: [],
    isSubsidiary: false,
    level: 0
  },
  subscription: {
    plan: 'starter',
    status: 'trial',
    startDate: Timestamp.now(),
    seats: 5,
    usedSeats: 1,
    features: ['basic_compliance', 'notifications']
  },
  settings: {
    timezone: 'UTC',
    language: 'en',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD',
    notifications: {
      enableEmail: true,
      enableSMS: false,
      enableInApp: true,
      digestFrequency: 'daily',
      escalationRules: []
    },
    security: {
      mfaRequired: false,
      ssoEnabled: false,
      sessionTimeout: 480, // 8 hours
      passwordPolicy: {}
    },
    compliance: {
      defaultJurisdictions: ['US'],
      dataRetentionDays: 2555, // 7 years
      auditLogRetentionDays: 2555
    }
  },
  apiAccess: {
    enabled: false,
    apiKeys: []
  },
  metadata: {
    createdBy,
    active: true
  }
});