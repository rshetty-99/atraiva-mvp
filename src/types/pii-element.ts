// PII Element Types

export type PIICategory =
  | "Core Identifiers"
  | "Government-Issued Numbers"
  | "Financial & Payment"
  | "Health & Genetic"
  | "Biometric Identifiers"
  | "Digital & Device IDs"
  | "Login & Security Credentials"
  | "Location & Vehicle"
  | "Personal Characteristics & Demographics"
  | "Civic, Political & Legal"
  | "Education & Employment"
  | "Media & Communications"
  | "Household & Utility"
  | "Miscellaneous Unique Identifiers";

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type Regulation =
  | "GDPR"
  | "CCPA"
  | "HIPAA"
  | "GLBA"
  | "FERPA"
  | "BIPA"
  | "GINA"
  | "PCI-DSS"
  | "TCPA"
  | "State Laws";

export interface PIIElement {
  id: string;
  element: string;
  category: PIICategory;
  categorySlug: string;
  description?: string;
  riskLevel: RiskLevel;
  isRegulated: boolean;
  applicableRegulations: Regulation[];
  detectionPatterns: string[];
  examples: string[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    source: string;
    importDate?: string;
  };
}

export interface PIICategoryInfo {
  id: string;
  category: PIICategory;
  categorySlug: string;
  description: string;
  riskLevel: RiskLevel;
  elementsCount: number;
  regulations: Regulation[];
  icon: string;
  color: string;
  examples: string[];
}

export interface PIIDetectionResult {
  element: PIIElement;
  matches: Array<{
    value: string;
    location: string;
    confidence: number;
  }>;
  riskScore: number;
}

export interface PIIInventory {
  organizationId: string;
  dataSourceId: string;
  dataSourceName: string;
  scanDate: Date;
  elements: Array<{
    piiElement: PIIElement;
    occurrences: number;
    locations: string[];
    lastDetected: Date;
  }>;
  summary: {
    totalElements: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    regulated: number;
    regulationsApplicable: Regulation[];
  };
}

export interface PIIFilters {
  category?: PIICategory;
  riskLevel?: RiskLevel;
  isRegulated?: boolean;
  regulation?: Regulation;
  searchTerm?: string;
}

export interface PIIStats {
  total: number;
  byCategory: Record<PIICategory, number>;
  byRiskLevel: Record<RiskLevel, number>;
  regulated: number;
  nonRegulated: number;
}

// Category metadata for UI display
export const PII_CATEGORY_INFO: Record<
  PIICategory,
  Omit<PIICategoryInfo, "id" | "elementsCount">
