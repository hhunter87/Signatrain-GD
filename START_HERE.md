# Start Here

This specification should be used in a **new repository dedicated to the disposable demo**.

## Recommended Codex workflow

1. Create a clean Git repository and copy this full specification package into it.
2. Open the repository in Codex.
3. Give Codex `prompts/00_MASTER_PROMPT.md`.
4. Require Codex to return a short implementation plan and file tree before editing.
5. Execute the build one phase at a time using prompts `01` through `06`.
6. Create a Git checkpoint after each accepted phase.
7. Use `docs/09_ACCEPTANCE_CRITERIA.md` as the final checklist and `docs/12_DEMO_PRESENTATION_SCRIPT.md` for rehearsal.

## Build policy

Do not connect production services. The default implementation must run after a normal dependency install with no environment variables. Optional environment-variable support may exist only for future replacement of mock adapters and must not be required.

## First implementation target

Phase 1 must produce:

- working application shell;
- demo persona selector;
- shared product switcher;
- permission and entitlement gates;
- seeded organizations and users;
- resettable local state;
- Signatrain and GD placeholder dashboards with real navigation;
- automated tests for access rules.

Do not begin detailed domain workflows until this foundation works.
