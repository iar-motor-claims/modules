# Playbook: Explore the codebase

Tool-neutral runbook for understanding this repo before making a change. Any agent
(or human) can follow this; the Claude skill `.claude/skills/explore-codebase.md`
points here.

## Steps

1. **Read the rules first.** [`AGENTS.md`](../../AGENTS.md) (root) +
   `services/<svc>/AGENTS.md` for the service you're touching.
2. **Discover capabilities.** `mise run info` and `mise run list-services` — the task
   list is the API; don't guess commands.
3. **Map the workspace.** Use the `nx-mcp` MCP (or `nx show projects` / `nx graph`)
   to see projects, targets, and dependencies. If `code-review-graph` is connected,
   `get_architecture_overview` + `semantic_search_nodes` beat grepping.
4. **Locate the work.** Only then open files — start at the service's `src/` and its
   `project.json` targets.
5. **Confirm the loop.** Know how you'll verify before you edit: `mise run verify
   <svc>` and `mise run e2e <svc>`.

## Rule

Prefer structural tools (nx graph, code-review-graph) over Grep/Glob/Read for
*understanding*; use file reads for the specific lines you need to change.
