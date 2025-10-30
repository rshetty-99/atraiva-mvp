"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  Smartphone,
  Key,
  Mail,
  CheckCircle,
  AlertTriangle,
  Lock,
  Smartphone as PhoneIcon,
} from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface SecurityData {
  mfaEnabled?: boolean;
  mfaMethod?: string;
  phoneNumber?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  securityAlerts?: boolean;
  sessionTimeout?: string;
  passwordPolicy?: string;
}

interface SecuritySetupStepProps {
  data: SecurityData;
  onDataUpdate: (data: SecurityData) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  registrationToken?: string | null;
}

const securitySchema = z.object({
  mfaEnabled: z.boolean(),
  mfaMethod: z.string().optional(),
  phoneNumber: z.string().optional(),
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  securityAlerts: z.boolean(),
  sessionTimeout: z.string().optional(),
  passwordPolicy: z.string().optional(),
  verificationCode: z.string().optional(),
});

const mfaMethods = [
  {
    id: "totp",
    name: "Authenticator",
    description: "Use Google Authenticator, Authy, or 1Password",
    icon: Smartphone,
    recommended: true,
    setup: "Scan QR code with your authenticator app",
  },
  {
    id: "sms",
    name: "SMS Verification",
    description: "Receive codes via text message",
    icon: PhoneIcon,
    recommended: false,
    setup: "Enter your phone number for verification",
  },
  {
    id: "email",
    name: "Email Codes",
    description: "Receive codes via email",
    icon: Mail,
    recommended: false,
    setup: "Codes will be sent to your registered email",
  },
  {
    id: "hardware",
    name: "Hardware Key",
    description: "Use YubiKey or similar security key",
    icon: Key,
    recommended: true,
    setup: "Insert your hardware key when prompted",
  },
];

const securityFeatures = [
  {
    title: "Multi-Factor Authentication",
    description: "Add an extra layer of security to your account with 2FA",
    icon: Shield,
    enabled: true,
    required: true,
    details:
      "Requires a second verification step beyond your password, such as a code from your phone or authenticator app.",
  },
  {
    title: "Session Management",
    description: "Control how long you stay logged in",
    icon: Lock,
    enabled: true,
    required: false,
    details:
      "Automatically log out after a period of inactivity to prevent unauthorized access.",
  },
  {
    title: "Security Notifications",
    description: "Get alerts about suspicious activity",
    icon: AlertTriangle,
    enabled: true,
    required: false,
    details:
      "Receive real-time notifications when unusual login attempts or security events occur.",
  },
  {
    title: "Password Policy",
    description: "Enforce strong password requirements",
    icon: Key,
    enabled: true,
    required: true,
    details:
      "Ensure all passwords meet enterprise security standards with complexity requirements.",
  },
];

const sessionTimeouts = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
  { value: "480", label: "8 hours" },
];

const passwordPolicies = [
  {
    value: "standard",
    label: "Standard",
    description: "8+ characters, mixed case, numbers",
  },
  {
    value: "strong",
    label: "Strong",
    description: "12+ characters, special characters required",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "16+ characters, complex requirements",
  },
];

