# Agent enablement

How this repo is set up to be driven by autonomous coding agents — regardless of
model vendor. If you're an agent, this is your operating manual; if you're a human,
this is the contract agents work under.

The design goal: an agent needs **only** the repo + mise to be fully productive. No
vendor-specific knowledge, no tribal setup. Five layers make that true.

## 1. Context — what to read

| Source | What it gives you |
|---|---|
| [`AGENTS.md`](../AGENTS.md) (root) | the rules — provider-neutral, single source of truth |
| `services/<svc>/AGENTS.md` | service-scoped rules; merge with root |
| [`docs/`](./) | conventions, architecture, guardrails, add-a-service playbook |
| `mise run info` / `mise tasks` | the capability API — what you can *do* |
| `mise run list-services` | services in the monorepo |
| nx graph (`nx show projects`, `nx graph`) | machine-readable project map + dependencies |

**Rule:** discover, don't assume. Start every task with `mise run info`.

## 2. Action tooling — how to do things

Everything is a `mise run <task>`. Never shell out to raw `pnpm`/`nx` when a task
exists.

| Task | Use |
|---|---|
| `mise run setup` | install dependencies |
| `mise run dev [svc]` | dev server(s) |
| `mise run build [svc]` | build |
| `mise run lint [svc]` | lint |
| `mise run typecheck [svc]` | type-check |
| `mise run test [svc]` | unit tests |
| `mise run e2e [svc]` | end-to-end (Playwright) |
| `mise run format` / `format-check` | Prettier write / check |
| `mise run verify [svc]` | **the done-gate** (lint + typecheck + build) |

## 3. MCP tools — external capabilities

Repo-relevant MCP servers are checked in at [`.mcp.json`](../.mcp.json) (Claude Code
reads it natively; other agents map these entries to their own config):

| Server | Why it's here |
|---|---|
| **nx** | project graph, targets, generators — reason about the monorepo instead of guessing |
| **playwright** | drive a real browser against the website — the behavioral/visual check |
| **docs** (Context7) | current Astro/Tailwind/React docs — don't hallucinate APIs |

Keep `.mcp.json` lean and repo-relevant. To add a server, justify it against a real
task class here — not "might be handy."

## 4. Verification loop — prove it works

Agents must self-verify before declaring done:

1. `mise run verify [svc]` — static + build gate (fast, deterministic).
2. `mise run e2e [svc]` — behavioral gate (Playwright). Extend the smoke test when
   you add behavior.
3. For visible UI changes, use the **playwright** MCP to load the page and confirm it
   renders as intended.

This mirrors CI and the husky `pre-push` hook, so "green locally" means "green in the
pipeline."

## 5. Guardrails — what not to break

See [guardrails.md](./guardrails.md) for the full set (CODEOWNERS, commitlint, husky
hooks, production approval gate). Agent-specific boundaries:

- **Never edit `infra/services/*/production/*`** without explicit human approval — it
  is gated on purpose.
- **Never print, commit, or exfiltrate secrets.** `infra/.../envs.conf` describes
  which env vars exist; values come from the deploy environment, not the repo.
- **Commits follow Conventional Commits** (enforced by commitlint) — the `commit-msg`
  hook will reject non-conforming messages.
- **Stay provider-neutral.** Agent guidance lives in `AGENTS.md`; don't scatter
  vendor-specific instructions into shared files.

## Onboarding a new agent/tool

1. Point it at the repo and let it read `AGENTS.md` (symlinked as `CLAUDE.md`,
   `GEMINI.md`, `.cursor/rules/agents.mdc`, `.github/copilot-instructions.md`;
   Codex reads `AGENTS.md` directly).
2. If it supports MCP, map `.mcp.json`.
3. That's it — `mise run info` tells it the rest.
