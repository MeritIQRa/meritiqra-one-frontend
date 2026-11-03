# MeritIQRa One — consolidated pending-work register

Updated: 3 November 2026 (Asia/Kolkata).

This is a backlog and evidence register, not a declaration that the complete ERP is production-ready. It consolidates the playbooks and requirements supplied in this chat, available playbook files, and repository implementation notes. It does not initiate development, provider activation or deployment. No passwords or secret values are included.

## Status and priority definitions

- **PENDING**: explicitly identified as unfinished in current implementation/release evidence.
- **VERIFY**: required by a playbook, but current completion evidence is insufficient or older notes conflict. Inspect the implementation before rebuilding it.
- **DEPENDENCY**: requires a provider, Core API, approved account, school input or physical device.
- **P0**: gate before the affected capability is used by a real school or handles live money/data.
- **P1**: complete the primary operational workflow.
- **P2**: broader enterprise coverage and polish.

All unchecked entries remain open. A saved configuration, simulated scenario, passing component test or successful deployment does not close a live-integration acceptance item. Priorities apply to the affected feature, not necessarily to every possible limited pilot.

## Sources and coverage

Playbooks under `/Users/dharmaofficial/Library/CloudStorage/OneDrive-Personal/MeritIQRa-One/`:

| Source | Coverage in this register |
|---|---|
| MERITIQRA_ONE_CODEX_WORK_PLAYBOOK.md | Local setup, repositories, backend/frontend verification, CI/CD |
| MERITIQRA_ONE_COMPLETE_FEE_MANAGEMENT_PLAYBOOK.md | Billing, accounts, payments, documents, ledger, reconciliation |
| MERITIQRA_ONE_LIVE_GPS_TRACKING_PLAYBOOK.md | Browser pilot, parent/driver/operator workflows, ETA, devices |
| MERITIQRA_ONE_REUSABLE_NOTIFICATIONS_PLAYBOOK.md | Shared messaging, reminders, delivery and provider onboarding |
| MERITIQRA_ONE_LIVE_RECORDED_CLASSROOM_PLAYBOOK.md | Found in supplied folder; completion not established in this release |
| MERITIQRA_ONE_CURRICULUM_SYLLABUS_TRACKING_PLAYBOOK.md | Found in supplied folder; completion not established in this release |

Additional sources:

- **WORLD-CLASS UI/UX TRANSFORMATION PLAYBOOK**, supplied directly in the chat.
- Master enterprise architecture/playbook attachments: `/Users/dharmaofficial/.codex/attachments/9ce18460-7c3f-4700-b711-64a231fbf7f1/Pasted text.txt` and `/Users/dharmaofficial/.codex/attachments/f9555d5b-903f-4d0a-b9f0-866d5bce55ee/Pasted text.txt`. Overlapping requirements are consolidated rather than counted twice.
- Chat requirements for academic exams/PTM PDFs, attendance/imports/biometrics, school autonomy, program entitlements, Vaidya onboarding, realistic isolated demo data, and Harness/GCP release.
- Backend evidence: `docs/INTEGRATION_CONFIGURATION_DEMO.md`, `TRANSPORT_COMMUNICATIONS_RELEASE.md`, `FEE_MANAGEMENT_IMPLEMENTATION.md`, `CORE_EXAM_INTEGRATION.md`, `ATTENDANCE_REGISTERS.md`, `IMPLEMENTATION_PROGRESS.md`, `RELEASE_AND_GCP.md` in `/private/tmp/meritiqra-one-backend-checkout`.
- Frontend evidence: `docs/UI_UX_IMPLEMENTATION_PROGRESS.md`, `COMPLETE_UI_UX_COVERAGE_PLAN.md`, `ACADEMIC_RESULTS_PTM.md` in `/private/tmp/meritiqra-one-frontend-push`.

