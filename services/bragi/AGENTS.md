# bragi — service rules (scoped)

> Service-scoped context. Agents merge this with the root
> [`AGENTS.md`](../../AGENTS.md); root rules still apply. Package: `@modules/bragi`.

**What this is:** the Modules marketing/product website. Astro + React islands +
Tailwind, built to a static site in `dist/`, served by nginx (see `nginx.conf` /
`Dockerfile`).

## Run it (always via mise, from repo root)

```bash
mise run dev bragi          # dev server (http://localhost:4321)
mise run build bragi        # static build → services/bragi/dist
mise run lint bragi
mise run typecheck bragi    # astro check
mise run e2e bragi          # Playwright behavioral tests
mise run verify bragi       # lint + typecheck + build — the done-gate
```

First e2e run on a machine: `pnpm exec playwright install chromium` (one-time).

## Where things live

| Thing | Path | Note |
|---|---|---|
| Pages (routes) | `src/pages/*.astro` | file name = route |
| Layouts | `src/layouts/` | |
| Components | `src/components/` | `.astro` or `.tsx` (React islands) |
| Styles | `src/styles/globals.css` | Tailwind |
| Static assets | `public/` | served as-is; shared brand assets come from repo-root `assets/` |
| E2E tests | `e2e/*.spec.ts` | Playwright; `playwright.config.ts` boots the dev server |

## Service conventions

- **React is for islands only.** Default to `.astro`; reach for `.tsx` when a
  component needs client interactivity, and add the appropriate `client:*` directive.
- **Dependencies use `catalog:`** (`astro`, `react19`, `default`) — never hardcode a
  version in `package.json`.
- **Don't duplicate brand assets here** — reference repo-root `assets/`.
- **Extend the smoke test** (`e2e/smoke.spec.ts`) as you add pages/flows; it's the
  seed of the verification loop.

## Definition of done (bragi)

1. `mise run verify bragi` passes (lint + typecheck + build).
2. `mise run e2e bragi` passes (or you added/updated tests for new behavior).
3. For visible UI changes, confirm it renders — drive the page via the Playwright MCP
   (see root [`docs/agents.md`](../../docs/agents.md)).
