// Firestore Collections and CRUD Operations for Atraiva

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentData,
  WhereFilterOp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  User,
  Organization,
  DataBreach,
  ComplianceCheck,
  PIIScanResult,
  Document,
  AuditLog,
  RegistrationLink,
  RegistrationEmail,
} from "./types";

// Collection references
export const collections = {
  users: "users",
  organizations: "organizations",
  breaches: "breaches",
  notifications: "notifications",
  complianceChecks: "complianceChecks",
  documents: "documents",
  piiScans: "piiScans",
  auditLogs: "auditLogs",
  regulationTemplates: "regulationTemplates",
  registrationLinks: "registrationLinks",
  registrationEmails: "registrationEmails",
} as const;

// Generic CRUD operations
export class FirestoreService<T> {
  constructor(private collectionName: string) {}

  async create(
    data: Omit<T, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  }

  async getById(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async getAll(): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, this.collectionName));
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  async getWhere(field: string, operator: WhereFilterOp, value: unknown): Promise<T[]> {
    const q = query(
      collection(db, this.collectionName),
      where(field, operator, value)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  }

  async getPaginated(
    pageSize: number = 10,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ data: T[]; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    let q = query(
      collection(db, this.collectionName),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];

    const newLastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    return { data, lastDoc: newLastDoc };
  }
}

// Specialized services
export const userService = new FirestoreService<User>(collections.users);
export const organizationService = new FirestoreService<Organization>(
  collections.organizations
);
export const breachService = new FirestoreService<DataBreach>(
  collections.breaches
);
export const complianceService = new FirestoreService<ComplianceCheck>(
  collections.complianceChecks
);
export const documentService = new FirestoreService<Document>(
  collections.documents
);
export const piiScanService = new FirestoreService<PIIScanResult>(
  collections.piiScans
);
export const auditService = new FirestoreService<AuditLog>(
  collections.auditLogs
);

// Specialized query functions for complex operations
export const breachQueries = {
  async getByOrganization(organizationId: string): Promise<DataBreach[]> {
    return breachService.getWhere("organizationId", "==", organizationId);
  },

  async getByStatus(status: DataBreach["status"]): Promise<DataBreach[]> {
    return breachService.getWhere("status", "==", status);
  },

  async getByDateRange(startDate: Date, endDate: Date): Promise<DataBreach[]> {
    const q = query(
      collection(db, collections.breaches),
      where("discoveryDate", ">=", startDate),
      where("discoveryDate", "<=", endDate),
      orderBy("discoveryDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DataBreach[];
  },

  async getCriticalBreaches(): Promise<DataBreach[]> {
    const q = query(
      collection(db, collections.breaches),
      where("severity", "==", "critical"),
      where("status", "in", ["reported", "investigating"]),
      orderBy("discoveryDate", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as DataBreach[];
  },
};

export const complianceQueries = {
  async getByOrganization(organizationId: string): Promise<ComplianceCheck[]> {
    return complianceService.getWhere("organizationId", "==", organizationId);
  },

  async getOverdueChecks(): Promise<ComplianceCheck[]> {
    const q = query(
      collection(db, collections.complianceChecks),
      where("nextCheckDue", "<=", new Date()),
      where("status", "!=", "completed"),
      orderBy("nextCheckDue", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ComplianceCheck[];
  },

  async getFailedChecks(): Promise<ComplianceCheck[]> {
    const q = query(
      collection(db, collections.complianceChecks),
      where("status", "==", "failed"),
      orderBy("updatedAt", "desc"),
      limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ComplianceCheck[];
  },
};

export const auditQueries = {
  async getByUser(
    userId: string,
    limitCount: number = 50
  ): Promise<AuditLog[]> {
    const q = query(
      collection(db, collections.auditLogs),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AuditLog[];
  },

  async getByOrganization(
    organizationId: string,
    limitCount: number = 100
  ): Promise<AuditLog[]> {
    const q = query(
      collection(db, collections.auditLogs),
      where("organizationId", "==", organizationId),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AuditLog[];
  },

  async getFailedActions(limitCount: number = 50): Promise<AuditLog[]> {
    const q = query(
      collection(db, collections.auditLogs),
      where("success", "==", false),
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AuditLog[];
  },
};

// Registration Links Service
export const registrationLinkService = new FirestoreService<RegistrationLink>(
  collections.registrationLinks
);
export const registrationEmailService = new FirestoreService<RegistrationEmail>(
  collections.registrationEmails
);

// Helper function to convert Firestore Timestamps to Dates for RegistrationLink
function convertRegistrationLinkDates(data: Record<string, unknown>): RegistrationLink {
  return {
    ...data,
    createdAt: data.createdAt?.toDate?.() || data.createdAt,
    expiresAt: data.expiresAt?.toDate?.() || data.expiresAt,
    usedAt: data.usedAt?.toDate?.() || data.usedAt,
    emailSentAt: data.emailSentAt?.toDate?.() || data.emailSentAt,
    lastEmailSentAt: data.lastEmailSentAt?.toDate?.() || data.lastEmailSentAt,
    cancelledAt: data.cancelledAt?.toDate?.() || data.cancelledAt,
  } as RegistrationLink;
}

// Registration Link specialized queries
export const registrationLinkQueries = {
  async getByToken(token: string): Promise<RegistrationLink | null> {
    const q = query(
      collection(db, collections.registrationLinks),
      where("token", "==", token),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return convertRegistrationLinkDates({ id: doc.id, ...doc.data() });
  },

  async getByEmail(email: string): Promise<RegistrationLink[]> {
    const q = query(
      collection(db, collections.registrationLinks),
      where("primaryUserData.email", "==", email),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      convertRegistrationLinkDates({ id: doc.id, ...doc.data() })
    );
  },

  async getByStatus(
    status: RegistrationLink["status"]
  ): Promise<RegistrationLink[]> {
    const q = query(
      collection(db, collections.registrationLinks),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      convertRegistrationLinkDates({ id: doc.id, ...doc.data() })
    );
  },

  async getActiveLinks(): Promise<RegistrationLink[]> {
    const now = new Date();
    const q = query(
      collection(db, collections.registrationLinks),
      where("status", "in", ["pending", "sent"]),
      where("expiresAt", ">", now),
      orderBy("expiresAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      convertRegistrationLinkDates({ id: doc.id, ...doc.data() })
    );
  },

  async getExpiredLinks(): Promise<RegistrationLink[]> {
    const now = new Date();
    const q = query(
      collection(db, collections.registrationLinks),
      where("status", "in", ["pending", "sent"]),
      where("expiresAt", "<=", now),
      orderBy("expiresAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      convertRegistrationLinkDates({ id: doc.id, ...doc.data() })
    );
  },

  async getByCreator(creatorId: string): Promise<RegistrationLink[]> {
    const q = query(
      collection(db, collections.registrationLinks),
      where("createdBy", "==", creatorId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      convertRegistrationLinkDates({ id: doc.id, ...doc.data() })
    );
  },

  async hasActiveLink(email: string): Promise<boolean> {
    const now = new Date();
    const q = query(
      collection(db, collections.registrationLinks),
      where("primaryUserData.email", "==", email),
      where("status", "in", ["pending", "sent"]),
      where("expiresAt", ">", now),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  },
};
