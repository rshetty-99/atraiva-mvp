// Firestore Data Models for Atraiva Compliance Platform

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: 'admin' | 'compliance_officer' | 'analyst' | 'viewer';
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  country: string;
  state?: string;
  applicableRegulations: string[];
  subscriptionPlan: 'free' | 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'canceled' | 'trialing';
  createdAt: Date;
  updatedAt: Date;
}

export interface DataBreach {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: 'reported' | 'investigating' | 'contained' | 'resolved' | 'closed';
  severity: 'low' | 'medium' | 'high' | 'critical';
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
  type: 'ssn' | 'email' | 'phone' | 'address' | 'financial' | 'medical' | 'biometric' | 'other';
  description: string;
  count: number;
  sensitivity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BreachNotification {
  id: string;
  breachId: string;
  recipientType: 'individual' | 'regulator' | 'media' | 'law_enforcement';
  recipientName: string;
  recipientEmail?: string;
  recipientAddress?: string;
  regulation: string;
  deadline: Date;
  status: 'pending' | 'sent' | 'delivered' | 'acknowledged' | 'failed';
  sentAt?: Date;
  acknowledgedAt?: Date;
  content: string;
  method: 'email' | 'mail' | 'phone' | 'online' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceCheck {
  id: string;
  organizationId: string;
  regulation: string;
  checkType: 'automated' | 'manual' | 'periodic';
  status: 'pending' | 'running' | 'completed' | 'failed';
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
  type: 'gap' | 'risk' | 'improvement' | 'compliant';
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  regulation: string;
  section: string;
  remediation: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
  assignedTo?: string;
  dueDate?: Date;
  resolvedAt?: Date;
}

export interface Document {
  id: string;
  organizationId: string;
  breachId?: string;
  name: string;
  type: 'policy' | 'procedure' | 'evidence' | 'report' | 'correspondence' | 'other';
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
  scanType: 'database' | 'file_system' | 'cloud_storage' | 'api';
  targetSystem: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
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
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface BreachTimelineEvent {
  id: string;
  type: 'discovery' | 'containment' | 'investigation' | 'notification' | 'resolution' | 'other';
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
  recipientType: 'individual' | 'regulator' | 'media';
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