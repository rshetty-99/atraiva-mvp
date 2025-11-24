import { collection, doc, getDoc, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type {
  BreachRecord,
  BreachTrigger,
  BreachTriggerRegulationSnapshot,
  BreachNotification,
  BreachEvidenceItem,
  BreachTimelineEntry,
  BreachStakeholderAck,
  BreachTicketLink,
  BreachControlAssessment,
  BreachImpactSummary,
  BreachTaxonomyItem,
} from "@/types/breach";

const COLLECTIONS = {
  BREACHES: "breaches",
  TRIGGERS: "breach_triggers",
  TAXONOMIES: "breach_trigger_taxonomies",
} as const;

function toIsoString(value: unknown): string {
  if (!value) return new Date().toISOString();

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate: () => Date }).toDate === "function"
  ) {
    try {
      return (value as { toDate: () => Date }).toDate().toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  return new Date().toISOString();
}

function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function toStringArray(value: unknown): string[] {
  return ensureArray<string>(value).filter((item) => typeof item === "string");
}

function toTitleCase(value: string): string {
  return String(value ?? "")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

function mapRegulationSnapshot(
  data: Record<string, unknown>
): BreachTriggerRegulationSnapshot {
  return {
    regulationId: String(data.regulationId ?? data.id ?? ""),
    regulationCode:
      typeof data.regulationCode === "string" ? data.regulationCode : undefined,
    title: typeof data.title === "string" ? data.title : undefined,
    citation: typeof data.citation === "string" ? data.citation : undefined,
    jurisdictionLevel:
      typeof data.jurisdictionLevel === "string"
        ? (data.jurisdictionLevel as BreachTriggerRegulationSnapshot["jurisdictionLevel"])
        : undefined,
    jurisdictionCode:
      typeof data.jurisdictionCode === "string"
        ? data.jurisdictionCode
        : undefined,
    snapshotAt: toIsoString(data.snapshotAt),
    regulationRevision:
      typeof data.regulationRevision === "string"
        ? data.regulationRevision
        : undefined,
    sourceUrl:
      typeof data.sourceUrl === "string" ? data.sourceUrl : undefined,
  };
}

function mapEvidenceItem(data: Record<string, unknown>): BreachEvidenceItem {
  const hashed =
    data.hashed && typeof data.hashed === "object"
      ? {
          algorithm:
            (data.hashed as Record<string, unknown>).algorithm === "SHA-512"
              ? "SHA-512"
              : (data.hashed as Record<string, unknown>).algorithm === "BLAKE3"
              ? "BLAKE3"
              : "SHA-256",
          value: String(
            (data.hashed as Record<string, unknown>).value ?? ""
          ),
          generatedAt: toIsoString(
            (data.hashed as Record<string, unknown>).generatedAt
          ),
        }
      : undefined;

  const retention =
    data.retentionPolicy && typeof data.retentionPolicy === "object"
      ? {
          deleteAt: toIsoString(
            (data.retentionPolicy as Record<string, unknown>).deleteAt
          ),
          legalHold:
            typeof (data.retentionPolicy as Record<string, unknown>)
              .legalHold === "boolean"
              ? ((data.retentionPolicy as Record<string, unknown>)
                  .legalHold as boolean)
              : undefined,
          legalHoldReason:
            typeof (data.retentionPolicy as Record<string, unknown>)
              .legalHoldReason === "string"
              ? ((data.retentionPolicy as Record<string, unknown>)
                  .legalHoldReason as string)
              : undefined,
          overrideApprovedBy:
            typeof (data.retentionPolicy as Record<string, unknown>)
              .overrideApprovedBy === "string"
              ? ((data.retentionPolicy as Record<string, unknown>)
                  .overrideApprovedBy as string)
              : undefined,
          overrideApprovedAt: toIsoString(
            (data.retentionPolicy as Record<string, unknown>)
              .overrideApprovedAt
          ),
        }
      : undefined;

  return {
    id: String(data.id ?? ""),
    title: String(data.title ?? ""),
    type: (data.type as BreachEvidenceItem["type"]) ?? "other",
    storagePath: String(data.storagePath ?? ""),
    hashed,
    uploadedAt: toIsoString(data.uploadedAt),
    uploadedBy:
      typeof data.uploadedBy === "string"
        ? (data.uploadedBy as string)
        : undefined,
    description:
      typeof data.description === "string"
        ? (data.description as string)
        : undefined,
    tags: toStringArray(data.tags),
    retentionPolicy: retention,
  };
}

function mapTimelineEntry(data: Record<string, unknown>): BreachTimelineEntry {
  return {
    id: String(data.id ?? ""),
    label: String(data.label ?? ""),
    type:
      (data.type as BreachTimelineEntry["type"]) === undefined
        ? "other"
        : (data.type as BreachTimelineEntry["type"]),
    occurredAt: toIsoString(data.occurredAt),
    description:
      typeof data.description === "string"
        ? (data.description as string)
        : undefined,
    relatedNotificationIds: toStringArray(data.relatedNotificationIds),
    relatedEvidenceIds: toStringArray(data.relatedEvidenceIds),
  };
}

function mapStakeholderAck(data: Record<string, unknown>): BreachStakeholderAck {
  return {
    stakeholderRole: (data.stakeholderRole ??
      "executive") as BreachStakeholderAck["stakeholderRole"],
    contactId:
      typeof data.contactId === "string" ? (data.contactId as string) : undefined,
    acknowledgedAt: toIsoString(data.acknowledgedAt),
    ackStatus:
      typeof data.ackStatus === "string"
        ? (data.ackStatus as BreachStakeholderAck["ackStatus"])
        : undefined,
    notes:
      typeof data.notes === "string" ? (data.notes as string) : undefined,
  };
}

function mapTicketLink(data: Record<string, unknown>): BreachTicketLink {
  return {
    system: (data.system ??
      "custom") as BreachTicketLink["system"],
    ticketId: String(data.ticketId ?? ""),
    url: typeof data.url === "string" ? (data.url as string) : undefined,
    status:
      typeof data.status === "string" ? (data.status as string) : undefined,
    syncedAt: toIsoString(data.syncedAt),
  };
}

function mapControlAssessment(
  data: Record<string, unknown>
): BreachControlAssessment {
  return {
    controlId: String(data.controlId ?? ""),
    framework:
      typeof data.framework === "string"
        ? (data.framework as string)
        : undefined,
    status:
      (data.status as BreachControlAssessment["status"]) ?? "operating",
    notes:
      typeof data.notes === "string" ? (data.notes as string) : undefined,
  };
}

function mapImpactSummary(data: Record<string, unknown>): BreachImpactSummary {
  return {
    affectedIndividuals:
      typeof data.affectedIndividuals === "number"
        ? (data.affectedIndividuals as number)
        : undefined,
    affectedCustomers:
      typeof data.affectedCustomers === "number"
        ? (data.affectedCustomers as number)
        : undefined,
    affectedRecords:
      typeof data.affectedRecords === "number"
        ? (data.affectedRecords as number)
        : undefined,
    dataElements: toStringArray(data.dataElements),
    impactedJurisdictions: toStringArray(data.impactedJurisdictions),
    severity:
      typeof data.severity === "string"
        ? (data.severity as BreachImpactSummary["severity"])
        : undefined,
    confidence:
      typeof data.confidence === "string"
        ? (data.confidence as BreachImpactSummary["confidence"])
        : undefined,
  };
}

function mapNotification(data: Record<string, unknown>): BreachNotification {
  const statusHistory = ensureArray<Record<string, unknown>>(data.statusHistory).map(
    (entry) => ({
      status:
        (entry.status as BreachNotification["statusHistory"][number]["status"]) ??
        "pending",
      updatedAt: toIsoString(entry.updatedAt),
      updatedBy:
        typeof entry.updatedBy === "string"
          ? (entry.updatedBy as string)
          : undefined,
      acknowledgedAt: toIsoString(entry.acknowledgedAt),
      deliveryEvidenceUrl:
        typeof entry.deliveryEvidenceUrl === "string"
          ? (entry.deliveryEvidenceUrl as string)
          : undefined,
      notes:
        typeof entry.notes === "string" ? (entry.notes as string) : undefined,
    })
  );

  const approvals = ensureArray<Record<string, unknown>>(data.approvals).map(
    (entry) => ({
      approverId: String(entry.approverId ?? ""),
      approvedAt: toIsoString(entry.approvedAt),
      notes:
        typeof entry.notes === "string" ? (entry.notes as string) : undefined,
    })
  );

  return {
    id: String(data.id ?? ""),
    triggerId: String(data.triggerId ?? ""),
    obligationId:
      typeof data.obligationId === "string"
        ? (data.obligationId as string)
        : undefined,
    recipient: {
      audience:
        (data.recipient as Record<string, unknown>)?.audience ??
        "regulator",
      name:
        typeof (data.recipient as Record<string, unknown>)?.name === "string"
          ? ((data.recipient as Record<string, unknown>)?.name as string)
          : undefined,
      email:
        typeof (data.recipient as Record<string, unknown>)?.email === "string"
          ? ((data.recipient as Record<string, unknown>)?.email as string)
          : undefined,
      phone:
        typeof (data.recipient as Record<string, unknown>)?.phone === "string"
          ? ((data.recipient as Record<string, unknown>)?.phone as string)
          : undefined,
      address:
        typeof (data.recipient as Record<string, unknown>)?.address === "string"
          ? ((data.recipient as Record<string, unknown>)?.address as string)
          : undefined,
      portalUrl:
        typeof (data.recipient as Record<string, unknown>)?.portalUrl ===
        "string"
          ? ((data.recipient as Record<string, unknown>)?.portalUrl as string)
          : undefined,
      jurisdictionCode:
        typeof (data.recipient as Record<string, unknown>)?.jurisdictionCode ===
        "string"
          ? ((data.recipient as Record<string, unknown>)
              ?.jurisdictionCode as string)
          : undefined,
    },
    plannedDueAt: toIsoString(data.plannedDueAt),
    completedAt: toIsoString(data.completedAt),
    statusHistory,
    templateId:
      typeof data.templateId === "string"
        ? (data.templateId as string)
        : undefined,
    communicationId:
      typeof data.communicationId === "string"
        ? (data.communicationId as string)
        : undefined,
    attachments: toStringArray(data.attachments),
    approvals,
  };
}

function mapTrigger(docId: string, data: Record<string, unknown>): BreachTrigger {
  return {
    id: docId,
    taxonomyId: String(data.taxonomyId ?? ""),
    taxonomyIds: toStringArray(data.taxonomyIds),
    title: String(data.title ?? ""),
    summary:
      typeof data.summary === "string" ? (data.summary as string) : undefined,
    riskScore:
      typeof data.riskScore === "object" && data.riskScore !== null
        ? {
            impact:
              typeof (data.riskScore as Record<string, unknown>).impact ===
              "number"
                ? ((data.riskScore as Record<string, unknown>).impact as number)
                : undefined,
            likelihood:
              typeof (data.riskScore as Record<string, unknown>).likelihood ===
              "number"
                ? ((data.riskScore as Record<string, unknown>)
                    .likelihood as number)
                : undefined,
            calculated:
              typeof (data.riskScore as Record<string, unknown>).calculated ===
              "number"
                ? ((data.riskScore as Record<string, unknown>)
                    .calculated as number)
                : undefined,
          }
        : undefined,
    severity:
      typeof data.severity === "string"
        ? (data.severity as BreachTrigger["severity"])
        : undefined,
    jurisdictions: ensureArray<Record<string, unknown>>(data.jurisdictions).map(
      (entry) => ({
        level: entry.level as BreachTrigger["jurisdictions"][number]["level"],
        code: String(entry.code ?? ""),
      })
    ),
    regulations: ensureArray<Record<string, unknown>>(data.regulations).map(
      mapRegulationSnapshot
    ),
    obligations: ensureArray<Record<string, unknown>>(data.obligations).map(
      (entry) => ({
        audience:
          (entry.audience as BreachTrigger["obligations"][number]["audience"]) ??
          "regulator",
        description: String(entry.description ?? ""),
        deadline:
          entry.deadline && typeof entry.deadline === "object"
            ? {
                sla:
                  typeof (entry.deadline as Record<string, unknown>).sla ===
                  "string"
                    ? ((entry.deadline as Record<string, unknown>).sla as string)
                    : undefined,
                computedDueAt: toIsoString(
                  (entry.deadline as Record<string, unknown>).computedDueAt
                ),
                conditions: toStringArray(
                  (entry.deadline as Record<string, unknown>).conditions
                ),
              }
            : undefined,
        templateId:
          typeof entry.templateId === "string"
            ? (entry.templateId as string)
            : undefined,
        contact:
          entry.contact && typeof entry.contact === "object"
            ? {
                name:
                  typeof (entry.contact as Record<string, unknown>).name ===
                  "string"
                    ? ((entry.contact as Record<string, unknown>).name as string)
                    : undefined,
                email:
                  typeof (entry.contact as Record<string, unknown>).email ===
                  "string"
                    ? ((entry.contact as Record<string, unknown>).email as string)
                    : undefined,
                phone:
                  typeof (entry.contact as Record<string, unknown>).phone ===
                  "string"
                    ? ((entry.contact as Record<string, unknown>).phone as string)
                    : undefined,
                portalUrl:
                  typeof (entry.contact as Record<string, unknown>).portalUrl ===
                  "string"
                    ? ((entry.contact as Record<string, unknown>)
                        .portalUrl as string)
                    : undefined,
              }
            : undefined,
        waiver:
          entry.waiver && typeof entry.waiver === "object"
            ? {
                allowed: Boolean(
                  (entry.waiver as Record<string, unknown>).allowed
                ),
                requiredApproverRole:
                  typeof (entry.waiver as Record<string, unknown>)
                    .requiredApproverRole === "string"
                    ? ((entry.waiver as Record<string, unknown>)
                        .requiredApproverRole as string)
                    : undefined,
              }
            : undefined,
      })
    ),
    recommendedActions: toStringArray(data.recommendedActions),
    playbooks: ensureArray<Record<string, unknown>>(data.playbooks).map(
      (entry) => ({
        playbookId: String(entry.playbookId ?? ""),
        title: String(entry.title ?? ""),
        checklist: toStringArray(entry.checklist),
        referenceUrl:
          typeof entry.referenceUrl === "string"
            ? (entry.referenceUrl as string)
            : undefined,
      })
    ),
    automationConfig:
      typeof data.automationConfig === "object" && data.automationConfig !== null
        ? {
            createTask: Boolean(
              (data.automationConfig as Record<string, unknown>).createTask
            ),
            taskSystem:
              typeof (data.automationConfig as Record<string, unknown>)
                .taskSystem === "string"
                ? ((data.automationConfig as Record<string, unknown>)
                    .taskSystem as BreachTrigger["automationConfig"]["taskSystem"])
                : undefined,
            taskTemplateId:
              typeof (data.automationConfig as Record<string, unknown>)
                .taskTemplateId === "string"
                ? ((data.automationConfig as Record<string, unknown>)
                    .taskTemplateId as string)
                : undefined,
            notifyChannels: toStringArray(
              (data.automationConfig as Record<string, unknown>).notifyChannels
            ),
          }
        : undefined,
    validation:
      typeof data.validation === "object" && data.validation !== null
        ? {
            status:
              ((data.validation as Record<string, unknown>).status as
                | "current"
                | "needs_review"
                | "outdated") ?? "current",
            validatedAt: toIsoString(
              (data.validation as Record<string, unknown>).validatedAt
            ),
            validatedBy:
              typeof (data.validation as Record<string, unknown>).validatedBy ===
              "string"
                ? ((data.validation as Record<string, unknown>)
                    .validatedBy as string)
                : undefined,
            notes:
              typeof (data.validation as Record<string, unknown>).notes ===
              "string"
                ? ((data.validation as Record<string, unknown>).notes as string)
                : undefined,
          }
        : undefined,
    isArchived: Boolean(data.isArchived),
    createdAt: toIsoString(data.createdAt),
    createdBy:
      typeof data.createdBy === "string"
        ? (data.createdBy as string)
        : undefined,
    updatedAt: toIsoString(data.updatedAt),
    updatedBy:
      typeof data.updatedBy === "string"
        ? (data.updatedBy as string)
        : undefined,
    auditLogId:
      typeof data.auditLogId === "string"
        ? (data.auditLogId as string)
        : undefined,
  };
}

function mapLegacyTrigger(
  docId: string,
  data: Record<string, unknown>
): BreachTrigger {
  const titleSource =
    typeof data.canonical_phrase === "string"
      ? data.canonical_phrase
      : typeof data.title === "string"
      ? data.title
      : docId;
  const title = toTitleCase(titleSource);
  const summary =
    typeof data.interpretation === "string"
      ? data.interpretation
      : typeof data.summary === "string"
      ? data.summary
      : undefined;

  const jurisdictionRaw = data.jurisdiction;
  const jurisdictions = Array.isArray(jurisdictionRaw)
    ? jurisdictionRaw
        .map((entry) =>
          entry && typeof entry === "object"
            ? {
                level:
                  typeof (entry as Record<string, unknown>).type === "string"
                    ? (((entry as Record<string, unknown>).type as string) || "state").toLowerCase()
                    : "state",
                code:
                  typeof (entry as Record<string, unknown>).code === "string"
                    ? ((entry as Record<string, unknown>).code as string).toUpperCase()
                    : docId.toUpperCase(),
              }
            : null
        )
        .filter(Boolean) as BreachTrigger["jurisdictions"]
    : jurisdictionRaw && typeof jurisdictionRaw === "object"
    ? [
        {
          level:
            typeof (jurisdictionRaw as Record<string, unknown>).type === "string"
              ? (((jurisdictionRaw as Record<string, unknown>).type as string) || "state").toLowerCase()
              : "state",
          code:
            typeof (jurisdictionRaw as Record<string, unknown>).code === "string"
              ? ((jurisdictionRaw as Record<string, unknown>).code as string).toUpperCase()
              : docId.toUpperCase(),
        },
      ]
    : [];

  const taxonomyId = jurisdictions.length
    ? `LEGACY_${jurisdictions[0].code}`
    : `LEGACY_${docId.toUpperCase()}`;

  const regulationsRaw = data.metadata && typeof data.metadata === "object"
    ? (data.metadata as Record<string, unknown>)
    : {};

  const regulationId =
    typeof regulationsRaw.source_regulation_id === "string"
      ? (regulationsRaw.source_regulation_id as string)
      : docId;
  const regulationTitle =
    typeof regulationsRaw.rule_id === "string"
      ? (regulationsRaw.rule_id as string)
      : regulationId;

  const confidence =
    typeof data.confidence_score === "number"
      ? (data.confidence_score as number)
      : undefined;

  const notificationsRaw = data.notification;
  const notificationsArray = Array.isArray(notificationsRaw)
    ? notificationsRaw
    : notificationsRaw
    ? [notificationsRaw]
    : [];

  const normalizeAudience = (value: unknown): BreachTrigger["obligations"][number]["audience"] => {
    const audience = typeof value === "string" ? value.toLowerCase() : "";
    if (audience.includes("individual")) return "individual";
    if (audience.includes("media")) return "media";
    if (audience.includes("law")) return "law_enforcement";
    if (audience.includes("executive")) return "executive";
    if (audience.includes("third")) return "third_party";
    return "regulator";
  };

  const obligations = notificationsArray
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const description =
        typeof record.description === "string"
          ? (record.description as string)
          : summary ?? title;
      const deadlineValue =
        typeof record.deadline === "string"
          ? (record.deadline as string)
          : typeof record.timeline === "string"
          ? (record.timeline as string)
          : typeof record.days === "number"
          ? `${record.days} days`
          : undefined;

      const contact =
        record.contact && typeof record.contact === "object"
          ? (record.contact as Record<string, unknown>)
          : undefined;

      return {
        audience: normalizeAudience(record.audience ?? record.recipient),
        description,
        deadline: deadlineValue ? { sla: deadlineValue } : undefined,
        templateId:
          typeof record.template_id === "string"
            ? (record.template_id as string)
            : undefined,
        contact: contact
          ? {
              name:
                typeof contact.name === "string"
                  ? (contact.name as string)
                  : undefined,
              email:
                typeof contact.email === "string"
                  ? (contact.email as string)
                  : undefined,
              phone:
                typeof contact.phone === "string"
                  ? (contact.phone as string)
                  : undefined,
              portalUrl:
                typeof contact.url === "string"
                  ? (contact.url as string)
                  : undefined,
            }
          : undefined,
      } satisfies BreachTrigger["obligations"][number];
    })
    .filter(Boolean) as BreachTrigger["obligations"] | undefined;

  const calculatedScore =
    confidence !== undefined ? Math.max(0, Math.min(confidence * 10, 10)) : undefined;

  const createdAt = toIsoString(data._created_at ?? data.createdAt);
  const updatedAt = toIsoString(data._updated_at ?? data.updatedAt ?? data._created_at);

  return {
    id: docId,
    taxonomyId,
    taxonomyIds: [taxonomyId],
    title,
    summary,
    riskScore: calculatedScore !== undefined ? { calculated: calculatedScore } : undefined,
    severity: "medium",
    jurisdictions,
    regulations: [
      {
        regulationId,
        title: regulationTitle,
        citation:
          typeof regulationsRaw.citation === "string"
            ? (regulationsRaw.citation as string)
            : undefined,
        jurisdictionLevel: jurisdictions.length
          ? (jurisdictions[0].level as BreachTriggerRegulationSnapshot["jurisdictionLevel"])
          : undefined,
        jurisdictionCode: jurisdictions.length ? jurisdictions[0].code : undefined,
        snapshotAt: toIsoString(data.extracted_at ?? data.extracted_date),
        sourceUrl:
          typeof regulationsRaw.source_url === "string"
            ? (regulationsRaw.source_url as string)
            : undefined,
      },
    ],
    obligations: obligations && obligations.length ? obligations : undefined,
    recommendedActions: summary ? [summary] : undefined,
    validation:
      confidence !== undefined
        ? {
            status: confidence >= 0.6 ? "current" : "needs_review",
            notes:
              typeof data.boolean_logic === "string"
                ? (data.boolean_logic as string)
                : undefined,
          }
        : undefined,
    isArchived: false,
    createdAt,
    updatedAt,
  };
}

