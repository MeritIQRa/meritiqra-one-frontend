# MeritIQRa One UI refresh — decision record and screen inventory

Updated 3 November 2026.

## Audit snapshot

- Frontend is a Next.js 15 / React 19 TypeScript client workspace with a single authenticated `/` route, module selection inside `app/page.tsx`, and an API proxy at `/api/v1/[...path]`.
- Existing iconography is `lucide-react`; styling is plain, global CSS split across `style.css`, `workspace.css`, `design-system.css`, `auth.css`, and domain files. No component framework or utility CSS is installed.
- Current project checks are script-driven under `npm test`; production compile/type validation is `npm run build`.
- Existing APIs, session handling, tenant routing, roles, domain components, forms, reports, and CRUD remain the source of application behaviour. The refresh changes presentation and the shell only.

## Design decision

Use CSS custom properties as the one semantic token source and continue the current CSS approach. `modern-ui.css` owns the refreshed token contract and application-wide component overrides. Domain styles may add layout rules, but new color/spacing decisions should consume `--mq-*` tokens. Keep the product light-first; dark theme is not declared supported. Preserve Lucide icons. Use responsive off-canvas navigation on phones and an icon rail on compact desktop/tablet. Persist the expanded/collapsed choice by organization and user in local storage. Include a skip link, landmarks, labelled compact navigation, visible focus and reduced-motion handling. Dedicated document print styles continue to own their print output.

## Route and flow inventory

All following workspaces are modules selected inside `/`; access is role/feature filtered by existing code and APIs.

| Workspace / journey | Primary page implementation | Shared surface | Current refresh status | Risk / next pass |
|---|---|---|---|---|
| Sign-in / Google identity | `auth-screen.tsx`, `google-sign-in.tsx` | Sign-in panel | Tokens applied | Verify consent/error states at phone widths |
| Command Center | `page.tsx` Dashboard | KPI cards, insight cards, shell | Tokens applied | Verify 360/390/768/wide layouts and chart alternatives |
| Organization, academic years, classes/sections | generic record workspace | Search, status filter, table, add/edit modal | Shared tokens applied | Build reusable table controls and responsive record cards |
| Students, admissions, faculty, leave | generic records + student search | Table, form modal, search | Shared tokens applied | Review directory density and record detail journeys |
| Subjects and timetable | generic records | Table and forms | Shared tokens applied | Validate high-density scheduling layouts |
| Attendance register | `attendance-register.tsx` | Register and submission states | Shared tokens applied | Keyboard/touch operation and long roster review |
| Attendance reports / dashboard | `attendance-reports.tsx` | Filters, summary, exports, charts | Shared tokens applied | Verify printable and mobile analytics layouts |
| Curriculum and syllabus | `curriculum-workspace.tsx`, `curriculum-import.tsx` | Split workspace, status and progress | Shared tokens applied | Validate large curriculum trees and responsive panels |
| Classroom preparation | `classroom-readiness.tsx` | Readiness cards and device checks | Shared tokens applied | Verify mobile device action targets |
| Exams and academic results | `exam-management.tsx`, `academic-entry.tsx` | Exam workflows, marks entry, reports | Existing exam styles retained; tokens applied | High regression risk: test autosave, filters, result release and OMR integration |
| Achievements and outcomes | `achievements-workspace.tsx` | KPI/chart/table/import | Existing module styles retained; tokens applied | Verify bulk import and visibility/consent states |
| Fees and receipts | `fee-management.tsx`, `fee-checkout.tsx` | Forms, status, receipt print | Tokens applied | High risk: payment confirmation, idempotency and print regression |
| Reports Centre and Core results | `reports-centre.tsx`, `core-online-results.tsx` | Filters, report summaries | Tokens applied | Validate large result set and export scope |
| Communications and integrations | `communication-centre.tsx`, `integration-settings.tsx` | Draft/status/form panels | Tokens applied | Never imply external delivery from UI-only state |
| Transport and live GPS | `transport-workspace.tsx`, `transport-map.tsx` | Map, queue/status cards | Tokens applied | Validate stale/fresh and permission states; retain map lifecycle |
| Library, assets, helpdesk, notices | generic records | Table/forms/status | Shared tokens applied | Verify task-specific records on narrow screens |
| Roles, features and platform admin | `role-accounts.tsx`, `feature-settings.tsx`, `platform-operations.tsx`, `platform-onboarding.tsx` | Admin forms, tables, switches | Tokens applied | Verify role/tenant restrictions and destructive confirmations |
| Student/parent portal | `student-portal.tsx` | Role-specific portal | Tokens applied | Full child-switching and mobile usability pass remains |

## Exceptions and rollout

- Existing exam, achievement, fee, curriculum, communications, transport and report styles remain as domain layout styles while consuming shared tokens. They are not yet fully migrated to composed primitives.
- This is not a claim that every route has passed visual, accessibility or responsive QA. The current implementation is the foundation/shell rollout; module-by-module verification remains tracked below.
- Rollback is to revert the frontend commit. No database or API contract changes are involved.