> = {
  "Core Identifiers": {
    category: "Core Identifiers",
    categorySlug: "core-identifiers",
    description:
      "Basic identifying information that directly identifies an individual",
    riskLevel: "high",
    regulations: ["GDPR", "CCPA", "State Laws"],
    icon: "User",
    color: "red",
    examples: ["Full name", "Alias", "Maiden name"],
  },
  "Government-Issued Numbers": {
    category: "Government-Issued Numbers",
    categorySlug: "government-issued-numbers",
    description:
      "Official identification numbers issued by government agencies",
    riskLevel: "high",
    regulations: ["HIPAA", "GLBA", "State Laws"],
    icon: "FileText",
    color: "red",
    examples: ["SSN", "Passport number", "Driver's license"],
  },
  "Financial & Payment": {
    category: "Financial & Payment",
    categorySlug: "financial-payment",
    description: "Financial account and payment information",
    riskLevel: "high",
    regulations: ["GLBA", "PCI-DSS", "State Laws"],
    icon: "CreditCard",
    color: "red",
    examples: ["Bank account", "Credit card", "Routing number"],
  },
  "Health & Genetic": {
    category: "Health & Genetic",
    categorySlug: "health-genetic",
    description: "Protected health information and genetic data",
    riskLevel: "high",
    regulations: ["HIPAA", "GINA", "State Laws"],
    icon: "Heart",
    color: "red",
    examples: ["Medical records", "Health insurance", "DNA data"],
  },
  "Biometric Identifiers": {
    category: "Biometric Identifiers",
    categorySlug: "biometric-identifiers",
    description: "Unique biological characteristics used for identification",
    riskLevel: "high",
    regulations: ["BIPA", "GDPR", "CCPA", "State Laws"],
    icon: "Fingerprint",
    color: "red",
    examples: ["Fingerprint", "Facial recognition", "Iris scan"],
  },
  "Digital & Device IDs": {
    category: "Digital & Device IDs",
    categorySlug: "digital-device-ids",
    description: "Digital identifiers for devices and online presence",
    riskLevel: "medium",
    regulations: ["GDPR", "CCPA"],
    icon: "Smartphone",
    color: "yellow",
    examples: ["IP address", "MAC address", "Device ID"],
  },
  "Login & Security Credentials": {
    category: "Login & Security Credentials",
    categorySlug: "login-security-credentials",
    description: "Authentication and access control information",
    riskLevel: "high",
    regulations: ["GDPR", "CCPA", "State Laws"],
    icon: "Lock",
    color: "red",
    examples: ["Username", "Password", "Security questions"],
  },
  "Location & Vehicle": {
    category: "Location & Vehicle",
    categorySlug: "location-vehicle",
    description: "Geographic location and vehicle identification",
    riskLevel: "medium",
    regulations: ["GDPR", "CCPA", "State Laws"],
    icon: "MapPin",
    color: "yellow",
    examples: ["Geolocation", "VIN", "License plate"],
  },
  "Personal Characteristics & Demographics": {
    category: "Personal Characteristics & Demographics",
    categorySlug: "personal-characteristics-demographics",
    description: "Personal attributes and demographic information",
    riskLevel: "medium",
    regulations: ["GDPR", "CCPA", "State Laws"],
    icon: "Users",
    color: "yellow",
    examples: ["Date of birth", "Race", "Gender"],
  },
  "Civic, Political & Legal": {
    category: "Civic, Political & Legal",
    categorySlug: "civic-political-legal",
    description: "Political affiliations and legal records",
    riskLevel: "medium",
    regulations: ["GDPR", "State Laws"],
    icon: "Gavel",
    color: "yellow",
    examples: ["Voting records", "Political party", "Criminal history"],
  },
  "Education & Employment": {
    category: "Education & Employment",
    categorySlug: "education-employment",
    description: "Educational and professional records",
    riskLevel: "medium",
    regulations: ["FERPA", "GDPR", "State Laws"],
    icon: "GraduationCap",
    color: "yellow",
    examples: ["Student ID", "Transcripts", "Employment history"],
  },
  "Media & Communications": {
    category: "Media & Communications",
    categorySlug: "media-communications",
    description: "Contact information and communication records",
    riskLevel: "medium",
    regulations: ["GDPR", "CCPA", "TCPA", "State Laws"],
    icon: "Mail",
    color: "yellow",
    examples: ["Email", "Phone number", "Social media"],
  },
  "Household & Utility": {
    category: "Household & Utility",
    categorySlug: "household-utility",
    description: "Home address and utility account information",
    riskLevel: "medium",
    regulations: ["GDPR", "State Laws"],
    icon: "Home",
    color: "yellow",
    examples: ["Home address", "Utility accounts", "Property records"],
  },
  "Miscellaneous Unique Identifiers": {
    category: "Miscellaneous Unique Identifiers",
    categorySlug: "miscellaneous-unique-identifiers",
    description: "Other unique identifying documents and credentials",
    riskLevel: "high",
    regulations: ["GDPR", "State Laws"],
    icon: "IdCard",
    color: "red",
    examples: ["Passport image", "License scan", "Visa image"],
  },
};

// Helper function to get category info
export function getPIICategoryInfo(
  category: PIICategory
): Omit<PIICategoryInfo, "id" | "elementsCount"> {
  return PII_CATEGORY_INFO[category];
}

// Helper function to get risk level color
export function getRiskLevelColor(riskLevel: RiskLevel): string {
  const colors = {
    low: "bg-green-500/10 text-green-500 border-green-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    critical: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };
  return colors[riskLevel];
}






