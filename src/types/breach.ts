/**
 * Breach Response Data Models
 *
 * These interfaces mirror the Firestore collections used by the breach workflow:
 * - `breach_trigger_taxonomies`
 * - `breach_triggers`
 * - `breaches`
 *
 * Each model exposes optional future-proofed fields so the UI can evolve without
 * forcing breaking schema changes.
 */

export type BreachTriggerAudience =
  | "regulator"
  | "individual"
  | "media"
  | "law_enforcement"
  | "executive"
  | "third_party";

export type BreachTriggerJurisdictionLevel =
  | "federal"
  | "state"
  | "provincial"
  | "territory"
  | "country"
  | "regional";

export type BreachSeverity = "low" | "medium" | "high" | "critical";

export type BreachLifecycleStatus =
  | "draft"
  | "reported"
  | "investigating"
  | "contained"
  | "resolved"
  | "closed"
  | "archived";

export interface BreachTaxonomyItem {
  id: string;
  canonicalPhrase: string;
  category: string;
  sensitivityLevel: string;
  synonyms: string[];
  keywords?: string[];
  jurisdiction: {
    name: string;
    code?: string;
  };
  metadata?: Record<string, unknown>;
  source?: string;
  originalLine?: string;
  semanticCluster?: string;
  globalIdentifier?: string | null;
  raw?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BreachTriggerRegulationSnapshot {
  regulationId: string;
  regulationCode?: string;
  /** Human readable title cached to avoid additional lookups */
  title?: string;
  citation?: string;
  jurisdictionLevel?: BreachTriggerJurisdictionLevel;
  jurisdictionCode?: string;
  /** ISO timestamp when this snapshot was captured */
  snapshotAt?: string;
  /** Optional revision hash to detect drift */
  regulationRevision?: string;
  /** Optional URL to the authoritative source */
  sourceUrl?: string;
}

export interface BreachTriggerObligation {
  audience: BreachTriggerAudience;
  description: string;
  deadline?: {
    /** ISO duration string (e.g. P3D, PT72H) */
    sla?: string;
    /** When calculated deadline lands – stored on breaches collection */
    computedDueAt?: string;
    /** Additional conditions (e.g. threshold > 500 records) */
    conditions?: string[];
  };
  /** Recommended template ID to use when communicating */
  templateId?: string;
  /** External contact or URL */
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    portalUrl?: string;
  };
  /** Whether this obligation can be waived and the approval path */
  waiver?: {
    allowed: boolean;
    requiredApproverRole?: string;
  };
}

export interface BreachTriggerPlaybook {
  playbookId: string;
  title: string;
  /** Array of checklist item IDs or inline checklist text */
  checklist?: string[];
  /** Optional link to a runbook or knowledge base article */
  referenceUrl?: string;
}

export interface BreachTrigger {
  id: string;
  taxonomyId: string;
  /** Optional multi-select support when one trigger maps to multiple nodes */
  taxonomyIds?: string[];
  title: string;
  summary?: string;
  riskScore?: {
    impact?: number; // 0-10 scale
    likelihood?: number; // 0-10 scale
    calculated?: number; // Weighted score
  };
  severity?: BreachSeverity;
  jurisdictions?: {
    level: BreachTriggerJurisdictionLevel;
    code: string;
  }[];
  /** Cached regulation metadata for offline display */
  regulations?: BreachTriggerRegulationSnapshot[];
  /** Compliance obligations derived from the regulation */
  obligations?: BreachTriggerObligation[];
  recommendedActions?: string[];
  playbooks?: BreachTriggerPlaybook[];
  /** Automation configuration (ticketing, notifications, etc.) */
  automationConfig?: {
    createTask?: boolean;
    taskSystem?:
      | "jira"
      | "servicenow"
      | "asana"
      | "linear"
      | "clickup"
      | "custom";
    taskTemplateId?: string;
    notifyChannels?: string[];
  };
  /** Track validation state against source regulation */
  validation?: {
    status: "current" | "needs_review" | "outdated";
    validatedAt?: string;
    validatedBy?: string;
    notes?: string;
  };
  isArchived?: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  auditLogId?: string;
}

export interface BreachNotificationStatus {
  status:
    | "pending"
    | "drafting"
    | "sent"
    | "acknowledged"
    | "waived"
    | "failed";
  updatedAt: string;
  updatedBy?: string;
  acknowledgedAt?: string;
  deliveryEvidenceUrl?: string;
  notes?: string;
}