export default function SecuritySetupStep({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
}: SecuritySetupStepProps) {
  const [selectedMfaMethod, setSelectedMfaMethod] = useState(
    data.mfaMethod || ""
  );
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [mfaSetupStep, setMfaSetupStep] = useState(0);
  const [securityFeatureStates, setSecurityFeatureStates] = useState<
    Record<string, boolean>
  >({
    "Multi-Factor Authentication": true,
    "Session Management": true,
    "Security Notifications": true,
    "Password Policy": true,
  });

  const form = useForm({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      mfaEnabled: data.mfaEnabled || false,
      mfaMethod: data.mfaMethod || "",
      phoneNumber: data.phoneNumber || "",
      emailNotifications: data.emailNotifications || true,
      smsNotifications: data.smsNotifications || false,
      securityAlerts: data.securityAlerts || true,
      sessionTimeout: data.sessionTimeout || "30",
      passwordPolicy: data.passwordPolicy || "strong",
    },
  });

  const {
    handleSubmit,
    formState: {},
    watch,
    setValue,
    control,
  } = form;
  const watchedValues = watch();

  const handleMfaMethodSelect = (methodId: string) => {
    setSelectedMfaMethod(methodId);
    setValue("mfaMethod", methodId);
    setShowMfaSetup(true);
    setMfaSetupStep(0);
  };

  const handleMfaSetupComplete = () => {
    setValue("mfaEnabled", true);
    setShowMfaSetup(false);
    onDataUpdate({
      mfaMethod: selectedMfaMethod,
      ...watchedValues,
    });
  };

  const onSubmit = (formData: SecurityData) => {
    onDataUpdate(formData);
    onNext();
  };

  const selectedMethod = mfaMethods.find(
    (method) => method.id === selectedMfaMethod
  );

  if (showMfaSetup && selectedMethod) {
    return (
      <div className="space-y-8">
        {/* MFA Setup Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            {React.createElement(selectedMethod.icon, {
              className: "h-10 w-10 text-primary",
            })}
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Set up {selectedMethod.name}
          </h3>
          <p className="text-muted-foreground text-lg">
            {selectedMethod.setup}
          </p>
        </div>

        {/* MFA Setup Steps */}
        <Card>
          <CardContent className="p-6">
            <FormProvider {...form}>
              {mfaSetupStep === 0 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-muted rounded-xl mb-6">
                      <div className="grid grid-cols-4 gap-1">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 bg-muted-foreground/20 rounded"
                          />
                        ))}
                      </div>
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-3">
                      Scan QR Code
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      Open your authenticator app and scan this QR code
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-6 border">
                    <h5 className="font-semibold text-foreground mb-3">
                      Manual Entry
                    </h5>
                    <p className="text-muted-foreground mb-4">
                      If you can&apos;t scan the QR code, enter this code
                      manually:
                    </p>
                    <div className="bg-background border rounded-lg p-4 font-mono text-sm text-foreground">
                      JBSWY3DPEHPK3PXP
                    </div>
                  </div>

                  <Button onClick={() => setMfaSetupStep(1)} className="w-full">
                    I&apos;ve scanned the QR code
                  </Button>
                </div>
              )}

              {mfaSetupStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-6" />
                    <h4 className="text-xl font-semibold text-foreground mb-3">
                      Verify Setup
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="verificationCode"
                    label="Verification Code"
                    placeholder="123456"
                    control={control}
                    required
                  />

                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setMfaSetupStep(0)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button onClick={handleMfaSetupComplete} className="flex-1">
                      Verify & Complete
                    </Button>
                  </div>
                </div>
              )}
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Vertical Tabs Layout */}
      <Tabs defaultValue="features" className="w-full">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tabs List - Vertical on desktop, horizontal on mobile */}
          <TabsList className="grid w-full lg:w-64 grid-cols-2 lg:grid-cols-1 h-auto lg:h-[480px]">
            <TabsTrigger
              value="features"
              className="flex flex-col items-start p-4 h-auto min-h-[100px]"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Shield className="h-4 w-4" />
                <span className="font-medium">Security Features</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Configure core security settings
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="mfa"
              className="flex flex-col items-start p-4 h-auto min-h-[100px]"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Smartphone className="h-4 w-4" />
                <span className="font-medium">Multi-Factor Auth</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Set up MFA methods
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex flex-col items-start p-4 h-auto min-h-[100px]"
            >
              <div className="flex items-center space-x-2 mb-1">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Preferences</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Additional security settings
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="flex flex-col items-start p-4 h-auto min-h-[100px]"
            >
              <div className="flex items-center space-x-2 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="font-medium">Summary</span>
              </div>
              <span className="text-xs text-muted-foreground text-left">
                Review your security setup
              </span>
            </TabsTrigger>
          </TabsList>

          {/* Tabs Content */}
          <div className="flex-1">
            <TabsContent value="features" className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Core Security Features
                </h4>
                <p className="text-muted-foreground">
                  Configure essential security settings for your account.
                  Required features are enabled by default for compliance.
                </p>
              </div>

              <div className="space-y-4">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      className={`transition-all duration-200 ${
                        securityFeatureStates[feature.title]
                          ? "border-primary/20 bg-primary/5 dark:bg-primary/10"
                          : "border-border hover:border-primary/20"
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-start space-x-4">
                              <div
                                className={`p-3 rounded-xl ${
                                  securityFeatureStates[feature.title]
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {React.createElement(feature.icon, {
                                  className: "h-6 w-6",
                                })}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h4 className="font-semibold text-foreground text-lg">
                                    {feature.title}
                                  </h4>
                                  {feature.required && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs font-medium"
                                    >
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-muted-foreground mt-1">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={securityFeatureStates[feature.title]}
                              onCheckedChange={(checked) => {
                                // Handle feature toggle
                                console.log(
                                  `${feature.title} toggled to:`,
                                  checked
                                );
                                // Update the feature state
                                setSecurityFeatureStates((prev) => ({
                                  ...prev,
                                  [feature.title]: checked,
                                }));
                              }}
                              disabled={feature.required}
                            />
                          </div>

                          {/* Feature Details */}
                          <div className="ml-16 pl-2 border-l-2 border-muted">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {feature.details}
                            </p>
                            {feature.required && (
                              <p className="text-xs text-destructive mt-2 font-medium">
                                This feature is required for compliance and
                                cannot be disabled.
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Security Compliance Info */}
              <div className="bg-muted/50 rounded-xl p-6 border">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h5 className="font-semibold text-foreground mb-2">
                      Why These Features Matter
                    </h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      These security features are designed to protect your
                      organization&apos;s data and ensure compliance with
                      industry standards like HIPAA, SOC 2, and GDPR. Required
                      features cannot be disabled as they are essential for
                      maintaining security posture.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mfa" className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Multi-Factor Authentication
                </h4>
                <p className="text-muted-foreground">
                  Choose your preferred MFA method for enhanced security
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mfaMethods.map((method, index) => (
                  <motion.div
                    key={method.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg relative ${
                        selectedMfaMethod === method.id
                          ? "ring-2 ring-primary bg-primary/5 dark:bg-primary/10 border-primary/20"
                          : "hover:shadow-md hover:border-primary/20"
                      }`}
                      style={{
                        height: "204px",
                        minHeight: "204px",
                        maxHeight: "204px",
                      }}
                      key={`mfa-card-${method.id}-204px`}
                      onClick={() => handleMfaMethodSelect(method.id)}
                    >
                      <CardContent className="pt-0 px-4 pb-4 h-full flex flex-col overflow-hidden">
                        <div className="flex items-start space-x-3 flex-1">
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              selectedMfaMethod === method.id
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {React.createElement(method.icon, {
                              className: "h-6 w-6",
                            })}
                          </div>
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-start justify-between mb-1">
                              <h5 className="font-semibold text-foreground text-lg break-words">
                                {method.name}
                              </h5>
                              {selectedMfaMethod === method.id && (
                                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                              )}
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed break-words hyphens-auto">
                              {method.description}
                            </p>
                          </div>
                        </div>

                        {/* Recommended tag in bottom right */}
                        {method.recommended && (
                          <div className="absolute bottom-2 right-2 z-10">
                            <Badge
                              variant="outline"
                              className="text-xs font-medium text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 shadow-sm"
                            >
                              Recommended
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-foreground mb-2">
                  Security Preferences
                </h4>
                <p className="text-muted-foreground">
                  Configure additional security settings for your account
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label
                    htmlFor="sessionTimeout"
                    className="text-foreground font-medium text-base"
                  >
                    Session Timeout
                  </Label>
                  <Select
                    value={watchedValues.sessionTimeout}
                    onValueChange={(value) => setValue("sessionTimeout", value)}
                  >
                    <SelectTrigger className="bg-background h-12">
                      <SelectValue placeholder="Select timeout duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionTimeouts.map((timeout) => (
                        <SelectItem key={timeout.value} value={timeout.value}>
                          <span className="text-foreground">
                            {timeout.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label
                    htmlFor="passwordPolicy"
                    className="text-foreground font-medium text-base"
                  >
                    Password Policy
                  </Label>
                  <Select
                    value={watchedValues.passwordPolicy}
                    onValueChange={(value) => setValue("passwordPolicy", value)}
                  >
                    <SelectTrigger className="bg-background min-h-[120px] h-auto py-4 px-3 w-full">
                      <SelectValue placeholder="Select password policy">
                        {watchedValues.passwordPolicy && (
                          <div className="text-left w-full pr-6 overflow-hidden">
                            <div className="font-medium text-foreground text-base mb-2 break-words">
                              {
                                passwordPolicies.find(
                                  (policy) =>
                                    policy.value ===
                                    watchedValues.passwordPolicy
                                )?.label
                              }
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed break-words hyphens-auto">
                              {
                                passwordPolicies.find(
                                  (policy) =>
                                    policy.value ===
                                    watchedValues.passwordPolicy
                                )?.description
                              }
                            </div>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="w-full max-w-full">
                      {passwordPolicies.map((policy) => (
                        <SelectItem
                          key={policy.value}
                          value={policy.value}
                          className="p-4 w-full"
                        >
                          <div className="w-full overflow-hidden">
                            <div className="font-medium text-foreground text-base mb-2 break-words">
                              {policy.label}
                            </div>
                            <div className="text-sm text-muted-foreground leading-relaxed break-words hyphens-auto">
                              {policy.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div>
                    <h5 className="font-semibold text-foreground">
                      Email Notifications
                    </h5>
                    <p className="text-muted-foreground">
                      Receive security alerts via email
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.emailNotifications}
                    onCheckedChange={(checked) =>
                      setValue("emailNotifications", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div>
                    <h5 className="font-semibold text-foreground">
                      SMS Notifications
                    </h5>
                    <p className="text-muted-foreground">
                      Receive security alerts via SMS
                    </p>
                  </div>
                  <Switch
                    checked={watchedValues.smsNotifications}
                    onCheckedChange={(checked) =>
                      setValue("smsNotifications", checked)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg mb-3">
                      Security Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Enterprise-grade encryption
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          HIPAA compliant data handling
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Regular security audits
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          24/7 security monitoring
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <Button
          onClick={handleSubmit(onSubmit)}
          className="flex items-center space-x-2"
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
