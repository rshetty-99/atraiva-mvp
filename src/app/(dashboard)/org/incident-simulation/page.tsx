"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useSession } from "@/hooks/useSession";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  AlertTriangle,
  FileText,
  Shield,
  CheckCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";
import {
  incidentService,
  incidentDetailService,
} from "@/lib/firestore/collections";
import type { IncidentSimulation, IncidentDetail } from "@/lib/firestore/types";
import { IncidentSimulationData } from "@/components/incident-simulation/types";
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step6,
  Step7,
} from "@/components/incident-simulation";
import {
  OnboardingProvider,
  GuidedTour,
  ContextualHelp,
  OnboardingControls,
  getHelpSectionsForStep,
} from "@/components/incident-simulation/onboarding";
import { AnalysisStatus } from "@/components/incident-simulation/AnalysisStatus";
import { createAnalysisRequest } from "@/lib/services/incident-analysis";
import { triggerCloudRunAnalysis } from "@/lib/services/cloud-run-trigger";

const incidentSteps = [
  {
    id: "initial-details",
    title: "Initial Details",
    description: "Provide basic information about the incident",
    component: Step1,
    icon: FileText,
  },
  {
    id: "discovery-type",
    title: "Discovery and Incident Type",
    description: "How was the incident discovered and what type is it?",
    component: Step2,
    icon: AlertTriangle,
  },
  {
    id: "impact-containment",
    title: "Immediate Impact & Containment",
    description: "Assess the current impact and containment status",
    component: Step3,
    icon: Shield,
  },
  {
    id: "data-scope",
    title: "Data Scope & Risk Assessment",
    description: "Identify affected data sources and types",
    component: Step4,
    icon: Shield,
  },
  {
    id: "technical-pointers",
    title: "Initial Technical Pointers",
    description: "Provide technical details for investigation",
    component: Step6,
    icon: Zap,
  },
  {
    id: "next-steps",
    title: "Immediate Next Steps",
    description: "Review and submit the incident simulation",
    component: Step7,
    icon: CheckCircle,
  },
];

