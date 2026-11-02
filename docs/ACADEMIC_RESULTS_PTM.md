# Academic results and PTM cards

## Teacher workflow

Open Academic Results & Performance. In Teacher marks register choose academic year/school, class/section, examination and subject. Search by name or admission number. Enter marks, outcome, institution-defined grade and a PTM observation. Tab navigation works across native form controls.

Blank is not zero. An explicit zero is valid; Absent stores an absence outcome and is excluded from PDF score averages. Existing maximum marks are preserved when editing. Save changes for review persists only changed students. If a request fails part-way, successful writes stay saved and unsaved inputs remain. Changing register context prompts before discarding edits. Reloading the browser warns when entries are unsaved; internal module navigation does not yet preserve drafts.

Teachers cannot publish or edit published records. An examination administrator reviews and publishes the register with confirmation. Saving an administrator's revision for review unpublishes that changed record until re-approved. Grades and pass/fail are entered according to school policy, not inferred from a universal threshold.

## PTM card

Select an academic year and find the student in the PTM results panel. Download PTM performance card generates a real PDF locally from authorized workspace records. All published academic examination results for that student, school and year are used independently of the page's exam-cycle filter.

Page one shows descriptive assessment averages, subject bars, attendance, assessment comparison and relative practice priorities. Page two shows a subject-by-exam matrix with obtained/maximum marks, grades and exam delivery modes, teacher observations and signature lines. Larger years continue to additional pages instead of dropping exams. More than six subjects/exams remain in the detailed matrix; overview charts are limited and labelled.

The PDF is an institutional PTM aid, not a board-certified transcript. Assessment averages are unweighted and do not determine promotion. Attendance includes present and late among recorded entries, scoped to the year's date range; missing dates are not inferred as attended. Core's separately retrieved competitive results, activities and wellbeing indicators are explicitly marked unavailable. The exporter currently uses standard PDF fonts; comprehensive multilingual font coverage remains outstanding.

## Validation

- `npm test`: component tests for mark limits, zero/absence, review saves, teacher locks, partial-failure retention and administrator publishing; PDF generation and year/publication isolation.
- `npm run build`: Next.js production build and TypeScript checks.
- Preview generated with `node scripts/check-performance-report.cjs /absolute/path/report.pdf`; two pages rendered and inspected locally.
- Backend `./gradlew test bootJar`: API validation, publication permissions, published-edit lock, percentage computation, absent handling, duplicate rejection and existing suite.

These checks use local component fixtures and mocked repository API tests. A real database concurrency test, authenticated browser end-to-end check and production deployment are not included in this evidence.
