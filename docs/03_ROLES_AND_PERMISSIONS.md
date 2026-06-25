# 3. Roles, Personas, and Permissions

## Role model

Roles are additive. An account may hold several roles, but an active entitlement is still required for subscriber-facing access. External accounts are scoped to one customer organization per email address.

| Code | Role | Type | Core responsibility |
|---|---|---|---|
| PSA | Platform Super Admin | Internal | Technical identity, organization, entitlement, audit, and integration metadata; no default privileged GD content access |
| SSA | Signatrain Super Admin | Internal | Full Signatrain operational administration |
| SOC | Signatrain Ops / Content Admin | Internal | Day-to-day content, sessions, cohorts, completion, and support |
| FCR | Faculty / Content Reviewer | Internal | Assigned content review and assigned session delivery |
| GDO | GD Operations Admin | Internal | GD plans, onboarding, triage, scheduling, benefits, and project operations |
| GDA | GD Attorney | Internal | Assigned legal requests and matters; legal review and alert sign-off |
| GDC | GD Content / Template Admin | Internal | Templates and legislative alert drafting/administration |
| CO | Company Owner | External | Buyer, billing owner, users, seats, company reports |
| CHA | Company HR Admin | External | Users, seats, training assignment/reporting; no billing |
| HRS | HR Subscriber | External | Signatrain HR product user |
| MGR | Manager Subscriber | External | Signatrain Manager product user |
| GDCU | GD Client User | External | GD client portal user, subject to request-level privacy |

## Entitlements

| Code | Meaning |
|---|---|
| `GD_CONCIERGE` | GD Concierge portal and plan benefits |
| `GD_ALL_ACCESS` | GD All Access portal and plan benefits |
| `SIGNATRAIN_HR` | Signatrain HR product |
| `SIGNATRAIN_MANAGER` | Signatrain Manager product |
| `LEGISLATIVE_TRACKING` | Targeted legislative alerts |
| `BOT_ACCESS` | Third-party Bot entry for HR users |

Each entitlement includes status, effective dates, source, and optional seat assignment. Sources are `manual`, `stripe`, `enterprise_contract`, `gd_included`, or `promotional`.

## Critical permission rules

1. A Company Owner can manage billing; a Company HR Admin cannot.
2. Company Owner and Company HR Admin can invite/archive users and assign/transfer seats within their organization.
3. Company admins can see company training completion and certificates.
4. A restricted GD legal request is visible only to its submitter, explicitly added client participants, GD Operations, and the assigned attorney.
5. A company-visible GD request is visible to authorized company admins and GD client participants in that company.
6. Technical Platform Super Admin access does not imply access to legal-request substance.
7. HR content and Manager content are separate; shared scenarios are visible only when configured for both audiences.
8. Manager users never see the Bot or Legislative Tracking.
9. An alert cannot be published until a GD Attorney approves and signs it off.
10. A certificate cannot be issued until the configured completion rule is satisfied, unless an authorized administrator records an audited override.

## Demo personas

The canonical personas are defined in `config/demo-personas.json`. The most important presentation personas are:

- **Maya Patel** — Acme Company Owner + HR Subscriber + GD Client User; sees both products.
- **Jordan Lee** — Acme Company HR Admin; manages people, seats, learning, and company-visible requests.
- **Elena Ruiz** — HR Subscriber; demonstrates learning, live registration, Bot, alerts, and certificate.
- **Marcus Chen** — Manager Subscriber; demonstrates the Manager program and restricted product experience.
- **Priya Shah** — Signatrain Super Admin + Ops/Content Admin.
- **Alex Morgan** — Faculty / Content Reviewer.
- **Dana Brooks** — GD Operations Admin.
- **Rachel Kim** — GD Attorney.
- **Sam Carter** — GD Content / Template Admin.

The Demo Controls selector changes the active persona, not an isolated role toggle. This preserves additive-role behavior.
