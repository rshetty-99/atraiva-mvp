"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save } from "lucide-react";
import { IncidentSimulationStepProps } from "./types";
import { TooltipGuide, getTooltipsForStep } from "./onboarding";
import { useOnboarding } from "./onboarding";

const formSchema = z.object({
  isActive: z.enum(["yes", "no", "unknown"], {
    required_error: "Please select if the incident is active or ongoing",
  }),
  businessOperationsImpact: z.string().min(1, "Business operations impact is required"),
  containmentSteps: z.string().min(1, "Containment steps are required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step3({ data, onDataUpdate, onNext, onPrevious }: IncidentSimulationStepProps) {
  const { state: onboardingState } = useOnboarding();
  const tooltips = getTooltipsForStep(3);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: data.step3?.isActive || undefined,
      businessOperationsImpact: data.step3?.businessOperationsImpact || "",
      containmentSteps: data.step3?.containmentSteps || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    onDataUpdate("step3", values);
    onNext();
  };

  const handleSave = () => {
    const values = form.getValues();
    onDataUpdate("step3", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TooltipGuide
          config={tooltips.find((t) => t.field === "isActive") || tooltips[0]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>Is the incident considered active or ongoing?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-y-3"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="status_yes" />
                        <label htmlFor="status_yes" className="text-sm font-normal cursor-pointer">
                          Yes
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="status_no" />
                        <label htmlFor="status_no" className="text-sm font-normal cursor-pointer">
                          No
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unknown" id="status_unknown" />
                        <label htmlFor="status_unknown" className="text-sm font-normal cursor-pointer">
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

        <TooltipGuide
          config={tooltips.find((t) => t.field === "businessOperationsImpact") || tooltips[1]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="businessOperationsImpact"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>What critical business operations are currently impacted?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'All manufacturing is down,' 'Our website is offline,' 'None that we know of.'"
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
          config={tooltips.find((t) => t.field === "containmentSteps") || tooltips[2]}
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="containmentSteps"
            render={({ field }) => (
              <FormItem>
                <div className="border rounded-lg p-4 space-y-3">
                  <FormLabel>What containment steps have been taken so far, if any?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'We shut down the server,' 'We've told employees not to open the email,' 'Nothing yet, we called you first.'"
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

        <div className="flex justify-between pt-4">
          <div>
            {onPrevious && (
              <Button type="button" variant="outline" onClick={onPrevious}>
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
              Continue
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

