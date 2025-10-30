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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Save } from "lucide-react";
import CustomFormField, { FormFieldType } from "@/components/CustomFormFields";

interface StepProps {
  onNext: () => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}

const formSchema = z.object({
  activeStatus: z.string().min(1, "Please select the active status"),
  containmentStatus: z.string().min(1, "Please select containment status"),
  immediateConcerns: z.array(z.string()).min(1, "Select at least one concern"),
  additionalNotes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step3({ onNext, onPrevious }: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activeStatus: "",
      containmentStatus: "",
      immediateConcerns: [],
      additionalNotes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Step 3 data:", data);
    localStorage.setItem("incident_step3", JSON.stringify(data));
    onNext();
  };

  const handleSave = () => {
    const data = form.getValues();
    localStorage.setItem("incident_step3", JSON.stringify(data));
  };

  const concernOptions = [
    { id: "data_loss", label: "Data Loss / Deletion" },
    { id: "ransomware_encryption", label: "Ransomware / Encrypted Files" },
    { id: "system_outage", label: "System Outage / Downtime" },
    { id: "email_compromise", label: "Email Compromise" },
    { id: "financial_impact", label: "Financial / Payment Impact" },
    { id: "customer_impact", label: "Customer / Client Impact" },
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
          {/* Active Status */}
          <FormField
            control={form.control}
            name="activeStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold">
                  Is the incident considered active or ongoing?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="yes" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        Yes
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        No
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="unknown" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        Unknown
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Containment Status */}
          <FormField
            control={form.control}
            name="containmentStatus"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base font-semibold">
                  Has any containment been performed?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="yes_isolated" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        Yes - Systems isolated / disabled
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="partial" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        Partial containment
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="no" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer flex-1">
                        No
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Immediate Concerns */}
          <FormField
            control={form.control}
            name="immediateConcerns"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">
                    Immediate Impact Concerns (Select all that apply)
                  </FormLabel>
                </div>
                {concernOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="immediateConcerns"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3 hover:bg-accent"
                        >
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
                          <FormLabel className="font-normal cursor-pointer">
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

          {/* Additional Notes */}
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="additionalNotes"
            label="Additional Notes or Observations"
            placeholder="Provide any additional details about the immediate impact..."
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
