# 1. Demo Scope

## Objective

Create a convincing interactive demo that lets a stakeholder experience the proposed platform from multiple roles without a production backend. The demo must answer four questions:

1. What does each user type see?
2. How do GD and Signatrain connect without merging their sensitive data?
3. How do the principal workflows behave?
4. Is the product structure coherent enough to proceed to production estimation and development?

## Included domains

### Shared Platform Core
- Demo sign-in/persona selection
- Organizations and organization context
- Additive role assignments
- Product entitlements and entitlement sources
- Seat pools, assignment, transfer, archive, and reactivation
- Cross-product “My Products” switcher
- Billing overview and simulated checkout
- In-app notifications, simulated email outbox, and partial audit history
- CSV export for selected reports

### Signatrain
- HR and Manager dashboards
- Course, module, video, document, and optional evaluation experiences
- Standalone scenario library
- Ordered learning sequences
- Video progress and 95% unique-watch completion
- Live-session listing, selection, registration, and simulated Zoom handoff
- 90% live-attendance completion
- HR Masterclasses and Risk Roundtable
- Manager core program and private company cohort
- Company-specific cohort materials
- Content draft/review/approve/publish/archive workflow
- Certificate eligibility, issue, download, revoke, and public verification
- Third-party Bot represented by a safe mock embed for entitled HR users

### Greenwald Doherty
- GD plan and benefit overview
- Client onboarding checklist and mock file uploads
- Legal-request intake with company-visible or restricted privacy
- GD operations triage, categorization, priority, assignment, and status changes
- Secure client-visible messages and internal-only notes
- Limited Centerbase matter reference and summary
- Calendly scheduling simulation
- Template library
- Flat-fee project request and Adobe Sign simulation
- Billing/invoice references without reproducing legal accounting
- GD-included Signatrain HR seat provisioning

### Legislative Tracking MVP-Lite
- Jurisdiction coverage display and change request
- Alert draft, review, attorney approval, publication, distribution, archive
- Targeting by jurisdiction, audience, and entitlement
- Portal/email notification simulation
- Read/unread state and company delivery/read summary

## Demo priorities

### P0 — presentation-critical
- Shared persona/product switching
- Company user and seat management
- HR learning and certificate path
- Manager program view
- Live-session registration
- GD onboarding and legal request workflow
- GD operations/attorney processing
- Legislative alert workflow
- Simulated online purchase

### P1 — supporting depth
- Cancellation/archive/reactivation
- Private cohort administration
- Session recording approval
- Flat-fee project/Adobe Sign flow
- Jurisdiction coverage request
- Limited reports and audit views
- Template administration

## Explicit non-goals
- Production code reuse or migration guarantees
- Real authentication or MFA
- Real payments or financial reconciliation
- Real legal advice or matter management
- Real uploads or document retention
- Real outbound email
- Real Zoom, Centerbase, Calendly, Adobe Sign, HubSpot, Fireflies, Bot, or video-hosting calls
- Automated legislative monitoring, scraping, or AI legal summaries
- Full assessment engine or proctoring
- Direct SHRM/HRCI API integration
- White-label customer branding
- Native mobile applications

## Data safety

All names, companies, legal requests, documents, payments, certificates, alerts, and conversations are fictional. A persistent “Demo — fictional data” banner must be visible. The demo must include a one-click reset to the original fixture state.
