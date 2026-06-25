# Master prompt for Codex

Read `AGENTS.md`, `START_HERE.md`, all files in `docs/`, `config/route-manifest.json`, and `config/demo-personas.json`. This repository is the specification for a disposable GD & Signatrain demo.

Before editing:
1. Summarize the architecture and product boundaries in no more than 12 bullets.
2. Propose the repository tree and the Phase 0/Phase 1 implementation plan.
3. Identify any contradiction in the checked-in specification. Do not invent missing product behavior; choose the documented demo assumption when one exists.

Then implement only Phase 0 and Phase 1 from `docs/11_BUILD_SEQUENCE.md`.

Requirements:
- Next.js App Router, strict TypeScript, Tailwind, accessible reusable components.
- Local fixture-backed resettable store; no secrets and no real integrations.
- Functional Demo Controls, persona switching, product switching, route guards, and placeholder dashboards with real navigation.
- Unit tests for role + entitlement access and request privacy foundations.
- Run lint, typecheck, tests, and build before reporting completion.

At the end, provide: files changed, commands run, test results, known gaps, and the exact next prompt to use.
