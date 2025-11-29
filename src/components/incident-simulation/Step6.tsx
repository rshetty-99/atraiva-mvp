"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Save, ArrowLeft, ArrowRight } from "lucide-react";
import { IncidentSimulationStepProps } from "./types";
import { TooltipGuide, getTooltipsForStep } from "./onboarding";
import { useOnboarding } from "./onboarding";
import { PurviewScanUpload } from "./PurviewScanUpload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
  purviewScanOption: z.enum(["has_report", "needs_help"], {
    required_error: "Please select an option for Purview scan",
  }),
  keySystems: z.string().optional(),
  compromisedAccounts: z
    .object({
      hasCompromised: z.enum(["yes", "no", "unknown"]),
      accountNames: z.string().optional(),
    })
    .optional(),
  purviewScanPriorities: z
    .array(z.string())
    .max(3, "Please select top 3 priorities")
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const purviewPriorities = [
  {
    value: "compromised_accounts_data",
    label: "Identify all data touched by compromised accounts",
  },
  {
    value: "map_sensitive_data",
    label: "Map sensitive data in affected systems",
  },
  {
    value: "trace_data_lineage",
    label: "Trace data lineage from affected sources",
  },
  {
    value: "audit_access_patterns",
    label: "Audit recent access patterns (last 30 days)",
  },
  {
    value: "classification_scan",
    label: "Classification scan of affected datasets",
  },
  {
    value: "dlp_alerts",
    label: "Cross-reference with known data loss prevention (DLP) alerts",
  },
];

