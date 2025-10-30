/**
 * COMPLETE FIRESTORE DATABASE SCHEMA
 * Breach Notification SaaS Platform
 * Version 1.0
 * 
 * This schema covers all collections, subcollections, and document structures
 * for the entire platform including reference data and operational data.
 */

// ============================================================================
// REFERENCE DATA COLLECTIONS (Mostly Static)
// ============================================================================

/**
 * PII Elements Reference Collection
 * Path: /reference_data/pii_elements/{elementId}
 * Description: Master list of all PII data types we scan for
 */
interface PIIElement {
  id: string; // e.g., "pii_ssn", "pii_credit_card"
  
  // Categorization
  category: 'identifiers' | 'government_ids' | 'financial' | 'health' | 
            'biometric' | 'digital' | 'credentials' | 'location' | 'demographics';
  subcategory?: string; // e.g., "federal_id", "state_id"
  
  // Basic Information
  name: string; // e.g., "social_security_number"
  displayName: string; // e.g., "Social Security Number"
  abbreviation?: string; // e.g., "SSN"
  description: string;
  examples?: string[]; // Sample formats
  
  // Detection Configuration
  detection: {
    patterns: {
      regex: string;
      confidence: number; // 0-100
      description: string;
    }[];
    keywords: string[]; // Associated keywords
    contextClues: string[]; // Surrounding text that increases confidence
    purviewClassifierIds: string[]; // Microsoft Purview classifier IDs
    customClassifierIds?: string[]; // Custom trained classifiers
    minimumConfidence: number; // Threshold for positive detection
  };
  
  // Risk Assessment
  sensitivity: {
    level: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number; // 1-10
    requiresEncryption: boolean;
    requiresSpecialHandling: boolean;
    cannotBeStored?: boolean; // For extremely sensitive data
  };
  
  // Regulatory Mapping
  regulatory: {
    alwaysTriggersBreach: boolean;
    triggeringRegulations: string[]; // Regulation IDs
    specialRequirements: {
      [stateCode: string]: {
        additionalRequirements: string;
        differentThreshold?: number;
      };
    };
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    lastValidatedAt: Timestamp;
    version: string;
    active: boolean;
    notes?: string;
  };
}

/**
 * Regulations Reference Collection
 * Path: /reference_data/regulations/{regulationId}
 * Description: All breach notification laws and requirements
 */
interface Regulation {
  id: string; // e.g., "reg_ca_1798_82", "reg_hipaa"
  
  // Jurisdiction Information
  jurisdiction: {
    type: 'federal' | 'state' | 'territory' | 'local' | 'international';
    code: string; // e.g., "CA", "NY", "US", "EU"
    name: string; // e.g., "California"
    fullName: string; // e.g., "State of California"
    region?: string; // e.g., "North America"
  };
  
  // Legal Reference
  law: {
    shortName: string; // e.g., "CCPA"
    fullName: string; // e.g., "California Consumer Privacy Act"
    citation: string; // e.g., "Cal. Civ. Code § 1798.82"
    statuteNumber?: string;
    publicLawNumber?: string;
    effectiveDate: Timestamp;
    lastAmendedDate?: Timestamp;
    sunsetDate?: Timestamp; // If law expires
    replacedBy?: string; // If superseded by another law
    url: string; // Link to official text
    pdfUrl?: string; // Link to PDF version
  };
  
  // Breach Definition
  breachDefinition: {
    definition: string; // Legal definition text
    requiresActualHarm: boolean;
    requiresLikelihoodOfHarm: boolean;
    goodFaithException: boolean; // Employee good faith access
    employeeException: boolean;
    encryptionSafeHarbor: boolean;
    redactionSafeHarbor: boolean;
    riskAssessmentAllowed: boolean;
    riskAssessmentStandard?: string; // Specific standard required
  };
  
  // Covered Entities
  coveredEntities: {
    types: ('data_owner' | 'data_maintainer' | 'data_processor' | 'service_provider')[];
    sizeThreshold?: {
      metric: 'revenue' | 'employees' | 'records' | 'customers';
      value: number;
      period?: string; // e.g., "annual"
    };
    industrySpecific: string[]; // Specific industries covered
    exemptions: {
      type: string;
      description: string;
      conditions?: string;
    }[];
  };
  
  // Personal Information Definition
  personalInfoDefinition: {
    generalDefinition: string;
    specificElements: string[]; // PII element IDs
    requiresCombination: boolean; // Name + another element
    combinationRules: {
      baseElement: string; // Usually "name"
      plusOneOf: string[]; // PII element IDs
    }[];
    excludes: string[]; // Publicly available info, etc.
    specialCategories: {
      category: string;
      elements: string[];
      specialRules?: string;
    }[];
  };
  
  // Notification Thresholds
  thresholds: {
    minimum: number; // Minimum affected individuals
    triggerLogic: 'absolute' | 'state_residents' | 'nationwide';
    specialThresholds: {
      condition: string;
      threshold: number;
    }[];
  };
  
