# 6. Domain and Mock Data Model

TypeScript interfaces are supplied in `schemas/domain-types.ts`. Seed instances are supplied in `mock-data/`.

## Shared Core

- `User`: identity and profile only
- `Organization`: customer tenant and status
- `Membership`: binds a user to one organization and stores status
- `RoleAssignment`: additive role codes
- `Entitlement`: product access, dates, source, and status
- `SeatPool`: product seat capacity for an organization
- `SeatAssignment`: binds a seat to a user
- `SubscriptionReference`: commercial/payment display metadata
- `Notification`: in-app notification
- `EmailOutboxItem`: safe simulation of outbound email
- `AuditEvent`: actor, action, object reference, safe metadata, timestamp

## Signatrain

- `ContentItem`: common metadata for course, scenario, module, document, and recording
- `Course`: ordered modules and completion rule
- `Module`: video/text/document/evaluation composition
- `Scenario`: standalone scenario content and audience
- `Program`: required courses/sessions
- `Enrollment`: learner-to-course/program state
- `VideoProgress`: unique watched intervals and percent
- `EvaluationSubmission`: optional completion/evaluation record
- `LiveSession`: type, schedule, audience, Zoom mock reference, recording state
- `Registration`: learner/session relationship
- `AttendanceRecord`: attended minutes and completion result
- `Cohort`: company-only enrollment and special materials
- `Certificate`: issue/revoke and verification metadata

## GD

- `GDPlan`: Concierge, All Access, or custom representation
- `BenefitAllocation`: allowance, used count, availability, renewal
- `OnboardingTask`: assigned checklist item and fictional attachment metadata
- `LegalRequest`: topic, privacy, status, priority, assignee, public-safe fields
- `LegalMessage`: client-visible or internal-only
- `AttachmentMetadata`: metadata only; no real file persistence
- `MatterReference`: limited Centerbase mock reference and approved summary
- `AppointmentReference`: Calendly mock reference
- `TemplateDocument`: fictional downloadable resource metadata
- `ProjectRequest`: flat-fee request and Adobe Sign mock state
- `InvoiceReference`: external invoice/payment display reference

## Legislative Tracking

- `Jurisdiction`: federal/state/city taxonomy
- `OrganizationCoverage`: active jurisdictions per organization
- `CoverageChangeRequest`: requested changes and approval state
- `LegislativeAlert`: content workflow, targeting, review, and sign-off
- `AlertRecipient`: organization/user eligibility, delivery, and read state

## Data ownership boundaries

- Shared entities must not contain GD legal-request body content.
- Signatrain objects must not reference privileged GD messages or attachments.
- `MatterReference` is intentionally incomplete; Centerbase remains authoritative in production.
- No raw card, ACH, or bank data exists in any model.
- Email outbox bodies must contain links/status language only, not confidential legal descriptions.

## Persistence

- Load immutable fixture files once.
- Copy them into a browser-persisted demo store.
- Persist mutations under a versioned storage key such as `gd-signatrain-demo-v1`.
- Reset deletes the storage key and reloads the seed.
- A fixture schema version mismatch must automatically reset safely.
