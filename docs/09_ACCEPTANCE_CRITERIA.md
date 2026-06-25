# 9. Acceptance Criteria

## Global

- [ ] Application installs and runs without secrets or external accounts.
- [ ] A visible fictional-data/demo banner is present.
- [ ] Demo Controls can switch persona, open scenario shortcuts, show outbox, and reset data.
- [ ] State changes persist across refresh and reset reliably.
- [ ] All P0 routes exist and are navigable.
- [ ] No visible primary button is dead.
- [ ] Unauthorized routes redirect to a clear restricted-access page.
- [ ] Company 3 is absent from all user-facing copy and navigation.
- [ ] Product themes and navigation change correctly between GD and Signatrain.
- [ ] Mobile and tablet layouts remain usable.

## Shared Core

- [ ] Maya sees both GD and Signatrain in My Products.
- [ ] Marcus sees only Signatrain Manager and never sees HR-only features.
- [ ] Company Owner sees billing; Company HR Admin does not.
- [ ] Company admins can invite a user and assign an available seat.
- [ ] Exhausted seat inventory blocks assignment with a useful message.
- [ ] Archiving a user releases access while retaining history.
- [ ] Transferring a seat updates both users and the inventory.
- [ ] Simulated checkout creates active entitlement and seat inventory only after success.
- [ ] Cancellation is scheduled for period end, not immediate.
- [ ] CSV export downloads valid demo rows.

## Signatrain

- [ ] HR and Manager dashboards differ materially.
- [ ] Content visibility respects audience and entitlement.
- [ ] Course modules enforce order.
- [ ] Video completes at 95% unique watched coverage, not by seeking to the end.
- [ ] Live registration creates a mock Zoom reference and notification.
- [ ] Attendance at 90% completes the session; lower attendance does not.
- [ ] Private cohort content is visible only to its company cohort.
- [ ] Content follows draft/review/approved/published/archive rules.
- [ ] Only an authorized reviewer can approve assigned content.
- [ ] Recording is hidden until approved.
- [ ] Certificate eligibility recalculates correctly.
- [ ] Certificate PDF downloads and public verification works.
- [ ] Revoked certificate verification displays revoked status.
- [ ] Bot route is visible only to entitled HR users.

## GD

- [ ] GD dashboard shows plan, benefits, onboarding, requests, alerts, and included seats.
- [ ] Onboarding tasks can be completed and fictional attachments added.
- [ ] A client can submit a company-visible or restricted request.
- [ ] Restricted request is invisible to unrelated company users/admins.
- [ ] GD Operations can triage, prioritize, assign, and change status.
- [ ] Assigned attorney can send a client-visible message and internal note.
- [ ] Internal note never appears in client view or email outbox.
- [ ] Matter conversion creates only a limited Centerbase reference.
- [ ] Calendly simulation creates an appointment reference.
- [ ] Template downloads use fictional safe files/content.
- [ ] Flat-fee project flow can reach simulated signed status.
- [ ] Concierge provides one included HR seat; All Access provides two by default.
- [ ] Included seat assignment activates Signatrain HR without a Stripe transaction.

## Legislative Tracking

- [ ] Manager users cannot access alerts.
- [ ] Eligible GD and HR users see only alerts matching entitlement and jurisdiction.
- [ ] Alert cannot publish without GD Attorney approval.
- [ ] Rejection returns the alert to draft with reviewer notes.
- [ ] Publication creates recipient records, notifications, and safe email previews.
- [ ] Read/unread status updates for the current user.
- [ ] Company admin can view company delivery/read summary.
- [ ] Approved jurisdiction coverage change affects future targeting.

## Engineering

- [ ] Type checking, linting, unit tests, E2E tests, and production build pass.
- [ ] Permission and transition logic is centralized and tested.
- [ ] No production credentials, real PII, or real privileged content exist in source or fixtures.
