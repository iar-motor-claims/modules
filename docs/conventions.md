# Conventions

The non-negotiable rules for working in this repo. Also see [AGENTS.md](../AGENTS.md).

## mise-first

**mise is the primary tooling.** Always go through `mise run <task>` — not raw
`pnpm`/`nx`. The tasks pin tool versions (Node 24.21.0, pnpm 12.8.2, nx) and set
env so every contributor and CI stay aligned. Start with `mise run info`.

## Naming — Norse Mythology

**Every service in `services/` is named after a Norse figure.** The name should
reflect what the service does. Hard rule: when a new service is created, the first
question is *"what's its Norse name?"* — no generic names like `web` or `api`.

- **Workspace package:** `@modules/<codename>` (e.g. `@modules/bragi`)
- **Pipeline service:** `<codename>` (e.g. `bragi`)
- **Deploy config:** `infra/services/<codename>/{development,production}/envs.conf`

### Services

| Codename | Role | Why this name |
|----------|------|---------------|
| **Bragi** | Marketing/product website | God of poetry & eloquence — presents and tells the platform's story |

### Unclaimed name ideas

| Candidate | Fits a service about... |
|-----------|-------------------------|
| **Heimdall** | monitoring / observability / gateway (the all-seeing watchman) |
| **Odin** | AI / reasoning (all-father, wisdom) |
| **Mimir** | document processing / knowledge (keeper of the well of wisdom) |
| **Forseti** | claims / dispute settlement (god of justice) |
| **Loki** | agentic AI (shapeshifter, adaptive) |
| **Saga** | analytics / audit history (goddess of history & storytelling) |
| **Ratatoskr** | messaging / event bus (carries messages across Yggdrasil) |
| **Yggdrasil** | core platform / orchestration (the world tree) |

## Version catalogs

Dependencies use `catalog:` references from `pnpm-workspace.yaml`. Never hardcode a
version in a service's `package.json` — add it to the catalog and reference it.
Catalogs: `default`, `astro`, `react19`.

## Shared assets

Brand assets live once in the repo-root `assets/` directory and are referenced by
services. Don't duplicate assets into a service.

## Agentic-AI-first, provider-agnostic

This repo is built to be driven by autonomous coding agents, independent of model
vendor. Everything runs through mise, so there is no tool-specific setup required to
build, test, or run a service — any agent discovers capabilities via `mise run info`.

**Agent instructions have one home: [`AGENTS.md`](../AGENTS.md)** (the cross-tool
standard read by OpenAI Codex, Cursor, Copilot, Gemini, and others). Every
vendor-specific entrypoint is a **symlink** to it, so there is exactly one file to
maintain:

| File | Tool | Kind |
|------|------|------|
| `AGENTS.md` | Codex + any `AGENTS.md`-aware agent | source of truth |
| `CLAUDE.md` | Claude Code | → symlink to `AGENTS.md` |
| `GEMINI.md` | Gemini CLI | → symlink to `AGENTS.md` |
| `.cursor/rules/agents.mdc` | Cursor | → symlink to `AGENTS.md` |
| `.github/copilot-instructions.md` | GitHub Copilot | → symlink to `AGENTS.md` |

**Rules:** edit only `AGENTS.md`; never add vendor-/model-specific guidance to shared
files; to onboard a new tool, add a symlink to `AGENTS.md`, not a new copy.
