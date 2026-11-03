# Classroom playbook: source audit and first safe slice

3 November 2026. This is an implementation inventory, not a claim that the classroom playbook is complete or that current production media was tested.

## Sources inspected

- Supplied `MERITIQRA_ONE_LIVE_RECORDED_CLASSROOM_PLAYBOOK (1).md`, sections 1–22.
- One backend `docs/ALL_PLAYBOOKS_PENDING_REGISTER.md` and source modules.
- Core checkout `/private/tmp/meritiqra-core-payments-source`, commit `bf89c53`. This is the available source snapshot, not evidence that production currently runs that commit.
- Core `AGENTS.md`, `docs/codex/MERITIQRA_PLAYBOOK.md`, `docs/LIVE_CLASSES.md` and source paths below.

## Reuse matrix

| Capability | Actual Core source | Current contract / scope | Decision and remaining verification |
|---|---|---|---|
| Media provider | `live_class_media.py`; `static/vendor/daily-0.93.0.js`, `daily-LICENSE` | Daily private rooms; server API key; two-minute join token; explicit audio/video permissions; stable room names; participant eject and room expiry | Retain adapter/provider. Do not create another room owner. Current key validity, two-device quality and capacity were not checked. |
| Class scheduling / access | `live_classes.py`, `live_class_schema.py`, `migrations/versions/0064_live_classes.py` | `/api/live-classes`; Core session + CSRF; active program enrollment and assigned teacher or global Core ADMIN | Reuse through an authenticated ERP tenant/campus/cohort bridge. Program membership alone is not ERP school isolation. No ERP classroom bridge was found. Do not forward an ERP admin as global Core ADMIN. |
| Local pre-join / classroom UI | `static/live-classes.js`, `.html`, `.css` | Existing Core classroom frontend and local device checks; direct Core auth | Preserve Core UI. Add One's non-broadcast local readiness tool independently; do not claim it joined a Core class. |
| Whiteboard | `live_class_whiteboard.py`, `live_class_whiteboard_schema.py`, `static/live-whiteboard.js` | Revisioned structured document/update log, class authorization through Core access helper | Reuse after tenant/cohort bridge. No production whiteboard recovery check performed. |
| Chat, controls, quiz | `live_classes.py`, `live_class_controls_schema.py` | Persisted class messages and quizzes; teacher authority; server answer times and reveal | Reuse source contracts. Bridge tenant access, moderation scope and current release state. Core documentation describes response-time tie-breaking; playbook prefers marks/accuracy without network-speed tie-breaks, so resolve this explicitly. |
| Recorded lesson catalogue | `class_library.py`, `class_library_schema.py` | `/api/class-library`; program enrollment; published catalogue; canonical YouTube or externally reachable HTTPS MP4/WebM sources; chapters | Retain metadata/player patterns. External media links are not private storage entitlements. Do not represent this as provider-generated private recordings. |
| Provider recording pipeline | No recording start/stop adapter found in inspected `live_class_media.py`; documentation says automatic recording is disabled | No verified Daily recorder/webhook → private processing → publication lifecycle in this snapshot | Pending: provider capabilities/account, consent, manifest/segments, private access, processing, review, replay revocation and real audio/video QA. |
| Existing One preparation data | `ModuleCatalog.java`, `RecordController.java`; frontend `rows.schools/staff/classes/subjects/timetable` | School records and timetable CRUD already available to authorized workspace roles | Reuse saved records for campus preparation counts. Staff count does not prove Google identity, Core host grant or teaching readiness. |

No ODA/private reference page, provider account, real class or camera stream was opened for this work. No secrets, rooms, recordings, reminders or student attendance records were created.

## Implemented slice

New frontend files:

- `app/classroom-readiness.tsx`
- `app/classroom-readiness.module.css`
- `scripts/check-classroom-readiness.cjs`

The component renders campus-filtered staff, section, subject and timetable counts; flags timetable entries without a current staff record; links to existing Faculty and Timetable pages; and exposes separate explicit camera and microphone access checks. It requests only the selected device. Camera preview is muted/local; microphone audio is neither played nor recorded nor transmitted. No media is requested on mount. Stop, unmount and late asynchronous permission completion release tracks. Permission-denied, missing-device and device-busy errors are actionable. Live/provider connectivity remains explicitly pending.

No HTTP/media provider endpoint is invoked by this component. No settings, schedules or attendance are written. Thus it can be released without claiming unsupported classroom access or opening media permissions across schools.

## Parent integration instructions

1. Import `ClassroomReadiness` from `./classroom-readiness` in `app/page.tsx`.
2. Add key `classroom-readiness` to the Academics navigation and label `Classroom Preparation` in `moduleNames`.
3. Add the key only for `SCHOOL_SUPER_ADMIN`, `COLLEGE_SUPER_ADMIN`, `SCHOOL_ADMIN`, `COLLEGE_ADMIN`, `PRINCIPAL`, `TEACHER` if those users already receive the relevant saved records. Prefer school admin/principal only for the first release; this UI itself is not an authorization boundary.
4. Map this navigation key to the existing `timetable` feature gate.
5. Render `<ClassroomReadiness rows={rows} onNavigate={navigate}/>` inside the existing ERPShell. Avoid a generic Add record button for this key.
6. Add `node scripts/check-classroom-readiness.cjs` to the test command, run the full frontend test/build, and capture browser evidence before deployment acceptance.

## Verification and pending register delta

Automated check verifies: no passive capture; selected-campus counts; camera-only and microphone-only constraints; explicit stop; unmount cleanup; capture resolving after unmount; permission refusal. TypeScript compilation must also pass at integration. Physical microphone quality, camera/permission interactions, browser/OS versions, cross-browser/mobile behavior and actual Daily media remain unverified.

Classroom phase 0 audit: partial source inventory completed with this matrix. Phase 1 local preflight: code slice completed, browser/device acceptance pending. All remaining phases in the supplied playbook remain open, including scoped Core classroom bridge, scheduling/enrollment, learner/teacher/mentor room UI, provider join grants, live controls, durable chat integration, recording pipeline, exam launch, parent reports and load/device acceptance. Do not close the consolidated classroom playbook item based on this slice.
