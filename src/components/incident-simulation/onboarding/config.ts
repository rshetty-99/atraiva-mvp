// Onboarding configuration for incident simulation
export interface TooltipConfig {
  field: string;
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export interface TourStep {
  target: string; // CSS selector or data attribute
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
}

export interface HelpSection {
  id: string;
  title: string;
  content: string;
  icon?: string;
}

// Tooltips for Step 1
export const step1Tooltips: TooltipConfig[] = [
  {
    field: "clientName",
    title: "Client Name",
    content:
      "This is automatically populated from your organization. This represents the organization reporting the incident.",
    position: "right",
  },
  {
    field: "loggerName",
    title: "Logging Person",
    content:
      "The person creating this incident report. This is automatically filled from your profile information.",
    position: "right",
  },
  {
    field: "loggerContact",
    title: "Contact Information",
    content:
      "Your email and phone number for follow-up questions. Automatically populated from your profile.",
    position: "right",
  },
  {
    field: "incidentDiscoveryDate",
    title: "Discovery Date & Time",
    content:
      "The exact date and time when the incident was first discovered. Pre-filled with current time, but you can adjust if the discovery happened earlier.",
    position: "right",
  },
];

// Tooltips for Step 2
export const step2Tooltips: TooltipConfig[] = [
  {
    field: "discoveryMethod",
    title: "Discovery Method",
    content:
      "How was this incident first detected? This helps understand the incident's origin and severity.",
    position: "right",
  },
  {
    field: "summary",
    title: "Brief Summary",
    content:
      "Provide a clear, plain English description of what happened. This helps the team quickly understand the situation.",
    position: "right",
  },
  {
    field: "incidentTypes",
    title: "Incident Types",
    content:
      "Select all types that apply. You can choose multiple types if the incident involves several attack vectors.",
    position: "right",
  },
];

// Tooltips for Step 3
export const step3Tooltips: TooltipConfig[] = [
  {
    field: "isActive",
    title: "Active Status",
    content:
      "Is the incident still ongoing? This helps prioritize response actions.",
    position: "right",
  },
  {
    field: "businessOperationsImpact",
    title: "Business Impact",
    content:
      "Describe how this incident affects your business operations. Be specific about what's impacted.",
    position: "right",
  },
  {
    field: "containmentSteps",
    title: "Containment Steps",
    content:
      "What actions have already been taken to contain the incident? This helps avoid duplicate efforts.",
    position: "right",
  },
];

// Tooltips for Step 4
export const step4Tooltips: TooltipConfig[] = [
  {
    field: "dataSources",
    title: "Data Sources",
    content:
      "Select all data sources that may be affected. This helps focus the investigation.",
    position: "right",
  },
  {
    field: "dataTypes",
    title: "Data Types at Risk",
    content:
      "What types of sensitive data might be compromised? This is critical for compliance reporting.",
    position: "right",
  },
  {
    field: "estimatedRecordsAffected",
    title: "Records Affected",
    content:
      "Estimate the number of records potentially affected. This helps assess the severity and notification requirements.",
    position: "right",
  },
];

// Tooltips for Step 6
export const step6Tooltips: TooltipConfig[] = [
  {
    field: "keySystems",
    title: "Key Systems",
    content:
      "List specific systems, hostnames, IP addresses, or accounts to investigate first. This is your 'start here' command.",
    position: "right",
  },
  {
    field: "compromisedAccounts",
    title: "Compromised Accounts",
    content:
      "Have any high-privilege accounts been compromised? This is critical for understanding the attack scope.",
    position: "right",
  },
  {
    field: "purviewScanPriorities",
    title: "Purview Scan Priorities",
    content:
      "Select the top 3 priorities for automated Purview scanning. This guides the automated analysis.",
    position: "right",
  },
];

// Guided tour steps for the entire flow
export const incidentSimulationTour: TourStep[] = [
  {
    target: "[data-tour='step-indicator']",
    title: "Progress Tracking",
    content:
      "Track your progress through the 6-step incident simulation process. You can see which steps you've completed.",
    placement: "bottom",
  },
  {
    target: "[data-tour='step-content']",
    title: "Current Step",
    content:
      "Each step collects specific information about the incident. Fill out all required fields to proceed.",
    placement: "top",
  },
  {
    target: "[data-tour='save-button']",
    title: "Save Progress",
    content:
      "You can save your progress at any time. Your data will be preserved if you need to come back later.",
    placement: "top",
  },
  {
    target: "[data-tour='upload-scan']",
    title: "Upload Purview Scan",
    content:
      "Optionally upload a Purview scan file (JSON, CSV, or Excel) at any point. This will enhance the automated analysis.",
    placement: "left",
  },
];

// Help sections for each step
export const stepHelpSections: Record<number, HelpSection[]> = {
  1: [
    {
      id: "initial-details",
      title: "Initial Details",
      content:
        "This step captures basic information about who is reporting the incident and when it was discovered. Most fields are auto-populated from your profile.",
    },
    {
      id: "why-important",
      title: "Why This Matters",
      content:
        "Accurate initial details ensure proper attribution and help establish the incident timeline, which is critical for compliance reporting.",
    },
  ],
  2: [
    {
      id: "discovery-method",
      title: "Discovery Method",
      content:
        "Understanding how the incident was discovered helps assess the organization's security posture and response capabilities.",
    },
    {
      id: "incident-types",
      title: "Incident Types",
      content:
        "Selecting the correct incident types helps route the case to the right experts and apply appropriate response procedures.",
    },
  ],
  3: [
    {
      id: "impact-assessment",
      title: "Impact Assessment",
      content:
        "Accurately assessing business impact helps prioritize response actions and allocate resources effectively.",
    },
    {
      id: "containment",
      title: "Containment Steps",
      content:
        "Documenting existing containment steps prevents duplicate efforts and helps coordinate the response team.",
    },
  ],
  4: [
    {
      id: "data-scope",
      title: "Data Scope",
      content:
        "Identifying affected data sources and types is essential for compliance reporting and determining notification requirements.",
    },
    {
      id: "records-affected",
      title: "Records Affected",
      content:
        "The number of affected records determines regulatory notification deadlines and potential penalties.",
    },
  ],
  5: [
    {
      id: "technical-pointers",
      title: "Technical Pointers",
      content:
        "Providing specific systems and accounts to investigate helps the technical team start their analysis immediately.",
    },
    {
      id: "purview-priorities",
      title: "Purview Priorities",
      content:
        "Selecting scan priorities guides the automated analysis to focus on the most critical areas first.",
    },
  ],
  6: [
    {
      id: "technical-pointers",
      title: "Technical Pointers",
      content:
        "Providing specific systems and accounts to investigate helps the technical team start their analysis immediately.",
    },
    {
      id: "purview-priorities",
      title: "Purview Priorities",
      content:
        "Selecting scan priorities guides the automated analysis to focus on the most critical areas first.",
    },
  ],
  7: [
    {
      id: "next-steps",
      title: "Next Steps",
      content:
        "The system automatically generates a checklist of immediate actions based on your responses. Review and submit to proceed.",
    },
    {
      id: "analysis",
      title: "Automated Analysis",
      content:
        "After submission, the system will automatically analyze your incident data and any uploaded Purview scans to generate insights and recommendations.",
    },
  ],
};

// Get tooltips for a specific step
export function getTooltipsForStep(step: number): TooltipConfig[] {
  switch (step) {
    case 1:
      return step1Tooltips;
    case 2:
      return step2Tooltips;
    case 3:
      return step3Tooltips;
    case 4:
      return step4Tooltips;
    case 6:
      return step6Tooltips;
    default:
      return [];
  }
}

// Get help sections for a specific step
export function getHelpSectionsForStep(step: number): HelpSection[] {
  return stepHelpSections[step] || [];
}
