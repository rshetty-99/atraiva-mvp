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
  dataSources: z.array(z.string()).min(1, "Select at least one data source"),
  estimatedRecords: z.string().min(1, "Please provide an estimate"),
  dataTypes: z.array(z.string()).min(1, "Select at least one data type"),
  riskLevel: z.string().min(1, "Please select a risk level"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step4({ onNext, onPrevious }: StepProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataSources: [],
      estimatedRecords: "",
      dataTypes: [],
      riskLevel: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Step 4 data:", data);
    localStorage.setItem("incident_step4", JSON.stringify(data));
    onNext();
  };

  const handleSave = () => {
    const data = form.getValues();
    localStorage.setItem("incident_step4", JSON.stringify(data));
  };

  const dataSourceOptions = [
    { id: "email", label: "Email/Exchange data" },
    { id: "file_servers", label: "File Servers / Network Shares" },
    { id: "databases", label: "Databases (SQL, NoSQL, etc.)" },
    {
      id: "cloud_storage",
      label: "Cloud Storage (O365, Google Drive, Dropbox)",
    },
    { id: "endpoints", label: "Endpoints / Laptops / Desktops" },
    { id: "backup", label: "Backup Systems" },
    { id: "unknown", label: "Unknown / Still Investigating" },
  ];

  const dataTypeOptions = [
    { id: "pii", label: "PII (Personally Identifiable Information)" },
    { id: "phi", label: "PHI (Protected Health Information)" },
    { id: "financial", label: "Financial / Payment Data" },
    { id: "credentials", label: "Credentials / Passwords" },
    { id: "ip", label: "Intellectual Property / Trade Secrets" },
    { id: "general", label: "General Business Data" },
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
          {/* Data Sources */}
          <FormField
            control={form.control}
            name="dataSources"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">
                    Data Sources of Concern (Select all that apply)
                  </FormLabel>
                </div>
                {dataSourceOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="dataSources"
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

          {/* Estimated Records */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="estimatedRecords"
            label="Estimated Number of Records Affected"
            placeholder="Select a range"
            required
          >
            <option value="less_100">Less than 100</option>
            <option value="100_1000">100 - 1,000</option>
            <option value="1000_10000">1,000 - 10,000</option>
            <option value="10000_100000">10,000 - 100,000</option>
            <option value="more_100000">More than 100,000</option>
            <option value="unknown">Unknown at this time</option>
          </CustomFormField>

          {/* Data Types */}
          <FormField
            control={form.control}
            name="dataTypes"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base font-semibold">
                    Types of Data Potentially Affected (Select all that apply)
                  </FormLabel>
                </div>
                {dataTypeOptions.map((item) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name="dataTypes"
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

          {/* Risk Level */}
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="riskLevel"
            label="Initial Risk Assessment"
            placeholder="Select risk level"
            required
          >
            <option value="critical">
              Critical - Immediate action required
            </option>
            <option value="high">High - Significant risk</option>
            <option value="medium">Medium - Moderate risk</option>
            <option value="low">Low - Minimal risk</option>
          </CustomFormField>

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
