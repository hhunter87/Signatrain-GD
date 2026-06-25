# GD & Signatrain Disposable Demo — Codex Specification v1.0

This package is the implementation contract for a **disposable, interactive product demo** covering:

- Shared account, organization, role, entitlement, seat, and billing-reference behavior
- Signatrain HR and Manager training experiences
- Greenwald Doherty client portal experiences
- Legislative Tracking MVP-Lite
- Simulated checkout and third-party integrations

The demo exists to validate information architecture, terminology, role-specific navigation, and workflow behavior with stakeholders. It is **not** a production foundation and must not contain real client, legal, payment, or privileged data.

## Start here

1. Read `AGENTS.md`.
2. Read `START_HERE.md`.
3. Read `docs/01_DEMO_SCOPE.md` and `docs/02_INFORMATION_ARCHITECTURE.md`.
4. Use `config/route-manifest.json`, `config/demo-personas.json`, and the seed files in `mock-data/` as implementation inputs.
5. Build in the phases defined in `docs/11_BUILD_SEQUENCE.md`; do not attempt the entire application in one uncontrolled pass.
6. Verify the result against `docs/09_ACCEPTANCE_CRITERIA.md` and `docs/10_TEST_SCENARIOS.md`.

## Primary implementation documents

| File | Purpose |
|---|---|
| `AGENTS.md` | Persistent repository rules for Codex |
| `START_HERE.md` | Exact workflow for starting and supervising the build |
| `docs/03_ROLES_AND_PERMISSIONS.md` | Role, persona, entitlement, and data-scope behavior |
| `docs/04_SCREEN_SPECIFICATIONS.md` | Screen inventory and expected behavior |
| `docs/05_WORKFLOWS_AND_STATE_MACHINES.md` | Workflow and transition rules |
| `docs/06_DOMAIN_AND_MOCK_DATA_MODEL.md` | Entities, relationships, and seed expectations |
| `docs/07_MOCK_INTEGRATIONS.md` | Contract for all simulated external systems |
| `docs/08_VISUAL_DESIGN_SYSTEM.md` | Product shells, themes, components, and responsive rules |
| `docs/09_ACCEPTANCE_CRITERIA.md` | Definition of done |
| `docs/12_DEMO_PRESENTATION_SCRIPT.md` | Suggested stakeholder presentation path |
| `prompts/` | Staged prompts to give Codex |

## Canonical product decisions

- Two public products are visible: **Greenwald Doherty** and **Signatrain**.
- Company 3 is an invisible infrastructure layer and must never appear as a user-facing product.
- A shared core manages identity, organizations, additive roles, entitlements, seats, product switching, notifications, and audit events.
- Signatrain HR and Manager are separate products.
- The GD portal is a client front door, not a replacement for Centerbase.
- Manual provisioning is the production baseline; the demo also simulates self-service checkout.
- Legislative Tracking is manual, targeted, and attorney-reviewed.
- Video completion requires at least 95% unique watch coverage.
- Live-session completion requires at least 90% attendance.
- The demo uses fake data and mock adapters only.
