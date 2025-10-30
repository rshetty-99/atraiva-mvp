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
  clientName: z.string().min(1, "Client name is required"),
  reporterName: z.string().min(1, "Reporter name and title is required"),
  reporterContact: z.string().min(1, "Contact information is required"),
  incidentTime: z.date({
    required_error: "Incident discovery date and time is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step1({ onNext, onPrevious, isFirstStep }: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      reporterName: "",
      reporterContact: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Step 1 data:", data);
    // Save to localStorage or state management
    localStorage.setItem("incident_step1", JSON.stringify(data));
    onNext();
  };

  const handleSave = () => {
    const data = form.getValues();
    localStorage.setItem("incident_step1", JSON.stringify(data));
    console.log("Data saved:", data);
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
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="clientName"
            label="Client Name"
            placeholder="Enter client name"
            required
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="reporterName"
            label="Reporting Person's Name & Title"
            placeholder="Enter name and title"
            required
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="reporterContact"
            label="Reporting Person's Contact Info (Email & Phone)"
            placeholder="Enter email and phone"
            required
          />

          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="incidentTime"
            label="Incident Discovery Date & Exact Time (including Timezone)"
            showTimeSelect
            dateFormat="MM/dd/yyyy h:mm aa"
            required
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
              {!isFirstStep && onPrevious && (
                <Button type="button" onClick={onPrevious} variant="outline">
                  Previous
                </Button>
              )}
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
