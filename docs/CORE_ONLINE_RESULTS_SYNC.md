# Core online results and identity review

Scope: online NEET results for VaidyaEdu only. Offline results are deliberately excluded. Core remains authoritative; the sync uses a read-only Core transaction and an isolated ERP transaction. Program 11 must be licensed and enabled before each run. Source organization 1 is explicitly configured for the historical Core exams and is not inferred from the ERP workspace slug.

V28 adds an online-result inbox, identity mappings and sync-run audit. Attempts are keyed by tenant + Core session, preserving attempts and negative marks. Core publication rules control score visibility; withheld and removed attempts do not expose scores. Results with no plausible school match are not copied. Near-name results remain in the administrator review inbox and cannot produce a linked student PDF until confirmed. Exact names require uniqueness; conflicting admission numbers are reviewed. Similarity is spelling similarity, not a calibrated identity probability. Administrators must compare the identities before confirming; confirmation is audited and retained by later syncs.

The new school Reports & Insights page provides Core online results, name/admission/ERP-ID/Core-ID search, year filtering, original scores, subject breakdown, CSV and published student PDF. Academic result entry and its existing PTM card remain separate from this Core online report. Student and parent portals do not expose the unverified inbox. A reviewed mapping adds the Core IDs to the student's searchable aliases on the next successful sync.

Deployment: run backend migrations before executing `scripts/core-results/sync.py`; deploy its Dockerfile as the dedicated Cloud Run job using `deploy-job.sh`. Required runtime permissions: Cloud SQL Client and Secret Accessor only on the explicit Core connection secret and Vaidya DB password. No secret values belong in source, logs or documentation. The Core credential currently is the existing production runtime credential; read-only behavior is enforced by the worker connection. A dedicated database SELECT-only credential would further reduce privilege and remains a hardening follow-up.

Validation: six matching unit tests; backend authorization tests for anonymous/student/parent/teacher/platform and cross-tenant confirmation; existing backend suite; frontend suite/build and student-ID search test. Live deployment, job execution, rerun counts and browser evidence are recorded after completion.

Limitations: no fuzzy automatic student assignment, no offline ingestion, no combined academic-plus-Core annual PTM PDF yet, and no student/parent access to this administrator review page. Confirmed students' published Core results can be downloaded from this view. No claim is made that all 437 students have published online results.

## Live evidence — 3 November 2026

- Backend Cloud Build `66081e44-05db-4585-a17e-35fcd0b2b3b1` succeeded. Main API revision `meritiqra-one-api-00018-vlj`; Vaidya API revision `meritiqra-one-vaidyaedu-api-00004-cz4`. Vaidya Flyway V28 succeeded.
- Two successful imports yielded the same 1,134 online attempts and 535 Core accounts: 165 exact-matched accounts / 154 ERP students / 354 attempts; 370 review-required accounts / 780 attempts. Unmatched unrelated source accounts were not imported. No offline results were imported.
- Live browser verified exact and review counts. Core ID 7084 search returned two attempts, and the downloaded CSV was reopened and checked for that ID and retained admission number.
- Backend result: 92 discovered tests, 48 executed successfully and 44 skipped. Frontend command, production build, matching unit tests, identity/search and device-preflight tests passed. Skipped integration checks are not claimed as passing.
- Vaidya academic year currently has no start/end dates; year-filtered PDF live verification awaits confirmed reporting dates. The proposed production date change was blocked by automatic approval review and was not applied.
- The dedicated sync account and the two explicit secret grants are approved and created. Creating the recurring Cloud Run job/Scheduler and its caller invoker grant was separately blocked pending exact user approval. Until approved, automatic refresh is not active; the two successful imports ran through the existing authorized operator connection.
