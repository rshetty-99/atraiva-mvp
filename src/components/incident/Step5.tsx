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
import { Checkbox } from "@/components/ui/checkbox";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";
import { ArrowRight, Save } from "lucide-react";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

const formSchema = z.object({
  notificationObligations: z.array(z.string()),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step5({ onNext, onPrevious }: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationObligations: [],
      additionalInfo: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Step 5 data:", data);
    localStorage.setItem("incident_step5", JSON.stringify(data));
    onNext();
  };

  const handleSave = () => {
    const data = form.getValues();
    localStorage.setItem("incident_step5", JSON.stringify(data));
  };

  const notificationOptions = [
    {
      id: "healthcare_hipaa",
      label: "Healthcare / HIPAA - 60 days to HHS, affected individuals",
    },
    {
      id: "california_ccpa",
      label: "California (CCPA/CPRA) - Without unreasonable delay",
    },
    {
      id: "new_york_shield",
      label: "New York SHIELD Act - Without unreasonable delay",
    },
    {
      id: "financial_glba",
      label: "Financial Institutions (GLBA) - Notify customers ASAP",
    },
    {
      id: "federal_contractor",
      label: "Federal Contractor (DFARS) - 72 hours to DoD",
    },
    {
      id: "state_general",
      label: "General State Notification Laws - Typically 30-90 days",
    },
    { id: "none", label: "None that I'm aware of" },
    { id: "unsure", label: "Unsure / Need legal review" },
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
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Note:</strong> This is a quick reference only. Always
              consult with your legal team for specific notification
              requirements.
            </p>
          </div>

          {/* Notification Obligations */}
          <FormField
            control={form.control}
            name="notificationObligations"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">
                    Are there immediate notification obligations? (Select all
                    that apply)
                  </FormLabel>
                </div>
                {notificationOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="notificationObligations"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer text-sm">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Info */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="additionalInfo"
            label="Additional Compliance or Regulatory Information"
            placeholder="Provide any additional details about applicable regulations or compliance requirements..."
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