function mapTaxonomyDocument(
  docId: string,
  data: Record<string, unknown>
): BreachTaxonomyItem | null {
  const getString = (value: unknown, fallback = ""): string =>
    typeof value === "string" ? value : fallback;

  const canonicalPhrase =
    getString(data.canonicalPhrase) || getString(data.canonical_phrase);
  if (!canonicalPhrase) {
    return null;
  }

  const category = getString(data.category, "custom");
  const sensitivityLevel = getString(data.sensitivityLevel) || getString(data.sensitivity_level, "unknown");
  const synonyms = ensureArray<string>(data.synonyms).filter((entry): entry is string => typeof entry === "string");
  const keywords = ensureArray<string>(data.keywords).filter((entry): entry is string => typeof entry === "string");

  const jurisdictionRaw = data.jurisdiction;
  let jurisdictionName = "UNKNOWN";
  let jurisdictionCode: string | undefined;
  if (jurisdictionRaw && typeof jurisdictionRaw === "object") {
    const record = jurisdictionRaw as Record<string, unknown>;
    jurisdictionName =
      getString(record.name) || getString(record.jurisdiction) || jurisdictionName;
    jurisdictionCode = getString(record.code) || undefined;
  } else if (typeof jurisdictionRaw === "string") {
    jurisdictionName = jurisdictionRaw;
  }

  const metadata =
    data.metadata && typeof data.metadata === "object"
      ? (data.metadata as Record<string, unknown>)
      : undefined;

  const source = getString(data.source) || getString(metadata?.source);
  const originalLine =
    getString(data.originalLine) || getString(metadata?.originalLine) || getString((metadata as Record<string, unknown> | undefined)?.original_line);
  const semanticCluster =
    getString(data.semanticCluster) ||
    getString(metadata?.semanticCluster) ||
    getString((metadata as Record<string, unknown> | undefined)?.semantic_cluster);
  const globalIdentifier =
    data.globalIdentifier !== undefined
      ? (data.globalIdentifier as string | null)
      : (metadata?.globalIdentifier as string | null | undefined);

  const createdAt = toIsoString(data.createdAt ?? data._created_at);
  const updatedAt = toIsoString(data.updatedAt ?? data._updated_at ?? data.createdAt);

  const raw =
    data.raw && typeof data.raw === "object"
      ? (data.raw as Record<string, unknown>)
      : undefined;

  return {
    id: docId,
    canonicalPhrase,
    category,
    sensitivityLevel,
    synonyms,
    keywords: keywords.length ? keywords : undefined,
    jurisdiction: {
      name: jurisdictionName,
      code: jurisdictionCode,
    },
    metadata,
    source: source || undefined,
    originalLine: originalLine || undefined,
    semanticCluster: semanticCluster || undefined,
    globalIdentifier: globalIdentifier ?? undefined,
    raw,
    createdAt,
    updatedAt,
  };
}

