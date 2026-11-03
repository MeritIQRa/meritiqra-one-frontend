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
