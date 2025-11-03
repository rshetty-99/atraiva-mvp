// State Regulation Types - Based on actual Firestore data structure

export interface StateRegulation {
  id: string; // Firestore document ID
  state: string; // State code e.g., "AR", "CA"
  source_id: string; // URL to the source document
  url: string; // URL to the regulation
  fetched_at: string | Date; // ISO timestamp when data was fetched
  metadata: Record<string, unknown>; // Additional metadata
  parsed: {
    breach_notification: Record<string, unknown>; // Breach notification details
    requirements: Record<string, unknown>; // Compliance requirements
    timelines: unknown[]; // Timeline information
    penalties: Record<string, unknown>; // Penalty information
    exemptions: unknown[]; // Exemptions list
    definitions: Record<string, unknown>; // Key definitions
    state: string; // State code (duplicate)
    url: string; // URL (duplicate)
    metadata: Record<string, unknown>; // Metadata (duplicate)
    parsed_at: string | Date; // ISO timestamp when parsed
    extractor: string; // Extractor type (e.g., "ai_extractor")
    law_type: string; // Type of law (e.g., "general_privacy", "data_breach")
    industry: string; // Industry applicability (e.g., "general", "healthcare")
  };
  keywords: string[]; // Keywords extracted from the regulation
  changes: string[]; // List of what changed (e.g., ["definitions", "penalties"])
  industry: string; // Industry applicability
  scan_type: string; // Scan type (e.g., "full", "partial")
  updated_at: string | Date; // ISO timestamp when updated
}

// Extended interface with computed fields for display
export interface StateRegulationDisplay extends StateRegulation {
  stateName?: string; // Full state name (computed from state code)
  regulationName?: string; // Friendly name for the regulation
  status?: "active" | "pending" | "archived" | "superseded"; // Computed status
}

export interface StateRegulationFilters {
  state?: string;
  lawType?: string;
  industry?: string;
  scanType?: string;
  searchTerm?: string;
}

export interface StateRegulationStats {
  total: number;
  byState: Record<string, number>;
  byLawType: Record<string, number>;
  byIndustry: Record<string, number>;
  byScanType: Record<string, number>;
}

// US States mapping for display
export const US_STATES_MAP: Record<string, string> = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
  DC: "District of Columbia",
};