function mapBreach(docId: string, data: Record<string, unknown>): BreachRecord {
  const notifications = ensureArray<Record<string, unknown>>(data.notifications).map(
    mapNotification
  );
  const evidence = ensureArray<Record<string, unknown>>(data.evidence).map(
    mapEvidenceItem
  );
  const stakeholders = ensureArray<Record<string, unknown>>(data.stakeholders).map(
    mapStakeholderAck
  );
  const controls = ensureArray<Record<string, unknown>>(data.controls).map(
    mapControlAssessment
  );
  const timeline = ensureArray<Record<string, unknown>>(data.timeline).map(
    mapTimelineEntry
  );
  const ticketLinks = ensureArray<Record<string, unknown>>(data.ticketLinks).map(
    mapTicketLink
  );

  return {
    id: docId,
    organizationId: String(data.organizationId ?? ""),
    title: String(data.title ?? ""),
    summary:
      typeof data.summary === "string" ? (data.summary as string) : undefined,
    status:
      (data.status as BreachRecord["status"]) ?? "reported",
    severity:
      (data.severity as BreachRecord["severity"]) ?? "medium",
    triageScore:
      typeof data.triageScore === "number"
        ? (data.triageScore as number)
        : undefined,
    taxonomySelections: ensureArray<Record<string, unknown>>(
      data.taxonomySelections
    ).map((entry) => ({
      nodeId: String(entry.nodeId ?? ""),
      triggerIds: toStringArray(entry.triggerIds),
    })),
    triggerIds: toStringArray(data.triggerIds),
    notifications,
    evidence,
    stakeholders,
    impact:
      typeof data.impact === "object" && data.impact !== null
        ? mapImpactSummary(data.impact as Record<string, unknown>)
        : {
            severity: "medium",
          },
    controls,
    timeline,
    ticketLinks,
    automationState:
      typeof data.automationState === "object" && data.automationState !== null
        ? {
            lastEvaluatedAt: toIsoString(
              (data.automationState as Record<string, unknown>).lastEvaluatedAt
            ),
            pendingActions: toStringArray(
              (data.automationState as Record<string, unknown>).pendingActions
            ),
          }
        : undefined,
    simulation:
      typeof data.simulation === "object" && data.simulation !== null
        ? {
            isSimulation: Boolean(
              (data.simulation as Record<string, unknown>).isSimulation
            ),
            scenarioId:
              typeof (data.simulation as Record<string, unknown>).scenarioId ===
              "string"
                ? ((data.simulation as Record<string, unknown>).scenarioId as string)
                : undefined,
            scheduledAt: toIsoString(
              (data.simulation as Record<string, unknown>).scheduledAt
            ),
            runbookLink:
              typeof (data.simulation as Record<string, unknown>).runbookLink ===
              "string"
                ? ((data.simulation as Record<string, unknown>)
                    .runbookLink as string)
                : undefined,
          }
        : undefined,
    postIncident:
      typeof data.postIncident === "object" && data.postIncident !== null
        ? {
            remediationSummary:
              typeof (data.postIncident as Record<string, unknown>)
                .remediationSummary === "string"
                ? ((data.postIncident as Record<string, unknown>)
                    .remediationSummary as string)
                : undefined,
            costEstimateUsd:
              typeof (data.postIncident as Record<string, unknown>)
                .costEstimateUsd === "number"
                ? ((data.postIncident as Record<string, unknown>)
                    .costEstimateUsd as number)
                : undefined,
            lessonsLearned: toStringArray(
              (data.postIncident as Record<string, unknown>).lessonsLearned
            ),
            effectiveSince: toIsoString(
              (data.postIncident as Record<string, unknown>).effectiveSince
            ),
          }
        : undefined,
    createdAt: toIsoString(data.createdAt),
    createdBy:
      typeof data.createdBy === "string"
        ? (data.createdBy as string)
        : undefined,
    updatedAt: toIsoString(data.updatedAt),
    updatedBy:
      typeof data.updatedBy === "string"
        ? (data.updatedBy as string)
        : undefined,
    archivedAt: toIsoString(data.archivedAt),
  };
}

