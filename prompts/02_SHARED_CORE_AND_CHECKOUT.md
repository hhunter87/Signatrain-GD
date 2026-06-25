Implement Phase 2 from `docs/11_BUILD_SEQUENCE.md`.

Use the existing fixtures and route manifest. Deliver:
- company overview, users, invitations, archive/reactivate;
- seat inventory, assignment, transfer, and exhaustion behavior;
- entitlement source display;
- Company Owner billing view and Company HR Admin billing denial;
- simulated pricing/checkout for eligible SKUs;
- successful and declined payment scenarios;
- cancellation at period end and reactivation simulation;
- in-app notifications, safe email outbox, audit events, and CSV export.

Do not add real Stripe, email, or authentication. Run all checks and prove E2E-02 and E2E-08.
