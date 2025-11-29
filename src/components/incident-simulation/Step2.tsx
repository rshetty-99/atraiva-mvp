"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
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
  discoveryMethod: z.string().min(1, "Please select how the incident was discovered"),
  discoveryMethodOther: z.string().optional(),
  summary: z.string().min(1, "Brief summary is required"),
  incidentTypes: z.array(z.string()).min(1, "Please select at least one incident type"),
});

type FormValues = z.infer<typeof formSchema>;

const discoveryMethods = [
  { value: "ransomware_note", label: "Ransomware Note / Screen" },
  { value: "internal_alert", label: "Internal Security Alert (e.g., EDR, SIEM)" },
  { value: "employee_report", label: "Employee Report" },
  { value: "customer_complaint", label: "Customer Complaint / Report" },
  { value: "law_enforcement", label: "Notification from Law Enforcement (e.g., FBI)" },
  { value: "third_party", label: "Notification from a Third Party (e.g., security researcher)" },
  { value: "other", label: "Other (please specify)" },
];

const incidentTypes = [
  { value: "ransomware", label: "Ransomware" },
  { value: "bec_phishing", label: "Business Email Compromise (BEC) / Phishing" },
  { value: "unauthorized_access", label: "Unauthorized Access" },
  { value: "lost_stolen_device", label: "Lost or Stolen Device (Laptop, Phone, etc.)" },
  { value: "accidental_exposure", label: "Accidental Data Exposure" },
  { value: "insider_threat", label: "Insider Threat" },
  { value: "unknown", label: "Unknown" },
];

export default function Step2({ data, onDataUpdate, onNext, onPrevious }: IncidentSimulationStepProps) {
  const { state: onboardingState } = useOnboarding();
  const tooltips = getTooltipsForStep(2);
  const [showOtherInput, setShowOtherInput] = useState(data.step2?.discoveryMethod === "other");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discoveryMethod: data.step2?.discoveryMethod || "",
      discoveryMethodOther: data.step2?.discoveryMethodOther || "",
      summary: data.step2?.summary || "",
      incidentTypes: data.step2?.incidentTypes || [],
    },
  });

  const discoveryMethod = form.watch("discoveryMethod");

  React.useEffect(() => {
    setShowOtherInput(discoveryMethod === "other");
  }, [discoveryMethod]);

  const onSubmit = (values: FormValues) => {
    onDataUpdate("step2", values);
    onNext();
  };

  const handleSave = () => {
    const values = form.getValues();
    onDataUpdate("step2", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TooltipGuide
          config={tooltips.find((t) => t.field === "discoveryMethod") || tooltips[0]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="discoveryMethod"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>How was the incident discovered? (Select one)</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discovery method" />
                      </SelectTrigger>
                      <SelectContent>
                        {discoveryMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
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

        {showOtherInput && (
          <FormField
            control={form.control}
            name="discoveryMethodOther"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Please specify</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter discovery method" {...field} />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        )}

        <TooltipGuide
          config={tooltips.find((t) => t.field === "summary") || tooltips[1]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Brief Summary of Event (in plain English)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'A ransom note appeared on our primary file server,' or 'The CFO's email account is sending out spam to our vendors,' or 'We can't access any of our files.'"
                      className="min-h-[120px]"
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
          config={tooltips.find((t) => t.field === "incidentTypes") || tooltips[2]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="incidentTypes"
            render={() => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Suspected Type of Incident: (Select one or more)</FormLabel>
                  <div className="space-y-3 mt-2">
                    {incidentTypes.map((type) => (
                      <FormField
                        key={type.value}
                        control={form.control}
                        name="incidentTypes"
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

