# Curriculum & Syllabus Tracking — implementation status

Scope: MERITIQRA_ONE_CURRICULUM_SYLLABUS_TRACKING_PLAYBOOK.md only. The full ERP pending register remains separate.

## Implemented in the working tree

- Tenant-scoped version authoring, review/approval/publication, adoption and independent section evidence.
- Weighted coverage separating taught, verified, revised and assessed; mastery remains unavailable without assessment evidence.
- Private bounded PDF/DOCX/XLSX/CSV imports with complete source-anchor review before draft creation.
- Optional evidence-grounded Gemini adapter, durable extraction chunks and explicit consent. Disabled until provider configuration and data-policy approval exist; no live provider call validated.
- Reviewed migration preserving source history; assessment-scope intersection and immutable scope snapshots. Core question mappings remain required.
- Curriculum workspace, source review, section plans and management coverage table.
- Isolated local demo seed: 30 offerings, 30 published plus 30 draft versions, 360 published measurable outcomes and 90 independent deliveries.

## Remaining before playbook completion

- Complete extraction recovery and proposal-review UI; scanned-source OCR and live provider validation.
- Migration and assessment-snapshot UI; authorized Core question-bank crosswalk and question-shortage handling.
- Family/PTM views, timetable/holiday integration, richer executive aggregates and attribution.
- Expanded demo fixtures and verified replay/drift behavior.
- End-to-end browser, accessibility, responsive, PDF render/export and concurrent-workflow checks.
- Full curriculum playbook acceptance remains pending. Current implemented subset was committed, pushed and deployed on 2026-11-03; this is not full playbook completion.

No completion percentage is asserted. A successful build is not evidence that every workflow passes.

## Verification — 2026-11-03

- Latest backend compilation and frontend production build passed.
- Curriculum-focused Gradle suite: 19 tests, zero failures/errors/skips, including PostgreSQL migration, isolation, version migration and assessment-scope tests against the dedicated local validation database.
- The migration test exposed a proxied-controller dependency access error; direct dependency injection fixed it and the rerun passed.
- No live Gemini call or full curriculum browser acceptance is claimed. The implemented subset was subsequently deployed on 2026-11-03.
