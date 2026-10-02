# Playbook: Review changes

Tool-neutral runbook for a risk-aware review of the current diff. Any agent (or human)
can follow this; the Claude skill `.claude/skills/review-changes.md` just points here.

## Steps

1. **Scope the diff.** `git status` + `git diff` (or `nx affected --target=build --graph`
   to see which services are touched).
2. **Use the code graph if available.** If the `code-review-graph` MCP is connected,
   run `detect_changes` for risk-scored analysis and `get_impact_radius` for blast
   radius — it's cheaper and more structural than reading files. Fall back to
   reading the diff directly if the graph isn't there.
3. **Check the gates.** Confirm `mise run verify <svc>` passes (lint + typecheck +
   build) and `mise run e2e <svc>` covers new behavior.
4. **Trace coverage.** For each risky change, check it has a test (graph
   `query_graph pattern="tests_for"`, or look under the service's `e2e/`).
5. **Check conventions.** mise-first (no raw pnpm/nx), `catalog:` versions, Norse
   service names, no secrets/assets duplicated — see [../conventions.md](../conventions.md).

## Output

Group findings by risk (high/medium/low). For each: what changed, why it matters,
test-coverage status, suggested fix, and an overall merge recommendation.
