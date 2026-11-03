# Isolated institution deployment — 2026-11-03

VaidyaEdu Group uses workspace `vaidyaedu-group` on the existing public portal, backed by a dedicated Cloud Run service (`meritiqra-one-vaidyaedu-api`) and PostgreSQL database (`meritiqra_vaidyaedu`). The SQL instance is shared infrastructure; the database role has no superuser, create-role or create-database privilege. Instance-scoped IAM restricts its runtime to the ERP SQL instance. Its Secret Manager binding grants only its own database password.

The frontend's `TENANT_BACKEND_ROUTES` configuration is a server-owned allowlist. The workspace submitted at login chooses a deployment and a secure HttpOnly routing cookie persists that choice. The routing cookie confers no authorization: every backend validates sessions against its own database. Unknown workspace codes use the normal backend and cannot supply an arbitrary upstream URL. Future frontend Cloud Builds retain this routing configuration.

Google-only school login remains enforced. The user approved Google-only onboarding, so no temporary ERP passwords were generated or displayed. Public challenge routing was verified against the dedicated database; anonymous student reads, password login and invalid Google tokens were rejected. School-owner Google sign-in still requires the actual owner.

The authorized real import reconciled all 153 records, including admission identifiers, names, numbers and sections. The original NUMBER column is stored as contactPhone, with guardian details left unspecified. No raw records or credentials are checked into either repository. Four NEET 2027 long-term sections and academic year 2026–27 are configured. Teacher records remain empty for manual setup.

Core program 11/version 25 supplies three curriculum drafts with original 2026 source provenance. They are not a verified 2027 curriculum and must be reviewed before publication. No teaching evidence or assessment progress was invented.

The central platform registry entry remains ONBOARDING pending owner acceptance and academic setup. Cross-database propagation of central feature controls and Core examination-service entitlements remain follow-up work. Do not treat a central feature setting as applied to the isolated backend until propagation is implemented and verified.

## Release evidence

- Backend source commit: e45e1b7; frontend source commit: 48a13b3.
- Tested backend artifact SHA-256: ee90c37a5a4b0bbd34b3f50122ae7da5a1d9bbd4903995d5100e1c0c9887097a.
- Release image tag: vaidya-onboarding-20261103.
- Main API revision: meritiqra-one-api-00015-x4f.
- Isolated API revision: meritiqra-one-vaidyaedu-api-00001-655.
- Portal revision with routing: meritiqra-one-portal-00011-rnk.
- 26 successful Flyway migrations in the isolated database; cross-database table reads denied.
- Backend tests and frontend tests/production build passed; tenant-routing regression test passed.

## Operational follow-up

Complete school-owner sign-in, teacher provisioning, 2027 source review, centralized isolated-tenant administration, Core exam entitlement/service integration and a restore-tested backup/recovery procedure before declaring full institution rollout complete.
