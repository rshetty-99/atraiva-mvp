"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, ArrowLeft, ArrowRight } from "lucide-react";
import { IncidentSimulationStepProps } from "./types";
import { TooltipGuide, getTooltipsForStep } from "./onboarding";
import { useOnboarding } from "./onboarding";

const formSchema = z.object({
  dataSources: z.array(z.string()).min(1, "Please select at least one data source"),
  dataTypes: z.array(z.string()).min(1, "Please select at least one data type"),
  estimatedRecordsAffected: z.string().min(1, "Please select estimated records affected"),
  severity: z.enum(["critical", "high", "medium", "low", "unknown"], {
    required_error: "Please select a severity level",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const dataSources = [
  { value: "email_exchange", label: "Email/Exchange data" },
  { value: "file_shares_sharepoint", label: "File shares/SharePoint" },
  { value: "databases", label: "Databases (SQL, Oracle, etc.)" },
  { value: "cloud_storage", label: "Cloud storage (OneDrive, Teams, etc.)" },
  { value: "crm_systems", label: "Customer databases/CRM systems" },
  { value: "erp_systems", label: "Financial/ERP systems" },
  { value: "all_unknown", label: "All/Unknown - need broad scan" },
];

const dataTypes = [
  { value: "pii", label: "Personal Identifiable Information (PII)" },
  { value: "financial", label: "Financial records" },
  { value: "phi", label: "Healthcare information (PHI)" },
  { value: "ip_trade_secrets", label: "Intellectual property/Trade secrets" },
  { value: "customer_data", label: "Customer data" },
  { value: "employee_data", label: "Employee data (HR records, payroll)" },
  { value: "pci", label: "Payment card information" },
  { value: "unknown", label: "Unknown - need classification scan" },
];

const recordCounts = [
  { value: "under_1k", label: "Under 1,000" },
  { value: "1k_10k", label: "1,000 - 10,000" },
  { value: "10k_100k", label: "10,000 - 100,000" },
  { value: "over_100k", label: "Over 100,000" },
  { value: "unknown", label: "Unknown" },
];

const severityLevels = [
  { value: "critical", label: "Critical", description: "Over 100,000 records or critical systems compromised" },
  { value: "high", label: "High", description: "10,000 - 100,000 records affected" },
  { value: "medium", label: "Medium", description: "1,000 - 10,000 records affected" },
  { value: "low", label: "Low", description: "Under 1,000 records affected" },
  { value: "unknown", label: "Unknown", description: "Severity cannot be determined at this time" },
];

export default function Step4({ data, onDataUpdate, onNext, onPrevious }: IncidentSimulationStepProps) {
  const { state: onboardingState } = useOnboarding();
  const tooltips = getTooltipsForStep(4);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataSources: data.step4?.dataSources || [],
      dataTypes: data.step4?.dataTypes || [],
      estimatedRecordsAffected: data.step4?.estimatedRecordsAffected || "",
      severity: data.step4?.severity || undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    onDataUpdate("step4", values);
    onNext();
  };

  const handleSave = () => {
    const values = form.getValues();
    onDataUpdate("step4", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TooltipGuide
          config={tooltips.find((t) => t.field === "dataSources") || tooltips[0]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="dataSources"
            render={() => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Data Sources of Concern: (Select all that apply)</FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                {dataSources.map((source) => (
                  <FormField
                    key={source.value}
                    control={form.control}
                    name="dataSources"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={source.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(source.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, source.value])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== source.value)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {source.label}
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

        <TooltipGuide
          config={tooltips.find((t) => t.field === "dataTypes") || tooltips[1]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="dataTypes"
            render={() => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Suspected Data Types at Risk: (Select all that apply)</FormLabel>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                {dataTypes.map((type) => (
                  <FormField
                    key={type.value}
                    control={form.control}
                    name="dataTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type.value}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, type.value])
                                  : field.onChange(
                                      field.value?.filter((value) => value !== type.value)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal cursor-pointer">
                            {type.label}
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

        <TooltipGuide
          config={tooltips.find((t) => t.field === "estimatedRecordsAffected") || tooltips[2]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="estimatedRecordsAffected"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Estimated number of records potentially affected:</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select estimated records" />
                      </SelectTrigger>
                      <SelectContent>
                        {recordCounts.map((count) => (
                          <SelectItem key={count.value} value={count.value}>
                            {count.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </TooltipGuide>

        <TooltipGuide
          config={tooltips.find((t) => t.field === "severity") || {
            field: "severity",
            title: "Severity Level",
            content: "Select the severity level based on the number of records affected and the impact of the incident.",
            position: "right",
          }}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Severity Level *</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        {severityLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label} - {level.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </TooltipGuide>

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
            <Button type="submit">
              <ArrowRight className="h-4 w-4 mr-2" />
              Continue
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

