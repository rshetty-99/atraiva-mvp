# Breach Response Feature — Phase 1 Implementation Notes

_This document captures the execution details for the Phase 1 tasks defined in `@bre.plan.md`._

## 1. Data Model Audit (`data-model-audit`)
- Canonical TypeScript interfaces live in `src/types/breach.ts`.
- Fields mirror the three Firestore collections (`breach_trigger_taxonomies`, `breach_triggers`, `breaches`) with forward-looking metadata for automation, audit, and retention.
- Conversion helpers in `src/lib/firestore/breach.ts` normalise Firestore timestamps, optional arrays, and nested structures.
- Drift detection: `BreachTriggerRegulationSnapshot.regulationRevision` + `validation.status` surface stale triggers when regulations change.

## 2. Data Access Layer (`hooks-layer`)
- Firestore fetchers and mappers in `src/lib/firestore/breach.ts`.
- React Query hooks in `src/hooks/useBreachData.ts` provide:
  - `useBreachTaxonomies`
  - `useBreachTriggers`
  - `useBreaches` / `useBreach`
- Query keys exported via `invalidateBreachQueryKeys()` for cache coordination.

## 3. Admin Reference UI (`admin-ui`)
- New routes:
  - `src/app/(dashboard)/admin/reference/breach-taxonomies/page.tsx`
  - `src/app/(dashboard)/admin/reference/breach-triggers/page.tsx`
- Views include validation indicators, obligation summaries, regulation snapshots, and refresh controls.
- Navigation updates for `super_admin` and `platform_admin` roles in `src/lib/rbac/menu-config.ts`.

## 4. Incident Workflow Integration (`incidents-integration`)
- `/admin/incidents` now consumes live breach data via `useBreaches`.
- Table columns align with breach reality: severity/status badges, jurisdiction footprint, deadline tracking, notification progress, and evidence counts.
- Graceful fallback to sample data + error toast when Firestore is unavailable.

## 5. Automation & Future Proofing (`automation-roadmap`)
- Automation metadata captured in types:
  - `BreachTrigger.automationConfig`
  - `BreachRecord.automationState`, `ticketLinks`, `stakeholders`, `simulation`.
- Cloud Functions or background jobs can observe these fields to drive ticket creation, Slack/Email alerts, and deadline reminders.
- Validation hooks (`validation.status`) flag triggers that require manual review after regulation updates.

## 6. Executive Dashboards & Reporting (`dashboards-reporting`)
- `BreachDashboardSummary` interface (see `src/types/breach.ts`) consolidates counts, severity mix, jurisdiction heat maps, and upcoming deadlines.
- Dashboard cards can reuse `fetchBreaches()` + client aggregation until dedicated endpoints arrive.

## 7. External Task Integrations (`external-integrations`)
- Trigger-level configuration (`automationConfig.taskSystem`, `taskTemplateId`, `notifyChannels`) plus breach-level `ticketLinks[]` provide the contract for Jira/ServiceNow sync.
- Future implementation: a Firestore-triggered function that reads `automationConfig` and pushes/updates external tickets.

## 8. Regulation Versioning (`regulation-versioning`)
- Each trigger stores `BreachTriggerRegulationSnapshot` entries with `snapshotAt` and `regulationRevision`.
- Comparison against the `regulations` collection (or `validatedAt`) signals drift and populates the “Needs Review” bucket in the UI.

## 9. Machine-Assisted Triage (`ai-triage`)
- Types include `riskScore`, `triageScore`, and `taxonomySelections`. These can power an ML inference service that suggests likely triggers based on impacted data/jurisdictions.
- Placeholder fields ensure future predictions can be stored without schema changes.

## 10. Evidence Intake Automation (`evidence-automation`)
- `BreachEvidenceItem` now supports hashing (`hashed`) and retention overrides (`retentionPolicy`).
- Evidence column in `/admin/incidents` links to future evidence workspace.

## 11. Communication Templates (`comms-templates`)
- `BreachTriggerObligation.templateId` and `BreachNotification.templateId` tie triggers/notifications to reusable templates.
- Approvals captured via `BreachNotification.approvals`.

## 12. Analytics Export (`analytics-export`)
- `BreachDashboardSummary` + typed fetchers enable CSV/API export endpoints (future server routes) with minimal extra mapping.
- Hooks provide client-side CSV export opportunity while backend endpoints are built.

## 13. Zero-Trust Handling & Retention (`security-retention`)
- Evidence retention control fields plus `BreachRecord.postIncident` support cost tracking and legal-hold exceptions.
- `BreachEvidenceItem.hashed` ensures integrity verification for legal defensibility.

## 14. Playbook Testing (`playbook-testing`)
- `BreachTrigger.playbooks` + `BreachRecord.simulation` fields underpin tabletop drills and scenario templates.
- Simulation metadata distinguishes training incidents from production events.

---

**Next steps:** tackle Phase 2 roadmap items (third-party coordination, legal counsel workspace, post-incident analytics, control mapping, stakeholder notifications, regional packs, evidence hashing automation, retention exceptions) once Phase 1 stabilises and data is flowing from Firestore.


