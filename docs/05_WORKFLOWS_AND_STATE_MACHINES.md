# 5. Workflows and State Machines

The canonical transitions are also available in `config/state-machines.json`.

## User invitation

`draft → pending → accepted → active`

Alternate transitions:
- `pending → expired`
- `pending → revoked`
- `expired → pending` through resend
- `active → archived → active`

## Organization

`prospect → active → archived → active`

- Archiving removes product access but retains all fictional history.
- Reactivation requires at least one active entitlement.

## Entitlement and subscription

`pending → active → cancel_at_period_end → expired`

Other states: `suspended`, `revoked`, `archived`.

- Self-service purchase becomes active only after mock payment success.
- Cancellation preserves access until the period end.
- No grace period is simulated.

## Training content

`draft → in_review → approved → published → archived`

- `in_review → rejected → draft`
- Published edits require a new draft transition in UI; the demo keeps a change log rather than full version rollback.

## Learning

Enrollment: `not_started → in_progress → completed`

Video:
- completion when unique watched coverage is `>= 0.95`;
- seeking does not count unwatched intervals;
- progress persists by user and asset.

Live registration: `not_registered → registered → attended → completed`

- attendance ratio is total attended minutes divided by scheduled minutes;
- completion when ratio is `>= 0.90`;
- admin override requires a reason and audit event.

Certificate: `not_eligible → eligible → issued → revoked`

## Live session

`draft → scheduled → registration_open → completed → recording_pending → recording_published`

Alternate: `scheduled|registration_open → cancelled`.

## GD onboarding task

`not_started → in_progress → submitted → accepted`

Alternate: `waived`, and authorized internal users may `reopen` an accepted/waived task.

## GD legal request

`submitted → triage → assigned → in_progress → resolved → closed`

Additional transitions:
- `triage|assigned|in_progress → waiting_for_client → in_progress`
- `assigned|in_progress → converted_to_matter`
- `converted_to_matter → closed`

Rules:
- privacy is enforced independently from status;
- only assigned attorney/GD Operations can change internal fields;
- client-visible status uses plain-language labels;
- internal note creation never triggers a client notification.

## Flat-fee project

`submitted → scoping → proposal_ready → sent_for_signature → signed → active → completed`

Alternate: `declined`, `cancelled`.

## Legislative alert

`draft → in_review → approved → published → archived`

- `in_review → rejected → draft`
- approval actor must have GDA role;
- publication blocked until approval actor and approval timestamp exist;
- audience targeting is recalculated on publish.

## Jurisdiction coverage request

`requested → approved` or `requested → rejected`.

Approved coverage changes affect future alert eligibility immediately in the demo.
