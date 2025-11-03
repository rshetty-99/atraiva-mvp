// Firestore Data Models for Atraiva Compliance Platform

export interface User {
  id: string;
  auth: {
    email: string;
    clerkId: string;
    lastSignIn: Date;
    isActive: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    imageUrl?: string;
    timezone: string;
    locale: string;
    jobTitle?: string;
    username: string; // Made required
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: "public" | "organization" | "private";
      dataSharing: boolean;
    };
  };
  security: {
    mfaEnabled: boolean;
    lastPasswordChange: Date;
    loginAttempts: number;
    accountLocked: boolean;
    sessionTimeout?: string;
    passwordPolicy?: string;
  };
  organizations: UserOrganizationMembership[]; // Array of organization memberships
  role?: string; // Primary role from onboarding
  userType?: "law_firm" | "enterprise" | "channel_partner" | "platform_admin";
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface UserOrganizationMembership {
  orgId: string;
  role: string; // Clerk role like "org:admin" or "org:member"
  permissions: string[];
  isPrimary: boolean;
  joinedAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  clerkId?: string; // Clerk organization ID
  name: string;
  organizationType:
    | "law_firm"
    | "enterprise"
    | "channel_partner"
    | "government"
    | "nonprofit";
  industry: string;
  teamSize: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";
  website?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description?: string;
  settings: {
    applicableRegulations: string[];
    subscriptionPlan: "free" | "basic" | "pro" | "enterprise";
    subscriptionStatus: "active" | "past_due" | "canceled" | "trialing";
    timezone: string;
    locale: string;
  };
  members: OrganizationMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  userId: string;
  role: string;
  permissions: string[];
  joinedAt: Date;
  isActive: boolean;
}