export interface BreachNotificationRecipient {
  audience: BreachTriggerAudience;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  portalUrl?: string;
  jurisdictionCode?: string;
}

export interface BreachNotification {
  id: string;
  triggerId: string;
  obligationId?: string;
  recipient: BreachNotificationRecipient;
  plannedDueAt?: string;
  completedAt?: string;
  statusHistory: BreachNotificationStatus[];
  templateId?: string;
  communicationId?: string; // ID for templated communication
  attachments?: string[];
  /** Legal counsel approvals for this notification */
  approvals?: {
    approverId: string;
    approvedAt: string;
    notes?: string;
  }[];
}

export interface BreachEvidenceItem {
  id: string;
  title: string;
  type:
    | "log"
    | "customer_notice"
    | "regulator_correspondence"
    | "forensics"
    | "legal"
    | "media"
    | "other";
  storagePath: string;
  hashed?: {
    algorithm: "SHA-256" | "SHA-512" | "BLAKE3";
    value: string;
    generatedAt: string;
  };
  uploadedAt: string;
  uploadedBy?: string;
  description?: string;
  tags?: string[];
  retentionPolicy?: {
    deleteAt?: string;
    legalHold?: boolean;
    legalHoldReason?: string;
    overrideApprovedBy?: string;
    overrideApprovedAt?: string;
  };
}

export interface BreachStakeholderAck {
  stakeholderRole:
    | "executive"
    | "legal"
    | "privacy"
    | "security"
    | "customer_success"
    | "public_relations"
    | "third_party";
  contactId?: string;
  acknowledgedAt?: string;
  ackStatus?: "pending" | "acknowledged" | "declined";
  notes?: string;
}

export interface BreachImpactSummary {
  affectedIndividuals?: number;
  affectedCustomers?: number;
  affectedRecords?: number;
  dataElements?: string[];
  impactedJurisdictions?: string[];
  severity?: BreachSeverity;
  confidence?: "suspected" | "confirmed";
}

export interface BreachControlAssessment {
  controlId: string;
  framework?: string; // e.g. NIST 800-53, ISO 27001
  status: "failed" | "partially_failed" | "not_applicable" | "operating";
  notes?: string;
}

export interface BreachTimelineEntry {
  id: string;
  label: string;
  type:
    | "detection"
    | "containment"
    | "eradication"
    | "recovery"
    | "notification"
    | "postmortem"
    | "other";
  occurredAt: string;
  description?: string;
  relatedNotificationIds?: string[];
  relatedEvidenceIds?: string[];
}

export interface BreachTicketLink {
  system: "jira" | "servicenow" | "asana" | "linear" | "clickup" | "custom";
  ticketId: string;
  url?: string;
  status?: string;
  syncedAt?: string;
}

export interface BreachRecord {
  id: string;
  organizationId: string;
  title: string;
  summary?: string;
  status: BreachLifecycleStatus;
  severity: BreachSeverity;
  triageScore?: number;
  taxonomySelections: {
    nodeId: string;
    triggerIds?: string[];
  }[];
  triggerIds: string[];
  notifications?: BreachNotification[];
  evidence?: BreachEvidenceItem[];
  stakeholders?: BreachStakeholderAck[];
  impact: BreachImpactSummary;
  controls?: BreachControlAssessment[];
  timeline?: BreachTimelineEntry[];
  ticketLinks?: BreachTicketLink[];
  automationState?: {
    lastEvaluatedAt?: string;
    pendingActions?: string[];
  };
  simulation?: {
    isSimulation: boolean;
    scenarioId?: string;
    scheduledAt?: string;
    runbookLink?: string;
  };
  postIncident?: {
    remediationSummary?: string;
    costEstimateUsd?: number;
    lessonsLearned?: string[];
    effectiveSince?: string;
  };
  createdAt: string;
  createdBy?: string;
  updatedAt: string;
  updatedBy?: string;
  archivedAt?: string;
}

export interface BreachDashboardSummary {
  totalBreaches: number;
  byStatus: Record<BreachLifecycleStatus, number>;
  bySeverity: Record<BreachSeverity, number>;
  upcomingDeadlines: {
    notificationId: string;
    breachId: string;
    dueAt: string;
    audience: BreachTriggerAudience;
    status: BreachNotificationStatus["status"];
  }[];
  jurisdictionsImpacted: Record<string, number>;
}