  // Notification Requirements
  notificationRequirements: {
    // Consumer Notification
    consumers: {
      required: boolean;
      timeline: {
        description: string; // e.g., "without unreasonable delay"
        maxDays?: number; // Specific number if defined
        businessDays: boolean; // vs calendar days
        triggersFrom: 'discovery' | 'confirmation' | 'law_enforcement_clearance';
      };
      methods: ('written' | 'email' | 'telephone' | 'substitute' | 'website')[];
      substituteNoticeThreshold?: number; // When substitute notice allowed
      contentRequirements: string[]; // Required elements in notice
      languageRequirements?: string[]; // Languages required
      formatRequirements?: string[]; // Specific format requirements
    };
    
    // Regulator Notification (AG, etc.)
    regulator: {
      required: boolean;
      agency: string; // e.g., "Attorney General"
      timeline: {
        description: string;
        maxDays?: number;
        businessDays: boolean;
        triggersFrom: 'discovery' | 'confirmation' | 'consumer_notification';
      };
      threshold?: number; // May differ from consumer threshold
      submissionMethod: 'online' | 'email' | 'mail' | 'phone';
      submissionUrl?: string;
      submissionEmail?: string;
      requiredForms?: string[];
      requiredInfo: string[]; // Information that must be included
    };
    
    // Media Notification
    media: {
      required: boolean;
      threshold: number; // Usually higher, e.g., 500+
      timeline: {
        description: string;
        maxDays?: number;
        sameAsConsumer: boolean;
      };
      outlets: ('newspaper' | 'television' | 'radio' | 'website')[];
      geographicScope: 'local' | 'statewide' | 'national';
      contentRequirements?: string[];
    };
    
    // Credit Reporting Agencies
    creditAgencies: {
      required: boolean;
      threshold: number;
      agencies: string[]; // Specific agencies
      timeline: {
        description: string;
        maxDays?: number;
      };
      contentRequirements?: string[];
    };
    
    // Other Notifications
    other?: {
      entity: string;
      required: boolean;
      conditions: string;
      timeline: string;
    }[];
  };
  
  // Exemptions and Safe Harbors
  exemptions: {
    encryption: {
      applies: boolean;
      standard: string; // e.g., "NIST-approved"
      keyCompromiseNegates: boolean;
      requiresDocumentation: boolean;
    };
    
    riskAssessment: {
      applies: boolean;
      standard: string; // Specific methodology
      factors: string[]; // Factors to consider
      documentationRequired: boolean;
      reviewRequired: boolean; // External review
    };
    
    lawEnforcement: {
      delayAllowed: boolean;
      requiresWrittenRequest: boolean;
      maxDelayDays?: number;
      conditions: string;
    };
    
    other: {
      name: string;
      description: string;
      conditions: string;
      documentation: string;
    }[];
  };
  
  // Penalties and Enforcement
  penalties: {
    civil: {
      applicable: boolean;
      perViolation?: {
        min: number;
        max: number;
      };
      perPerson?: {
        min: number;
        max: number;
      };
      aggregateCap?: number;
      factors: string[]; // Factors affecting penalty amount
    };
    
    criminal: {
      applicable: boolean;
      conditions: string;
      penalties: string;
    };
    
    regulatory: {
      enforcementAgency: string;
      enforcementActions: string[];
      investigationPowers: string[];
    };
    
    privateRight: {
      allowed: boolean;
      statutoryDamages?: {
        min: number;
        max: number;
      };
      actualDamages: boolean;
      punitiveDamages: boolean;
      attorneysFees: boolean;
      classAction: boolean;
      statuteOfLimitations: string;
    };
  };
  
  // Industry-Specific Variations
  industryVariations?: {
    [industry: string]: {
      additionalRequirements: string[];
      differentTimelines?: object;
      specialForms?: string[];
    };
  };
  
  // Related Regulations
  related: {
    supersedes?: string[]; // Regulation IDs this replaces
    supersededBy?: string; // If this is replaced
    supplements?: string[]; // Additional regulations that apply
    conflictsWith?: string[]; // Regulations with conflicting requirements
    similarTo?: string[]; // Similar regulations in other jurisdictions
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastReviewedAt: Timestamp;
    nextReviewDate: Timestamp;
    createdBy: string;
    approvedBy: string;
    version: string;
    changeLog?: {
      date: Timestamp;
      changes: string;
      updatedBy: string;
    }[];
    sources: string[]; // Where this info came from
    notes?: string;
    active: boolean;
    tags: string[]; // For categorization
  };
}

/**
 * Notification Templates Collection
 * Path: /reference_data/notification_templates/{templateId}
 * Description: Pre-approved notification templates
 */
interface NotificationTemplate {
  id: string;
  name: string;
  
  // Template Classification
  type: 'consumer' | 'regulator' | 'media' | 'credit_agency' | 'internal';
  category: 'standard' | 'industry_specific' | 'state_specific' | 'federal';
  
  // Applicability
  applicable: {
    jurisdictions: string[]; // Regulation IDs
    industries?: string[];
    incidentTypes?: string[];
    severities?: ('low' | 'medium' | 'high' | 'critical')[];
  };
  
