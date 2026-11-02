# MeritIQRa One — Complete UI/UX Coverage Plan

## Product standard

MeritIQRa One is a multi-tenant school and college operations platform with a connected MeritIQRa Core learning and examination experience. The interface should feel like a polished education SaaS product: consistent navigation, high signal dashboards, clear workflow status, useful empty states, responsive pages and predictable controls across every role. The supplied EduNova ERP reference sets the breadth bar for platform administration, school operations, examinations, finance and campus services. The MeritIQRa One objective graphic remains the product identity and information architecture reference.

This is a coverage plan, not a claim that every listed integration is already implemented. Current MVP coverage and work still required are called out separately.

## 1. Shared application shell

- Tenant identity: institution name, campus context, signed-in role, current academic year and a visible sample-data indicator.
- Role-aware left navigation, quick launch, breadcrumbs, account menu and sign out.
- Search, filters, date range, saved views, refresh, CSV export and contextual help where relevant.
- Dashboard cards link to the actual underlying workflow and show a useful count, trend or action needed.
- Reusable tables and record panels with sort, pagination, status chips, row actions and bulk actions where safe.
- Consistent create/edit forms with field help, validation, confirmation for destructive actions and save feedback.
- Every feature has loading, success, empty, error, permission-denied and offline states. Empty pages provide an appropriate next action and seeded local workspaces remain populated for demonstration.
- Responsive desktop, tablet and mobile layouts, keyboard operation, visible focus, accessible labels and sufficient contrast.
- Configurable institution branding: logo, theme, campus identity and domain, subject to the platform entitlement.

## 2. SaaS platform administration

**Roles:** MeritIQRa platform administrator and future support/operations staff with narrowly scoped permissions.

### Screens and workflows

1. **Platform overview:** active organizations, onboarding pipeline, service health, support queue and subscription/renewal attention.
2. **Tenant onboarding:** create a school or college, campus details, workspace slug, initial super administrator, academic setup and synthetic starter data choice.
3. **Organization directory:** search/filter tenants, view lifecycle/status, institution type, campuses, plan, usage and onboarding progress.
4. **Subscription and plan management:** plan catalog, entitlements, seat/storage/module limits, billing state, renewal timeline and change history. Financial actions must be explicit and auditable.
5. **Feature entitlements:** enable/disable modules per organization. An organization cannot activate features outside this platform-level license.
6. **Branding and domain setup:** organization theme, logo, email identity and domain verification status.
7. **Operational monitoring:** API/database health, integration status, job queues, failed webhooks and safe diagnostic detail without exposing student data.
8. **Audit and support:** searchable platform actions, tenant-level support access with explicit reason, time limit and audit trail.
9. **Security:** MFA enrollment and enforcement, session/device management, recovery controls and suspicious-login signals.

Platform staff must not receive unrestricted student-record access through the school application. Support access should be separate, justified, time-limited and logged.

## 3. School and college administration

**Roles:** institution super administrator (created by platform onboarding), institution administrator, principal and delegated role accounts. Each organization owns its settings and data independently.

### School control center

- Institution profile, campuses, academic year, terms, grade/course structure, sections, subjects and calendars.
- Role and account administration, access review, account activation/deactivation and student/guardian account linking.
- **Feature & role access:** institution super administrators may switch licensed features on/off for the supported built-in role permissions. Platform entitlement and built-in RBAC remain hard limits. Show why a switch is unavailable.
- Approval inbox for admissions, leave, fee adjustments, exam approvals, certificates and operational requests.
- Activity and audit views with actor, action, time, affected record and exportable change history.

### Student lifecycle

- Applicant intake, document checklist, review, offer/admission, enrollment and transfer/withdrawal flows.
- Student directory and profile with identifiers, contacts, guardian relationships, class history, attendance, fees, exams, documents and communications.
- Guardian/parent portal with linked-child switcher and data limited to linked students.
- Certificates, bonafide letters, transcripts and other institution-approved documents, including preview, approval, generation and download states.
- Bulk import/export with mapping preview, duplicate detection, validation report and rollback/error summary.
- Student Registry/Core integration: show source, sync time, match/conflict status and field ownership. Do not silently overwrite authoritative registry values.

