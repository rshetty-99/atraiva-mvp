import { z } from "zod";

export const organizationStatusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending Activation" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
  { value: "past_due", label: "Past Due" },
  { value: "canceled", label: "Canceled" },
] as const;

export const organizationPlanOptions = [
  { value: "starter", label: "Starter" },
  { value: "professional", label: "Professional" },
  { value: "enterprise", label: "Enterprise" },
  { value: "custom", label: "Custom" },
] as const;

const metadataSchema = z
  .string()
  .optional()
  .refine(
    (value) => {
      if (!value) return true;
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === "object" && parsed !== null;
      } catch {
        return false;
      }
    },
    {
      message: "Metadata must be valid JSON",
    }
  );

export const organizationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  plan: z.enum(organizationPlanOptions.map((o) => o.value) as [string, ...string[]]),
  status: z.enum(organizationStatusOptions.map((o) => o.value) as [string, ...string[]]),
  timezone: z.string().min(1, "Timezone is required"),
  industry: z.string().optional(),
  primaryEmail: z
    .string()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  description: z.string().optional(),
  address: z.string().optional(),
  metadata: metadataSchema,
  notifyOnIncidents: z.boolean().default(true),
  requireMfa: z.boolean().default(false),
  shareReports: z.boolean().default(true),
});

export type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

export const defaultOrganizationValues: OrganizationFormValues = {
  name: "",
  slug: "",
  plan: "starter",
  status: "active",
  timezone: "America/New_York",
  industry: "",
  primaryEmail: "",
  phone: "",
  description: "",
  address: "",
  metadata: "",
  notifyOnIncidents: true,
  requireMfa: false,
  shareReports: true,
};