  // Content Structure
  content: {
    subject: string; // With {{placeholders}}
    
    // Header Section
    header: {
      template: string;
      required: boolean;
      variables: string[];
    };
    
    // Body Sections
    sections: {
      id: string;
      title: string;
      template: string;
      required: boolean;
      order: number;
      conditions?: string; // When to include
      variables: string[];
    }[];
    
    // Footer Section
    footer: {
      template: string;
      required: boolean;
      variables: string[];
    };
    
    // Attachments
    attachments?: {
      name: string;
      type: string;
      required: boolean;
      template?: string;
    }[];
  };
  
  // Variables Used
  variables: {
    [key: string]: {
      type: 'string' | 'number' | 'date' | 'boolean' | 'list';
      source: string; // Where to get this data
      required: boolean;
      format?: string; // Display format
      default?: any;
      validation?: string; // Validation rule
    };
  };
  
  // Multi-language Support
  translations?: {
    [languageCode: string]: {
      subject: string;
      content: object; // Translated content structure
    };
  };
  
  // Compliance Validation
  compliance: {
    validated: boolean;
    validatedBy?: string;
    validatedAt?: Timestamp;
    validationNotes?: string;
    meetsRequirements: string[]; // Regulation IDs
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    lastUsedAt?: Timestamp;
    useCount: number;
    version: string;
    active: boolean;
  };
}

/**
 * Industries Reference Collection
 * Path: /reference_data/industries/{industryId}
 * Description: Industry-specific requirements and configurations
 */
interface Industry {
  id: string; // e.g., "healthcare", "financial", "retail"
  name: string;
  description: string;
  
  // Regulatory Requirements
  regulations: {
    federal: string[]; // Regulation IDs
    common_state: string[]; // Commonly applicable state regulations
    specific_requirements: {
      [regulationId: string]: {
        additionalRequirements: string[];
        specialTimelines?: object;
      };
    };
  };
  
  // Common Data Types
  commonDataTypes: {
    piiElements: string[]; // PII element IDs
    industrySpecific: {
      name: string;
      description: string;
      sensitivity: 'low' | 'medium' | 'high' | 'critical';
    }[];
  };
  
  // Best Practices
  bestPractices: {
    category: string;
    practice: string;
    priority: 'required' | 'recommended' | 'optional';
  }[];
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    active: boolean;
  };
}

// ============================================================================
// OPERATIONAL DATA COLLECTIONS
// ============================================================================

/**
 * Organizations Collection (Multi-tenant)
 * Path: /organizations/{organizationId}
 * Description: Law firms, enterprises, channel partners
 */
