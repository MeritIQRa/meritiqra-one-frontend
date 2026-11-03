
## 3 November 2026 — Transport / Communication Centre

Implemented role-aware in-shell workspaces, transport setup/fleet/driver controls and guardian views;
in-app announcement drafts, audience preview, schedules, inbox/preferences and explicit external
channel setup states. New UI tests cover bounded GPS buffering and no sends from passive reads/drafts.
`npm test` and `npm run build` passed. Local Chrome verified login, draft persistence and transport setup;
390px layout inspected, content gutters corrected. Physical GPS, complete accessibility audit,
external provider delivery and full playbook phases remain pending. Backend release document lists
all deliberate pilot deviations and unsupported flows; do not equate this release with full completion.

## 3 November 2026 — Configuration and Westbridge demo

Added institution integration settings with revision conflict handling and Secret Manager reference
fields; explicit demo setup, isolated channel simulation, existing-record reminder dry run,
scripted journey playback and operator-reported acceptance checklist. DEMO and LIVE_REQUESTED are
visibly distinct; neither configuration saving nor demo playback activates an external provider.
Frontend tests cover the disabled gate, explicit initialization, labelled simulation and absence
of live send requests. Provider activation and physical acceptance remain separate requirements.