This is a consolidated requirement-level review, not a fresh line-by-line source audit or exhaustive acceptance run. VERIFY items intentionally preserve that distinction.

## Verified baseline — do not list these as still unbuilt

Latest configuration/demo release:

- Backend commit `70d957f`; frontend commit `deb0435`; both pushed to `develop`.
- Backend Cloud Build `746d38fe-7844-4353-bc1d-ff6356cb2409`: SUCCESS; revision `meritiqra-one-api-00013-xdh`.
- Frontend Cloud Build `2066b2b4-8e9f-4eab-bed1-d25a99b65da9`: SUCCESS; revision `meritiqra-one-portal-00008-tmm`.
- API health UP; platform and Westbridge school login plus authenticated `/api/v1/auth/me` verified.
- Isolated PostgreSQL suite: 60 tests passed, zero failures/errors/skips. Frontend checks and production build passed. This is not 60 production/browser/device tests; cloud builds skip database-gated integration tests.
- Tenant-owned, versioned configuration for email, WhatsApp, reminders and tracking; secret-reference fields; explicit DEMO versus LIVE_REQUESTED; operator-reported acceptance records.
- Westbridge presets initialized; channel, reminder and journey scenarios saved and verified. No external messages or real GPS readings generated.
- Reminder dry run examined 2,501 invoices: 625 settled suppressed, 1,876 outside the configured schedule, zero invalid records and zero currently eligible fees. Twelve unpublished exam candidates excluded. These are a point-in-time result, not fixed dashboard metrics.
- Public journey playback inspected. Physical-device/load checklist remains NOT RUN.
- Earlier release supplies browser tracking foundation, tenant/guardian/driver controls, in-app announcements and bounded Cloud Run Job/Scheduler processing. Configuration does not replace those live-workflow activation requirements.

Public portal: https://meritiqra-one-portal-e27n2q2rxa-el.a.run.app/

## 1. Shared notifications and reminders

Current boundary: in-app foundation and configuration/demo are implemented; real email/WhatsApp dispatch is disabled.

- [ ] **NOT-01 · P0 · PENDING/DEPENDENCY:** Implement and verify the tenant-authenticated Core email bridge; establish the actual Core sender contract and mailbox ownership/readiness. Resolve older SES references versus the later Gmail audit before choosing the runtime route.
- [ ] **NOT-02 · P0 · PENDING/DEPENDENCY:** Official WhatsApp provider adapter, school business/phone binding, approved templates and language versions, provider onboarding and signed callback verification.
- [ ] **NOT-03 · P0 · PENDING:** Verified contact endpoints and opt-in evidence; recipient relationship checks for each entity; tenant-owned sender isolation, revocation and credential rotation. A secret resource name alone must never grant access.
- [ ] **NOT-04 · P0 · PENDING:** External attempt leases, durable retries, timeout/unknown-outcome reconciliation, callback deduplication and ordering; distinguish accepted, delivered, read, failed and unknown.
- [ ] **NOT-05 · P1 · PENDING:** Live fee/exam/attendance/transport event producers and authorised audience resolvers; stable business IDs, event versions and source revalidation immediately before sending.
- [ ] **NOT-06 · P1 · PENDING:** Automated fee/exam reminder worker: exact schedules, eligible student resolution, payment/concession/hold/dispute checks, outdated-reminder invalidation and race handling. Current reminder settings and dry run do not dispatch.
- [ ] **NOT-07 · P1 · PENDING:** Quiet hours, timezone scheduling, frequency caps, suppression, expiry, budgets and explicit fallback policy enforced during real delivery.
- [ ] **NOT-08 · P1 · PENDING:** Versioned templates, preview/approval, branding, Telugu rendering and private document links; invoice/receipt emails and reusable SMS adapter/sender prerequisites.
- [ ] **NOT-09 · P1 · PENDING:** Automation builder, delivery exports, provider health, queue fairness, failure/retry support console and operational alerts.
- [ ] **NOT-10 · P0 · DEPENDENCY:** Controlled provider sandbox/allowlisted-contact acceptance: actual email and WhatsApp delivery, revoked permission, duplicate callback, suppression, retry and failure recovery. Never use a simulated acceptance as evidence.

