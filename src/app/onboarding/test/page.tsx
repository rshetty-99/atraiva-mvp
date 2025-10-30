"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import RoleSelectionStep from "@/components/onboarding/RoleSelectionStep";
import OrganizationSetupStep from "@/components/onboarding/OrganizationSetupStep";
import DashboardPreviewStep from "@/components/onboarding/DashboardPreviewStep";
import SecuritySetupStep from "@/components/onboarding/SecuritySetupStep";
import CompletionStep from "@/components/onboarding/CompletionStep";

export default function OnboardingTestPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [testData, setTestData] = useState({
    userType: "law_firm",
    role: "law_firm_admin",
    organizationName: "Test Law Firm",
    organizationType: "law_firm",
    teamSize: "11-50",
    mfaEnabled: false,
    preferences: {
      theme: "auto",
      notifications: true,
      dashboardLayout: "sidebar",
    },
  });

  const steps = [
    { name: "Welcome", component: WelcomeStep },
    { name: "Role Selection", component: RoleSelectionStep },
    { name: "Organization Setup", component: OrganizationSetupStep },
    { name: "Dashboard Preview", component: DashboardPreviewStep },
    { name: "Security Setup", component: SecuritySetupStep },
    { name: "Completion", component: CompletionStep },
  ];

  const CurrentComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDataUpdate = (data: any) => {
    setTestData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Onboarding Components Test
              </h1>
              <p className="text-muted-foreground">
                Testing all onboarding components in isolation
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Step Navigation */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === index
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {step.name}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Current Step: {steps[currentStep].name} ({currentStep + 1} of{" "}
            {steps.length})
          </div>
        </div>

        {/* Component Test Area */}
        <div className="bg-card rounded-lg shadow-sm border p-8">
          <CurrentComponent
            data={testData}
            onDataUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirstStep={currentStep === 0}
            isLastStep={currentStep === steps.length - 1}
          />
        </div>

        {/* Data Display */}
        <div className="mt-8 bg-muted rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Current Test Data
          </h3>
          <pre className="text-sm text-foreground overflow-auto">
            {JSON.stringify(testData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
