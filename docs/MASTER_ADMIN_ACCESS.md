# Master administrator school access

The authorized master account is deployment-configured using both `MASTER_ADMIN_EMAIL` and `MASTER_ADMIN_GOOGLE_SUBJECT`. The subject must come from a previously verified Google login. Do not grant this access from an email supplied by a browser or from a user-editable school setting.

After Google signature, issuer, audience, expiry, verified-email and browser-nonce validation, the matching pinned identity receives a platform-managed membership in the selected active school. Schools receive SCHOOL_SUPER_ADMIN, colleges receive COLLEGE_SUPER_ADMIN. Existing school administrators remain independent. Each membership, session and data request stays within that institution's database and tenant.

Master sessions use MASTER_GOOGLE and login is audited as MASTER_GOOGLE_SIGN_IN. Each authenticated request rechecks the configured email/subject for managed accounts; removing/changing the configuration invalidates their existing sessions. School account-management endpoints cannot disable or reassign these memberships. Ordinary Google users still need existing school membership.

The platform directory's Open school workspace action ends the current session and opens the school sign-in flow. The user signs in with the same Google identity. The school shell clearly indicates master access and provides Return to platform. No generic cross-tenant session token or database access is issued.

Configure the same approved pinned identity on every isolated ERP backend when onboarding an additional dedicated database. The existing shared and VaidyaEdu services are the current rollout targets. Missing configuration fails closed. Preserve these runtime environment variables across releases.

Validation: 85 backend tests passed, including database-backed tests for identity pinning, two independent school/college memberships, session scoping and school-admin mutation denial. Frontend regression tests and production build passed. Live browser verification is recorded separately after rollout.

## Live verification — 2026-11-03

Deployed tested image `master-admin-20261103` to main API revision `meritiqra-one-api-00016-9qd` and isolated VaidyaEdu API revision `meritiqra-one-vaidyaedu-api-00002-bp8`. Frontend Cloud Build `7b61ca6e-2047-47f5-9676-49305b31629c` succeeded.

Real browser Google login with the authorized master account opened VaidyaEdu from the platform directory. The school dashboard displayed the master administrator banner, 153 students and four sections. VaidyaEdu migration 27 succeeded; the original operations school owner remains active. Unauthenticated auth/me returns 401. Other school memberships were covered by automated tests; Westbridge was not separately browser-tested in this release.