## 2. Live GPS and transport

Current boundary: browser pilot uses authenticated PostgreSQL snapshots polled every 10 seconds; live ETA is unavailable. Demo ETA/geofence output is scripted.

- [ ] **GPS-01 · P0 · DEPENDENCY:** Configure the test institution's vehicle, versioned route/stops, driver, student/guardian assignment and explicit browser-pilot activation. Conduct a real driver Start/End test; opening a page must not start capture.
- [ ] **GPS-02 · P1 · PENDING:** Actual route-based ETA provider with quality/confidence, stale suppression, timeout handling, quotas and cost controls.
- [ ] **GPS-03 · P1 · PENDING:** Real geofence hysteresis, consecutive-fix/dwell rules, stop visits and deduplicated approach events. Configuration fields and playback are not the engine.
- [ ] **GPS-04 · P1 · PENDING:** Parent start/end/approach/delay notifications through the shared engine, scoped to current assignments/preferences.
- [ ] **GPS-05 · P1 · PENDING:** Native Android foreground-location implementation and device permission lifecycle; vendor-specific authenticated hardware adapters, device revocation and audited authoritative-source handover.
- [ ] **GPS-06 · P1 · PENDING/DECISION:** Complete the proposed Firestore token exchange, rules, entitlement revocation, ordered outbox publication and terminal-state protection, or formally accept the PostgreSQL polling alternative after scale testing. Do not add a second store without this decision.
- [ ] **GPS-07 · P1 · PENDING:** Full CSV/Excel route/assignment preview-and-commit import; capacity/coordinate validation; complete route-version and campus-grant administration UI.
- [ ] **GPS-08 · P1 · PENDING:** Attendant boarding/alighting events and corrections; never infer student attendance from bus position.
- [ ] **GPS-09 · P1 · PENDING:** Authorised history playback/export, punctuality/availability/incident reports, stop timeline and complete operator diagnostics.
- [ ] **GPS-10 · P0 · DEPENDENCY:** Physical Android/iOS testing: visible tracking, poor accuracy, permission revocation, lock/background interruption, offline replay, End while offline, logout and guardian revocation. Record actual device/browser versions.
- [ ] **GPS-11 · P0 · PENDING:** Fleet/load and recovery tests (playbook target includes 100 vehicles/2,000 viewers), API/database cost/latency, stale detection and job recovery. 2,500 seeded students do not prove capacity.
- [ ] **GPS-12 · P1 · VERIFY:** Full 360px-to-desktop accessibility, text alternatives, localisation, retention/backup policy and production map-tile licensing/capacity readiness.

## 3. Complete fee management and payments

Current boundary: cash/evidence approval, additive financial snapshots/postings, TEST/LIVE account versions and One-owned Razorpay intent/signature/capture contracts exist. This is not a complete statutory ledger or verified provider payment lifecycle.

