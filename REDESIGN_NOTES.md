# Redesign v2 — Modern SaaS (Linear/Stripe direction)

## Changed files

| File | Change |
|---|---|
| `app/brand-tokens.css` | Full rewrite: dark application shell (topbar + sidebar), light content canvas, new elevation/glow system, hero panel, persona/plan cards, motion keyframes (fade-up, scale-in, stagger, progress-grow), reduced-motion support |
| `app/globals.css` | Font smoothing, balanced headings, themed focus ring, selection color, custom scrollbars |
| `components/AppShell.tsx` | Gradient brand tile in topbar, page-enter transition keyed by pathname, redesigned landing hero + persona cards with avatars, modernized pricing cards, animated count-up metric values, stagger animations on card grids, product cards with icons |

## Design decisions

- **Dark shell, light canvas** — topbar and sidebar use a deep, per-brand dark surface; content stays light and airy for readability.
- **Brand hues preserved** — Signatrain keeps teal/green energy, GD keeps navy/cyan trust; shared core uses a neutral indigo. Each theme drives shell color, accents, glow shadows, and radii from CSS variables, so final brand assets can still replace tokens centrally (per docs/08).
- **Motion is CSS-only** — no new dependencies; every animation respects `prefers-reduced-motion`.

## Verified

- `pnpm typecheck` clean
- `pnpm lint` clean (max-warnings=0)
- `pnpm test` 6/6 pass
- `pnpm build` succeeds
