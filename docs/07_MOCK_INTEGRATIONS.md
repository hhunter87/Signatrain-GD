# 7. Mock Integration Contracts

All adapters must be asynchronous and deterministic so UI behavior resembles an integration without external calls.

## Authentication adapter
- Selects a seeded persona.
- Simulates sign-in, sign-out, invitation acceptance, and archived-account denial.
- Stores no password.

## Stripe adapter
Functions:
- `createCheckoutSession`
- `confirmCheckout`
- `addSeats`
- `cancelAtPeriodEnd`
- `reactivateSubscription`

Behavior:
- Card, ACH, and invoice/PO are presentation choices only.
- Successful checkout creates subscription reference, entitlement, seat pool, audit event, and confirmation email.
- “Decline payment” scenario returns a recoverable error and creates no entitlement.
- Never render or store real card/bank fields; use fictional test form fields.

## Zoom adapter
Functions:
- `createMeetingReference`
- `registerParticipant`
- `openJoinSimulation`
- `importAttendanceFixture`

Behavior:
- Registration returns a mock ID and join token.
- Attendance fixture produces attended minutes.
- 90% threshold is calculated in platform logic, not hard-coded in the adapter.

## Secure video adapter
- Supplies a local demo video/poster or abstract training placeholder.
- Emits watched interval events.
- Supports resume.
- Does not count skipped intervals.

## Calendly adapter
- Opens a scheduling modal with seeded time slots.
- Confirmation creates an appointment reference and safe email.

## Adobe Sign adapter
- Creates a fictional agreement reference.
- Supports `sent`, `viewed`, `signed`, and `declined` demo transitions.
- Does not display a real signature or legal agreement.

## Centerbase adapter
- Creates or links a fictional matter reference.
- Returns only approved fields: reference ID, type, public-safe status, responsible attorney, last updated, approved summary, external invoice link label.
- Never stores or returns time entries, full billing, legal work product, or matter documents.

## Bot adapter
- Renders a clearly marked third-party-style mock widget for HR users with `BOT_ACCESS`.
- Accepts fictional general employment-law questions and returns a prewritten educational response with an escalation disclaimer.
- Does not give individualized legal advice.

## Email adapter
- Writes a record to the simulated outbox.
- Email preview contains recipient, subject, timestamp, template key, and non-confidential body.
- No external email is sent.

## File adapter
- Accepts selected files only to create metadata and local object preview where supported.
- Enforce demo file type/size validation.
- Reset removes all user-created metadata.

## Certificate adapter
- Generates a local PDF from certificate metadata.
- Uses a unique deterministic certificate ID.
- Public verification reads current status from the demo store.
