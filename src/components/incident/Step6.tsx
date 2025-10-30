"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { ArrowRight, Save } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

const formSchema = z.object({
  keySystems: z.string().optional(),
  suspiciousIPs: z.string().optional(),
  suspiciousAccounts: z.string().optional(),
  evidenceLocations: z.string().optional(),
  additionalTechnicalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step6({ onNext, onPrevious }: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keySystems: "",
      suspiciousIPs: "",
      suspiciousAccounts: "",
      evidenceLocations: "",
      additionalTechnicalInfo: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Step 6 data:", data);
    localStorage.setItem("incident_step6", JSON.stringify(data));
    onNext();
  };

  const handleSave = () => {
    const data = form.getValues();
    localStorage.setItem("incident_step6", JSON.stringify(data));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Note:</strong> This information helps prioritize and guide
              the investigation. Provide as much detail as you can.
            </p>
          </div>

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="keySystems"
            label="Key Systems/Assets to Investigate First"
            placeholder="Provide hostnames, IP addresses, application names, or user accounts..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="suspiciousIPs"
            label="Suspicious IP Addresses or Domains"
            placeholder="List any suspicious IP addresses or domains you've identified..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="suspiciousAccounts"
            label="Suspicious User Accounts or Email Addresses"
            placeholder="List any user accounts or email addresses involved..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="evidenceLocations"
            label="Evidence Locations (Logs, Screenshots, etc.)"
            placeholder="Describe where evidence is located or stored..."
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="additionalTechnicalInfo"
            label="Additional Technical Information"
            placeholder="Any other technical details that might be relevant..."
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
