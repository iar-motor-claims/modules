# Modules

**Modules** is a platform of composable, sellable AI & business capabilities. Each
capability ships as an independent service in this monorepo, built and deployed
through the shared `monorepo_nx_pipeline`.

- **Services** live in `services/<codename>/` and are named after Norse figures
  (see [NAMING.md](./NAMING.md)).
- **Tooling** is driven by **mise** — run `mise run <task>`.
- **CI/CD** is the shared `monorepo_nx_pipeline` (Jenkins).

## Current services

| Service | Role | Stack |
|---------|------|-------|
| [**bragi**](./services/bragi) | Marketing/product website | Astro + React + Tailwind |

More services are added over time — each as a new `services/<norse-name>/`.

## Quick start

mise is the primary tooling. It installs the pinned Node + pnpm for you.

```bash
# install mise: https://mise.jdx.dev/getting-started.html
mise install          # pinned Node 22.15.3 + pnpm 10.32.1
mise run setup        # install dependencies
mise run dev bragi    # start the website dev server
```

## Common tasks (all via mise)

```bash
mise run info               # list tasks
mise run dev <service>      # start a service dev server
mise run build [service]    # build all services (or one)
mise run lint [service]     # lint
mise run typecheck [service]# type-check
mise run test [service]     # test
mise run clean              # clear build output + caches
mise run list-services      # list services
```

## Monorepo layout

```
modules/
├── services/            # one folder per service (Norse-named)
│   └── bragi/           # the website (Astro)
├── packages/            # shared libraries (added when needed)
├── tools/               # repo tooling (added when needed)
├── assets/              # shared brand assets, used by all services
├── infra/
│   └── services/<svc>/{development,production}/envs.conf
├── .mise.toml           # primary tooling / task runner
├── nx.json              # Nx task orchestration
└── pnpm-workspace.yaml  # workspaces + version catalogs
```

## Adding a service

1. Pick a Norse codename (see [NAMING.md](./NAMING.md)).
2. Create `services/<codename>/` following the Bragi layout
   (`package.json` as `@modules/<codename>`, `project.json` with Nx targets/tags,
   framework config, `Dockerfile`, `nginx.conf`).
3. Add `infra/services/<codename>/{development,production}/envs.conf`.
4. Register `<codename>` in the `monorepo_nx_pipeline` services catalog.
5. `mise run setup` then `mise run dev <codename>`.

## Conventions

- **mise-first** — go through `mise run`, not raw `pnpm`/`nx`.
- **Norse names** — every service is themed (NAMING.md).
- **Version catalogs** — dependencies use `catalog:` from `pnpm-workspace.yaml`.
- **Shared assets** — live once in root `assets/`, referenced by services.
- **Pipeline** — deploys via shared `monorepo_nx_pipeline`, no per-repo Jenkinsfile.
