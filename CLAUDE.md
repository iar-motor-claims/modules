# Modules — Working Rules

**Modules** is a monorepo of composable, sellable services. Right now it contains
**one service: `bragi`** (the website). More services get added over time, each as
`services/<norse-name>/`.

This file is for ANY developer or tool. The repo is editor/AI-agnostic — it works
with any setup as long as you go through **mise**.

## Non-negotiable conventions

1. **mise is the primary tooling.** Run `mise run <task>`, not raw `pnpm`/`nx`.
   Tasks pin tool versions and env so everyone (and CI) stays aligned.
   Start with `mise run info`.
2. **Services are Norse-named.** Every `services/<name>/` uses a Norse codename
   (see [NAMING.md](./NAMING.md)). No generic names. Package = `@modules/<name>`.
3. **Follow the monorepo pattern.** New services mirror the existing service's
   layout (see `services/bragi/`). Don't invent new top-level structures.
4. **CI/CD is the shared `monorepo_nx_pipeline`.** No per-repo Jenkinsfile.
   Each service registers in the pipeline's catalog.
5. **Version catalogs.** Dependencies use `catalog:` from `pnpm-workspace.yaml`.
6. **Shared assets** live once in root `assets/`, referenced by services.

## Repo layout

```
modules/
├── services/            # one folder per service (Norse-named)
│   └── bragi/           # website — Astro + React + Tailwind
├── packages/            # shared libs (when needed)
├── tools/               # repo tooling (when needed)
├── assets/              # shared brand assets
├── infra/services/<svc>/{development,production}/envs.conf
├── .mise.toml  nx.json  pnpm-workspace.yaml
```

## Before starting work

1. Install mise, then `mise install` and `mise run setup`.
2. `mise run info` to see tasks; `mise run list-services` to see services.
3. Decide: editing an existing service, or adding a new one?

## Working on the website (bragi)

```bash
mise run dev bragi        # dev server
mise run build bragi      # build static site → services/bragi/dist
mise run lint bragi
mise run typecheck bragi
```

- Pages: `services/bragi/src/pages/*.astro` (file = route)
- Layouts: `services/bragi/src/layouts/`
- Components: `services/bragi/src/components/` (`.astro` or `.tsx`)
- Styles: `services/bragi/src/styles/globals.css` (Tailwind)

## Adding a new service

1. Pick a Norse codename (NAMING.md) — add it to the table there.
2. Create `services/<codename>/` mirroring `services/bragi/`:
   - `package.json` → name `@modules/<codename>`, scripts (dev/build/lint/typecheck)
   - `project.json` → Nx targets + tags (`type:app`, `scope:services`, `framework:…`)
   - framework config, `Dockerfile`, `nginx.conf` (for web services)
   - `README.md` with the codename + role + why
3. `infra/services/<codename>/{development,production}/envs.conf`
4. Register `<codename>` in the `monorepo_nx_pipeline` catalog.
5. `mise run setup` then `mise run dev <codename>`.

## Never

- Call raw `pnpm`/`nx` in docs/scripts when a `mise run` task exists.
- Create a service with a non-Norse / generic name.
- Add a separate Jenkinsfile — use `monorepo_nx_pipeline`.
- Hardcode versions — use `catalog:`.
- Duplicate assets into a service — reference root `assets/`.

## Resources

- Astro: https://docs.astro.build
- Tailwind: https://tailwindcss.com/docs
- mise: https://mise.jdx.dev
- NAMING.md — the Norse naming convention
