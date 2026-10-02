# Modules

A monorepo of composable, sellable AI & business services. Each capability ships
as an independent service, built and deployed through the shared
`monorepo_nx_pipeline`.

## Owner

**ZOOP Claims Team** — see [CODEOWNERS](./.github/CODEOWNERS).

## Services

Services live in `services/<codename>/` and are named after Norse figures
(see [docs/conventions.md](./docs/conventions.md#naming)).

| Service | Role | Stack | Docs |
|---------|------|-------|------|
| **bragi** | Marketing/product website | Astro · React · Tailwind | [service README](./services/bragi/README.md) |

## Quick start

mise is the primary tooling — it installs the pinned Node + pnpm for you.

```bash
# install mise: https://mise.jdx.dev/getting-started.html
mise install          # pinned Node 24.21.0 + pnpm 12.8.2
mise run setup        # install dependencies
mise run dev bragi    # start the website
mise run info         # list all tasks
```

## Documentation

| Doc | What's in it |
|-----|--------------|
| [docs/conventions.md](./docs/conventions.md) | Naming (Norse), mise-first, version catalogs, assets |
| [docs/architecture.md](./docs/architecture.md) | Monorepo layout, how services fit together |
| [docs/guardrails.md](./docs/guardrails.md) | CI/CD, CODEOWNERS, hooks, pipeline, approval gates |
| [docs/add-a-service.md](./docs/add-a-service.md) | Step-by-step to add a new service |
| [CLAUDE.md](./CLAUDE.md) | Rules for developers & AI agents |

Each service also has its own README (and docs) under `services/<name>/`.
