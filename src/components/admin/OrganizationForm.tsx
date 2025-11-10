"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField, {
  FormFieldType,
} from "@/components/CustomFormFields";
import { Button } from "@/components/ui/button";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Switch } from "@/components/ui/switch";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedToggle } from "@/components/ui/animated-toggle";
import { cn } from "@/lib/utils";
import {
  organizationStatusOptions,
  organizationPlanOptions,
  organizationFormSchema,
  OrganizationFormValues,
  defaultOrganizationValues,
} from "@/lib/validators/organization";

export interface OrganizationFormProps {
  defaultValues?: Partial<OrganizationFormValues>;
  onSubmit: (values: OrganizationFormValues) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  allowMetadata?: boolean;
  showPlanField?: boolean;
  showStatusField?: boolean;
  readOnlyFields?: Array<keyof OrganizationFormValues>;
  className?: string;
}

export function OrganizationForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  mode = "create",
  allowMetadata = true,
  showPlanField = true,
  showStatusField = true,
  readOnlyFields = [],
  className,
}: OrganizationFormProps) {
  const mergedDefaults = useMemo(
    () => ({
      ...defaultOrganizationValues,
      ...defaultValues,
    }),
    [defaultValues]
  );

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: mergedDefaults,
  });

  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(mergedDefaults.metadata)
  );

  const handleFormSubmit = (values: OrganizationFormValues) => {
    const cleanedMetadata =
      values.metadata && values.metadata.trim().length > 0
        ? values.metadata
        : undefined;
    onSubmit({
      ...values,
      metadata: cleanedMetadata,
    });
  };

  const disabled = (field: keyof OrganizationFormValues) =>
    readOnlyFields.includes(field);

  const notifyOnIncidents = form.watch("notifyOnIncidents");
  const requireMfa = form.watch("requireMfa");
  const shareReports = form.watch("shareReports");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className={cn("space-y-8", className)}
      >
        <CardSpotlight className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CustomFormField
              control={form.control}
              name="name"
              label="Organization Name"
              placeholder="Atraiva Labs"
              required
              disabled={disabled("name")}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="slug"
              label="Display Slug"
              placeholder="atraiva-labs"
              required
              disabled={disabled("slug")}
              fieldType={FormFieldType.INPUT}
            />
            {showPlanField && (
              <CustomFormField
                control={form.control}
                name="plan"
                label="Subscription Plan"
                placeholder="Select plan"
                disabled={disabled("plan")}
                fieldType={FormFieldType.SELECT}
              >
                {organizationPlanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CustomFormField>
            )}
            {showStatusField && (
              <CustomFormField
                control={form.control}
                name="status"
                label="Status"
                placeholder="Select status"
                disabled={disabled("status")}
                fieldType={FormFieldType.SELECT}
              >
                {organizationStatusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </CustomFormField>
            )}
            <CustomFormField
              control={form.control}
              name="timezone"
              label="Primary Timezone"
              placeholder="America/New_York"
              disabled={disabled("timezone")}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="industry"
              label="Industry"
              placeholder="e.g. Healthcare"
              disabled={disabled("industry")}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="primaryEmail"
              label="Primary Contact Email"
              placeholder="admin@company.com"
              disabled={disabled("primaryEmail")}
              inputType="email"
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="phone"
              label="Contact Phone"
              placeholder="+1 (555) 555-0100"
              disabled={disabled("phone")}
              fieldType={FormFieldType.PHONE_INPUT}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <CustomFormField
              control={form.control}
              name="address"
              label="Mailing Address"
              placeholder="123 Compliance Ave, Suite 400"
              disabled={disabled("address")}
              fieldType={FormFieldType.TEXTAREA}
            />
            <CustomFormField
              control={form.control}
              name="description"
              label="Organization Description"
              placeholder="Describe the organization, compliance focus, or operational notes."
              disabled={disabled("description")}
              fieldType={FormFieldType.TEXTAREA}
            />
          </div>
        </CardSpotlight>

        <CardSpotlight className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Security & Notifications
          </h3>
          <FormField
            control={form.control}
            name="notifyOnIncidents"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <FormLabel className="text-sm font-medium">
                    Incident Alerts
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Automatically notify organization admins about new incidents
                    or breaches.
                  </p>
                </div>
                <Switch
                  checked={notifyOnIncidents}
                  onCheckedChange={(value) => field.onChange(value)}
                  disabled={disabled("notifyOnIncidents")}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requireMfa"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <FormLabel className="text-sm font-medium">
                    Require MFA for Members
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Enforce multi-factor authentication for all members in this
                    organization.
                  </p>
                </div>
                <Switch
                  checked={requireMfa}
                  onCheckedChange={(value) => field.onChange(value)}
                  disabled={disabled("requireMfa")}
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shareReports"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <FormLabel className="text-sm font-medium">
                    Share Compliance Reports
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Allow organization members to download and share compliance
                    reports.
                  </p>
                </div>
                <Switch
                  checked={shareReports}
                  onCheckedChange={(value) => field.onChange(value)}
                  disabled={disabled("shareReports")}
                />
              </FormItem>
            )}
          />
        </CardSpotlight>

        {allowMetadata && (
          <CardSpotlight className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Advanced Settings
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage metadata used for role-based access, feature flags, and
                  integrations.
                </p>
              </div>
              <AnimatedToggle
                key={showAdvanced ? "advanced-on" : "advanced-off"}
                checked={showAdvanced}
                onChange={setShowAdvanced}
                variant="gradient"
                label="Metadata"
              />
            </div>

            {showAdvanced && (
              <FormField
                control={form.control}
                name="metadata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clerk / Firestore Metadata (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='e.g. {"complianceLevel":"hipaa","region":"US-East"}'
                        className="min-h-[160px] font-mono text-sm"
                        disabled={disabled("metadata")}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Changes here will sync to Clerk&apos;s publicMetadata and
                      Firestore. Provide valid JSON. Leave empty to skip.
                    </p>
                  </FormItem>
                )}
              />
            )}
          </CardSpotlight>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Create Organization"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

