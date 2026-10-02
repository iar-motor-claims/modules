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

MCP servers are checked in at [`.mcp.json`](../.mcp.json) (Claude Code reads it
natively; other agents map these entries to their own config). The set is aligned
with the org standard (`../claims/mcp.json`):

| Server | Why it's here |
|---|---|
| **linear** | read/update the Linear issues the work is tracked against |
| **nx-mcp** | project graph, targets, generators — reason about the monorepo instead of guessing |
| **shadcn** | browse/add shadcn UI components into bragi's React islands |
| **playwright** | drive a real browser against the website — the behavioral/visual check |
| **code-review-graph** | knowledge graph — query code structure/impact before grepping (see "query before you grep") |

> Only the `mcpServers` key is read by Claude Code — a `servers` key is silently
> ignored. Keep `.mcp.json` lean and repo-relevant; to add a server, justify it
> against a real task class here — not "might be handy."

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

## Staying provider-agnostic (the substance/adapter rule)

Rules have a cross-tool standard (`AGENTS.md`); permissions, hooks, skills, and
subagents **do not** yet. So for those we keep the *substance* in a neutral home and
make each tool's native file a thin adapter pointing at it:

| Capability | Neutral home (substance) | Per-tool adapters |
|---|---|---|
| Rules / context | `AGENTS.md` + `docs/` | `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/agents.mdc`, `.github/copilot-instructions.md` (symlinks); Codex reads `AGENTS.md` |
| Guardrails / permissions | policy in `AGENTS.md` → *Guardrails for agents* | `.claude/settings.json`; Gemini `settings.json`; Codex sandbox/approval; Cursor allowlist |
| Automation / hooks | `mise run <task>` + husky git hooks | `.claude/settings.json` hooks = optional in-session accelerator |
| Skills / playbooks | `docs/playbooks/*.md`, `docs/add-a-service.md` | `.claude/skills/*` pointer files; Cursor commands; Codex prompts |
| Subagents | documented roles in `docs/` (deferred) | `.claude/agents/*` |
| MCP servers | `.mcp.json` | each MCP-aware tool maps the same entries |

**Honest limits:** hard permission *enforcement*/sandboxing and in-session hooks are
per-tool — only the *policy* and git-level automation are truly portable. That's why
required automation lives in husky + mise, not a tool hook.

### Guardrails across tools

The policy is in `AGENTS.md` → *Guardrails for agents*. Enforcement mapping:

| Rule | Claude (`.claude/settings.json`) | Other tools |
|---|---|---|
| Can't read secrets | `deny: Read(./.env*)`, `Read(./secrets/**)` | Gemini `excludeTools`/deny; Codex sandbox; Cursor ignore/allowlist |
| Writes scoped to `services/**`,`docs/**` | `allow: Write/Edit(...)` | tool's write-scope / approval mode |
| Ask before `git push`/`docker`/prod edits | `ask: Bash(git push:*)`, `Bash(docker:*)`, `…/production/**` | approval mode / confirm-on-command |
| Keep code graph fresh | `PostToolUse` hook → `mise run graph-update` | husky `pre-push` runs it for everyone |

To onboard a new tool's guardrails: translate the same four rows into that tool's
config — don't rewrite the policy.

## Onboarding a new agent/tool

1. Point it at the repo and let it read `AGENTS.md` (symlinked as `CLAUDE.md`,
   `GEMINI.md`, `.cursor/rules/agents.mdc`, `.github/copilot-instructions.md`;
   Codex reads `AGENTS.md` directly).
2. If it supports MCP, map `.mcp.json`.
3. That's it — `mise run info` tells it the rest.
