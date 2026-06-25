# Repository guidance for Codex

## Mission
Build a polished, deterministic, disposable demo for the GD & Signatrain platform from the checked-in specification. Optimize for stakeholder validation, not production architecture.

## Read before coding
1. `START_HERE.md`
2. `docs/01_DEMO_SCOPE.md`
3. `config/route-manifest.json`
4. `config/demo-personas.json`
5. The relevant domain document for the task being implemented

## Required implementation approach
- Use Next.js App Router, React, strict TypeScript, Tailwind CSS, and reusable accessible components.
- Keep all data local and fictional. Seed from `mock-data/`; persist demo mutations in browser storage.
- Put all third-party behavior behind mock adapters. Never require real credentials or network services.
- Centralize role, entitlement, organization-scope, request-privacy, and route-access checks.
- Treat roles as additive. Product access still requires the relevant active entitlement.
- Provide a persistent **Demo Controls** panel with persona selection, product context, reset-data action, and scenario shortcuts.
- Every visible primary action must work. Do not leave dead buttons, placeholder links, or unexplained blank pages.
- Use realistic success, empty, restricted, validation, and recoverable-error states.
- Company 3 must never appear in navigation, page titles, products, or customer-facing copy.
- Do not expose privileged GD request content to technical platform roles or unrelated company users.
- Do not put confidential legal content in simulated email notifications.

## Non-goals
- No production authentication, database, API, file storage, payment processing, legal advice, email delivery, Zoom, Centerbase, Calendly, Adobe Sign, or Bot integration.
- No real customer names, employee data, legal documents, card data, tokens, or secrets.
- No native mobile app, SSO, SOC 2 implementation, or automated legislative monitoring.

## Engineering quality
- Prefer small, typed domain modules over page-specific business logic.
- Keep seed data immutable; write mutations to a resettable demo store.
- Use deterministic IDs and dates so screenshots and tests are stable.
- Add unit tests for permissions, completion thresholds, entitlement activation, request privacy, and state transitions.
- Add Playwright coverage for the critical presentation journeys.
- Use semantic HTML, keyboard-accessible controls, visible focus states, and sensible responsive behavior.

## Commands expected in the implemented repository
- `pnpm dev`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm build`

## Definition of done
A phase is complete only when its routes are navigable, all primary actions mutate visible state, permissions are enforced, tests pass, and the acceptance items for that phase are checked.