### Academics and day-to-day operation

- Classes/courses, sections, subjects, teacher assignments, timetable, room allocation and substitution requests.
- Attendance register, late/absence reasons, authorized corrections, monthly views and guardian notifications.
- Lesson planning, assignments/homework, submissions, grading feedback and class progress.
- Notices and communications with audience targeting, draft/review/schedule/publish states and delivery status.

## 4. Examination experience — MeritIQRa Core

MeritIQRa One owns school context, exam requests, schedules, class rosters, access and reporting surfaces. MeritIQRa Core remains the examination engine and source of truth for exam delivery and evaluation. Reuse Core APIs and established security/activation patterns; do not create a parallel exam engine here.

### Coverage

- Exam calendar and request wizard: online/offline/hybrid mode, class/subject, schedule, duration, marks, instructions, accommodations and approval.
- Core exam connection status, exam identifier, sync status, last updated time and actionable failure/retry details.
- Online examination launch/readiness surface: candidate instructions, allowed window, identity/proctoring status, connectivity and submission confirmation, subject to Core capabilities.
- Offline exam preparation: printable paper/package, roster and seating plan, invigilator assignment, attendance, absent candidate marking and upload/import status.
- OMR workflow: sheet/template selection, generation/download, scan batch upload, image-quality checks, ambiguous-mark review queue and scan progress.
- Invigilator mobile scanning flow: assigned session, candidate search/scan, duplicate/invalid scan handling, offline queue and sync confirmation.
- Automated scoring and moderation: scoring status, exception review, manual override reason, approval and locked/published state.
- Results: subject marks, grades, ranks, class/term comparison, report-card preview, export and release/suppression controls.
- Student performance analytics: longitudinal trends, skill/topic gaps, cohort comparisons and accessible explanations.
- AI explanations: clearly labeled generated insight, evidence/metric links, educator review, feedback and an explicit distinction between guidance and official result.

### Examination states

Draft → approval → scheduled → Core provisioning → ready → in progress → submitted/scanning → evaluation → moderation → results approved → published/archived. Each transition needs owner, timestamp, available action and failure recovery.

## 5. Finance and campus operations

### Finance

- Fee structures, scholarships/discount approvals, student invoices, installment plans, outstanding balance and reconciliation.
- Cash/UPI/card/bank/cheque/manual payment capture, gateway checkout where configured, refunds/reversals and immutable receipts.
- Receipt preview, print/PDF, duplicate retrieval, invoice balance history and payment audit trail.
- Accounting ledger, journal review, expenses, budget vs actual and financial-period close.
- Payroll: employee records, attendance/leave inputs, payslip review, approval and secure delivery; integrate with the configured payroll provider where applicable.
- Every payment screen identifies whether the action records an offline payment or initiates a provider charge. Never represent a local/demo entry as a real payment.

### People and HR

- Staff directory, role, qualifications, contracts, document expiry, attendance, leave, approvals and payroll status.

### Transport and biometric attendance

- Routes, stops, vehicles, drivers, student allocation and capacity.
- Live GPS map and trip history from the approved driver/transport API, with stale/offline indicators and privacy-aware access.
- Biometric device/vendor setup, enrollment/sync health, raw event review, attendance reconciliation and exception handling. Show device and last-sync health without exposing biometric templates.

### Hostel, inventory, library and communications

- Hostel/boarding: buildings, rooms, occupancy, allocation, check-in/out and maintenance requests.
- Inventory/assets: catalogue, stock movement, purchase/issue/return, custodian, warranty and low-stock alerts.
- Library: catalogue, copy availability, circulation, reservation, overdue and fine handling.
- Communications: email, SMS and WhatsApp templates, audience preview, approval, schedule, delivery/bounce state and provider configuration.

## 6. Integration and privacy UX