- [ ] **FEE-01 · P0 · PENDING:** Normalised legal entities, billing accounts, parties/payers and collection-account ownership; per-campus finance permissions and controlled account/bank changes.
- [ ] **FEE-02 · P0 · DEPENDENCY:** Provider onboarding, activation/KYC and verified beneficiary-bank ownership for each real school; do not reuse the Core merchant for unrelated organisations.
- [ ] **FEE-03 · P0 · DEPENDENCY:** Genuine Razorpay TEST credentials and sandbox checkout/capture/callback testing. Existing secret labelled test contains a LIVE key. Read-only LIVE authentication passed; no live charge/refund or sandbox payment is proven.
- [ ] **FEE-04 · P0 · PENDING/DEPENDENCY:** Register and validate One's account-bound webhook without replacing Core's; scheduled inbox replay and UNKNOWN-intent reconciliation; provider outage and lost-callback recovery.
- [ ] **FEE-05 · P1 · PENDING:** Reusable charge definitions, versioned fee plans/agreements, installment revisions, billing rules and legacy-client invoice issue idempotency.
- [ ] **FEE-06 · P1 · PENDING:** Concession/scholarship negotiation and approval limits; credit/debit notes, adjustments after payment and withdrawal policies with immutable evidence.
- [ ] **FEE-07 · P1 · PENDING:** Complete parent self-service checkout/statements and cashier workflow; multi-invoice allocation, partial/split tender and independent successful tender legs.
- [ ] **FEE-08 · P0 · PENDING:** Advance/deposit liabilities and excess captured-credit allocation; concurrency conservation for simultaneous cash/online/discount changes. CAPTURED_REVIEW is a hold, not completed excess-credit accounting.
- [ ] **FEE-09 · P0 · PENDING:** Refund reservations, approval, provider timeout/reconciliation, reversals, cheque bounce, disputes/chargebacks and duplicate-refund protection.
- [ ] **FEE-10 · P1 · PENDING:** Cash drawers/shifts, custody handover, closure, deposits and bank evidence; external POS/cheque/bank verification completion.
- [ ] **FEE-11 · P0 · PENDING:** Provider–ledger–bank reconciliation, settlement fees/taxes/holds, bank imports, duplicate fingerprints and owned exception queues. Parent credit must remain gross of gateway fees.
- [ ] **FEE-12 · P1 · PENDING:** Private server-generated versioned invoice/receipt/statement PDFs, secure storage/downloads, immutable numbering and reprint/email retry without new financial records.
- [ ] **FEE-13 · P1 · PENDING:** Shared notifications for issue/confirmation/receipt/refund/reminders, private links and suppression after current balance changes. Depends on NOT items.
- [ ] **FEE-14 · P0 · PENDING:** Historical opening-balance migration, signed control totals, ledger cutover ownership and replay/repair of financial projections. Current journal covers post-upgrade movements only.
- [ ] **FEE-15 · P1 · PENDING:** Accounting exports, aging/daybook/settlement reports, fiscal close, jurisdictional tax/rounding policies and configurable currency scales beyond legacy INR.
- [ ] **FEE-16 · P0 · PENDING:** Full playbook acceptance: ₹10,000 invoice, ₹1,000 approved reduction, ₹3,000 cash plus ₹4,000 sandbox online, ₹2,000 balance everywhere, documents, settlement/deposit, approved refund and race tests; repeat with a second tenant.
- [ ] **FEE-17 · P1 · VERIFY/DECISION:** Document continued ported-contract ownership versus a future Core shared runtime payment API. A ported adapter is not a deployed shared Core service.

## 4. Core examinations, academic results and PTM cards

