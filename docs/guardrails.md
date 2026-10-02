# Guardrails

How this repo is governed. These mirror the iar-claims monorepo guardrails so the
two repos behave identically.

## Code ownership — `.github/CODEOWNERS`

Automatic PR reviewer assignment. **Owner: ZOOP Claims Team.**

- Default → `@iar-motor-claims/developer`
- `/infra/`, `/.github/`, root config (`nx.json`, `pnpm-workspace.yaml`, `.mise.toml`,
  `commitlint.config.js`, `.husky/`) → `@iar-motor-claims/leads`
- `/services/` → `@iar-motor-claims/developer`

## Conventional commits — `commitlint.config.js`

Enforced by the `commit-msg` hook. Allowed types: `feat, fix, docs, style, refactor,
perf, test, build, ci, chore, format, revert`. Scope must be kebab-case; header ≤ 100
chars. Example: `feat(bragi): add pricing page`.

## Git hooks — `.husky/`

| Hook | Runs | Enforces |
|------|------|----------|
| `pre-commit` | `mise install`+`mise lock` (if `.mise.toml` changed), then `nx affected -t typecheck lint build` | no broken affected code gets committed |
| `commit-msg` | `commitlint --edit` | conventional commit format |
| `pre-push` | `nx affected -t build` | everything affected builds before push |

Hooks install via the root `prepare` script (`husky`) on `pnpm install` / `mise run setup`.

## Version catalogs — `pnpm-workspace.yaml`

Services reference dependency versions with `catalog:` — no hardcoded versions, no
drift. Catalogs: `default`, `astro`, `react19`.

## Nx task graph — `nx.json`

`build`/`lint`/`typecheck`/`test` are cached and declare `dependsOn: ["^<target>"]`
so dependencies run first. `parallel: 5`. `workspaceLayout.appsDir = services`.

## CI/CD — shared `monorepo_nx_pipeline`

The thin root `Jenkinsfile` calls the shared library and declares only the service
catalog (`bragi → frontend/node`). The library owns detection → build → test →
approval → deploy. No pipeline logic is duplicated here.

### Environment matrix & approval gates — `infra/jenkins/lib/config/environments.yaml`

| Env | requireApproval | Vuln severity | Notes |
|-----|-----------------|---------------|-------|
| development | false | MEDIUM | auto-deploy |
| staging (uat) | false | HIGH | auto-deploy, release notes |
| **production** | **true** | CRITICAL | 🔒 approval gate, approvers `claims-lead,release-manager`, 2h timeout |

Production deploys **block** on an approval prompt; dev/uat auto-proceed.

## Per-service deploy config — `infra/services/<svc>/<env>/`

Each service provides, per environment:

- `envs.conf` — env vars; secrets use `google_secret:<key>` (fetched from Google
  Secret Manager at deploy, never hardcoded)
- `values.yaml` — Helm values (image, resources, HPA, probes, gateway hostnames)

Example: `infra/services/bragi/{development,production}/{envs.conf,values.yaml}`.

## Secret naming

Secrets are referenced as `google_secret:<env>-<shortform>-<key>` (same scheme as
iar-claims). Non-secret config stays in version control.