- Integration directory shows provider, feature entitlement, connection state, last successful sync, next action and recent safe errors.
- School-level users can configure only providers/features licensed by the platform.
- Secrets are entered into secure configuration controls and never echoed after save. Test connection and rotate credentials without exposing existing values.
- Respect source-of-truth boundaries across MeritIQRa Core, Student Registry, payment providers, email/SMS, biometric and transport APIs.
- Per-tenant isolation applies to reads, search, exports, notifications, settings and audit records. Cross-tenant search or accidental identifier reuse must not disclose another school's records.
- Offline/mobile workflows identify queued, synced and conflict states and provide retry/reconciliation rather than silently dropping changes.

## 7. Navigation and role coverage map

| Area | Platform admin | Institution super admin | Principal | Role-specific staff | Student/parent |
|---|---|---|---|---|---|
| Tenants, plans, entitlements | Manage | — | — | — | — |
| Institution setup, branding, role switches | Platform policy | Manage own organization | View/approve as delegated | — | — |
| Accounts and roles | Bootstrap/recovery policy | Manage own accounts | Delegated review | Own profile | Own/linked profile |
| Students and admissions | No routine access | Manage | Review/approve | Admissions/teaching scope | Self or linked child only |
| Academics and attendance | Service health only | Configure | Monitor/approve | Assigned classes/tasks | Personal timetable/results |
| Core examinations | Integration health/entitlement | Configure and approve | Review/approve | Coordinator/invigilator duties | Assigned exams/results |
| Fees and finance | Plan/entitlement | Configure/report | Approve by policy | Accountant/cashier scope | Own invoices/receipts |
| HR and operations | Provider health | Configure | Review/approve | Assigned operational scope | Relevant notices/status only |

The backend role/tenant policy is authoritative. The UI hides unavailable navigation for clarity but never treats hidden navigation as authorization.

## 8. Current MVP coverage and gaps

### Present in the current MVP

- School/college onboarding and initial super-admin creation; organization-scoped sessions and role accounts.
- Platform entitlement switches and school super-admin role feature switches, persisted and enforced by API.
- Dashboard, sample-data banner, generic record pages for current modules, and role-specific navigation.
- Fee invoice listing, plan-based invoice creation, manual/full/partial payment recording and printable receipt flow.
- Current generic modules: schools/campuses, academic years, classes, staff, subjects, students, admissions, attendance, assignments, timetable, fee plans/invoices/payments, exam requests, notices, library books, transport routes, leave, assets and helpdesk.
- Local-only, idempotent synthetic dataset for every current module and local run/seed scripts.

### Planned before the full product standard is met

- Platform subscription/billing, tenant usage limits and full platform monitoring/audit UI.
- MFA, institution audit history, certificate/document workflows, approval inbox and bulk import UX.
- MeritIQRa Core online/offline exam, OMR, scanning, evaluation, rank, AI explanation and performance analytics surfaces.
- Accounting ledger, payroll, GPS transport, biometric device workflows, hostel, deeper inventory and provider-backed email/SMS/WhatsApp.
- Production-grade dashboard visualizations, global search, saved filters, pagination, responsive mobile workflows and complete accessibility review across all modules.

## 9. Delivery and acceptance sequence

1. **Foundation:** settle design tokens, shell, navigation, responsive layouts, role/tenant boundaries, empty/loading/error patterns and reusable forms/tables.
2. **Administration:** complete platform tenant/plan/entitlement and school setup/role/audit/approval journeys.
3. **Student and academic lifecycle:** admissions through certificates, guardian experience, timetable and attendance.
4. **Core examination:** connect request, readiness, offline/OMR/scanning, evaluation, result approval and student analytics to MeritIQRa Core.
5. **Finance and operations:** fee reconciliation and accounting, payroll/HR, transport/biometrics, hostel, inventory, library and communications.
6. **Polish and release:** accessibility and device review, realistic synthetic demo across all screens, tenant-isolation review, integration failure drills and role-by-role acceptance.

Each area is ready only when an authorized user can complete its primary journey, understands its current state and next action, can recover from validation/integration failures, and cannot see or modify another tenant's data.
