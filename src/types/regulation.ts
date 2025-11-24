/**
 * Regulation Types for Frontend
 *
 * TypeScript types and interfaces for creating and managing regulations
 * in the Firebase Firestore collection.
 */

// Jurisdiction Types
export type JurisdictionType = "state" | "federal";

export type RegulationStatus = "active" | "inactive" | "draft" | "superseded";

export type RegulationType =
  | "privacy"
  | "breach_notification"
  | "data_protection"
  | "other";

export type NotificationTimelineType =
  | "hours"
  | "days"
  | "business_days"
  | "immediate";

// Breach Notification Interface
export interface BreachNotification {
  required: boolean;
  timelineHours?: number | null;
  timelineDays?: number | null;
  thresholdRecords?: number | null;
  notifyAttorneyGeneral?: boolean;
  notifyDataSubjects?: boolean;
  notifyConsumerReportingAgencies?: boolean;
  agNotificationMethod?: string | null;
  consumerNotificationMethod?: string | null;
}

// Requirements Interface
export interface Requirements {
  dataInventory?: boolean;
  riskAssessment?: boolean;
  securityProgram?: boolean;
  vendorManagement?: boolean;
  incidentResponse?: boolean;
  dataRetention?: boolean;
  rightToDelete?: boolean;
  rightToAccess?: boolean;
  rightToCorrect?: boolean;
  rightToOptOut?: boolean;
  encryptionSafeHarbor?: boolean;
}

// Penalties Interface
export interface Penalties {
  civilPenaltyPerViolation?: number | null;
  maxCivilPenalty?: number | null;
  criminalPenalties?: boolean;
  attorneyFees?: boolean;
  classActionAllowed?: boolean;
  privateRightOfAction?: boolean;
}

// References Interface
export interface References {
  statuteNumber?: string | null;
  url?: string | null;
  lastReviewedDate?: string | null;
}

// Contact Info Interface
export interface ContactInfo {
  agencyName?: string | null;
  agencyUrl?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  mailingAddress?: string | null;
  agNotificationMethod?: string | null;
  consumerNotificationMethod?: string | null;
}

// Covered Data Type Interface
export interface CoveredDataType {
  category: string;
  elements: string[];
  sensitivityLevel?: string;
}

// Main Regulation Interface
export interface Regulation {
  // Core identification
  id?: string; // Firestore document ID (auto-generated)
  state?: string; // State code (e.g., "CA", "NY", "FEDERAL")
  stateCode?: string; // Alias for state
  jurisdictionType: JurisdictionType;
  jurisdictionName: string;

  // Regulation details
  regulationName: string;
  regulationType?: RegulationType;
  industry?: string; // Industry classification (e.g., "General", "Healthcare", "Financial")

  // Dates
  effectiveDate?: string | null; // ISO date string
  lastUpdated?: string | null; // ISO date string
  status?: RegulationStatus;

  // Breach notification requirements
  breachNotification?: BreachNotification;

  // Compliance requirements
  requirements?: Requirements;

  // Penalties
  penalties?: Penalties;

  // Content
  scope?: string;
  definitions?: string;
  exemptions?: string | null;

  // References
  references?: References;

  // Additional fields
  contactInfo?: ContactInfo;
  coveredDataTypes?: CoveredDataType[];
  specialCategories?: string[];

  // Metadata
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  createdBy?: string | null;
  updatedBy?: string | null;
  notes?: string | null;
}

// Request DTO for creating a regulation
export interface CreateRegulationRequest {
  state: string;
  jurisdictionType: JurisdictionType;
  jurisdictionName: string;
  regulationName: string;
  regulationType?: RegulationType;
  industry?: string;
  effectiveDate?: string;
  status?: RegulationStatus;
  breachNotification?: Partial<BreachNotification>;
  requirements?: Partial<Requirements>;
  penalties?: Partial<Penalties>;
  scope?: string;
  definitions?: string;
  exemptions?: string;
  references?: Partial<References>;
  contactInfo?: Partial<ContactInfo>;
  coveredDataTypes?: CoveredDataType[];
  specialCategories?: string[];
  notes?: string;
}

// Response from API
export interface CreateRegulationResponse {
  id: string;
  message: string;
  regulation: Regulation;
}

// Update request (partial update)
export interface UpdateRegulationRequest
  extends Partial<CreateRegulationRequest> {
  id: string;
}

