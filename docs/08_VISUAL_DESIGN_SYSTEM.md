# 8. Visual Design System

## Design intent

Professional, calm, credible, and operational. Avoid generic “AI startup” styling, excessive gradients, oversized marketing illustrations, or dense enterprise tables without hierarchy.

## Product themes

### Signatrain
- Primary: charcoal
- Accent: restrained gold
- Surface: warm white / light neutral
- Tone: modern professional-development platform

### Greenwald Doherty
- Demo placeholder theme: deep navy with restrained teal accent and neutral surfaces
- Tone: trusted professional-services client portal
- All GD theme tokens must be centralized so final brand assets can replace them easily.

### Shared/admin
- Neutral theme, with product badge/context visible.
- Legislative Tracking inherits the current portal theme; it never uses a “Company 3” brand.

## Layout

- Desktop-first at 1440×900; fully usable at 1024px and on common phone widths.
- Collapsible left navigation.
- Sticky top bar.
- Content max-width appropriate for dashboards and forms.
- Tables become cards or horizontally scroll on narrow screens.

## Core components

- App shell
- Product switcher
- Demo Controls drawer
- Persona selector
- Status badge
- Metric card
- Empty/restricted/error state
- Data table with filters
- Stepper/checklist
- Seat inventory card
- Course/module list
- Video progress player
- Session card and registration modal
- Certificate card and printable certificate
- Secure-message thread
- Internal-note component with warning treatment
- Attachment list
- Workflow timeline
- Legislative alert card
- Audit event list
- Confirmation dialog and toast

## Interaction quality

- Primary actions use clear verbs: Assign seat, Register, Submit for review, Approve alert, Publish, Convert to matter.
- Destructive/archive actions require confirmation.
- Every state change gives immediate visible feedback.
- Use skeletons or brief simulated latency only where it improves realism.
- Permission denial explains the required role/product without exposing hidden data.

## Accessibility baseline

- Semantic landmarks and headings
- Keyboard navigation and visible focus
- Labels and errors for forms
- Sufficient contrast
- Avoid color-only status communication
- Respect reduced-motion preference

Formal WCAG certification is not part of the demo.
