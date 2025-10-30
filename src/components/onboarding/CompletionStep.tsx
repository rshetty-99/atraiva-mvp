"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { OnboardingData } from "@/lib/firestore/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  BarChart3,
  Settings,
  Mail,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
  Target,
  Building,
} from "lucide-react";

interface CompletionStepProps {
  data: OnboardingData;
  onDataUpdate: (data: OnboardingData) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  registrationToken?: string | null;
}

const completionSteps = [
  {
    id: "validation",
    title: "Validating information",
    description: "Verifying your account details",
    duration: 1000,
    icon: Shield,
  },
  {
    id: "account-creation",
    title: "Creating your account",
    description: "Setting up your user profile in Clerk",
    duration: 1500,
    icon: Users,
  },
  {
    id: "organization-setup",
    title: "Setting up organization",
    description: "Creating your organization in the system",
    duration: 1500,
    icon: Building,
  },
  {
    id: "database-sync",
    title: "Syncing to database",
    description: "Saving your data to Firestore",
    duration: 1500,
    icon: BarChart3,
  },
  {
    id: "permissions-setup",
    title: "Configuring permissions",
    description: "Setting up role-based access controls",
    duration: 1000,
    icon: Settings,
  },
  {
    id: "finalization",
    title: "Finalizing setup",
    description: "Completing your Atraiva configuration",
    duration: 1000,
    icon: CheckCircle,
  },
];

const nextSteps = [
  {
    title: "Explore Your Dashboard",
    description: "Take a tour of your personalized dashboard and widgets",
    icon: BarChart3,
    action: "Start Tour",
    color: "blue",
  },
  {
    title: "Invite Team Members",
    description: "Add your team members and assign appropriate roles",
    icon: Users,
    action: "Invite Team",
    color: "green",
  },
  {
    title: "Configure Integrations",
    description: "Connect Microsoft Purview and other data sources",
    icon: Settings,
    action: "Set Up Integrations",
    color: "purple",
  },
  {
    title: "Review Documentation",
    description: "Access comprehensive guides and best practices",
    icon: Download,
    action: "View Docs",
    color: "orange",
  },
];

const quickActions = [
  {
    title: "Create Your First Incident",
    description: "Start managing compliance incidents right away",
    icon: Target,
    href: "/incidents/new",
  },
  {
    title: "Set Up Client Onboarding",
    description: "Configure your client management workflow",
    icon: Users,
    href: "/clients/onboard",
  },
  {
    title: "Configure Notifications",
    description: "Set up alerts and notification preferences",
    icon: Mail,
    href: "/settings/notifications",
  },
  {
    title: "View Compliance Reports",
    description: "Access your compliance dashboard and reports",
    icon: BarChart3,
    href: "/reports",
  },
];

