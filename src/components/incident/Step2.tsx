"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Save } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

const formSchema = z.object({
  discoveryMethod: z
    .string()
    .min(1, "Please select how the incident was discovered"),
  incidentType: z.string().min(1, "Please select the incident type"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step2({ onNext, onPrevious }: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      discoveryMethod: "",
      incidentType: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Step 2 data:", data);
    localStorage.setItem("incident_step2", JSON.stringify(data));
    onNext();
  };

  const handleSave = () => {
    const data = form.getValues();
    localStorage.setItem("incident_step2", JSON.stringify(data));
    console.log("Data saved:", data);
  };

  const discoveryOptions = [
    { value: "ransomware", label: "Ransomware Note / Encryption" },
    { value: "suspicious_activity", label: "Suspicious User Activity" },
    { value: "antivirus_alert", label: "Antivirus / EDR Alert" },
    { value: "phishing", label: "Phishing Email / Social Engineering Report" },
    { value: "employee_report", label: "Employee Report / Observation" },
    { value: "third_party", label: "Third-party Notification" },
    { value: "audit", label: "Audit / Log Review" },
    { value: "other", label: "Other" },
  ];

  const incidentTypes = [
    { value: "ransomware", label: "Ransomware" },
    { value: "phishing", label: "Phishing / Business Email Compromise" },
    { value: "malware", label: "Malware Infection" },
    { value: "unauthorized_access", label: "Unauthorized Access / Intrusion" },
    { value: "data_breach", label: "Data Breach / Data Exfiltration" },
    { value: "insider_threat", label: "Insider Threat" },
    { value: "ddos", label: "DDoS Attack" },
    { value: "unknown", label: "Unknown / Still Investigating" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Discovery Method */}
          <FormField
            control={form.control}
            name="discoveryMethod"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold">
                  How was the incident discovered? (Select one)
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {discoveryOptions.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex-1">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Incident Type */}
          <FormField
            control={form.control}
            name="incidentType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold">
                  What type of incident is this? (Select one)
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    {incidentTypes.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer"
                      >
                        <FormControl>
                          <RadioGroupItem value={option.value} />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer flex-1">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleSave}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save
            </Button>
            <div className="flex gap-3">
              <Button type="button" onClick={onPrevious} variant="outline">
                Previous
              </Button>
              <Button type="submit" className="gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
