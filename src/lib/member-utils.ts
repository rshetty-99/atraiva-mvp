import { serverTimestamp, Timestamp } from "firebase/firestore";
import { MemberFormValues } from "@/lib/validators/member";

export interface ClerkMemberLite {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  emailAddresses: Array<{ emailAddress: string }>;
  imageUrl?: string | null;
  createdAt?: number | string | Date | null;
  lastSignInAt?: number | string | Date | null;
  publicMetadata?: Record<string, unknown> | null;
  privateMetadata?: Record<string, unknown> | null;
}

export type FirestoreMemberRecord = Record<string, unknown>;

export interface NormalizedMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  organizationId?: string | null;
  organizationRole?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  notifyAccess: boolean;
  requireMfa: boolean;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const toDate = (value: unknown, fallback: Date) => {
  if (!value) return fallback;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  const parsed = new Date(value as string);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
};

export const parseMemberMetadata = (metadata?: string | null) => {
  if (!metadata) return null;
  const trimmed = metadata.trim();
  if (!trimmed) return null;
  const parsed = JSON.parse(trimmed);
  if (parsed && typeof parsed === "object") {
    return parsed as Record<string, unknown>;
  }
  throw new Error("Metadata must be valid JSON");
};

export const buildMemberClerkMetadata = (
  values: MemberFormValues,
  parsedMetadata: Record<string, unknown> | null
) => {
  const base = {
    department: values.department || "",
    jobTitle: values.jobTitle || "",
    phone: values.phone || "",
    allowDashboardAccess: values.allowDashboardAccess,
    role: values.role,
    status: values.status,
    requireMfa: values.requireMfa,
  } satisfies Record<string, unknown>;

  if (parsedMetadata && Object.keys(parsedMetadata).length > 0) {
    return { ...base, customMetadata: parsedMetadata };
  }

  return base;
};

export const buildMemberFirestorePayload = (
  values: MemberFormValues,
  parsedMetadata: Record<string, unknown> | null
) => ({
  firstName: values.firstName,
  lastName: values.lastName,
  email: values.email,
  phoneNumber: values.phone || "",
  jobTitle: values.jobTitle || "",
  department: values.department || "",
  role: values.role,
  status: values.status,
  isActive: values.status === "active",
  timezone: "America/New_York",
  locale: "en-US",
  profile: {
    firstName: values.firstName,
    lastName: values.lastName,
    jobTitle: values.jobTitle || "",
    department: values.department || "",
    phone: values.phone || "",
  },
  contact: {
    email: values.email,
  },
  role: values.role,
  status: values.status,
  organizations: values.organizationId
    ? [
        {
          id: values.organizationId,
          role: values.role,
        },
      ]
    : [],
  preferences: {
    allowDashboardAccess: values.allowDashboardAccess,
  },
  security: {
    requireMfa: values.requireMfa,
  },
  metadata: parsedMetadata || {},
  updatedAt: serverTimestamp(),
});

export const normalizeFirestoreMember = (
  id: string,
  data: FirestoreMemberRecord
): NormalizedMember => {
  const profile = (data.profile as Record<string, unknown>) || {};
  const contact = (data.contact as Record<string, unknown>) || {};
  const organizations = Array.isArray(data.organizations)
    ? (data.organizations as Array<Record<string, unknown>>)
    : [];
  const firstOrg = organizations[0] || {};

  return {
    id,
    firstName: (profile.firstName as string) || "",
    lastName: (profile.lastName as string) || "",
    email: (contact.email as string) || "",
    role: (data.role as string) || "org_viewer",
    status: (data.status as string) || "active",
    organizationId:
      (firstOrg && (firstOrg.id as string | null | undefined)) || null,
    organizationRole:
      (firstOrg && (firstOrg.role as string | null | undefined)) || undefined,
    phone: (profile.phone as string) || "",
    department: (profile.department as string) || "",
    jobTitle: (profile.jobTitle as string) || "",
    notifyAccess:
      typeof (data.preferences as Record<string, unknown>)?.allowDashboardAccess ===
      "boolean"
        ? ((data.preferences as Record<string, unknown>)
            .allowDashboardAccess as boolean)
        : true,
    requireMfa:
      typeof (data.security as Record<string, unknown>)?.requireMfa === "boolean"
        ? ((data.security as Record<string, unknown>).requireMfa as boolean)
        : false,
    metadata: (data.metadata as Record<string, unknown>) || {},
    createdAt: toDate(data.createdAt, new Date()),
    updatedAt: toDate(data.updatedAt, new Date()),
  };
};

export const mapMemberResponse = (
  member: NormalizedMember,
  clerkUser?: ClerkMemberLite,
  organizationName?: string
) => {
  const publicMetadata =
    (clerkUser?.publicMetadata as Record<string, unknown>) || {};
  const customMetadata =
    (publicMetadata.customMetadata as Record<string, unknown>) || {};

  return {
    id: member.id,
    firstName: member.firstName || clerkUser?.firstName || "",
    lastName: member.lastName || clerkUser?.lastName || "",
    email:
      member.email ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      "Unknown",
    role: member.role,
    status: member.status,
    organizationId: member.organizationId,
    organizationName: organizationName,
    phone: member.phone || (publicMetadata.phone as string) || "",
    department:
      member.department || (publicMetadata.department as string) || "",
    jobTitle: member.jobTitle || (publicMetadata.jobTitle as string) || "",
    requireMfa: member.requireMfa,
    allowDashboardAccess: member.notifyAccess,
    metadata:
      Object.keys(member.metadata).length > 0
        ? member.metadata
        : customMetadata,
    createdAt:
      member.createdAt ||
      (clerkUser?.createdAt ? new Date(clerkUser.createdAt) : new Date()),
    lastSignInAt: clerkUser?.lastSignInAt
      ? new Date(clerkUser.lastSignInAt)
      : null,
    imageUrl: clerkUser?.imageUrl || undefined,
    isActive: member.status === "active",
  };
};