interface Organization {
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
      escalationRules: object[];
    };
    
    // Security Settings
    security: {
      mfaRequired: boolean;
      ssoEnabled: boolean;
      ssoProvider?: string;
      ipWhitelist?: string[];
      sessionTimeout: number; // minutes
      passwordPolicy: object;
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
interface User {
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

/**
 * Clients Collection
 * Path: /clients/{clientId}
 * Description: Enterprise clients managed by law firms
 */
interface Client {
  id: string;
  
  // Ownership
  ownership: {
    organizationId: string; // Managing law firm
    createdBy: string;
    assignedUsers: string[]; // User IDs with access
    sharedWith?: string[]; // Other org IDs (for collaboration)
  };
  
  // Client Profile
  profile: {
    companyName: string;
    legalName?: string;
    dba?: string[]; // Doing Business As names
    industry: string;
    subIndustry?: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    employeeCount?: number;
    annualRevenue?: number;
    website?: string;
    logo?: string;
    
    // Locations
    headquarters: {
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    
    operatingLocations: {
      state: string;
      country: string;
      hasPhysicalPresence: boolean;
      hasCustomers: boolean;
      hasEmployees: boolean;
      dataProcessing: boolean;
    }[];
  };
  
  // Compliance Profile
  compliance: {
    // Applicable Regulations
    regulations: {
      confirmed: string[]; // Regulation IDs confirmed to apply
      potential: string[]; // May apply, needs review
      exempted: string[]; // Confirmed not to apply
    };
    
    // Data Profile
    dataProfile: {
      collectsPII: boolean;
      piiTypes: string[]; // PII element IDs
      dataSubjectTypes: ('customers' | 'employees' | 'vendors' | 'patients' | 'students')[];
      estimatedRecords: {
        total: number;
        byState?: { [state: string]: number };
      };
      dataLocations: string[]; // Where data is stored
    };
    
    // Special Requirements
    specialRequirements: {
      hipaaCompliant?: boolean;
      pciCompliant?: boolean;
      soc2Compliant?: boolean;
      iso27001?: boolean;
      customRequirements?: string[];
    };
    
    // Risk Profile
    riskProfile: {
      level: 'low' | 'medium' | 'high' | 'critical';
      factors: string[];
      lastAssessment?: Timestamp;
      nextAssessment?: Timestamp;
    };
  };
  
  // Microsoft Purview Configuration
  purview: {
    connections: {
      id: string;
      name: string;
      tenantId: string;
      accountName: string;
      region: string;
      status: 'connected' | 'error' | 'pending' | 'disconnected';
      lastSync?: Timestamp;
      nextSync?: Timestamp;
      syncSchedule?: {
        frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
        time?: string; // For daily/weekly/monthly
        dayOfWeek?: number; // For weekly
        dayOfMonth?: number; // For monthly
      };
      configuration: {
        scanSources: string[];
        includedAssetTypes: string[];
        excludedPaths?: string[];
        classifiersEnabled: string[];
      };
    }[];
  };
  
  // Contacts
  contacts: {
    role: 'primary' | 'legal' | 'technical' | 'security' | 'executive' | 'billing';
    name: string;
    title?: string;
    email: string;
    phone?: string;
    isPrimary: boolean;
    receiveNotifications: boolean;
    notificationTypes?: string[];
  }[];
  
  // Incident History
  incidentStats: {
    totalIncidents: number;
    openIncidents: number;
    averageResolutionTime: number; // hours
    lastIncidentDate?: Timestamp;
    complianceRate: number; // percentage
  };
  
  // Documents
  documents?: {
    id: string;
    name: string;
    type: 'contract' | 'policy' | 'assessment' | 'report' | 'other';
    url: string; // Cloud Storage URL
    uploadedAt: Timestamp;
    uploadedBy: string;
  }[];
  
  // Custom Fields
  customFields?: {
    [key: string]: any;
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    onboardedAt?: Timestamp;
    lastReviewedAt?: Timestamp;
    nextReviewDate?: Timestamp;
    archivedAt?: Timestamp;
    status: 'active' | 'inactive' | 'onboarding' | 'archived';
    tags?: string[];
    notes?: string;
  };
}

/**
 * Incidents Collection
 * Path: /incidents/{incidentId}
 * Description: Breach incidents
 */
interface Incident {
  id: string;
  
  // Ownership
  ownership: {
    clientId: string;
    organizationId: string;
    createdBy: string;
    assignedTo?: string[];
    teamMembers?: string[];
  };
  
  // Incident Details
  details: {
    title: string;
    description: string;
    type: 'breach' | 'potential_breach' | 'security_incident' | 'privacy_incident';
    category: 'malware' | 'phishing' | 'insider' | 'physical' | 'misconfiguration' | 'third_party' | 'unknown';
    vector?: string; // Attack vector
    severity: 'low' | 'medium' | 'high' | 'critical';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    
    // External References
    ticketNumber?: string; // External ticket system
    caseNumber?: string; // Legal case number
    insuranceClaimNumber?: string;
  };
  
  // Status & Timeline
  status: {
    current: 'detected' | 'investigating' | 'confirmed' | 'contained' | 
             'eradicated' | 'recovered' | 'closed' | 'false_positive';
    
    timeline: {
      detected: Timestamp;
      reported?: Timestamp;
      investigationStarted?: Timestamp;
      confirmed?: Timestamp;
      contained?: Timestamp;
      notificationSent?: Timestamp;
      eradicated?: Timestamp;
      recovered?: Timestamp;
      closed?: Timestamp;
    };
    
    // Sub-statuses for detailed tracking
    subStatus?: string;
    statusHistory: {
      status: string;
      timestamp: Timestamp;
      changedBy: string;
      notes?: string;
    }[];
  };
  
  // Scope & Impact
  scope: {
    // Systems Affected
    systems: {
      id: string;
      name: string;
      type: string;
      compromised: boolean;
      containmentStatus?: string;
    }[];
    
    // Data Affected
    dataTypes: {
      piiElementId: string;
      confirmed: boolean;
      quantity?: number;
      encrypted: boolean;
      exfiltrated: boolean;
    }[];
    
    // Time Window
    timeWindow: {
      start?: Timestamp;
      end?: Timestamp;
      ongoing: boolean;
      duration?: number; // hours
    };
    
    // Affected Individuals
    affectedIndividuals: {
      total?: number;
      confirmed?: number;
      potential?: number;
      
      byState?: {
        [state: string]: {
          count: number;
          notified: boolean;
          notificationDate?: Timestamp;
        };
      };
      
      byCountry?: {
        [country: string]: number;
      };
      
      categories?: {
        customers?: number;
        employees?: number;
        vendors?: number;
        other?: number;
      };
    };
    
    // Business Impact
    businessImpact?: {
      operationalImpact: 'none' | 'minimal' | 'moderate' | 'severe' | 'critical';
      financialImpact?: number;
      reputationalImpact: 'low' | 'medium' | 'high';
      dataIntegrity: 'intact' | 'questionable' | 'compromised';
      serviceAvailability: 'no_impact' | 'degraded' | 'unavailable';
    };
  };
  
  // Investigation
  investigation: {
    leadInvestigator?: string;
    team?: string[];
    
    findings?: {
      rootCause?: string;
      vulnerabilitiesExploited?: string[];
      indicatorsOfCompromise?: string[];
      attackTimeline?: object[];
    };
    
    forensics?: {
      evidenceCollected: boolean;
      chainOfCustody: boolean;
      forensicsReport?: string; // URL
      lawEnforcementInvolved: boolean;
      lawEnforcementAgency?: string;
      lawEnforcementCaseNumber?: string;
    };
  };
  
  // Compliance Assessment
  compliance: {
    assessmentComplete: boolean;
    assessedAt?: Timestamp;
    assessedBy?: string;
    
    // Applicable Regulations
    applicableRegulations: {
      regulationId: string;
      applies: boolean;
      reason?: string;
      requirements?: object;
    }[];
    
    // Notification Requirements
    notificationRequirements: {
      regulationId: string;
      type: 'consumer' | 'regulator' | 'media' | 'credit_agency';
      required: boolean;
      deadline: Timestamp;
      status: 'pending' | 'drafted' | 'approved' | 'sent' | 'not_required';
      completedAt?: Timestamp;
    }[];
    
    // Exemptions
    exemptions: {
      regulationId: string;
      exemptionType: string;
      applies: boolean;
      justification?: string;
      documentation?: string;
    }[];
    
    // Overall Compliance
    complianceStatus: 'compliant' | 'non_compliant' | 'partial' | 'pending';
    complianceNotes?: string;
  };
  
  // Response Actions
  response: {
    containmentActions: {
      action: string;
      timestamp: Timestamp;
      performedBy: string;
      successful: boolean;
      notes?: string;
    }[];
    
    eradicationActions: {
      action: string;
      timestamp: Timestamp;
      performedBy: string;
      successful: boolean;
      notes?: string;
    }[];
    
    recoveryActions: {
      action: string;
      timestamp: Timestamp;
      performedBy: string;
      successful: boolean;
      notes?: string;
    }[];
    
    preventiveActions: {
      action: string;
      dueDate?: Timestamp;
      assignedTo?: string;
      status: 'planned' | 'in_progress' | 'completed';
    }[];
  };
  
  // Communications
  communications: {
    internal: {
      timestamp: Timestamp;
      from: string;
      to: string[];
      subject: string;
      message: string;
      attachments?: string[];
    }[];
    
    external: {
      timestamp: Timestamp;
      from: string;
      to: string;
      type: 'customer' | 'regulator' | 'media' | 'vendor' | 'other';
      subject: string;
      message: string;
      attachments?: string[];
    }[];
  };
  
  // Lessons Learned
  lessonsLearned?: {
    whatWentWell: string[];
    whatWentWrong: string[];
    improvements: string[];
    updatedProcedures?: string[];
    training?: string[];
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    version: number; // For optimistic locking
    tags?: string[];
    customFields?: { [key: string]: any };
  };
}

/**
 * Evidence Subcollection
 * Path: /incidents/{incidentId}/evidence/{evidenceId}
 * Description: Evidence for incidents
 */
interface Evidence {
  id: string;
  
  // Evidence Details
  details: {
    name: string;
    description?: string;
    type: 'log' | 'screenshot' | 'document' | 'email' | 'forensic_image' | 
          'network_capture' | 'memory_dump' | 'malware_sample' | 'other';
    category: 'technical' | 'administrative' | 'physical' | 'testimonial';
    source: string; // System or person
    originalLocation?: string;
  };
  
  // File Information
  file: {
    filename: string;
    mimeType: string;
    size: number; // bytes
    storageUrl: string; // Cloud Storage URL
    thumbnailUrl?: string;
    
    // Integrity
    checksums: {
      md5: string;
      sha1: string;
      sha256: string;
    };
  };
  
  // Chain of Custody
  chainOfCustody: {
    collectedBy: string;
    collectedAt: Timestamp;
    collectionMethod: string;
    
    // Custody Log
    transfers: {
      from: string;
      to: string;
      timestamp: Timestamp;
      purpose: string;
      verified: boolean;
    }[];
    
    // Access Log
    accesses: {
      userId: string;
      timestamp: Timestamp;
      action: 'view' | 'download' | 'analyze' | 'modify';
      ipAddress?: string;
      justification?: string;
    }[];
    
    // Integrity Checks
    integrityChecks: {
      timestamp: Timestamp;
      performedBy: string;
      checksums: object;
      verified: boolean;
    }[];
  };
  
  // Analysis
  analysis?: {
    analyzedBy?: string;
    analyzedAt?: Timestamp;
    findings?: string;
    relevance: 'high' | 'medium' | 'low' | 'none';
    tags?: string[];
  };
  
  // Legal Hold
  legalHold?: {
    active: boolean;
    placedBy?: string;
    placedAt?: Timestamp;
    reason?: string;
    releaseDate?: Timestamp;
  };
  
  // Metadata
  metadata: {
    uploadedAt: Timestamp;
    uploadedBy: string;
    lastModified?: Timestamp;
    modifiedBy?: string;
    deleted?: boolean;
    deletedAt?: Timestamp;
    deletedBy?: string;
  };
}

/**
 * Purview Snapshots Collection
 * Path: /snapshots/{snapshotId}
 * Description: Microsoft Purview metadata snapshots
 */
interface PurviewSnapshot {
  id: string;
  
  // Ownership
  ownership: {
    clientId: string;
    connectionId: string; // Which Purview connection
    organizationId: string;
  };
  
  // Snapshot Details
  details: {
    type: 'full' | 'delta' | 'on_demand';
    trigger: 'scheduled' | 'manual' | 'incident';
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'partial';
    
    // Timing
    scheduledAt?: Timestamp;
    startedAt: Timestamp;
    completedAt?: Timestamp;
    duration?: number; // seconds
    
    // Scope
    scope: {
      sources: string[]; // Data sources scanned
      assetTypes: string[];
      filters?: object;
    };
  };
  
  // Results Summary
  summary: {
    totalAssets: number;
    newAssets?: number; // For delta
    modifiedAssets?: number; // For delta
    deletedAssets?: number; // For delta
    
    // By Classification
    byClassification: {
      [classification: string]: number;
    };
    
    // By Sensitivity
    bySensitivity: {
      public: number;
      internal: number;
      confidential: number;
      restricted: number;
    };
    
    // PII Detection
    piiDetection: {
      totalPIIAssets: number;
      byPIIType: {
        [piiElementId: string]: {
          count: number;
          confidence: number;
        };
      };
    };
    
    // Data Subject Analysis
    dataSubjects?: {
      estimated: number;
      byState?: { [state: string]: number };
      byCountry?: { [country: string]: number };
    };
  };
  
  // Comparison (for delta snapshots)
  comparison?: {
    previousSnapshotId: string;
    changes: {
      added: string[]; // Asset IDs
      modified: string[]; // Asset IDs
      deleted: string[]; // Asset IDs
      
      classificationChanges: {
        assetId: string;
        before: string[];
        after: string[];
      }[];
      
      sensitivityChanges: {
        assetId: string;
        before: string;
        after: string;
      }[];
    };
    
    // Anomalies Detected
    anomalies?: {
      type: string;
      description: string;
      severity: 'low' | 'medium' | 'high';
      assetIds: string[];
    }[];
  };
  
  // Storage
  storage: {
    format: 'json' | 'parquet' | 'avro';
    compressed: boolean;
    encryption: 'aes256' | 'kms';
    location: string; // Cloud Storage URL
    size: number; // bytes
    
    // For large snapshots, data might be chunked
    chunks?: {
      id: string;
      url: string;
      size: number;
      checksum: string;
    }[];
  };
  
  // Validation
  validation: {
    checksumVerified: boolean;
    integrityCheck: boolean;
    completenessCheck: boolean;
    errors?: string[];
    warnings?: string[];
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    processedAt?: Timestamp;
    expiresAt?: Timestamp; // For retention
    retentionDays: number;
    version: string;
    tags?: string[];
  };
}

/**
 * Assets Subcollection (under Snapshots)
 * Path: /snapshots/{snapshotId}/assets/{assetId}
 * Description: Individual assets from Purview
 */
interface PurviewAsset {
  id: string; // Purview asset ID
  
  // Asset Information
  info: {
    name: string;
    qualifiedName: string; // Fully qualified name in Purview
    type: string; // Asset type (table, file, etc.)
    source: string; // Source system
    path?: string; // File path or location
    container?: string; // Container/database
    schema?: string; // Schema if applicable
  };
  
  // Classification & Sensitivity
  classification: {
    classifications: string[]; // Applied classifications
    confidence: { [classification: string]: number };
    sensitivityLabel?: string;
    informationTypes?: string[];
    customClassifications?: string[];
  };
  
  // PII Detection
  piiDetection?: {
    detected: boolean;
    elements: {
      piiElementId: string;
      confidence: number;
      occurrences?: number;
      sample?: string; // Redacted sample
    }[];
  };
  
  // Metadata
  metadata: {
    createdTime?: Timestamp;
    modifiedTime?: Timestamp;
    size?: number;
    owner?: string;
    department?: string;
    projectId?: string;
    tags?: string[];
    customMetadata?: { [key: string]: any };
  };
  
  // Access Information
  access?: {
    lastAccessedTime?: Timestamp;
    accessFrequency?: number;
    uniqueUsers?: number;
    permissions?: object;
  };
  
  // Lineage
  lineage?: {
    upstream: string[]; // Asset IDs
    downstream: string[]; // Asset IDs
    processes?: string[]; // Process IDs
  };
  
  // Snapshot Metadata
  snapshotMetadata: {
    capturedAt: Timestamp;
    changeType?: 'new' | 'modified' | 'unchanged' | 'deleted';
    previousVersion?: string; // For tracking changes
  };
}

/**
 * Notifications Collection
 * Path: /notifications/{notificationId}
 * Description: Generated breach notifications
 */
interface Notification {
  id: string;
  
  // Association
  association: {
    incidentId: string;
    clientId: string;
    organizationId: string;
  };
  
  // Notification Details
  details: {
    type: 'consumer' | 'regulator' | 'media' | 'credit_agency' | 'internal' | 'other';
    subtype?: string; // More specific type
    templateId?: string; // Template used
    regulationId?: string; // Driving regulation
    
    // Status
    status: 'draft' | 'pending_review' | 'approved' | 'scheduled' | 
            'sending' | 'sent' | 'delivered' | 'failed' | 'cancelled';
    
    // Priority
    priority: 'low' | 'medium' | 'high' | 'urgent';
    
    // Deadlines
    legalDeadline?: Timestamp;
    targetSendDate?: Timestamp;
    actualSendDate?: Timestamp;
  };
  
  // Recipients
  recipients: {
    // For Individual Notifications
    individuals?: {
      total: number;
      segments?: {
        name: string;
        count: number;
        criteria: object;
      }[];
    };
    
    // For Authority Notifications
    authorities?: {
      agency: string;
      jurisdiction: string;
      contactEmail?: string;
      contactPhone?: string;
      submissionUrl?: string;
    }[];
    
    // For Media
    media?: {
      outlet: string;
      type: 'newspaper' | 'tv' | 'radio' | 'online';
      contact?: string;
    }[];
    
    // Delivery Lists (for bulk)
    lists?: {
      id: string;
      name: string;
      count: number;
      url?: string; // Cloud Storage URL for list
    }[];
  };
  
  // Content
  content: {
    subject?: string;
    body: string; // HTML or plain text
    
    // Personalization
    personalized: boolean;
    variables?: { [key: string]: any };
    
    // Multi-language
    language: string;
    translations?: {
      [languageCode: string]: {
        subject?: string;
        body: string;
      };
    };
    
    // Attachments
    attachments?: {
      name: string;
      type: string;
      url: string;
      size: number;
    }[];
  };
  
  // Delivery Configuration
  delivery: {
    method: 'email' | 'mail' | 'portal' | 'api' | 'fax' | 'phone';
    
    // Email Settings
    email?: {
      provider: 'sendgrid' | 'ses' | 'mailgun';
      fromAddress: string;
      fromName: string;
      replyTo?: string;
      tracking: boolean;
    };
    
    // Physical Mail
    mail?: {
      provider: 'lob' | 'usps';
      mailType: 'first_class' | 'certified' | 'priority';
      returnReceipt: boolean;
      tracking?: string;
    };
    
    // Portal
    portal?: {
      url: string;
      accessCode?: string;
      expiresAt?: Timestamp;
    };
    
    // Scheduling
    scheduling?: {
      scheduledFor?: Timestamp;
      timezone?: string;
      batchSize?: number;
      batchDelay?: number; // seconds between batches
    };
  };
  
  // Tracking
  tracking: {
    // Delivery Tracking
    delivery: {
      sent?: Timestamp;
      delivered?: Timestamp;
      bounced?: boolean;
      bounceReason?: string;
      
      // For physical mail
      inTransit?: Timestamp;
      outForDelivery?: Timestamp;
      returned?: boolean;
    };
    
    // Engagement Tracking
    engagement?: {
      opened?: boolean;
      openedAt?: Timestamp;
      openCount?: number;
      
      clicks?: {
        url: string;
        timestamp: Timestamp;
        count: number;
      }[];
      
      // Portal access
      portalViews?: {
        timestamp: Timestamp;
        ipAddress?: string;
        duration?: number;
      }[];
    };
    
    // Response Tracking
    responses?: {
      timestamp: Timestamp;
      type: 'question' | 'complaint' | 'confirmation' | 'optout';
      content?: string;
      handledBy?: string;
    }[];
  };
  
  // Approval Workflow
  approval?: {
    required: boolean;
    
    approvals: {
      approver: string;
      role: string;
      timestamp: Timestamp;
      status: 'approved' | 'rejected' | 'changes_requested';
      comments?: string;
    }[];
    
    finalApproval?: {
      approver: string;
      timestamp: Timestamp;
    };
  };
  
  // Compliance
  compliance: {
    meetsRequirements: boolean;
    validatedBy?: string;
    validatedAt?: Timestamp;
    
    // Checklist
    checklist: {
      item: string;
      required: boolean;
      completed: boolean;
      notes?: string;
    }[];
    
    // Documentation
    proofOfDelivery?: string; // URL
    certificate?: string; // URL
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    createdBy: string;
    updatedAt: Timestamp;
    updatedBy?: string;
    version: number;
    
    // Audit
    auditLog: {
      timestamp: Timestamp;
      userId: string;
      action: string;
      details?: object;
    }[];
  };
}

/**
 * Audit Logs Collection
 * Path: /audit_logs/{logId}
 * Description: Immutable audit trail
 */
interface AuditLog {
  id: string;
  
  // Event Information
  event: {
    timestamp: Timestamp;
    type: string; // login, data_access, configuration_change, etc.
    category: 'authentication' | 'authorization' | 'data' | 'configuration' | 'compliance';
    severity: 'info' | 'warning' | 'error' | 'critical';
    description: string;
  };
  
  // Actor
  actor: {
    userId?: string;
    userEmail?: string;
    userName?: string;
    organizationId?: string;
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    apiKeyId?: string; // If API access
  };
  
  // Target
  target: {
    type: string; // user, client, incident, etc.
    id?: string;
    name?: string;
    organizationId?: string;
    previousValue?: any; // For changes
    newValue?: any; // For changes
  };
  
  // Context
  context: {
    action: string; // create, read, update, delete, etc.
    resource: string; // API endpoint or resource
    method?: string; // HTTP method
    success: boolean;
    errorMessage?: string;
    duration?: number; // milliseconds
  };
  
  // Compliance
  compliance?: {
    regulation?: string;
    requirement?: string;
    dataTypes?: string[];
    affectedRecords?: number;
  };
  
  // Immutability
  integrity: {
    hash: string; // Hash of the log entry
    previousHash?: string; // For blockchain-style chaining
    signature?: string; // Digital signature
  };
  
  // Metadata (minimal to preserve immutability)
  metadata: {
    source: 'application' | 'system' | 'integration';
    version: string; // Application version
    environment: 'development' | 'staging' | 'production';
  };
}

/**
 * Dry Run Scenarios Collection
 * Path: /dry_runs/{dryRunId}
 * Description: Breach simulation scenarios
 */
interface DryRunScenario {
  id: string;
  
  // Ownership
  ownership: {
    clientId?: string; // Optional, can be generic
    organizationId: string;
    createdBy: string;
  };
  
  // Scenario Details
  scenario: {
    name: string;
    description?: string;
    type: 'simulation' | 'template' | 'historical';
    category: string; // ransomware, insider, etc.
    
    // Incident Parameters
    parameters: {
      incidentType: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      discoveryDate: Timestamp;
      
      // Scope
      affectedSystems?: string[];
      dataTypes: string[]; // PII element IDs
      affectedIndividuals: number;
      affectedStates: string[];
      
      // Conditions
      dataEncrypted: boolean;
      backupAvailable: boolean;
      exfiltrationConfirmed: boolean;
      ransomDemanded?: boolean;
      
      // Additional factors
      customFactors?: { [key: string]: any };
    };
  };
  
  // Results
  results?: {
    ranAt: Timestamp;
    duration: number; // milliseconds
    
    // Compliance Assessment
    compliance: {
      applicableRegulations: string[];
      notificationRequirements: object[];
      deadlines: object[];
      exemptions: object[];
    };
    
    // Generated Playbook
    playbook?: {
      immediateActions: string[];
      shortTermActions: string[];
      longTermActions: string[];
      timeline: object[];
      resources: object[];
    };
    
    // Risk Assessment
    risk: {
      score: number;
      level: 'low' | 'medium' | 'high' | 'critical';
      factors: string[];
      financialImpact?: number;
    };
    
    // Recommendations
    recommendations: string[];
  };
  
  // Sharing
  sharing: {
    shared: boolean;
    sharedWith?: string[]; // User IDs
    public: boolean;
    template: boolean; // Available as template
  };
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastRunAt?: Timestamp;
    runCount: number;
    tags?: string[];
    notes?: string;
  };
}

// ============================================================================
// SUPPORTING COLLECTIONS
// ============================================================================

/**
 * System Configuration Collection
 * Path: /system_config/{configId}
 * Description: System-wide configuration
 */
interface SystemConfig {
  id: string;
  category: string;
  settings: { [key: string]: any };
  updatedAt: Timestamp;
  updatedBy: string;
}

/**
 * Integration Configurations Collection
 * Path: /integrations/{integrationId}
 * Description: Third-party integrations
 */
interface Integration {
  id: string;
  organizationId: string;
  type: 'purview' | 'siem' | 'ticketing' | 'sso' | 'notification' | 'storage';
  provider: string;
  configuration: { [key: string]: any };
  credentials: { [key: string]: string }; // Encrypted
  status: 'active' | 'inactive' | 'error';
  lastSync?: Timestamp;
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
  };
}

/**
 * Jobs Queue Collection
 * Path: /jobs/{jobId}
 * Description: Background job processing
 */
interface Job {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  priority: number;
  payload: { [key: string]: any };
  result?: { [key: string]: any };
  error?: string;
  attempts: number;
  maxAttempts: number;
  scheduledFor?: Timestamp;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  metadata: {
    createdAt: Timestamp;
    createdBy?: string;
    organizationId?: string;
  };
}

// Type definitions for Firestore Timestamp
type Timestamp = {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
};

/**
 * INDEXES REQUIRED FOR OPTIMAL PERFORMANCE:
 * 
 * 1. Composite Indexes:
 *    - incidents: (clientId, status.current, metadata.createdAt DESC)
 *    - incidents: (organizationId, severity, metadata.createdAt DESC)
 *    - notifications: (association.incidentId, details.status)
 *    - snapshots: (ownership.clientId, details.type, details.startedAt DESC)
 *    - audit_logs: (actor.organizationId, event.timestamp DESC)
 *    - users: (organizations.orgId, metadata.status)
 * 
 * 2. Collection Group Indexes:
 *    - evidence: (chainOfCustody.collectedAt DESC)
 *    - assets: (classification.sensitivityLabel, snapshotMetadata.capturedAt DESC)
 * 
 * 3. Single Field Indexes (auto-created by Firestore):
 *    - All document IDs
 *    - All fields used in where() clauses
 */

export {
  // Reference Data Types
  PIIElement,
  Regulation,
  NotificationTemplate,
  Industry,
  
  // Operational Data Types
  Organization,
  User,
  Client,
  Incident,
  Evidence,
  PurviewSnapshot,
  PurviewAsset,
  Notification,
  AuditLog,
  DryRunScenario,
  
  // Supporting Types
  SystemConfig,
  Integration,
  Job,
  
  // Utility Type
  Timestamp
};