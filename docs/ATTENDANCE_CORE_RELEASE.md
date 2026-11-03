# Attendance reporting and isolated Core access — 2026-11-03

## Implemented
- Attendance starts PRESENT only for missing entries in a new, unsaved register. Existing saved marks and legacy conflicts remain unchanged. Explicit Save persists one revisioned class/date/session register.
- Compact register and report tables use the existing workspace controls. Student search, academic year, class, date range, session and status filters; detailed, student and class summary reports; PDF and Excel exports of all filtered rows.
- Reports read saved records only. No missing-day inference. Attendance rate uses (present + late)/(present + late + absent); excused and unmarked are excluded. All-session reports count entries, not days. Teachers are restricted to assigned classes by the reporting API.
- Platform campus and Core licence operations forward to a deployment-allowlisted isolated backend using a Google-signed service ID token. Receiving service checks signature, expiry, issuer, audience, verified email, exact service account and tenant.
- VaidyaEdu Core connection uses ID-token-only delegation to the existing Core bridge service identity. No private service-account key is stored. NEET program 11 is licensed/enabled; eight OPEN published templates were granted with Core audit events. Other tenants' students, attempts and results were not copied.

## Runtime configuration
Main API: ISOLATED_CAMPUS_ROUTES maps exact tenant IDs to HTTPS backend origins. Isolated API: CAMPUS_CONTROL_SERVICE_ACCOUNT, CAMPUS_CONTROL_AUDIENCE, CAMPUS_CONTROL_TENANT. Existing environment values are preserved by deployment.
Core: MERITIQRA_CORE_API_URL, MERITIQRA_CORE_IDENTITY_AUDIENCE, MERITIQRA_CORE_SERVICE_ACCOUNT. Runtime requires roles/iam.serviceAccountOpenIdTokenCreator on that exact Core service account when identities differ.

## Validation
88 backend tests passed, zero skipped. Frontend regression tests, report filtering tests and production build passed. Download tests generated a real PDF and reopened an XLSX, preserving leading-zero admission identifiers and absent counts. PDF rendered and visually inspected.

## Limits / remaining work
Core assignment requires each participating student to have exactly one linked Google student login. No real VaidyaEdu exam was assigned or attendance fabricated during verification. General institution lifecycle/features are not federated by this narrowly scoped campus/licensing bridge. Full Core workspace/question-bank authoring and offline scan flows are not proven by template-list verification. Global page-by-page visual modernization is outside this attendance-focused release. Native/biometric hardware validation remains separate.

## Live verification
Main API revision 00017-bc4, VaidyaEdu API 00003-bp7 and portal 00013-qjj are deployed. Platform campus selector now loads VaidyaEdu NEET Academy and its program 11 licence through the authenticated bridge. School-side real Google login loaded eight published Core templates and nine class sections. Unauthenticated internal campus access returns 401.

Attendance report loaded the existing B-1 register: 48 entries, 47 present, 1 absent, 97.9%. Absence and section search narrowed to one saved entry. Real browser PDF/XLSX downloads succeeded; exported Excel was reopened and values reconciled. Unsaved G-2 register displayed 53 PRESENT and revision 0; no Save was performed. All 437 students remain available.

## Separate report workspace
Attendance Reports now has its own Academics sidebar page, separate from Attendance Register. It inherits attendance feature access and reporting roles, excludes biometric agents, and retains backend class/tenant checks. Compact responsive filters have visible labels, decorative icons, keyboard focus indicators and consistent PDF/Excel buttons. Frontend regression/export tests and production build passed before release `attendance-reports-page-20261103`.

## Reports Centre and monitoring — 3 November 2026

Added a role-aware Reports & Insights navigation group. Reports Centre links attendance downloads, attendance monitoring, existing academic performance reports and finance receipts. Monitoring is a separate view from register entry and report downloads, with year, section, date and session filters, present/absent/late counts, unique recorded students, attendance-rate ring, latest 14 recorded dates and section comparisons with drill-down. Counts are saved student-session entries; missing days are never inferred. Sections without saved records do not receive a fabricated rate.

Local verification: complete frontend test command, including PDF/XLSX round-trip and new dashboard rate, section selection and no-data checks; production build and TypeScript checks. Cloud deployment and browser verification are recorded after release. Existing exam/finance screens are linked, not replaced with new reporting engines. Responsive CSS is included; exhaustive device/accessibility testing remains pending.

Live verification: Cloud Build `1189ce10-bc1c-445d-a5e2-9b552d3fc1ed` succeeded; portal revision `meritiqra-one-portal-00015-9dc`. Google session refreshed and Reports Centre cards verified in Chrome. Attendance Dashboard loaded VaidyaEdu 2026–27 saved records: 47 present, 1 absent, 0 late, 48 unique students, 97.9% rate. Section B-1 drill-down selected the correct filter. No attendance data was created during verification. Separate compact report page returned the same totals. Full multi-device QA remains pending.