export default function Step6({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
  organizationId,
  incidentId,
  uploadedBy,
  purviewScan,
  onScanUpload,
  onScanRemove,
}: IncidentSimulationStepProps) {
  const { state: onboardingState } = useOnboarding();
  const tooltips = getTooltipsForStep(6);
  const [showAccountInput, setShowAccountInput] = useState(
    data.step6?.compromisedAccounts?.hasCompromised === "yes"
  );
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Ensure purviewScanOption is always defined (not undefined) to keep RadioGroup controlled
      purviewScanOption:
        (data.step6?.purviewScanOption as
          | "has_report"
          | "needs_help"
          | undefined) || undefined,
      keySystems: data.step6?.keySystems || "",
      compromisedAccounts: data.step6?.compromisedAccounts
        ? {
            hasCompromised:
              (data.step6.compromisedAccounts.hasCompromised as
                | "yes"
                | "no"
                | "unknown") || undefined,
            accountNames: data.step6.compromisedAccounts.accountNames || "",
          }
        : undefined,
      purviewScanPriorities: data.step6?.purviewScanPriorities || [],
    },
  });

  const purviewScanOption = form.watch("purviewScanOption");
  const compromisedAccounts = form.watch("compromisedAccounts");
  const hasCompromised = compromisedAccounts?.hasCompromised;
  const purviewPrioritiesSelected = form.watch("purviewScanPriorities") || [];

  // Check if file upload is required and completed
  const requiresFileUpload = purviewScanOption === "has_report";
  const hasFileUploaded = purviewScan !== null && purviewScan !== undefined;
  const isContinueDisabled = requiresFileUpload && !hasFileUploaded;

  React.useEffect(() => {
    setShowAccountInput(hasCompromised === "yes");
  }, [hasCompromised]);

  const onSubmit = async (values: FormValues) => {
    // Ensure upload is complete before proceeding
    if (isUploading) {
      console.warn("Cannot submit while upload is in progress");
      return;
    }

    // Validate form state
    const isValid = await form.trigger();
    if (!isValid) {
      console.error("Form validation failed", form.formState.errors);
      return;
    }

    onDataUpdate("step6", values);
    onNext();
  };

  const handleSave = () => {
    const values = form.getValues();
    onDataUpdate("step6", values);
  };

  // Debug: Log form state changes
  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        // Re-validate on change to ensure form is always in valid state
        form.trigger();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          // Log validation errors for debugging
          console.error("Form validation errors:", errors);
        })}
        className="space-y-6"
      >
        {/* Purview Scan Option Question */}
        <FormField
          control={form.control}
          name="purviewScanOption"
          render={({ field }) => (
            <FormItem>
              <div className="border rounded-lg p-4 space-y-3">
                <FormLabel>
                  Do you have a Purview scan report to upload, or do you need
                  help with Purview scanning?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="has_report"
                        id="purview_has_report"
                      />
                      <label
                        htmlFor="purview_has_report"
                        className="text-sm font-normal cursor-pointer"
                      >
                        I have a Purview scan report to upload
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="needs_help"
                        id="purview_needs_help"
                      />
                      <label
                        htmlFor="purview_needs_help"
                        className="text-sm font-normal cursor-pointer"
                      >
                        I need help with Purview scanning
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Show upload container if they have a report */}
        {purviewScanOption === "has_report" && (
          <Card className="mt-6 border-2 border-primary/20">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-lg">
                Upload Purview Scan Report
              </CardTitle>
              <CardDescription>
                Upload a Purview scan file (JSON, CSV, or Excel) to enhance the
                automated analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {organizationId && uploadedBy ? (
                <PurviewScanUpload
                  incidentId={incidentId || "draft"}
                  organizationId={organizationId}
                  uploadedBy={uploadedBy}
                  existingScan={purviewScan}
                  onUploadComplete={(scan) => {
                    setIsUploading(false);
                    if (onScanUpload) onScanUpload(scan);
                  }}
                  onUploadStart={() => setIsUploading(true)}
                  onUploadError={() => setIsUploading(false)}
                  onRemove={onScanRemove || (() => {})}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Organization information is required to upload a scan.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Show help container if they need help */}
        {purviewScanOption === "needs_help" && (
          <Card className="mt-6 border-2 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="bg-blue-100 dark:bg-blue-900/20">
              <CardTitle className="text-lg">
                Purview Scan Help & Guidance
              </CardTitle>
              <CardDescription>
                We&apos;ll help you set up and run a Purview scan for your
                incident
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <h4 className="font-semibold">What is a Purview Scan?</h4>
                <p className="text-sm text-muted-foreground">
                  Microsoft Purview provides data discovery, classification, and
                  governance capabilities. A Purview scan helps identify
                  sensitive data, access patterns, and data lineage related to
                  your incident.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">How to Get Started:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Access your Microsoft Purview portal</li>
                  <li>Navigate to the Data Map section</li>
                  <li>Create a new scan for the affected data sources</li>
                  <li>
                    Configure the scan to focus on the systems mentioned in your
                    incident
                  </li>
                  <li>Run the scan and export the results</li>
                  <li>Return here to upload the scan report</li>
                </ol>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Need More Help?</h4>
                <p className="text-sm text-muted-foreground">
                  Contact your Microsoft Purview administrator or refer to the
                  <a
                    href="https://learn.microsoft.com/en-us/purview/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline ml-1"
                  >
                    Microsoft Purview documentation
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show technical details fields if they need help */}
        {purviewScanOption === "needs_help" && (
          <>
            <TooltipGuide
              config={
                tooltips.find((t) => t.field === "keySystems") || tooltips[0]
              }
              show={onboardingState.showTooltips}
            >
              <FormField
                control={form.control}
                name="keySystems"
                render={({ field }) => (
                  <FormItem>
                    <div className="border rounded-lg p-4 space-y-3">
                      <FormLabel>
                        Key Systems/Assets to Investigate First:
                      </FormLabel>
                      <p className="text-sm text-muted-foreground mb-2">
                        This is the &quot;start here&quot; command. Please
                        provide hostnames, IP addresses, application names, or
                        user accounts.
                      </p>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., FS-PROD-01, SQL-DB-Finance, ceo@company.com"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </TooltipGuide>

            <TooltipGuide
              config={
                tooltips.find((t) => t.field === "compromisedAccounts") ||
                tooltips[1]
              }
              show={onboardingState.showTooltips}
            >
              <FormField
                control={form.control}
                name="compromisedAccounts.hasCompromised"
                render={({ field }) => (
                  <FormItem>
                    <div className="border rounded-lg p-4 space-y-3">
                      <FormLabel>
                        Have any key personnel accounts been compromised? (e.g.,
                        Domain Admin, CEO, CFO)
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="compromised_yes" />
                            <label
                              htmlFor="compromised_yes"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Yes (specify accounts if known):
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="compromised_no" />
                            <label
                              htmlFor="compromised_no"
                              className="text-sm font-normal cursor-pointer"
                            >
                              No
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="unknown"
                              id="compromised_unknown"
                            />
                            <label
                              htmlFor="compromised_unknown"
                              className="text-sm font-normal cursor-pointer"
                            >
                              Unknown
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </TooltipGuide>

            {showAccountInput && (
              <FormField
                control={form.control}
                name="compromisedAccounts.accountNames"
                render={({ field }) => (
                  <FormItem>
                    <div className="border rounded-lg p-4 space-y-3">
                      <FormControl>
                        <Input
                          placeholder="Enter account names..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}

            <TooltipGuide
              config={
                tooltips.find((t) => t.field === "purviewScanPriorities") ||
                tooltips[2]
              }
              show={onboardingState.showTooltips}
            >
              <FormField
                control={form.control}
                name="purviewScanPriorities"
                render={() => (
                  <FormItem>
                    <div className="border rounded-lg p-4 space-y-3">
                      <FormLabel>
                        What should the automated Purview scan prioritize?
                        (Optional)
                      </FormLabel>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select top 3
                      </p>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {purviewPriorities.map((priority) => (
                          <FormField
                            key={priority.value}
                            control={form.control}
                            name="purviewScanPriorities"
                            render={({ field }) => {
                              const currentValue = field.value || [];
                              const isChecked = currentValue.includes(
                                priority.value
                              );
                              const isDisabled =
                                !isChecked &&
                                purviewPrioritiesSelected.length >= 3;

                              return (
                                <FormItem
                                  key={priority.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      disabled={isDisabled}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...currentValue,
                                              priority.value,
                                            ])
                                          : field.onChange(
                                              currentValue.filter(
                                                (value) =>
                                                  value !== priority.value
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel
                                    className={`text-sm font-normal cursor-pointer ${
                                      isDisabled ? "opacity-50" : ""
                                    }`}
                                  >
                                    {priority.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </TooltipGuide>
          </>
        )}

        <div className="flex justify-between pt-4">
          <div>
            {onPrevious && (
              <Button type="button" variant="outline" onClick={onPrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button type="submit" disabled={isUploading || isContinueDisabled}>
              {isUploading ? (
                "Uploading..."
              ) : isContinueDisabled ? (
                "Upload file to continue"
              ) : (
                <>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Continue
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