export async function fetchBreachTriggerTaxonomies(): Promise<
  BreachTaxonomyItem[]
> {
  try {
    if (!db) {
      console.warn(
        "Firestore is not configured; returning empty taxonomy list."
      );
      return [];
    }

    const snapshot = await getDocs(collection(db, COLLECTIONS.TAXONOMIES));

    const items = snapshot.docs
      .map((docSnapshot) => mapTaxonomyDocument(docSnapshot.id, docSnapshot.data()))
      .filter((item): item is BreachTaxonomyItem => Boolean(item))
      .sort((a, b) => {
        const categoryCompare = a.category.localeCompare(b.category);
        if (categoryCompare !== 0) {
          return categoryCompare;
        }
        const jurisdictionCompare = a.jurisdiction.name.localeCompare(b.jurisdiction.name);
        if (jurisdictionCompare !== 0) {
          return jurisdictionCompare;
        }
        return a.canonicalPhrase.localeCompare(b.canonicalPhrase);
      });

    return items;
  } catch (error) {
    console.error("Failed to fetch breach taxonomies:", error);
    return [];
  }
}

export async function fetchBreachTriggers(): Promise<BreachTrigger[]> {
  try {
    if (!db) {
      console.warn("Firestore is not configured; returning empty trigger list.");
      return [];
    }

    const snapshot = await getDocs(collection(db, COLLECTIONS.TRIGGERS));

    const triggers = snapshot.docs
      .map((docSnapshot) => {
        const raw = docSnapshot.data();
        if (raw && typeof raw.title === "string" && raw.regulations) {
          return mapTrigger(docSnapshot.id, raw);
        }
        return mapLegacyTrigger(docSnapshot.id, raw);
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    return triggers;
  } catch (error) {
    console.error("Failed to fetch breach triggers:", error);
    return [];
  }
}

export async function fetchBreachById(id: string): Promise<BreachRecord | null> {
  try {
    if (!db) {
      console.warn("Firestore is not configured; returning null breach record.");
      return null;
    }

    const docRef = doc(db, COLLECTIONS.BREACHES, id);
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      return null;
    }

    return mapBreach(docSnapshot.id, docSnapshot.data());
  } catch (error) {
    console.error(`Failed to fetch breach with id ${id}:`, error);
    return null;
  }
}

export async function fetchBreaches(): Promise<BreachRecord[]> {
  try {
    if (!db) {
      console.warn("Firestore is not configured; returning empty breach list.");
      return [];
    }

    const q = query(
      collection(db, COLLECTIONS.BREACHES),
      orderBy("updatedAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnapshot) =>
      mapBreach(docSnapshot.id, docSnapshot.data())
    );
  } catch (error) {
    console.error("Failed to fetch breaches:", error);
    return [];
  }
}