- [ ] **EXAM-01 · P0 · DEPENDENCY:** Configure approved Core API URL, exact OIDC audience/trusted identity, school/program licenses, Core template grants and institution enablement; verify live bridge template → assignment → released-result flow.
- [ ] **EXAM-02 · P1 · DEPENDENCY:** Extend Core's tenant-authenticated contracts for question bank, program/PDF workspaces, exam building and workspace/document operations. Current bridge only covers published templates, assignments and released results.
- [ ] **EXAM-03 · P1 · DEPENDENCY:** Secure student identity/session handoff; online start/answer/submit, attempt review and monitoring entirely within the ERP experience.
- [ ] **EXAM-04 · P1 · DEPENDENCY:** Offline/hybrid paper sets, eligible rosters, student-linked OMR/QR generation, mobile scanning, duplicate/quality checks, ambiguous-mark review, scoring and moderation.
- [ ] **EXAM-05 · P1 · PENDING/VERIFY:** Complete scheduled/active/completed/archived lifecycle, invigilator/seating/accommodation flows and class/teacher/program permissions at every Core endpoint.
- [ ] **EXAM-06 · P1 · PENDING:** Combine authorised Core online/offline results with regular academic results in academic-year PTM reporting; current PDF documentation marks separately retrieved Core results unavailable.
- [ ] **EXAM-07 · P1 · PENDING:** PTM multilingual fonts, documented board/institution grading and weighting, promotion rules where required, activities/other indicators with real authorised data. Do not call the existing unweighted PTM aid a universal official transcript.
- [ ] **EXAM-08 · P1 · PENDING:** Preserve mark-entry drafts across internal module navigation; existing partial-save recovery does not establish navigation persistence.
- [ ] **EXAM-09 · P0 · VERIFY:** Current real-database concurrent mark entry, bulk import errors, teacher restriction, publication locking and deployed PDF download across all exam types/year boundaries. Older PDF evidence predates later deployment fixes.
- [ ] **EXAM-10 · P2 · VERIFY:** Topic/skill trends, class comparisons, rankings and educator-reviewed AI explanations linked to supporting metrics; no unsupported AI insight or competitive result should appear as official academic evidence.

## 5. Attendance and biometrics

- [ ] **ATT-01 · P1 · PENDING:** School calendars/holidays, local attendance codes, lateness policy, session-to-day aggregation and institution-approved attendance percentage rules.
- [ ] **ATT-02 · P1 · PENDING:** Register finalisation/approval, correction policy and appropriate guardian absence notifications.
- [ ] **ATT-03 · P1 · DEPENDENCY:** Real ZKTeco/eSSL/other vendor adapters or on-premise gateway; person-ID mapping, secure credential/session renewal, offline queue and health/reconciliation UI. Vendor-neutral event ingestion does not imply universal device compatibility.
- [ ] **ATT-04 · P0 · PENDING/DEPENDENCY:** Device credential lifecycle/revocation and physical-device validation for replay, clock/timezone, wrong-school mapping and manual override protection. No raw biometric templates should be introduced.
- [ ] **ATT-05 · P1 · VERIFY:** Deployed teacher manual entry and Excel/CSV preview/commit across many classes/sections; holiday/session totals and PTM/dashboard consistency. Current register uniqueness/concurrency and device replay already have isolated tests.

## 6. Live and recorded classrooms — completion unverified

Source found in the playbook folder. Treat these as VERIFY/DEPENDENCY until source and deployed evidence establish their status; do not assume all are absent.

- [ ] **CLASS-01 · P1 · VERIFY:** Audit and reuse Core's live-class/media contracts; define tenant/course/program enrolment, room identity and provider ownership.
- [ ] **CLASS-02 · P1 · VERIFY:** Secure scheduled room lifecycle, prejoin readiness, student/teacher/mentor roles and scoped join tokens with expiry/revocation.
- [ ] **CLASS-03 · P1 · VERIFY:** Teacher studio, camera/mic/screen share, roster/moderation, reconnect and readable device/network errors.
- [ ] **CLASS-04 · P1 · VERIFY:** Chat/doubts, moderation and abuse controls, attendance evidence and post-class resources.
- [ ] **CLASS-05 · P1 · VERIFY:** Live quizzes, fair timing/leaderboards, Core exams/results and in-class assessment permissions.
- [ ] **CLASS-06 · P0 · VERIFY:** Recording consent, recording lifecycle, private storage/access, retention/deletion and authorised replay/download.
- [ ] **CLASS-07 · P1 · VERIFY:** Recorded-class chapters/resources/progress, organisation scheduling and reusable notification integration.
- [ ] **CLASS-08 · P0 · DEPENDENCY:** Actual provider/media, cross-tenant token, device, reconnect, recording and concurrent-class cost/load acceptance.

## 7. Curriculum inventory and syllabus coverage — completion unverified

Source found in the playbook folder; not covered by the latest configuration release evidence.

