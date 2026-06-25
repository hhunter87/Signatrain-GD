# 10. Test Scenarios

## Unit tests

1. Additive roles merge capabilities without bypassing entitlement checks.
2. Company HR Admin cannot access billing routes/actions.
3. Manager entitlement cannot access HR dashboard, Bot, or alerts.
4. Restricted GD request permission returns false for unrelated company admins.
5. Unique watched interval merging calculates 95% correctly.
6. Seeking to the final second without coverage does not complete video.
7. 90% attendance completes; 89.9% does not.
8. Certificate eligibility requires all configured conditions.
9. Alert publication rejects missing attorney approval.
10. Jurisdiction targeting includes only overlapping active coverage.
11. GD-included seat creates entitlement source `gd_included` with no payment reference.
12. Archive/reactivate preserves historical progress and request references.

## Playwright presentation journeys

### E2E-01 — Cross-product company owner
- Select Maya.
- Confirm My Products shows GD and Signatrain.
- Open each portal and verify theme/navigation changes.

### E2E-02 — Invite and assign seat
- Select Jordan.
- Invite a fictional employee.
- Assign an HR seat.
- Confirm pending/active state and outbox message.

### E2E-03 — HR learning and certificate
- Select Elena.
- Continue New HR Bootcamp.
- Complete remaining video coverage and evaluation.
- Confirm course completion, certificate issue, download, and verification.

### E2E-04 — Live session
- Register Elena for a Masterclass.
- Switch to Priya and import 92% attendance.
- Switch back to Elena and confirm completion.

### E2E-05 — Manager product guardrails
- Select Marcus.
- Confirm Manager program and scenario library.
- Confirm Bot and alerts are absent.

### E2E-06 — Restricted legal request
- Select Maya and submit a restricted request.
- Select Jordan and confirm it is absent.
- Select Dana, triage, and assign Rachel.
- Select Rachel, message client, add internal note, and convert to matter.
- Select Maya and confirm client message/matter summary but not internal note.

### E2E-07 — Legislative alert lifecycle
- Select Sam and create/edit a draft.
- Submit for review.
- Select Rachel and approve.
- Select Dana or Sam and publish.
- Select Elena and read the alert.

### E2E-08 — Simulated checkout
- Select the prospect persona.
- Purchase Signatrain HR through simulated card success.
- Confirm entitlement, seat inventory, billing reference, and product access.

### E2E-09 — Cancellation/reactivation
- As Company Owner, cancel at period end.
- Use scenario shortcut to advance to end date.
- Confirm archive.
- As internal admin, reactivate and confirm restored access.

### E2E-10 — Reset
- Mutate several domains.
- Reset demo.
- Confirm fixtures return to the canonical baseline.
