# 11. Build Sequence

## Phase 0 — Repository bootstrap
- Initialize Next.js, strict TypeScript, Tailwind, component library, lint/test stack.
- Create folder structure and base tokens.
- Add fixture loader and versioned persisted demo store.
- Add CI-friendly commands.

## Phase 1 — Shared shell and access control
- Persona login/selector
- Product switcher
- Demo Controls
- Route guards
- Organization context
- Placeholder dashboards with real navigation
- Permission tests

**Exit:** E2E-01 works; no unauthorized route leakage.

## Phase 2 — Shared company administration and checkout
- Users, invitations, seats, entitlements
- Billing overview
- Simulated checkout/cancellation
- Notification outbox and audit events

**Exit:** E2E-02 and E2E-08 work.

## Phase 3 — Signatrain
- HR/Manager dashboards and library
- Learning player and progress
- Sessions/attendance
- Content workflow
- Certificates
- Optional Bot mock and cohort depth

**Exit:** E2E-03, E2E-04, and E2E-05 work.

## Phase 4 — GD portal
- Dashboard, onboarding, benefits
- Legal request/client thread
- GD operations/attorney workspace
- Matter reference, scheduling, templates
- Included Signatrain seat
- Project request/Adobe Sign depth

**Exit:** E2E-06 works.

## Phase 5 — Legislative Tracking
- Subscriber alerts and coverage
- Draft/review/approval/publication
- Recipient targeting, notifications, read state

**Exit:** E2E-07 works.

## Phase 6 — Polish and validation
- Responsive treatment
- Empty/restricted/error states
- PDF and CSV downloads
- Performance and accessibility cleanup
- Full acceptance and E2E pass
- Rehearse presentation script

## Change control

When a product decision changes:
1. Update the relevant source document in this package.
2. Update route/config/mock fixtures if affected.
3. Update tests before or with implementation.
4. Record the change in `docs/13_DECISION_LOG.md`.