- [ ] **CUR-01 · P1 · VERIFY:** Versioned board/qualification/year/source identity, curriculum tree/outcomes and approved school adoption, separate from competitive taxonomy.
- [ ] **CUR-02 · P1 · VERIFY:** Independent section delivery plans, valid teacher/co-teacher/substitute assignments and daily completion/correction audit.
- [ ] **CUR-03 · P1 · VERIFY:** PDF/DOCX/XLSX import lifecycle, Gemini extraction adapter, evidence citations, chunk recovery, review gates and explicit publication.
- [ ] **CUR-04 · P0 · VERIFY:** Malicious-file/prompt-injection handling, bounded uploads, private storage, provider privacy and no automatic publication of AI output.
- [ ] **CUR-05 · P1 · VERIFY:** Weighted coverage with taught/verified/revised/assessed/mastery separated; optional/excluded outcomes, zero denominators and reproducible aggregates.
- [ ] **CUR-06 · P1 · VERIFY:** Timetable/week planning, overdue targets, management dashboards, subject print/export and private pagination-safe PDFs.
- [ ] **CUR-07 · P1 · VERIFY:** Explicit question-bank mappings and exam scope snapshots; question shortages and section intersection handled without same-name auto-mapping.
- [ ] **CUR-08 · P1 · VERIFY:** Approved version migration, reviewed split/merge mapping, new-year progress reset and preserved historic coverage.
- [ ] **CUR-09 · P1 · VERIFY:** Idempotent isolated demo curriculum seed manifest/checksums, representative board profiles, preserved teacher edits and readiness report. No seed should call Gemini or external messaging implicitly.
- [ ] **CUR-10 · P0 · VERIFY:** Playbook acceptance, including one shared syllabus with independent section progress, import failure/retry, permission boundaries and projection rebuild.

## 8. Platform, school self-management and enterprise operations

Foundation onboarding, scoped logins and feature controls exist; specialist completion below needs evidence.

- [ ] **ERP-01 · P0 · VERIFY:** Privileged MFA, recovery, session/device management, access reviews, rate limits and time-limited audited support access.
- [ ] **ERP-02 · P1 · VERIFY:** Platform subscription/billing automation, plan/usage limits, renewal controls and complete service/integration monitoring.
- [ ] **ERP-03 · P1 · VERIFY:** School branding/domain verification, institution settings, comprehensive actor-based audit UI and reusable approval/task inbox.
- [ ] **ERP-04 · P1 · VERIFY:** Admissions through enrollment/transfer/withdrawal, document checklist, certificates/transcripts, guardian changes and historical enrollment.
- [ ] **ERP-05 · P1 · DEPENDENCY:** Real Student Registry contract, field ownership, approved roster import, match/conflict handling and school-authorised data. Do not assume prior permission proves a working production registry endpoint.
- [ ] **ERP-06 · P1 · VERIFY:** Generic workflow engine with approvals, delegation/escalation, attachments, rejection/resubmission and idempotency for admissions, fees, refunds, purchase, leave, payroll and exams.
- [ ] **ERP-07 · P1 · VERIFY:** Academic calendars, lesson plans, timetable conflicts/substitutions, assignment submission/feedback and college course/department structures beyond generic CRUD.
- [ ] **ERP-08 · P2 · VERIFY:** Full HR/payroll: contracts, documents, leave approvals, payroll calculations, payslips and statutory/provider dependencies.
- [ ] **ERP-09 · P2 · VERIFY:** Procurement/vendor invoices/POs, accounts payable, budgets, cost centres and financial statements beyond fee postings.
- [ ] **ERP-10 · P2 · VERIFY:** Hostel occupancy/check-in/out, library circulation/reservations/fines, stock movement/purchase/issue/return, facilities maintenance and helpdesk SLAs.
- [ ] **ERP-11 · P2 · VERIFY:** Sports/events/extracurricular workflows, compliance/governance and evidence-grounded AI assistant permissions.
- [ ] **ERP-12 · P0 · DEPENDENCY:** Vaidya Academy live onboarding: authorised super-admin, clean tenant, school master data and approved roster; role-by-role user acceptance. Never copy Westbridge students or credentials into it.

