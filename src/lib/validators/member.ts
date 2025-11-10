import { z } from "zod";

export interface RoleOption {
  value: string;
  label: string;
  description?: string;
}

export interface OrganizationOption {
  value: string;
  label: string;
}

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
    { message: "Metadata must be valid JSON" }
  );

export const memberFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  role: z.string().min(1, "Select a role"),
  organizationId: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  phone: z.string().optional(),
  status: z
    .enum(["active", "suspended", "invited", "updated"])
    .default("active"),
  metadata: metadataSchema,
  sendInvite: z.boolean().default(true),
  requireMfa: z.boolean().default(false),
  allowDashboardAccess: z.boolean().default(true),
});

export type MemberFormValues = z.infer<typeof memberFormSchema>;

export const defaultMemberValues: MemberFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  organizationId: "",
  department: "",
  jobTitle: "",
  phone: "",
  status: "active",
  metadata: "",
  sendInvite: true,
  requireMfa: false,
  allowDashboardAccess: true,
};


