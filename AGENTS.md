# Modules — Agent & Contributor Rules

> **This is the single source of truth for how any agent or human works in this repo.**
> Tool-specific entrypoints (`CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`,
> `.cursor/rules/agents.mdc`) are symlinks to this file. Edit **only this file**.
> OpenAI Codex and other `AGENTS.md`-aware tools read this directly.

**Modules** is a monorepo of composable, sellable services. Right now it contains
**one service: `bragi`** (the website). More services get added over time, each as
`services/<norse-name>/`.

This repo is **agentic-AI-first and provider-agnostic.** It is designed to be driven
by autonomous coding agents regardless of model vendor (Claude, Gemini, Codex, Copilot,
Cursor, …). The contract that keeps every agent and human aligned is **mise**: all
capabilities are exposed as `mise run <task>`, so no agent needs vendor- or
machine-specific knowledge to build, test, or run anything.

## How agents should operate here

1. **Discover, don't assume.** Start every task with `mise run info` to list the
   available tasks, and `mise run list-services` to see services. The task list is the
   API; prefer it over guessing commands.
2. **Act through mise.** Every action (dev, build, lint, typecheck, test, deploy) runs
   as a `mise run <task>`. Never shell out to raw `pnpm`/`nx` when a task exists.
3. **Stay provider-neutral.** Do not add vendor-specific instructions, config, or
   assumptions to shared files. Agent guidance lives here in `AGENTS.md`; tool files
   are thin symlinks. Keep it that way.
4. **Mirror existing patterns.** New services copy the layout of `services/bragi/`.
   Don't invent new top-level structures.

## Agent enablement (context, tooling, MCP, verification)

Full operating manual: **[docs/agents.md](./docs/agents.md)**. In short:

- **Context:** this file + `services/<svc>/AGENTS.md` + `docs/` + `mise run info`.
- **Tooling:** everything is a `mise run <task>`. The done-gate is **`mise run verify`**
  (lint + typecheck + build); behavioral checks run with **`mise run e2e`**.
- **MCP:** servers are checked in at [`.mcp.json`](./.mcp.json) — `linear` (issues),
  `nx-mcp` (project graph/targets), `shadcn` (UI components), `playwright` (drive the
  website), `code-review-graph` (query code structure before grepping). Aligned with
  the org standard; provider-neutral, map to any MCP-aware agent.
- **Verify before done:** `mise run verify [svc]` → `mise run e2e [svc]` → for UI,
  confirm render via the Playwright MCP.

## Non-negotiable conventions

1. **mise is the primary tooling.** Run `mise run <task>`, not raw `pnpm`/`nx`.
   Tasks pin tool versions and env so everyone (and CI) stays aligned.
   Start with `mise run info`.
2. **Services are Norse-named.** Every `services/<name>/` uses a Norse codename
   (see [docs/conventions.md](./docs/conventions.md#naming)). No generic names.
   Package = `@modules/<name>`.
3. **Follow the monorepo pattern.** New services mirror the existing service's
   layout (see `services/bragi/`). Don't invent new top-level structures.
4. **CI/CD is the shared `monorepo_nx_pipeline`.** The root `Jenkinsfile` is thin —
   it only declares the service catalog and delegates to the shared library. No
   pipeline logic is duplicated here.
5. **Version catalogs.** Dependencies use `catalog:` from `pnpm-workspace.yaml`.
6. **Shared assets** live once in root `assets/`, referenced by services.

## Work tracking (Linear)

Work is tracked in Linear via the `linear` MCP. Before starting non-trivial work,
ensure a Linear issue exists; set it `In Progress` when you start and `Done` when the
PR merges. Use the branch name Linear returns and reference the issue id in the commit
/ PR. Use `assignee: "me"` and the repo's default team — don't hardcode UUIDs or spend
calls rediscovering them.

## Code graph (query before you grep)

If the `code-review-graph` MCP is connected, use it to **understand** code before
reaching for Grep/Glob/Read: `semantic_search_nodes` / `query_graph` to find things,
`get_impact_radius` for blast radius, `detect_changes` for review. It's faster and
cheaper than file scanning. Fall back to file reads for the specific lines you edit.
The graph is refreshed by `mise run graph-update` (run from husky `pre-push`), so it
stays current for the next session regardless of which tool made the changes.

## Repo layout

```
modules/
├── AGENTS.md            # ← this file: canonical agent/contributor rules
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

Follow [docs/add-a-service.md](./docs/add-a-service.md) — the full playbook. In short:
pick a Norse codename → scaffold `services/<codename>/` like `bragi` → add
`infra/services/<codename>/{development,production}/{envs.conf,values.yaml}` →
register it in the root `Jenkinsfile` catalog → `mise run dev <codename>`.

## Guardrails

See [docs/guardrails.md](./docs/guardrails.md): CODEOWNERS, conventional-commit
enforcement, husky hooks (`pre-commit`/`commit-msg`/`pre-push`), version catalogs,
and the production approval gate in `infra/jenkins/lib/config/environments.yaml`.

## Never

- Call raw `pnpm`/`nx` in docs/scripts when a `mise run` task exists.
- Create a service with a non-Norse / generic name.
- Put pipeline logic in the Jenkinsfile — it only declares the catalog.
- Hardcode versions — use `catalog:`.
- Duplicate assets into a service — reference root `assets/`.
- Add vendor-/model-specific instructions to shared files — keep guidance here,
  provider-neutral.

## Guardrails for agents (all tools)

This is the **provider-neutral safety policy.** Every tool enforces it in its own
config — Claude via `.claude/settings.json`, others via their equivalent (see
[docs/agents.md](./docs/agents.md#guardrails-across-tools)) — but the policy is the
same everywhere:

- **Never read, print, or commit secrets.** Don't open `.env` / `.env.*` or any
  secrets store. `infra/services/*/*/envs.conf` declares which vars exist; values
  come from the deploy environment (see [docs/env-configuration.md](./docs/env-configuration.md)).
- **Never edit `infra/services/*/production/*` without explicit human approval** —
  production is gated on purpose (`infra/jenkins/lib/config/environments.yaml`).
- **Ask before irreversible/outward actions** — `git push`, `docker`, deploys.
- **Writes default to `services/**` and `docs/**`.** Changing root config
  (`.mise.toml`, `nx.json`, `Jenkinsfile`, catalogs) is higher-impact — flag it.
- **Automation is tool-agnostic:** repeatable checks live in `mise run <task>` and
  husky git hooks, which fire for every tool and human. Don't encode required
  automation in a single tool's hook.

## Documentation map

- [README.md](./README.md) — what the repo is, owners, services table
- [docs/agents.md](./docs/agents.md) — agent enablement: context, tooling, MCP, verify loop
- [docs/conventions.md](./docs/conventions.md) — naming, mise-first, catalogs
- [docs/architecture.md](./docs/architecture.md) — layout, service anatomy
- [docs/guardrails.md](./docs/guardrails.md) — CI/CD, CODEOWNERS, hooks, gates
- [docs/add-a-service.md](./docs/add-a-service.md) — add-a-service playbook
- `services/<name>/README.md` — per-service docs

## Resources

- Astro: https://docs.astro.build · Tailwind: https://tailwindcss.com/docs · mise: https://mise.jdx.dev
