# 4. Screen Specifications

The full machine-readable route contract is `config/route-manifest.json`. The table below is the human-readable screen inventory. All P0 routes must be implemented before presentation polish.

| Route | Screen | Domain | Priority | Principal actions |
|---|---|---|---|---|
| `/` | Demo landing | Public | P0 | Select a persona; Open pricing; Review demo disclaimer |
| `/pricing` | Pricing and plan comparison | Public | P0 | Select HR, Manager, or GD Concierge; Open simulated checkout |
| `/checkout/[sku]` | Simulated checkout | Public/Shared | P0 | Choose monthly/annual where available; Choose card, ACH, or invoice; Complete simulated purchase |
| `/certificate/[certificateId]` | Public certificate verification | Public | P0 | Verify certificate status and limited metadata |
| `/app/products` | My Products | Shared | P0 | Open GD or Signatrain according to active entitlements |
| `/app/profile` | Profile and notification preferences | Shared | P1 | Edit fictional profile; Toggle notification preferences |
| `/app/company` | Company overview | Shared | P0 | View profile, products, seats, and status |
| `/app/company/users` | Company users | Shared | P0 | Invite, resend, archive, reactivate users; Assign additive roles |
| `/app/company/seats` | Seats and entitlements | Shared | P0 | Assign and transfer HR/Manager seats; View entitlement source |
| `/app/company/billing` | Billing overview | Shared | P0 | View subscriptions and invoices; Add seats; Cancel at period end |
| `/app/company/reports` | Company reports | Shared | P1 | View training metrics; Export CSV |
| `/app/signatrain` | Signatrain dashboard | Signatrain | P0 | Continue learning; Open sessions, scenarios, progress |
| `/app/signatrain/library` | Content library | Signatrain | P0 | Filter by topic/type/audience; Open eligible content |
| `/app/signatrain/scenarios/[scenarioId]` | Standalone scenario detail | Signatrain | P0 | Play video; View discussion prompts and resources |
| `/app/signatrain/courses/[courseId]` | Course overview | Signatrain | P0 | Enroll or continue; View ordered modules and rules |
| `/app/signatrain/learn/[courseId]/[moduleId]` | Learning player | Signatrain | P0 | Watch video; Read material; Complete optional evaluation; Advance in sequence |
| `/app/signatrain/programs/[programId]` | Program progress | Signatrain | P0 | View required courses and completion |
| `/app/signatrain/live` | Live-session catalog | Signatrain | P0 | Select date; Register self or eligible company user |
| `/app/signatrain/live/[sessionId]` | Live-session detail | Signatrain | P0 | Register; Join simulated Zoom; View attendance/recording state |
| `/app/signatrain/cohorts/[cohortId]` | Private cohort | Signatrain | P1 | View roster-safe information; Open company materials and sessions |
| `/app/signatrain/progress` | My progress | Signatrain | P0 | View course, video, session, and program progress |
| `/app/signatrain/certificates` | My certificates | Signatrain | P0 | View/download certificate; Open public verification link |
| `/app/signatrain/bot` | HR Bot mock embed | Signatrain | P1 | Open third-party-style widget; Submit fictional general question |
| `/admin/signatrain` | Signatrain operations dashboard | Signatrain Admin | P0 | Review queues, sessions, cohorts, and exceptions |
| `/admin/signatrain/content` | Content catalog administration | Signatrain Admin | P0 | Filter by status; Create/open assigned content |
| `/admin/signatrain/content/[contentId]` | Content editor and review | Signatrain Admin | P0 | Edit metadata/modules; Submit, approve/reject, publish/archive |
| `/admin/signatrain/sessions` | Session administration | Signatrain Admin | P0 | Create/reschedule/cancel; Manage roster; Import simulated attendance; Approve recording |
| `/admin/signatrain/cohorts` | Cohort administration | Signatrain Admin | P1 | Create private cohort; Assign users and company-specific materials |
| `/admin/signatrain/learners` | Learner administration | Signatrain Admin | P1 | Inspect progress; Record audited completion override |
| `/admin/signatrain/certificates` | Certificate administration | Signatrain Admin | P1 | Issue/reissue/revoke with audit reason |
| `/app/gd` | GD client dashboard | GD | P0 | View plan, benefits, onboarding, requests, alerts, and included seats |
| `/app/gd/onboarding` | GD onboarding checklist | GD | P0 | Complete tasks; Attach mock files |
| `/app/gd/benefits` | Plan and benefit usage | GD | P0 | View available/used/renewal states |
| `/app/gd/requests` | Legal request list | GD | P0 | View own and permitted company-visible requests |
| `/app/gd/requests/new` | Submit legal request | GD | P0 | Enter topic/urgency/details; Choose privacy; Attach mock files |
| `/app/gd/requests/[requestId]` | Legal request thread | GD | P0 | View permitted status; Send secure message; Upload/download permitted attachments |
| `/app/gd/matters` | Limited matter references | GD | P1 | View approved matter summaries only |
| `/app/gd/matters/[matterId]` | Matter summary | GD | P1 | View limited Centerbase reference and approved status |
| `/app/gd/schedule` | Attorney scheduling | GD | P1 | Open simulated Calendly; Create appointment reference |
| `/app/gd/templates` | GD template library | GD | P1 | Filter and download fictional templates |
| `/app/gd/projects` | Flat-fee project requests | GD | P1 | View project request and agreement status |
| `/app/gd/projects/new` | Submit project request | GD | P1 | Choose project type; Describe scope; Submit |
| `/app/gd/billing` | GD billing references | GD | P1 | View subscription and external invoice references |
| `/app/gd/signatrain-seats` | Included Signatrain seats | GD | P0 | View allowance; Assign included HR seats |
| `/admin/gd` | GD operations dashboard | GD Admin | P0 | Review onboarding, request, project, and alert queues |
| `/admin/gd/clients` | GD client administration | GD Admin | P1 | Open company plan, benefits, users, and references |
| `/admin/gd/onboarding` | Onboarding operations | GD Admin | P1 | Create, assign, waive, reopen tasks |
| `/admin/gd/requests` | Legal request work queue | GD Admin | P0 | Filter by status/priority/assignee/privacy |
| `/admin/gd/requests/[requestId]` | Legal request triage workspace | GD Admin | P0 | Triage, assign, message, internal note, convert to matter |
| `/admin/gd/projects` | Project request administration | GD Admin | P1 | Scope proposal; Send simulated Adobe Sign; Update status |
| `/admin/gd/templates` | Template administration | GD Admin | P1 | Create/edit/publish/archive fictional templates |
| `/app/alerts` | Eligible legislative alerts | Legislative | P0 | Filter and open targeted alerts; See unread count |
| `/app/alerts/[alertId]` | Legislative alert detail | Legislative | P0 | Read attorney-reviewed alert; Mark read/unread |
| `/app/alerts/coverage` | Jurisdiction coverage | Legislative | P1 | View active jurisdictions; Request coverage change |
| `/admin/alerts` | Alert pipeline | Legislative Admin | P0 | Filter drafts/review/approved/published/archived |
| `/admin/alerts/[alertId]` | Alert editor and legal review | Legislative Admin | P0 | Draft, submit, approve/reject, target, publish, archive |
| `/admin/alerts/distribution` | Alert distribution report | Legislative Admin | P1 | View targeted companies, delivery, and read state |
| `/admin/platform/organizations` | Organization administration | Platform Admin | P1 | Create/archive/reactivate organization; Manage technical entitlement metadata |
| `/admin/platform/audit` | Audit event viewer | Platform Admin | P1 | Filter safe event metadata; exclude privileged body content |