export interface DataBreach {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: "reported" | "investigating" | "contained" | "resolved" | "closed";
  severity: "low" | "medium" | "high" | "critical";
  affectedRecords: number;
  piiTypes: PIIType[];
  discoveryDate: Date;
  reportedDate?: Date;
  containmentDate?: Date;
  resolutionDate?: Date;
  reportingOfficer: string;
  assignedTo?: string;
  notifications: BreachNotification[];
  documents: Document[];
  timeline: BreachTimelineEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PIIType {
  type:
    | "ssn"
    | "email"
    | "phone"
    | "address"
    | "financial"
    | "medical"
    | "biometric"
    | "other";
  description: string;
  count: number;
  sensitivity: "low" | "medium" | "high" | "critical";
}

export interface BreachNotification {
  id: string;
  breachId: string;
  recipientType: "individual" | "regulator" | "media" | "law_enforcement";
  recipientName: string;
  recipientEmail?: string;
  recipientAddress?: string;
  regulation: string;
  deadline: Date;
  status: "pending" | "sent" | "delivered" | "acknowledged" | "failed";
  sentAt?: Date;
  acknowledgedAt?: Date;
  content: string;
  method: "email" | "mail" | "phone" | "online" | "other";
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceCheck {
  id: string;
  organizationId: string;
  regulation: string;
  checkType: "automated" | "manual" | "periodic";
  status: "pending" | "running" | "completed" | "failed";
  score: number; // 0-100
  findings: ComplianceFinding[];
  recommendations: string[];
  nextCheckDue: Date;
  executedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceFinding {
  id: string;
  type: "gap" | "risk" | "improvement" | "compliant";
  severity: "info" | "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  regulation: string;
  section: string;
  remediation: string;
  status: "open" | "in_progress" | "resolved" | "accepted_risk";
  assignedTo?: string;
  dueDate?: Date;
  resolvedAt?: Date;
}

export interface Document {
  id: string;
  organizationId: string;
  breachId?: string;
  name: string;
  type:
    | "policy"
    | "procedure"
    | "evidence"
    | "report"
    | "correspondence"
    | "other";
  category: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  tags: string[];
  isConfidential: boolean;
  retentionPolicy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PIIScanResult {
  id: string;
  organizationId: string;
  scanName: string;
  scanType: "database" | "file_system" | "cloud_storage" | "api";
  targetSystem: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  totalFiles: number;
  scannedFiles: number;
  piiFound: PIIDetection[];
  falsePositives: number;
  accuracy: number;
  startedAt: Date;
  completedAt?: Date;
  executedBy: string;
  settings: ScanSettings;
  createdAt: Date;
}

export interface PIIDetection {
  id: string;
  scanId: string;
  filePath: string;
  fileName: string;
  piiType: string;
  confidence: number; // 0-100
  context: string;
  lineNumber?: number;
  isConfirmed: boolean;
  isFalsePositive: boolean;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface ScanSettings {
  includePatterns: string[];
  excludePatterns: string[];
  piiTypes: string[];
  minimumConfidence: number;
  maxFileSize: number;
  enableDeepScan: boolean;
}

export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string; // Actor who performed the action
  userName?: string; // Actor's display name for quick reference
  userEmail?: string; // Actor's email for quick reference

  // Event categorization
  action: string; // e.g., "created", "updated", "deleted", "login", "invite_sent"
  category:
    | "organization"
    | "user"
    | "security"
    | "compliance"
    | "breach"
    | "document"
    | "settings"
    | "integration"
    | "billing"
    | "notification";

  resourceType: string; // e.g., "organization", "user", "role", "subscription", "settings"
  resourceId: string; // ID of the affected resource
  resourceName?: string; // Name of the resource for display

  // Change tracking
  changes?: {
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }[];

  // Event details
  description: string; // Human-readable description
  severity?: "info" | "warning" | "error" | "critical";

  // Context
  ipAddress?: string;
  userAgent?: string;
  location?: string; // Geo-location if available

  // Status
  timestamp: Date;
  success: boolean;
  errorMessage?: string;

  // Additional metadata
  metadata?: Record<string, unknown>;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface Notification {
  id: string;
  userId: string; // Recipient of the notification
  organizationId: string;

  // Notification content
  type:
    | "organization_created"
    | "organization_updated"
    | "organization_deleted"
    | "member_added"
    | "member_removed"
    | "role_changed"
    | "profile_updated"
    | "subscription_changed"
    | "settings_updated"
    | "security_alert"
    | "compliance_alert"
    | "breach_reported"
    | "system_announcement";

  category: "organization" | "user" | "security" | "compliance" | "system";
  priority: "low" | "medium" | "high" | "urgent";

  title: string;
  message: string;

  // Action details
  actionBy?: string; // User ID who performed the action
  actionByName?: string; // Name of the user who performed the action
  actionByEmail?: string; // Email of the user who performed the action

  // Related resources
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;

  // Change tracking (for updates)
  changes?: {
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }[];

  // Status
  status: "unread" | "read" | "archived";
  readAt?: Date;
  archivedAt?: Date;

  // Action URL (where user should go when clicking notification)
  actionUrl?: string;

  // Timestamps
  createdAt: Date;
  expiresAt?: Date; // Optional expiration for temporary notifications

  // Additional metadata
  metadata?: Record<string, unknown>;
}

// Member Invitation for adding users to existing organizations
export interface MemberInvitation {
  id: string;
  token: string; // Cryptographically secure random token for URL

  // Organization data
  organizationId: string; // Existing organization ID
  organizationName: string;

  // Member data provided by admin
  memberData: {
    email: string;
    firstName: string;
    lastName: string;
    role: string; // org_admin, org_manager, org_viewer
    jobTitle?: string;
    phoneNumber?: string;
  };

  // Status tracking
  status: "pending" | "sent" | "accepted" | "expired" | "cancelled";

  // Metadata
  invitedBy: string; // User ID who created the invitation
  invitedByName: string; // Name for display
  invitedByEmail: string; // Email for audit
  invitedByRole: string; // Role of inviter (org_admin or platform_admin)
  createdAt: Date;
  expiresAt: Date; // 7 days from creation

  // Usage tracking
  acceptedAt?: Date;
  acceptedBy?: string; // Clerk user ID created
  clerkUserId?: string; // Created Clerk user ID
  firestoreUserId?: string; // Firestore user document ID

  // Email tracking
  emailSent: boolean;
  emailSentAt?: Date;
  emailResendCount: number;
  lastEmailSentAt?: Date;

  // Cancellation tracking
  cancelledAt?: Date;
  cancelledBy?: string;
  cancellationReason?: string;

  // Audit
  notes?: string;
}

// Onboarding Data Interface
export interface OnboardingData {
  // User fields
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  username: string;
  password: string;

  // Organization fields
  userType: "law_firm" | "enterprise" | "channel_partner" | "platform_admin";
  role: string;
  organizationName: string;
  organizationType: string;
  industry: string;
  teamSize: string;
  website: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;

  // Security and preferences
  mfaEnabled: boolean;
  mfaMethod?: string;
  phoneNumber?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  securityAlerts?: boolean;
  sessionTimeout?: string;
  passwordPolicy?: string;
  preferences: {
    theme: "light" | "dark" | "auto";
    notifications: boolean;
    dashboardLayout: string;
  };
}

export interface BreachTimelineEvent {
  id: string;
  type:
    | "discovery"
    | "containment"
    | "investigation"
    | "notification"
    | "resolution"
    | "other";
  title: string;
  description: string;
  timestamp: Date;
  performedBy: string;
  documents?: string[];
}

export interface RegulationTemplate {
  id: string;
  name: string;
  code: string; // e.g., "GDPR", "CCPA", "HIPAA"
  country: string;
  state?: string;
  industry?: string;
  notificationDeadlines: NotificationDeadline[];
  requiredElements: string[];
  penalties: RegulationPenalty[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationDeadline {
  recipientType: "individual" | "regulator" | "media";
  timeframe: string; // e.g., "72 hours", "30 days"
  conditions: string[];
  exceptions?: string[];
}

export interface RegulationPenalty {
  violationType: string;
  minPenalty: number;
  maxPenalty: number;
  currency: string;
  description: string;
}

// Registration Link for new organization onboarding
export interface RegistrationLink {
  id: string;
  token: string; // Cryptographically secure random token for URL

  // Organization data collected by admin
  organizationData: {
    name: string;
    organizationType:
      | "law_firm"
      | "enterprise"
      | "channel_partner"
      | "government"
      | "nonprofit";
    industry: string;
    teamSize: "1-10" | "11-50" | "51-200" | "201-1000" | "1000+";
    subscriptionPlan?: "free" | "basic" | "pro" | "enterprise";
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    website?: string;
    phone?: string;
  };

  // Primary user data collected by admin
  primaryUserData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    jobTitle?: string;
    role: string; // org_admin, org_manager, etc.
  };

  // Payment and status tracking
  paymentStatus: "completed"; // Payment completed before link creation
  paymentReference?: string; // External payment reference/receipt number
  status: "pending" | "sent" | "used" | "expired" | "cancelled";

  // Metadata
  createdBy: string; // Admin user ID who created the link
  createdByEmail: string; // Admin email for audit trail
  createdAt: Date;
  expiresAt: Date; // 3 days from creation

  // Usage tracking
  usedAt?: Date;
  usedBy?: string; // Clerk user ID who completed registration
  clerkUserId?: string; // Created Clerk user ID
  clerkOrgId?: string; // Created Clerk organization ID
  firestoreUserId?: string; // Created Firestore user document ID
  firestoreOrgId?: string; // Created Firestore organization document ID

  // Email tracking
  emailSent: boolean;
  emailSentAt?: Date;
  emailResendCount: number;
  lastEmailSentAt?: Date;

  // Cancellation tracking
  cancelledAt?: Date;
  cancelledBy?: string; // Admin user ID who cancelled
  cancellationReason?: string;

  // Audit trail
  notes?: string; // Admin notes about this registration
}

// Email trigger collection for Firebase Extensions
export interface RegistrationEmail {
  id?: string;
  to: string[]; // Primary user email
  from?: string; // Sender email (optional, can be set in Firebase Extension config)
  replyTo?: string;
  template: {
    name: "registration_link";
    data: {
      firstName: string;
      lastName: string;
      organizationName: string;
      registrationLink: string;
      expirationDate: string;
      expirationTime: string;
      supportEmail: string;
      companyName: string;
    };
  };
  subject?: string; // Can be overridden
  html?: string; // HTML email body
  text?: string; // Plain text email body
  createdAt: Date;
  delivery?: {
    state: "PENDING" | "PROCESSING" | "SUCCESS" | "ERROR";
    attempts: number;
    startTime?: Date;
    endTime?: Date;
    error?: string;
    info?: any;
  };
}
