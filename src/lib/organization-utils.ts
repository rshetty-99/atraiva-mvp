import { serverTimestamp, Timestamp } from "firebase/firestore";
import { OrganizationFormValues } from "@/lib/validators/organization";

export interface ClerkOrganizationLite {
  id: string;
  name: string;
  slug?: string | null;
  imageUrl?: string | null;
  membersCount?: number | null;
  publicMetadata?: Record<string, unknown> | null;
}

export type FirestoreOrganizationRecord = Record<string, unknown>;

interface NormalizedOrganization {
  id: string;
  name: string;
  slug: string;
  plan: string;
  status: string;
  timezone: string;
  industry: string;
  primaryEmail: string;
  phone: string;
  description: string;
  address: string;
  notifyOnIncidents: boolean;
  requireMfa: boolean;
  shareReports: boolean;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const getDate = (value: unknown, fallback: Date) => {
  if (!value) return fallback;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

export const parseOrganizationMetadata = (metadata?: string | null) => {
  if (!metadata) return null;
  const trimmed = metadata.trim();
  if (!trimmed) return null;
  const parsed = JSON.parse(trimmed);
  if (parsed && typeof parsed === "object") {
    return parsed as Record<string, unknown>;
  }
  throw new Error("Metadata must be valid JSON");
};

export const buildClerkOrganizationMetadata = (
  values: OrganizationFormValues,
  parsedMetadata: Record<string, unknown> | null
) => {
  const base = {
    plan: values.plan,
    status: values.status,
    timezone: values.timezone,
    industry: values.industry || "",
    contact: {
      email: values.primaryEmail,
      phone: values.phone || "",
    },
    profile: {
      description: values.description || "",
      address: values.address || "",
    },
    preferences: {
      notifyOnIncidents: values.notifyOnIncidents,
      requireMfa: values.requireMfa,
      shareReports: values.shareReports,
    },
  } satisfies Record<string, unknown>;

  if (parsedMetadata && Object.keys(parsedMetadata).length > 0) {
    return { ...base, customMetadata: parsedMetadata };
  }

  return base;
};

export const buildFirestoreOrganizationPayload = (
  values: OrganizationFormValues,
  parsedMetadata: Record<string, unknown> | null
) => ({
  name: values.name,
  slug: values.slug,
  plan: values.plan,
  status: values.status,
  industry: values.industry || "",
  primaryEmail: values.primaryEmail,
  phone: values.phone || "",
  description: values.description || "",
  address: values.address || "",
  settings: {
    timezone: values.timezone,
    notifications: {
      incidentAlerts: values.notifyOnIncidents,
    },
    security: {
      requireMfa: values.requireMfa,
    },
    sharing: {
      shareReports: values.shareReports,
    },
  },
  metadata: parsedMetadata || {},
  subscriptionPlan: values.plan,
  subscriptionStatus: values.status,
  updatedAt: serverTimestamp(),
});

export const normalizeFirestoreOrganization = (
  id: string,
  data: FirestoreOrganizationRecord
): NormalizedOrganization => {
  const settings = (data.settings as Record<string, any>) || {};
  const notifications = (settings.notifications as Record<string, any>) || {};
  const security = (settings.security as Record<string, any>) || {};
  const sharing = (settings.sharing as Record<string, any>) || {};

  return {
    id,
    name: (data.name as string) || "",
    slug: (data.slug as string) || "",
    plan: (data.plan as string) || (data.subscriptionPlan as string) || "starter",
    status: (data.status as string) || (data.subscriptionStatus as string) || "active",
    timezone: (settings.timezone as string) || (data.timezone as string) || "UTC",
    industry: (data.industry as string) || "",
    primaryEmail: (data.primaryEmail as string) || "",
    phone: (data.phone as string) || "",
    description: (data.description as string) || "",
    address: (data.address as string) || "",
    notifyOnIncidents:
      typeof notifications.incidentAlerts === "boolean"
        ? notifications.incidentAlerts
        : true,
    requireMfa:
      typeof security.requireMfa === "boolean" ? security.requireMfa : false,
    shareReports:
      typeof sharing.shareReports === "boolean" ? sharing.shareReports : true,
    metadata: (data.metadata as Record<string, unknown>) || {},
    createdAt: getDate(data.createdAt, new Date()),
    updatedAt: getDate(data.updatedAt, new Date()),
  };
};

export const mapOrganizationResponse = (
  org: NormalizedOrganization,
  clerkOrg?: ClerkOrganizationLite
) => {
  const clerkMetadata = clerkOrg?.publicMetadata || {};
  const preferences = (clerkMetadata.preferences as Record<string, unknown>) || {};
  const customMetadata = (clerkMetadata.customMetadata as Record<string, unknown>) || {};

  const sanitizeSlug = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "");

  const slugSource =
    org.slug ||
    clerkOrg?.slug ||
    org.name ||
    (typeof clerkMetadata.slug === "string" ? clerkMetadata.slug : "") ||
    org.id ||
    "organization";

  const sanitizedSlug = sanitizeSlug(slugSource);

  return {
    id: org.id,
    name: org.name || clerkOrg?.name || "",
    slug:
      sanitizedSlug.length >= 2 && /^[a-z0-9-]+$/.test(sanitizedSlug)
        ? sanitizedSlug
        : sanitizeSlug(`${slugSource}-${org.id}`).slice(0, 64) || org.id,
    plan: org.plan || (clerkMetadata.plan as string) || "starter",
    status: org.status || (clerkMetadata.status as string) || "active",
    timezone: org.timezone || (clerkMetadata.timezone as string) || "UTC",
    industry: org.industry || (clerkMetadata.industry as string) || "",
    primaryEmail:
      org.primaryEmail ||
      (clerkMetadata.contact as Record<string, unknown>)?.email ||
      "",
    phone:
      org.phone ||
      (clerkMetadata.contact as Record<string, unknown>)?.phone ||
      "",
    description:
      org.description ||
      (clerkMetadata.profile as Record<string, unknown>)?.description ||
      "",
    address:
      org.address ||
      (clerkMetadata.profile as Record<string, unknown>)?.address ||
      "",
    notifyOnIncidents:
      org.notifyOnIncidents ??
      (preferences.notifyOnIncidents as boolean) ??
      true,
    requireMfa:
      org.requireMfa ?? (preferences.requireMfa as boolean) ?? false,
    shareReports:
      org.shareReports ?? (preferences.shareReports as boolean) ?? true,
    metadata:
      Object.keys(org.metadata).length > 0 ? org.metadata : customMetadata,
    createdAt: org.createdAt,
    updatedAt: org.updatedAt,
    imageUrl: clerkOrg?.imageUrl || "",
    membersCount: clerkOrg?.membersCount || 0,
  };
};
