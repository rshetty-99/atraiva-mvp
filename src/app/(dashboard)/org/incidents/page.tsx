"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileText,
  Users,
  Clock,
  Shield,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Import incident step components
import {
  Step1,
  Step2,
  Step3,
  Step4,
  Step5,
  Step6,
  Step7,
} from "@/components/incident";

const incidentSteps = [
  {
    id: "incident-type",
    title: "Incident Type",
    description: "Select the type of security incident you&apos;re reporting",
    component: Step1,
    icon: AlertTriangle,
  },
  {
    id: "incident-details",
    title: "Incident Details",
    description: "Provide details about when and where the incident occurred",
    component: Step2,
    icon: FileText,
  },
  {
    id: "affected-data",
    title: "Affected Data",
    description: "Identify what data or systems were affected",
    component: Step3,
    icon: Shield,
  },
  {
    id: "affected-individuals",
    title: "Affected Individuals",
    description: "Specify who was impacted by this incident",
    component: Step4,
    icon: Users,
  },
  {
    id: "incident-timeline",
    title: "Incident Timeline",
    description: "Document the timeline of events",
    component: Step5,
    icon: Clock,
  },
  {
    id: "response-actions",
    title: "Response Actions",
    description: "Document actions taken in response to the incident",
    component: Step6,
    icon: Shield,
  },
  {
    id: "review-submit",
    title: "Review & Submit",
    description: "Review your incident report and submit for processing",
    component: Step7,
    icon: CheckCircle,
  },
];

export default function IncidentReportPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const progress = ((currentStep + 1) / incidentSteps.length) * 100;

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

  const CurrentStepComponent = incidentSteps[currentStep].component;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8"
      style={{ marginTop: "140px" }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              Report Security Incident
            </h1>
            <p className="text-muted-foreground mt-2">
              Document and report security incidents for compliance tracking
            </p>
          </div>
          <Badge variant="outline" className="text-sm h-8 px-4">
            Step {currentStep + 1} of {incidentSteps.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {incidentSteps[currentStep].title}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-card/90 backdrop-blur-sm relative">
              {/* Spinner Overlay */}
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

              <CardHeader className="text-center pb-6 border-b">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-orange-600">
                  {React.createElement(incidentSteps[currentStep].icon, {
                    className: "h-7 w-7 text-white",
                  })}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {incidentSteps[currentStep].title}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {incidentSteps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  className={
                    isTransitioning
                      ? "opacity-0"
                      : "opacity-100 transition-opacity duration-200"
                  }
                >
                  <CurrentStepComponent
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    isFirstStep={currentStep === 0}
                    isLastStep={currentStep === incidentSteps.length - 1}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {incidentSteps.map((step, index) => (
          <div
            key={step.id}
            className={`h-2 rounded-full transition-all ${
              index === currentStep
                ? "w-8 bg-primary"
                : index < currentStep
                ? "w-2 bg-primary/50"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
