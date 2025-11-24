# Breach Response Data Model

_Phase 1 deliverable for `@bre.plan.md` — data-model-audit_

This document captures the canonical schema for the breach workflow collections that already exist in Firestore. It highlights required fields, optional enhancements, and the safeguards we need to detect drift when regulations change.

## Collections

### 1. `breach_trigger_taxonomies`

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | Firestore document ID |
| `label` | string | Display name for selectors |
| `category` | `"cause" \| "impacted_data" \| "detection" \| "industry" \| "jurisdiction" \| "response_stage" \| "custom"` | Allows multiple trees |
| `parentId` | string? | Supports hierarchy |
| `ancestry` | string[]? | Ordered list of ancestor IDs |
| `description` | string? | Tooltip text in admin UI |
| `keywords` | string[]? | Search tokens |
| `ui` | `{ accentColor?: string; iconName?: string }` | Optional presentation metadata |
| `isArchived` | boolean | Soft delete for backward compatibility |
| `createdAt` / `updatedAt` | ISO string | Generated on write |
| `createdBy` / `updatedBy` | string? | User IDs for audit trail |
| `auditLogId` | string? | Pointer to audit entry |

### 2. `breach_triggers`

| Field | Type | Notes |
| --- | --- | --- |
| `taxonomyId` / `taxonomyIds` | string / string[] | References taxonomy nodes |
| `title` | string | Headline for card view |
| `summary` | string? | Rich description |
| `severity` | `"low" \| "medium" \| "high" \| "critical"` | Default incident severity |
| `riskScore` | `{ impact?: number; likelihood?: number; calculated?: number }` | Normalised 0-10 |
| `jurisdictions` | `{ level, code }[]?` | Link to regulations |
| `regulations` | `BreachTriggerRegulationSnapshot[]?` | Cached title/citation + `regulationRevision` for drift detection |
| `obligations` | `BreachTriggerObligation[]?` | Notification + SLA definitions |
| `recommendedActions` | string[]? | Quick action items |
| `playbooks` | `BreachTriggerPlaybook[]?` | Attach reusable checklists |
| `automationConfig` | `{ createTask?, taskSystem?, taskTemplateId?, notifyChannels? }?` | Enables ticketing integrations |
| `validation` | `{ status: "current" \| "needs_review" \| "outdated"; validatedAt?; validatedBy?; notes? }` | Flag stale guidance |
| `isArchived` | boolean? | Hide without deleting |
| Audit fields | As per taxonomy nodes |

### 3. `breaches`

| Field group | Description |
| --- | --- |
| Core | `organizationId`, `title`, `summary`, `status`, `severity`, timestamps |
| Taxonomy | `taxonomySelections[]` capturing selected nodes + `triggerIds[]` |
| Impact | `impact` block with counts, data elements, jurisdiction footprint, severity confidence |
| Notifications | Array of `BreachNotification` records with status history and approvals |
| Evidence | `BreachEvidenceItem[]` with hashing + retention overrides |
| Stakeholders | `stakeholders[]` for escalation acknowledgements |
| Controls | `controls[]` to tie back to preventive controls/frameworks |
| Timeline | `timeline[]` mapping major events |
| Tickets | `ticketLinks[]` storing external system references |
| Automation | `automationState` block for pending actions |
| Simulation | `simulation` block for tabletop exercises |
| Post-incident | `postIncident` block for remediation metrics |

Refer to `src/types/breach.ts` for the full TypeScript definitions.

## Validation & Drift Safeguards

- **Regulation Snapshotting:** Each trigger stores a lightweight snapshot (`title`, `citation`, `regulationRevision`) so we can compare against the latest entry in the `regulations` collection and flag items for review.
- **Audit Hooks:** Both taxonomies and triggers include audit metadata (`createdBy`, `updatedBy`, `auditLogId`) to integrate with the existing audit log service.
- **Retention Controls:** Evidence items support `retentionPolicy` with override approvals to honour legal holds.

## Immediate Next Steps

1. Enforce the typings in code via the new `src/types/breach.ts`.
2. Add schema validation in the Firestore data access layer (Phase 1 task `hooks-layer`).
3. Ensure admin tooling surfaces the validation state and lifecycle metadata (Phase 1 task `admin-ui`).

By locking the schema and documenting future fields now, we can evolve the breach feature without disruptive migrations.


