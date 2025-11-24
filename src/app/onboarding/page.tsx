"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  Building,
  Zap,
  Loader2,
} from "lucide-react";
import { OnboardingData } from "@/lib/firestore/types";
import { toast } from "sonner";

// Import onboarding components
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import RoleSelectionStep from "@/components/onboarding/RoleSelectionStep";
import OrganizationSetupStep from "@/components/onboarding/OrganizationSetupStep";
import DashboardPreviewStep from "@/components/onboarding/DashboardPreviewStep";
import SecuritySetupStep from "@/components/onboarding/SecuritySetupStep";
import CompletionStep from "@/components/onboarding/CompletionStep";

// OnboardingData interface is now imported from types

const onboardingSteps = [
  {
    id: "welcome",
    title: "Welcome to Atraiva",
    description:
      "Let's get you set up with your personalized compliance platform",
    component: WelcomeStep,
    icon: Shield,
  },
  {
    id: "organization-setup",
    title: "Create Account & Organization",
    description: "Set up your user account and organization details",
    component: OrganizationSetupStep,
    icon: Building,
  },
  {
    id: "role-selection",
    title: "Choose Your Role",
    description: "Select your primary role to customize your experience",
    component: RoleSelectionStep,
    icon: Users,
  },
  {
    id: "dashboard-preview",
    title: "Dashboard Preview",
    description: "See your personalized dashboard in action",
    component: DashboardPreviewStep,
    icon: Zap,
  },
  {
    id: "security-setup",
    title: "Security Configuration",
    description: "Set up multi-factor authentication and security preferences",
    component: SecuritySetupStep,
    icon: Shield,
  },
  {
    id: "completion",
    title: "You're All Set!",
    description: "Your Atraiva platform is ready to use",
    component: CompletionStep,
    icon: CheckCircle,
  },
];

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [registrationToken, setRegistrationToken] = useState<string | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    // User fields
    firstName: "",
    lastName: "",
    email: "",
    jobTitle: "",
    username: "",
    password: "",

    // Organization fields
    userType: "law_firm",
    role: "",
    organizationName: "",
    organizationType: "",
    industry: "",
    teamSize: "",
    website: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    description: "",

    // Security and preferences
    mfaEnabled: false,
    mfaMethod: "",
    phoneNumber: "",
    emailNotifications: true,
    smsNotifications: false,
    securityAlerts: true,
    sessionTimeout: "30",
    passwordPolicy: "strong",
    preferences: {
      theme: "auto",
      notifications: true,
      dashboardLayout: "default",
    },
  });

  // Fetch registration link data if token is present
  useEffect(() => {
    async function fetchRegistrationData() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        console.log("Validating registration token:", token);

        const response = await fetch("/api/registration-links/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Invalid or expired registration link."
          );
        }

        const data = await response.json();
        console.log("Registration link data:", data);

        if (data.link) {
          setRegistrationToken(token);

          console.log("Loading registration link data:", {
            organization: data.link.organizationData.name,
            role: data.link.primaryUserData.role,
            organizationType: data.link.organizationData.organizationType,
          });

          // Pre-fill onboarding data from registration link
          setOnboardingData((prev) => ({
            ...prev,
            // User data from registration link
            firstName: data.link.primaryUserData.firstName || "",
            lastName: data.link.primaryUserData.lastName || "",
            email: data.link.primaryUserData.email || "",
            jobTitle: data.link.primaryUserData.jobTitle || "",
            phoneNumber: data.link.primaryUserData.phoneNumber || "",
            role: data.link.primaryUserData.role || "", // Use generic role as-is

            // Organization data from registration link
            organizationName: data.link.organizationData.name || "",
            organizationType: data.link.organizationData.organizationType || "",
            industry: data.link.organizationData.industry || "",
            teamSize: data.link.organizationData.teamSize || "",
            website: data.link.organizationData.website || "",
            phone: data.link.organizationData.phone || "",
            address: data.link.organizationData.address?.street || "",
            city: data.link.organizationData.address?.city || "",
            state: data.link.organizationData.address?.state || "",
            zipCode: data.link.organizationData.address?.zipCode || "",
            country:
              data.link.organizationData.address?.country || "United States",

            // Set userType based on organization type
            userType: data.link.organizationData.organizationType,
          }));

          toast.success("Registration information loaded successfully!");
        }
      } catch (error: unknown) {
        console.error("Error fetching registration data:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        // Check if it's an expiration error
        const errorMsg = errorMessage || "Failed to load registration information.";
        if (errorMsg.toLowerCase().includes("expired")) {
          setIsExpired(true);
          setErrorMessage(errorMsg);
        } else {
          toast.error(errorMsg);
          // For other errors, allow user to continue with empty form
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrationData();
  }, [token]);

  // Handle countdown and redirect for expired links
  useEffect(() => {
    if (isExpired && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isExpired && redirectCountdown === 0) {
      router.push("/");
    }
  }, [isExpired, redirectCountdown, router]);

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
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

  const handleDataUpdate = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
  };

  const CurrentStepComponent = onboardingSteps[currentStep].component;

  // Show loading state while fetching registration data
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">
                  Loading Registration Information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please wait while we retrieve your registration details...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show expired link error page
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              {/* Error Icon */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Shield className="h-12 w-12 text-red-600 dark:text-red-400" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">!</span>
                  </div>
                </div>
              </div>

              {/* Error Title */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-foreground">
                  Registration Link Expired
                </h2>
                <p className="text-lg text-muted-foreground max-w-md">
                  {errorMessage ||
                    "This registration link has expired and is no longer valid."}
                </p>
              </div>

              {/* Instructions */}
              <Card className="w-full bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      What to do next:
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>
                          Contact{" "}
                          <strong className="text-foreground">
                            Atraiva Support
                          </strong>{" "}
                          to request a new registration link
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>
                          Provide your organization name and email address that
                          was used for registration
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>
                          A new registration link will be sent to your email
                          within 24 hours
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Support Contact */}
              <Card className="w-full bg-muted/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <h4 className="font-semibold text-foreground">
                      Contact Support
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Email:{" "}
                        <a
                          href="mailto:support@atraiva.ai"
                          className="text-primary hover:underline font-medium"
                        >
                          support@atraiva.ai
                        </a>
                      </p>
                      <p className="text-muted-foreground">
                        Phone:{" "}
                        <span className="text-foreground font-medium">
                          1-800-ATRAIVA
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Countdown and Redirect */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Redirecting to home page in{" "}
                    <strong className="text-foreground">
                      {redirectCountdown}
                    </strong>{" "}
                    {redirectCountdown === 1 ? "second" : "seconds"}...
                  </span>
                </div>
                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="mt-2"
                >
                  Go to Home Page Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Atraiva</h1>
                <p className="text-sm text-muted-foreground">
                  Compliance Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant="outline" className="text-sm">
                Step {currentStep + 1} of {onboardingSteps.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">
              {onboardingSteps[currentStep].title}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto">
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

                <CardHeader className="text-center pb-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600">
                    {React.createElement(onboardingSteps[currentStep].icon, {
                      className: "h-8 w-8 text-white",
                    })}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {onboardingSteps[currentStep].title}
                  </CardTitle>
                  <CardDescription className="text-lg text-muted-foreground">
                    {onboardingSteps[currentStep].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 min-h-[700px] flex flex-col">
                  <div
                    className={
                      isTransitioning
                        ? "opacity-0"
                        : "opacity-100 transition-opacity duration-200 flex-1"
                    }
                  >
                    <CurrentStepComponent
                      data={onboardingData}
                      onDataUpdate={handleDataUpdate}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      isFirstStep={currentStep === 0}
                      isLastStep={currentStep === onboardingSteps.length - 1}
                      registrationToken={registrationToken}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>© 2024 Atraiva. All rights reserved.</span>
              <span>•</span>
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Enterprise Security</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Loading...</h3>
                  <p className="text-sm text-muted-foreground">
                    Please wait...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  );
}
