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
  memberFormSchema,
  MemberFormValues,
  defaultMemberValues,
  RoleOption,
  OrganizationOption,
} from "@/lib/validators/member";

export interface MemberFormProps {
  defaultValues?: Partial<MemberFormValues>;
  onSubmit: (values: MemberFormValues) => Promise<void> | void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  mode?: "create" | "edit";
  roleOptions: RoleOption[];
  organizationOptions?: OrganizationOption[];
  requireOrganization?: boolean;
  showStatusField?: boolean;
  readOnlyFields?: Array<keyof MemberFormValues>;
  allowMetadata?: boolean;
  showInviteToggle?: boolean;
  className?: string;
}

export function MemberForm({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting,
  mode = "create",
  roleOptions,
  organizationOptions = [],
  requireOrganization = false,
  showStatusField = true,
  readOnlyFields = [],
  allowMetadata = true,
  showInviteToggle = true,
  className,
}: MemberFormProps) {
  const mergedDefaults = useMemo(
    () => ({
      ...defaultMemberValues,
      ...defaultValues,
    }),
    [defaultValues]
  );

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(
      requireOrganization
        ? memberFormSchema.extend({
            organizationId: z.string().min(1, "Select an organization"),
          })
        : memberFormSchema
    ),
    defaultValues: mergedDefaults,
  });

  const [showMetadata, setShowMetadata] = useState(
    Boolean(mergedDefaults.metadata)
  );

  const disabled = (field: keyof MemberFormValues) =>
    readOnlyFields.includes(field);

  const requireMfa = form.watch("requireMfa");
  const allowDashboardAccess = form.watch("allowDashboardAccess");
  const sendInvite = form.watch("sendInvite");
  const selectedOrg = form.watch("organizationId");

  const handleFormSubmit = async (values: MemberFormValues) => {
    const cleanedMetadata =
      values.metadata && values.metadata.trim().length > 0
        ? values.metadata
        : undefined;
    await onSubmit({
      ...values,
      metadata: cleanedMetadata,
      organizationId: values.organizationId || undefined,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className={cn("space-y-8", className)}
      >
        <CardSpotlight className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CustomFormField
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="Jane"
              required
              disabled={disabled("firstName")}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="Doe"
              required
              disabled={disabled("lastName")}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="email"
              label="Work Email"
              placeholder="jane.doe@company.com"
              required
              inputType="email"
              disabled={disabled("email") || mode === "edit"}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+1 (555) 010-2030"
              disabled={disabled("phone")}
              fieldType={FormFieldType.PHONE_INPUT}
            />
            <CustomFormField
              control={form.control}
              name="department"
              label="Department"
              placeholder="Compliance"
              disabled={disabled("department")}
              fieldType={FormFieldType.INPUT}
            />
            <CustomFormField
              control={form.control}
              name="jobTitle"
              label="Job Title"
              placeholder="Chief Compliance Officer"
              disabled={disabled("jobTitle")}
              fieldType={FormFieldType.INPUT}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CustomFormField
              control={form.control}
              name="role"
              label="Role"
              placeholder="Select role"
              required
              disabled={disabled("role")}
              fieldType={FormFieldType.SELECT}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CustomFormField>

            {showStatusField && (
              <CustomFormField
                control={form.control}
                name="status"
                label="Member Status"
                placeholder="Select status"
                disabled={disabled("status")}
                fieldType={FormFieldType.SELECT}
              >
                <option value="active">Active</option>
                <option value="updated">Updated</option>
                <option value="invited">Invited</option>
                <option value="suspended">Suspended</option>
              </CustomFormField>
            )}
          </div>

          {organizationOptions.length > 0 && (
            <CustomFormField
              control={form.control}
              name="organizationId"
              label="Organization"
              placeholder="Select organization"
              required={requireOrganization}
              disabled={disabled("organizationId")}
              fieldType={FormFieldType.SELECT}
            >
              <option value="">Unassigned</option>
              {organizationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </CustomFormField>
          )}
        </CardSpotlight>

        <CardSpotlight className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Security & Access
          </h3>

          {showInviteToggle && mode === "create" && (
            <FormField
              control={form.control}
              name="sendInvite"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Send invitation email
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Clerk will send a welcome email with setup instructions.
                      Disable to add without notifying immediately.
                    </p>
                  </div>
                  <Switch
                    checked={sendInvite}
                    onCheckedChange={(value) => field.onChange(value)}
                    disabled={disabled("sendInvite")}
                  />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="requireMfa"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <FormLabel className="text-sm font-medium">
                    Require MFA
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Force this member to enable multi-factor authentication at
                    next sign-in.
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
            name="allowDashboardAccess"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 px-4 py-3">
                <div>
                  <FormLabel className="text-sm font-medium">
                    Allow dashboard access
                  </FormLabel>
                  <p className="text-xs text-muted-foreground">
                    Grant access to the compliance dashboard and related tools
                    for this member.
                  </p>
                </div>
                <Switch
                  checked={allowDashboardAccess}
                  onCheckedChange={(value) => field.onChange(value)}
                  disabled={disabled("allowDashboardAccess")}
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
                  Advanced Metadata
                </h3>
                <p className="text-sm text-muted-foreground">
                  Store additional context that syncs with Clerk&apos;s
                  publicMetadata and Firestore.
                </p>
              </div>
              <AnimatedToggle
                key={showMetadata ? "metadata-on" : "metadata-off"}
                checked={showMetadata}
                onChange={setShowMetadata}
                variant="gradient"
                label="Metadata"
              />
            </div>

            {showMetadata && (
              <FormField
                control={form.control}
                name="metadata"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metadata (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder='e.g. {"teams":["Incident Response"],"permissions":["incidents:approve"]}'
                        className="min-h-[140px] font-mono text-sm"
                        disabled={disabled("metadata")}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Provide valid JSON to extend role-based access or store
                      preferences. Leave empty to skip changes.
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
              ? "Save Member"
              : showInviteToggle
              ? "Invite Member"
              : "Add Member"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