export default function IncidentSimulationPage() {
  const router = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { session, loading: sessionLoading } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<IncidentSimulationData>>({});
  const [incidentId, setIncidentId] = useState<string | null>(null);
  const [purviewScan, setPurviewScan] = useState<
    IncidentSimulation["purviewScan"] | null
  >(null);

  const progress = ((currentStep + 1) / incidentSteps.length) * 100;

  useEffect(() => {
    if (clerkLoaded && !clerkUser) {
      router.push("/sign-in");
    }
  }, [clerkLoaded, clerkUser, router]);

  if (!clerkLoaded || sessionLoading || !session?.currentOrganization) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            Loading incident simulation...
          </p>
        </div>
      </div>
    );
  }

  const handleDataUpdate = (
    step: keyof IncidentSimulationData,
    data: unknown
  ) => {
    setFormData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const handleNext = () => {
    if (currentStep < incidentSteps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    if (!clerkUser || !session?.currentOrganization) {
      toast.error("Session information is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      // Transform form data to IncidentSimulation format
      const incidentData: Omit<
        IncidentSimulation,
        "id" | "createdAt" | "updatedAt"
      > = {
        ownership: {
          organizationId: session.currentOrganization.id,
          createdBy: clerkUser.id,
          createdByName:
            clerkUser.fullName ||
            clerkUser.emailAddresses[0]?.emailAddress ||
            "",
          createdByEmail: clerkUser.emailAddresses[0]?.emailAddress || "",
          isSimulation: true,
        },
        initialDetails: {
          clientName: formData.step1?.clientName || "",
          loggerName: formData.step1?.loggerName || "",
          loggerContact: formData.step1?.loggerContact || "",
          incidentDiscoveryDate: formData.step1?.incidentDiscoveryDate
            ? Timestamp.fromDate(formData.step1.incidentDiscoveryDate)
            : Timestamp.now(),
        } as any,
        discovery: {
          discoveryMethod:
            (formData.step2?.discoveryMethod as any) || "unknown",
          discoveryMethodOther: formData.step2?.discoveryMethodOther,
          summary: formData.step2?.summary || "",
          incidentTypes: (formData.step2?.incidentTypes as any) || [],
        },
        impact: {
          isActive: formData.step3?.isActive || "unknown",
          businessOperationsImpact:
            formData.step3?.businessOperationsImpact || "",
          containmentSteps: formData.step3?.containmentSteps || "",
        },
        dataScope: {
          dataSources: (formData.step4?.dataSources as any) || [],
          dataTypes: (formData.step4?.dataTypes as any) || [],
          estimatedRecordsAffected:
            (formData.step4?.estimatedRecordsAffected as any) || "unknown",
        },
        severity: (formData.step4?.severity as any) || "unknown",
        technical: {
          keySystems: formData.step6?.keySystems || "",
          compromisedAccounts: {
            hasCompromised:
              formData.step6?.compromisedAccounts?.hasCompromised || "unknown",
            accountNames: formData.step6?.compromisedAccounts?.accountNames,
          },
          purviewScanPriorities:
            (formData.step6?.purviewScanPriorities as any) || [],
        },
        nextSteps: {
          executePurviewQueries: true,
          initiateRegulatoryTimeline: true,
          scheduleStakeholderCalls: true,
          preserveLogsEvidence: true,
          coordinateITContainment: true,
        },
        // Include purviewScan if uploaded
        ...(purviewScan && {
          purviewScan: {
            ...purviewScan,
            uploadedAt:
              purviewScan.uploadedAt instanceof Date
                ? Timestamp.fromDate(purviewScan.uploadedAt)
                : Timestamp.now(),
          },
        }),
        status: "simulation_initialized",
        currentStep: 7,
      } as any;

      // Save incident to Firestore
      const newIncidentId = await incidentService.create(incidentData);
      setIncidentId(newIncidentId);

      // Create incident detail
      const incidentDetail: Omit<
        IncidentDetail,
        "id" | "createdAt" | "updatedAt"
      > = {
        incidentId: newIncidentId,
        workflowState: {
          purviewScanInitiated: false,
          purviewScanCompleted: false,
          regulatoryNotificationsGenerated: false,
          stakeholderCallsScheduled: false,
          evidencePreserved: false,
          itContainmentCoordinated: false,
        },
      };

      await incidentDetailService.create(incidentDetail);

      // Create analysis request
      try {
        const statusId = await createAnalysisRequest({
          incidentId: newIncidentId,
          organizationId: session.currentOrganization.id,
          analysisType: purviewScan ? "combined" : "incident_data",
          purviewScanUrl: purviewScan?.fileUrl,
          incidentData: incidentData as any,
        });

        // Trigger Cloud Run analysis
        await triggerCloudRunAnalysis({
          statusId,
          incidentId: newIncidentId,
          organizationId: session.currentOrganization.id,
          analysisType: purviewScan ? "combined" : "incident_data",
          purviewScanUrl: purviewScan?.fileUrl,
          incidentData: incidentData as any,
        });
      } catch (error) {
        console.error("Error triggering analysis:", error);
        // Don't fail the submission if analysis trigger fails
      }

      toast.success("Incident simulation submitted successfully!");

      // Redirect to incidents page or success page
      setTimeout(() => {
        router.push("/org/incidents");
      }, 1500);
    } catch (error) {
      console.error("Error submitting incident simulation:", error);
      toast.error("Failed to submit incident simulation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = incidentSteps[currentStep].component;

  const handleScanUpload = async (scan: any) => {
    setPurviewScan(scan);
    if (incidentId) {
      // Update incident with scan if already created
      await incidentService.update(incidentId, {
        purviewScan: {
          ...scan,
          uploadedAt: Timestamp.fromDate(scan.uploadedAt),
        },
      } as any);
    }
  };

  const handleScanRemove = async () => {
    setPurviewScan(null);
    if (incidentId) {
      await incidentService.update(incidentId, {
        purviewScan: null,
      } as any);
    }
  };

  return (
    <OnboardingProvider>
      <div
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6"
        style={{ marginTop: "140px" }}
      >
        <div className="container mx-auto max-w-6xl">
          <GuidedTour />
          <ContextualHelp
            sections={getHelpSectionsForStep(currentStep + 1)}
            currentStep={currentStep}
          />
          <div className="flex gap-6">
            {/* Vertical Step Indicators - Left Side */}
            <div className="hidden lg:flex flex-col gap-4 w-48 flex-shrink-0">
              {incidentSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary/10 border-2 border-primary"
                        : isCompleted
                        ? "bg-muted/50 border-2 border-muted"
                        : "bg-muted/20 border-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : isCompleted
                          ? "bg-muted text-muted-foreground"
                          : "bg-muted/50 text-muted-foreground/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium ${
                          isActive
                            ? "text-primary"
                            : isCompleted
                            ? "text-muted-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        Step {index + 1}
                      </p>
                      <p
                        className={`text-sm font-semibold truncate ${
                          isActive
                            ? "text-foreground"
                            : isCompleted
                            ? "text-muted-foreground"
                            : "text-muted-foreground/50"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Progress Header */}
              <div className="mb-8" data-tour="step-indicator">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      Incident Simulation
                    </h1>
                    <p className="text-muted-foreground">
                      Step {currentStep + 1} of {incidentSteps.length}:{" "}
                      {incidentSteps[currentStep].title}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <OnboardingControls />
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Analysis Status */}
              {incidentId && (
                <div className="mb-6">
                  <AnalysisStatus incidentId={incidentId} />
                </div>
              )}

              {/* Horizontal Step Indicators - Mobile/Tablet (shown on smaller screens) */}
              <div className="mb-8 flex justify-between lg:hidden">
                {incidentSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index === currentStep;
                  const isCompleted = index < currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center flex-1 ${
                        isActive
                          ? "text-primary"
                          : isCompleted
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : isCompleted
                            ? "bg-muted text-muted-foreground"
                            : "bg-muted/50 text-muted-foreground/50"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className="text-xs text-center hidden sm:block">
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Main Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm relative">
                    {isTransitioning && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Loading step...
                          </p>
                        </div>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                        {React.createElement(incidentSteps[currentStep].icon, {
                          className: "h-8 w-8 text-white",
                        })}
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {incidentSteps[currentStep].title}
                      </CardTitle>
                      <CardDescription className="text-lg text-muted-foreground">
                        {incidentSteps[currentStep].description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent
                      className="px-8 pb-8 min-h-[500px] flex flex-col"
                      data-tour="step-content"
                    >
                      <div className="flex-grow">
                        <CurrentStepComponent
                          data={formData}
                          onDataUpdate={handleDataUpdate}
                          onNext={
                            currentStep === incidentSteps.length - 1
                              ? handleSubmit
                              : handleNext
                          }
                          onPrevious={
                            currentStep > 0 ? handlePrevious : undefined
                          }
                          isFirstStep={currentStep === 0}
                          isLastStep={currentStep === incidentSteps.length - 1}
                          organizationId={session?.currentOrganization?.id}
                          incidentId={incidentId || undefined}
                          uploadedBy={clerkUser?.id}
                          purviewScan={purviewScan}
                          onScanUpload={handleScanUpload}
                          onScanRemove={handleScanRemove}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {isSubmitting && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="p-6">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Submitting incident simulation...
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </OnboardingProvider>
  );
}
