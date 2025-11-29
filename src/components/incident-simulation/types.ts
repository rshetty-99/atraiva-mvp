// Types for incident simulation form data
export interface IncidentSimulationData {
  // Step 1: Initial Details
  step1: {
    clientName: string;
    loggerName: string;
    loggerContact: string;
    incidentDiscoveryDate: Date | null;
  };

  // Step 2: Discovery and Incident Type
  step2: {
    discoveryMethod: string;
    discoveryMethodOther?: string;
    summary: string;
    incidentTypes: string[];
  };

  // Step 3: Immediate Impact & Containment
  step3: {
    isActive: "yes" | "no" | "unknown";
    businessOperationsImpact: string;
    containmentSteps: string;
  };

  // Step 4: Data Scope & Risk Assessment
  step4: {
    dataSources: string[];
    dataTypes: string[];
    estimatedRecordsAffected: string;
    severity: "critical" | "high" | "medium" | "low" | "unknown";
  };

  // Step 6: Initial Technical Pointers
  step6: {
    purviewScanOption?: "has_report" | "needs_help";
    keySystems?: string;
    compromisedAccounts?: {
      hasCompromised: "yes" | "no" | "unknown";
      accountNames?: string;
    };
    purviewScanPriorities?: string[];
  };
}

export interface IncidentSimulationStepProps {
  data: Partial<IncidentSimulationData>;
  onDataUpdate: (step: keyof IncidentSimulationData, data: any) => void;
  onNext: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  // Optional props for upload functionality
  organizationId?: string;
  incidentId?: string;
  uploadedBy?: string;
  purviewScan?: any;
  onScanUpload?: (scan: any) => void;
  onScanRemove?: () => void;
}