export default function CompletionStep({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
  isFirstStep,
  registrationToken,
}: CompletionStepProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompletingOnboarding, setIsCompletingOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState<string | null>(null);
  const [hasAttemptedCompletion, setHasAttemptedCompletion] = useState(false);

  // Animation effect - runs through the completion steps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < completionSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update progress based on current step
  useEffect(() => {
    if (currentStep < completionSteps.length) {
      const stepProgress = ((currentStep + 1) / completionSteps.length) * 100;
      setProgress(stepProgress);
    }
  }, [currentStep]);

  // Complete onboarding when animation finishes
  useEffect(() => {
    async function completeOnboarding() {
      // Only proceed if we've reached the last step and haven't attempted completion yet
      if (
        currentStep === completionSteps.length - 1 &&
        !hasAttemptedCompletion &&
        !isCompletingOnboarding
      ) {
        console.log("Starting onboarding completion...");
        setIsCompletingOnboarding(true);
        setHasAttemptedCompletion(true); // Mark that we've attempted
        setOnboardingError(null);

        try {
          console.log("Completing onboarding with data:", {
            ...data,
            registrationToken,
          });

          // Call the onboarding completion API
          const response = await fetch("/api/onboarding/complete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              registrationToken, // Include the registration token if present
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || "Failed to complete onboarding");
          }

          console.log("Onboarding completed successfully:", result);

          // Mark as complete and show success screen
          setIsComplete(true);
          setProgress(100);
        } catch (error) {
          console.error("Onboarding completion failed:", error);
          setOnboardingError(
            error instanceof Error
              ? error.message
              : "Failed to complete onboarding"
          );
          // Do NOT show success screen on error
          // Keep isComplete as false so error UI is shown
          setProgress(100); // Complete the progress bar even on error
        } finally {
          setIsCompletingOnboarding(false);
        }
      }
    }

    completeOnboarding();
  }, [
    currentStep,
    hasAttemptedCompletion,
    isCompletingOnboarding,
    data,
    registrationToken,
  ]);

  const handleGoToDashboard = () => {
    // Redirect to sign-in page since user was created programmatically
    // and doesn't have an active session yet
    router.push(`/sign-in?email=${encodeURIComponent(data.email)}`);
  };

  const handleRetry = () => {
    // Reload the page to restart onboarding
    window.location.reload();
  };

  // Show error screen if there's an error and we've finished attempting
  if (onboardingError && hasAttemptedCompletion && !isCompletingOnboarding) {
    return (
      <div className="space-y-8">
        {/* Error Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
            <Shield className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Account Setup Failed
          </h3>
          <p className="text-muted-foreground">
            We encountered an issue while creating your account
          </p>
        </div>

        {/* Error Details */}
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-bold">!</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-2">
                    Error Details
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {onboardingError}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to Do Next */}
        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                What to do next:
              </h4>
              <ul className="space-y-3 text-sm text-muted-foreground ml-7">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Try the setup process again - the issue may be temporary
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>
                    If the problem persists, contact our support team for
                    assistance
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Support Contact */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Mail className="h-8 w-8 text-muted-foreground mx-auto" />
              <h4 className="font-semibold text-foreground">Need Help?</h4>
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRetry}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8"
          >
            Try Again
          </Button>
          <Button
            onClick={() => window.open("mailto:support@atraiva.ai", "_blank")}
            variant="outline"
            size="lg"
            className="px-8"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    );
  }

  // Show loading screen while completing or animating (and no error yet)
  if (!isComplete && !onboardingError) {
    return (
      <div className="space-y-8">
        {/* Progress Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">
            <Sparkles className="h-10 w-10 text-white animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {isCompletingOnboarding
              ? "Creating Your Account..."
              : "Setting Up Your Account"}
          </h3>
          <p className="text-muted-foreground">
            {isCompletingOnboarding
              ? "Please wait while we finalize your account creation"
              : "We're configuring everything for your personalized experience"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {isCompletingOnboarding
                ? "Finalizing your account..."
                : completionSteps[currentStep]?.title || "Complete"}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Current Step */}
        {(completionSteps[currentStep] || isCompletingOnboarding) && (
          <motion.div
            key={isCompletingOnboarding ? "api-call" : currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 dark:bg-blue-700 rounded-lg flex items-center justify-center">
                      {isCompletingOnboarding ? (
                        <CheckCircle className="h-6 w-6 text-white" />
                      ) : (
                        React.createElement(completionSteps[currentStep].icon, {
                          className: "h-6 w-6 text-white",
                        })
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-foreground">
                      {isCompletingOnboarding
                        ? "Creating your account in the system"
                        : completionSteps[currentStep].title}
                    </h4>
                    <p className="text-muted-foreground">
                      {isCompletingOnboarding
                        ? "Setting up your organization and user profile in Clerk and Firestore"
                        : completionSteps[currentStep].description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Completed Steps */}
        <div className="space-y-2">
          {completionSteps.slice(0, currentStep).map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg"
            >
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div className="flex-1">
                <h5 className="font-medium text-foreground">{step.title}</h5>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-600 mb-6">
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Atraiva!
        </h3>
        <p className="text-xl text-gray-600 mb-6">
          Your compliance platform is ready to use
        </p>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <Zap className="h-4 w-4 mr-2" />
          Setup Complete
        </div>
      </motion.div>

      {/* Account Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg text-green-900">
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Role:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-green-700 border-green-300"
                  >
                    {data.role
                      ?.replace("_", " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Organization:
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.organizationName}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Dashboard:
                  </span>
                  <span className="text-sm text-gray-600">Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Security:
                  </span>
                  <span className="text-sm text-gray-600">
                    {data.mfaEnabled ? "MFA Enabled" : "Standard"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-6"
      >
        <h4 className="text-xl font-semibold text-gray-900">
          What&apos;s Next?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nextSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-lg ${
                        step.color === "blue"
                          ? "bg-blue-100"
                          : step.color === "green"
                          ? "bg-green-100"
                          : step.color === "purple"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                      }`}
                    >
                      {React.createElement(step.icon, {
                        className: `h-6 w-6 ${
                          step.color === "blue"
                            ? "text-blue-600"
                            : step.color === "green"
                            ? "text-green-600"
                            : step.color === "purple"
                            ? "text-purple-600"
                            : "text-orange-600"
                        }`,
                      })}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-900 mb-1">
                        {step.title}
                      </h5>
                      <p className="text-sm text-gray-600 mb-3">
                        {step.description}
                      </p>
                      <Button variant="outline" size="sm" className="text-xs">
                        {step.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="space-y-6"
      >
        <h4 className="text-xl font-semibold text-gray-900">Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-4 hover:bg-gray-50"
                onClick={() => window.open(action.href, "_blank")}
              >
                <div className="flex items-center space-x-3">
                  {React.createElement(action.icon, {
                    className: "h-5 w-5 text-gray-600",
                  })}
                  <div className="text-left">
                    <div className="font-medium text-gray-900">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {action.description}
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Next Steps Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 mb-4">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Account Created Successfully!
          </h4>
          <p className="text-gray-600 mb-6">
            Your Atraiva account has been set up with the email{" "}
            <strong>{data.email}</strong>. Click the button below to sign in and
            access your dashboard.
          </p>
          <div className="space-y-3">
            <Button
              onClick={handleGoToDashboard}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold w-full sm:w-auto"
            >
              Sign In to Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              You'll be redirected to the sign-in page
            </p>
          </div>
        </div>
      </motion.div>

      {/* Support Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6"
      >
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Need Help Getting Started?
          </h4>
          <p className="text-gray-600 mb-4">
            Our support team is here to help you make the most of your Atraiva
            platform
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Contact Support</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Guide</span>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