## 9. UI/UX transformation and accessibility

- [ ] **UX-01 · P1 · VERIFY:** Complete route/component/API inventory and screen-by-screen functionality matrix; one central token/component system across every module.
- [ ] **UX-02 · P1 · VERIFY:** Shared shell, breadcrumbs, campus/year context, search, user/help/theme controls and all navigation staying in the portal where required. Retest Feature & role access and Core handoffs.
- [ ] **UX-03 · P1 · VERIFY:** Enterprise tables: true server pagination/filter/sort where needed, bulk actions, column visibility, saved views, exports and responsive presentation at 2,000–3,000 students per institution.
- [ ] **UX-04 · P1 · VERIFY:** Student profile's complete academics/attendance/exams/fees/documents/guardians/activity tabs and guided imports with duplicates, preview, partial-success and downloadable error reports.
- [ ] **UX-05 · P1 · VERIFY:** Executive trends and action queues with consistent period/campus filters, meaningful comparisons and real data; no invented production metrics.
- [ ] **UX-06 · P0 · PENDING:** Full WCAG 2.2 AA audit: keyboard, focus/dialog management, screen readers, contrast, zoom, touch targets, reduced motion and error announcements. A responsive screenshot is not this audit.
- [ ] **UX-07 · P1 · PENDING:** Representative mobile/tablet/desktop and cross-browser regression across every role and module, including errors/loading/empty/offline states.
- [ ] **UX-08 · P1 · VERIFY:** Performance budgets for route/bundle loading, large tables, charts, API patterns and layout stability; comprehensive visual regression coverage.
- [ ] **UX-09 · P1 · VERIFY:** Remove obsolete branding and placeholder wording from current product/docs. Use realistic names while preserving clear demo/simulation disclosures; no implication of affiliation with real schools.

## 10. Local setup, Harness, GCP and operational readiness

- [ ] **OPS-01 · P1 · VERIFY:** Fresh-clone reproducibility: Java 21/wrapper, locked frontend dependencies, local PostgreSQL 5433/backend 8081/UI 3001, ignored secrets, migrations and repeatable seed. Preserve unrelated JobGrab/port 3000.
- [ ] **OPS-02 · P0 · VERIFY:** Both Harness release pipelines succeed from current `develop`, with durable delegate health, minimal service identity permissions, status polling and rollback. Direct Cloud Build success does not prove Harness success.
- [ ] **OPS-03 · P1 · VERIFY:** Current GitHub Actions/automatic triggers, immutable release artifact provenance, environment promotion and post-deploy authenticated smoke tests.
- [ ] **OPS-04 · P0 · PENDING/VERIFY:** Backups and actual restore rehearsal, migration rehearsal, rollback boundaries, recovery objectives and tenant-safe restore/export procedures.
- [ ] **OPS-05 · P0 · VERIFY:** Comprehensive adversarial tenant/campus isolation across APIs, bulk imports/exports, documents, queues, caches, background jobs and Core/media/provider bindings.
- [ ] **OPS-06 · P0 · VERIFY:** Operational dashboards/alerts for API/DB health, queue lag, failed webhooks, job failures, provider errors, quotas, cost and on-call ownership/runbooks.
- [ ] **OPS-07 · P0 · PENDING:** Capacity and recovery tests for attendance peaks, fee collection, result publishing, import/report generation, OMR bursts and concurrent parents/teachers. Establish measured latency/error/cost targets.
- [ ] **OPS-08 · P1 · PENDING:** Complete OpenAPI/contract coverage and consistent pagination/errors; architecture/domain/tenancy/accounting/design-system/API/runbook/test-evidence documents requested by the master playbook.
- [ ] **OPS-09 · P1 · VERIFY:** Deployment-safe configuration schemas, secret rotation, test/live separation, private document storage and retention/lifecycle controls across modules.
- [ ] **OPS-10 · P1 · PENDING:** Reconcile stale documentation: old claims that every new tenant receives demo records, old unverified-local-start statements, old provider assumptions and superseded release versions. Latest evidence wins; retain historical context explicitly.

