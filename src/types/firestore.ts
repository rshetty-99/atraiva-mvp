import { Timestamp } from 'firebase/firestore';

/**
 * Organizations Collection
 * Path: /organizations/{organizationId}
 * Description: Organization entities with subscription and settings
 */
export interface Organization {
  id: string;
  
  // Basic Information
  profile: {
    name: string;
    type: 'law_firm' | 'enterprise' | 'channel_partner' | 'platform';
    industry?: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    website?: string;
    logo?: string;
  };
  
  // Hierarchy
  hierarchy: {
    parentOrgId?: string; // For subsidiaries
    childOrgIds: string[]; // Subsidiaries
    isSubsidiary: boolean;
    level: number; // 0 for root, 1 for child, etc.
  };
  
  // Subscription & Billing
  subscription: {
    plan: 'starter' | 'professional' | 'enterprise' | 'custom';
    status: 'trial' | 'active' | 'suspended' | 'cancelled';
    startDate: Timestamp;
    renewalDate?: Timestamp;
    seats: number;
    usedSeats: number;
    features: string[]; // Enabled features
  };
  
  // Settings
  settings: {
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
    fiscalYearStart?: string;
    
    // Notification Preferences
    notifications: {
      enableEmail: boolean;
      enableSMS: boolean;
      enableInApp: boolean;
      digestFrequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
      escalationRules: Record<string, any>[];
    };
    
    // Security Settings
    security: {
      mfaRequired: boolean;
      ssoEnabled: boolean;
      ssoProvider?: string;
      ipWhitelist?: string[];
      sessionTimeout: number; // minutes
      passwordPolicy: Record<string, any>;
    };
    
    // Compliance Settings
    compliance: {
      defaultJurisdictions: string[];
      defaultIndustry?: string;
      dataRetentionDays: number;
      auditLogRetentionDays: number;
    };
  };
  
  // API Access
  apiAccess: {
    enabled: boolean;
    apiKeys: {
      id: string;
      name: string;
      key: string; // Hashed
      createdAt: Timestamp;
      lastUsedAt?: Timestamp;
      expiresAt?: Timestamp;
      permissions: string[];
    }[];
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    onboardedAt?: Timestamp;
    lastActivityAt?: Timestamp;
    active: boolean;
  };
}

/**
 * Users Collection
 * Path: /users/{userId}
 * Description: All platform users
 */
export interface User {
  id: string;
  
  // Authentication
  auth: {
    email: string;
    emailVerified: boolean;
    clerkId?: string; // Clerk.dev ID
    authProvider: 'email' | 'google' | 'microsoft' | 'saml';
    lastLogin?: Timestamp;
    loginCount: number;
  };
  
  // Profile
  profile: {
    firstName: string;
    lastName: string;
    displayName?: string;
    phone?: string;
    phoneVerified?: boolean;
    avatar?: string;
    title?: string;
    department?: string;
    bio?: string;
  };
  
  // Organization Membership
  organizations: {
    orgId: string;
    role: 'super_admin' | 'admin' | 'manager' | 'analyst' | 'viewer';
    permissions: string[];
    isPrimary: boolean;
    joinedAt: Timestamp;
    invitedBy?: string;
  }[];
  
  // Client Access (for law firm users)
  clientAccess?: {
    allClients: boolean; // Access to all org's clients
    specificClients?: string[]; // Limited to specific client IDs
    permissions: string[]; // Client-specific permissions
  };
  
  // Preferences
  preferences: {
    timezone?: string;
    language: string;
    notifications: {
      email: boolean;
      sms: boolean;
      desktop: boolean;
      mobile: boolean;
      categories: {
        [category: string]: boolean;
      };
    };
    dashboard: {
      defaultView?: string;
      widgets?: string[];
      theme?: 'light' | 'dark' | 'system';
    };
  };
  
  // Security
  security: {
    mfaEnabled: boolean;
    mfaMethod?: 'totp' | 'sms' | 'email';
    mfaSecret?: string; // Encrypted
    backupCodes?: string[]; // Hashed
    trustedDevices?: {
      id: string;
      name: string;
      lastUsed: Timestamp;
      fingerprint: string;
    }[];
    passwordChangedAt?: Timestamp;
    requirePasswordChange: boolean;
  };
  
  // Activity
  activity: {
    lastActiveAt?: Timestamp;
    lastIpAddress?: string;
    lastUserAgent?: string;
    sessions: {
      id: string;
      createdAt: Timestamp;
      expiresAt: Timestamp;
      ipAddress: string;
      userAgent: string;
      active: boolean;
    }[];
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    deactivatedAt?: Timestamp;
    deactivatedBy?: string;
    status: 'active' | 'inactive' | 'suspended' | 'deleted';
  };
}

// Utility types for Firestore operations
export type OrganizationInput = Omit<Organization, 'id' | 'metadata'> & {
  metadata?: Partial<Organization['metadata']>;
};

export type UserInput = Omit<User, 'id' | 'metadata'> & {
  metadata?: Partial<User['metadata']>;
};

export type OrganizationUpdate = Partial<Omit<Organization, 'id' | 'metadata'>> & {
  metadata?: Partial<Organization['metadata']>;
};

export type UserUpdate = Partial<Omit<User, 'id' | 'metadata'>> & {
  metadata?: Partial<User['metadata']>;
};

// Collection references
export const COLLECTIONS = {
  ORGANIZATIONS: 'organizations',
  USERS: 'users',
} as const;

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  super_admin: ['*'], // All permissions
  admin: [
    'org.manage',
    'users.manage',
    'settings.manage',
    'billing.manage',
    'compliance.manage',
    'api.manage',
  ],
  manager: [
    'users.invite',
    'users.view',
    'compliance.manage',
    'reports.view',
    'notifications.manage',
  ],
  analyst: [
    'compliance.view',
    'reports.view',
    'notifications.view',
    'clients.manage',
  ],
  viewer: [
    'compliance.view',
    'reports.view',
    'notifications.view',
  ],
} as const;

export type Role = keyof typeof ROLE_PERMISSIONS;
export type Permission = typeof ROLE_PERMISSIONS[Role][number];