## Detailed interaction rules

### Demo landing
- Display a clear fictional-data disclaimer.
- Show persona cards grouped into External, Signatrain Internal, and GD Internal.
- Selecting a persona enters the correct initial product/dashboard.
- Provide direct links to Pricing and the Demo Presentation shortcuts.

### My Products
- Show only active entitled portals.
- A user with both portals sees two prominent product cards.
- A single-product user may be redirected directly to that portal, but can still open My Products.
- Never show Company 3.

### Company users and seats
- Invitations create a pending fictional user and simulated email.
- Seat assignment is blocked when the pool is exhausted.
- Archiving a user releases the active seat but preserves historical records.
- Transfer moves an available seat to another eligible active user.
- Every mutation creates a safe audit event.

### Learning player
- Modules unlock in configured order.
- The mock video player tracks unique watched intervals rather than only the final playhead position.
- At 95% unique coverage, the video component completes automatically.
- A “Simulate watching remaining portion” demo helper may be provided inside Demo Controls, not as normal product UI.
- Optional evaluation must be completed when configured in the course rule.
- Course/program completion recalculates immediately.

### Live sessions
- Users choose among offered dates and register.
- Registration creates a mock Zoom registration reference and simulated confirmation email.
- “Join Zoom” opens a branded simulation modal, not an external URL.
- Admin may import deterministic attendance; 90% or greater marks the session complete.
- Recording remains hidden until an authorized user approves it.

### Certificate
- Display recipient, program/course, issue date, optional credit metadata, and unique certificate ID.
- Download generates a local demo PDF.
- Public verification exposes only limited non-sensitive metadata and current status.
- Revoked certificates remain verifiable as revoked.

### GD legal request
- New request fields: topic, subject, description, urgency, desired response type, privacy, fictional attachments.
- Privacy options: `company_visible` or `restricted`.
- Restricted requests must never appear to unrelated company admins/users.
- Client-visible messages and internal-only notes use visibly different components.
- Matter conversion stores only a fictional Centerbase reference, public-safe status, responsible attorney, and approved summary.

### Legislative alert
- Draft includes title, summary, impact, recommended action, topic, jurisdictions, effective date, source references, and target audiences.
- Only GD Attorney can perform legal approval/sign-off.
- Publication is blocked without approval.
- Eligible recipients are calculated from active entitlement plus jurisdiction overlap plus audience.
- Publishing creates in-app notifications and safe simulated email records.
