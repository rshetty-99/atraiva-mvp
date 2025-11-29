"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/nextjs";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { IncidentSimulationStepProps } from "./types";
import { TooltipGuide, getTooltipsForStep } from "./onboarding";
import { useOnboarding } from "./onboarding";

const formSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  loggerName: z.string().min(1, "Logging person's name and title is required"),
  loggerContact: z.string().min(1, "Contact information is required"),
  incidentDiscoveryDate: z.date({
    required_error: "Incident discovery date and time is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Step1({
  data,
  onDataUpdate,
  onNext,
  onPrevious,
  isFirstStep,
}: IncidentSimulationStepProps) {
  const { user: clerkUser } = useUser();
  const { session } = useSession();
  const { state: onboardingState } = useOnboarding();
  const tooltips = getTooltipsForStep(1);

  // Get values from session or Clerk
  const organizationName = session?.currentOrganization?.name || "";
  const userName = session?.user
    ? session.user.displayName ||
      `${session.user.firstName} ${session.user.lastName}`.trim()
    : clerkUser?.fullName ||
      `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() ||
      "";
  const userJobTitle = session?.user?.jobTitle || "";
  const userEmail =
    session?.user?.email || clerkUser?.emailAddresses[0]?.emailAddress || "";
  const userPhone = session?.user?.phone || "";

  // Format logger name with title
  const loggerNameWithTitle = userJobTitle
    ? `${userName}, ${userJobTitle}`
    : userName;

  // Format contact info
  const contactInfo = [userEmail, userPhone].filter(Boolean).join(", ");

  // Get current date/time - memoized to avoid unnecessary re-renders
  const currentDateTime = useMemo(() => new Date(), []);
  const currentDateTimeString = useMemo(
    () => currentDateTime.toISOString().slice(0, 16),
    [currentDateTime]
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: data.step1?.clientName || organizationName,
      loggerName: data.step1?.loggerName || loggerNameWithTitle,
      loggerContact: data.step1?.loggerContact || contactInfo,
      incidentDiscoveryDate:
        data.step1?.incidentDiscoveryDate || currentDateTime,
    },
  });

  // Update form when session data becomes available or when data prop changes
  useEffect(() => {
    // Use data.step1 values if provided (e.g., from admin organization selection), otherwise use session
    const clientNameToUse = data.step1?.clientName || organizationName;
    const loggerNameToUse = data.step1?.loggerName || loggerNameWithTitle;
    const contactToUse = data.step1?.loggerContact || contactInfo;
    const dateToUse = data.step1?.incidentDiscoveryDate || currentDateTime;

    if (clientNameToUse) {
      form.setValue("clientName", clientNameToUse);
    }
    if (loggerNameToUse) {
      form.setValue("loggerName", loggerNameToUse);
    }
    if (contactToUse) {
      form.setValue("loggerContact", contactToUse);
    }
    if (dateToUse) {
      form.setValue("incidentDiscoveryDate", dateToUse);
    }
  }, [
    organizationName,
    loggerNameWithTitle,
    contactInfo,
    currentDateTime,
    data.step1,
    form,
  ]);

  const onSubmit = (values: FormValues) => {
    onDataUpdate("step1", values);
    onNext();
  };

  const handleSave = () => {
    const values = form.getValues();
    onDataUpdate("step1", values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <TooltipGuide
          config={tooltips.find((t) => t.field === "clientName") || tooltips[0]}
          fieldName="clientName"
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter client name"
                    {...field}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <FormDescription>
                  Automatically populated from your organization
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TooltipGuide>

        <TooltipGuide
          config={tooltips.find((t) => t.field === "loggerName") || tooltips[1]}
          fieldName="loggerName"
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="loggerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logging Person&apos;s Name & Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., John Doe, Security Manager"
                    {...field}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <FormDescription>
                  Automatically populated from your profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TooltipGuide>

        <TooltipGuide
          config={tooltips.find((t) => t.field === "loggerContact") || tooltips[2]}
          fieldName="loggerContact"
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="loggerContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Logging Person&apos;s Contact Info (Email & Phone)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., john.doe@company.com, +1-555-123-4567"
                    {...field}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </FormControl>
                <FormDescription>
                  Automatically populated from your profile
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TooltipGuide>

        <TooltipGuide
          config={tooltips.find((t) => t.field === "incidentDiscoveryDate") || tooltips[3]}
          fieldName="incidentDiscoveryDate"
          show={onboardingState.showTooltips}
        >
          <FormField
            control={form.control}
            name="incidentDiscoveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Incident Discovery Date & Exact Time (including Timezone)
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : currentDateTimeString
                    }
                    onChange={(e) => {
                      const date = e.target.value
                        ? new Date(e.target.value)
                        : null;
                      field.onChange(date);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Pre-filled with current date and time. You can adjust if needed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </TooltipGuide>

        <div className="flex justify-between pt-4">
          <div>
            {!isFirstStep && onPrevious && (
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
            <Button type="submit">Continue</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
