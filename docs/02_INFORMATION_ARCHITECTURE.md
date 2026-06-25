# 2. Information Architecture

## Public product model

```text
Shared Platform Core
├── My Products
├── Organization & Users
├── Seats & Entitlements
├── Billing / Checkout
├── Profile & Notifications
└── Demo Controls

Greenwald Doherty Portal
├── Dashboard
├── Onboarding
├── Plan & Benefits
├── Legal Requests
├── Matter References
├── Schedule
├── Template Library
├── Project Requests
├── Billing References
├── Included Signatrain Seats
└── Legislative Alerts

Signatrain Portal
├── Dashboard
├── Library
├── Courses & Programs
├── Standalone Scenarios
├── Live Sessions
├── Cohorts
├── Progress
├── Certificates
├── Bot (HR only)
└── Legislative Alerts (eligible HR only)

Internal Administration
├── Platform / Company Administration
├── Signatrain Content & Learning Operations
├── GD Client Operations
├── GD Attorney Work Queue
├── GD Template Administration
└── Legislative Alert Administration
```

## Cross-product principles

- The product switcher shows only active entitled products.
- A user with both GD and Signatrain access retains the same account and organization context.
- Product navigation and visual themes change when switching products.
- Legal requests, secure messages, attachments, and matter summaries never appear in Signatrain.
- Learning progress, attendance, and certificates never appear in GD legal-request screens.
- Company 3 is never displayed.
- Legislative Tracking appears inside GD or Signatrain according to the viewer’s eligible product context.

## Global shell

### Top bar
- Product/portal switcher
- Organization name
- Current persona avatar/name
- Notifications
- Demo Controls toggle

### Left navigation
- Changes by portal and persona
- Hides unauthorized destinations rather than showing disabled links
- May show a clear “Admin” section for internal personas

### Demo Controls
- Current persona selector
- Current organization selector for authorized internal personas
- Scenario shortcuts
- “Reset all demo data” action
- “Open simulated email outbox” action
- Optional “Show permission diagnostics” toggle

## Dashboard intent

Dashboards should be decision-oriented, not generic collections of charts.

- Company Owner: products, billing, seats, onboarding, benefits, employee progress, active requests
- Company HR Admin: users, seats, learning progress, sessions, certificates, company-visible GD requests
- HR Subscriber: continue learning, upcoming sessions, alerts, certificates, Bot
- Manager Subscriber: assigned program, scenarios, upcoming core sessions, progress
- Signatrain Admin: content queue, upcoming sessions, cohorts, completion exceptions
- GD Operations: onboarding backlog, untriaged requests, scheduled appointments, project requests
- GD Attorney: assigned requests, review tasks, legislative alerts awaiting legal sign-off
- Legislative editor: draft/review/publish pipeline and delivery status