## 11. Westbridge demo completion checklist

- [x] Separate existing synthetic organisation with realistic school records.
- [x] Four versioned integration configurations in DEMO mode.
- [x] Saved channel/reminder/journey scenarios with explicit simulation labels.
- [x] Public school/platform authentication and journey display verified.
- [ ] **DEMO-01 · P1 · PENDING:** Add controlled, seed-owned due/overdue/held/paid and published-exam scenario fixtures for an informative repeatable reminder demonstration. Current dry run legitimately has no eligible reminders; do not change existing financial records merely to populate a preview.
- [ ] **DEMO-02 · P1 · PENDING:** Guided role-by-role demonstration script with teacher, guardian, driver/operator and finance users; complete realistic relationships without exposing credentials.
- [ ] **DEMO-03 · P0 · PENDING:** Real provider test lane and actual device lane, separate from the simulated lane and gated by verified setup.
- [ ] **DEMO-04 · P1 · VERIFY:** Repeatable seed manifest, drift-safe upgrades, tenant-only reset policy and all-module readiness report. Empty real-school workspaces remain valid until onboarding.

## Recommended implementation order

1. Verify real-school isolation, privileged access, backups and current Harness status; decide the limited live onboarding scope.
2. Complete provider bindings and Core contracts; obtain genuine sandbox/payment and authorised messaging/device test prerequisites.
3. Finish notification dispatch reliability and financial safety/reconciliation before enabling those live flows.
4. Complete Core exam delivery/OMR and academic/PTM result integration; validate teacher/guardian workflows.
5. Run actual browser GPS pilot, then implement ETA/geofence and native/hardware adapters.
6. Audit and deliver classroom/curriculum work, remaining enterprise modules and consistent UI workflows.
7. Finish accessibility, physical-device, load/recovery and real-school acceptance with recorded evidence.

## Closing an item

Record item ID, implementation commit, migration/configuration, applicable tenant/provider prerequisites, test command/report, deployed revision and end-to-end evidence. Mark complete only after its acceptance passes. Track intentional architecture deviations explicitly. Do not use an overall completion percentage without a stable, weighted requirement inventory.

## 3 November 2026 — online results and classroom preparation

- Online-only Core sync: new result inbox, explicit identity review, idempotent attempt keys, original subject scores and release status. Deployment/import evidence is in `CORE_ONLINE_RESULTS_SYNC.md`; do not treat pending near-name matches as verified student results.
- Classroom playbook phase-0 reuse audit and local preparation UI implemented. See `CLASSROOM_READINESS_IMPLEMENTATION.md` for source paths and device-lifecycle tests.
- Still pending for classroom: tenant-scoped Core join bridge, teacher/learner/mentor rooms, provider token and publishing enforcement, durable chat/doubts, whiteboard integration, private recording lifecycle/playback, quizzes/leaderboards, parent journeys, live device/media verification, capacity and accessibility testing. Device preparation is not a working live-class feature.
- Combined academic + Core annual PTM report and student/parent Core result access remain pending; this release provides an administrator Core online performance PDF separately.

Result sync release verified: 1,134 online attempts migrated, 354 linked attempts and 780 identity-review attempts; 15-minute scheduled job active and scheduler-triggered execution passed. Approved year dates configured and live Core student PDF/CSV verified. Offline results remain intentionally excluded. See CORE_ONLINE_RESULTS_SYNC.md.
