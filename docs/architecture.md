# Architecture

## Monorepo layout

```
modules/
├── services/            # one folder per service (Norse-named)
│   └── bragi/           # website — Astro + React + Tailwind
├── packages/            # shared libraries (added when needed)
├── tools/               # repo tooling (added when needed)
├── assets/              # shared brand assets, referenced by services
├── infra/
│   └── services/<svc>/{development,production}/envs.conf
├── docs/                # repo-level documentation (this folder)
├── .mise.toml           # primary task runner / tool versions
├── nx.json              # Nx task orchestration
├── pnpm-workspace.yaml  # workspaces + version catalogs
└── AGENTS.md            # canonical agent/contributor rules (vendor files symlink here)
```

## How services fit together

- Each service is **self-contained** and independently deployable.
- `pnpm-workspace.yaml` globs `services/*`, `packages/*`, `tools/*`, so new
  services are auto-discovered.
- Nx (`nx.json` + each service's `project.json`) orchestrates `build`, `lint`,
  `typecheck`, `test`, running only what changed.
- Shared code (when it appears) goes in `packages/`; services depend on packages,
  not on each other.

## A service's anatomy

Using `bragi` as the reference:

```
services/bragi/
├── package.json        # name: @modules/bragi, scripts
├── project.json        # Nx targets + tags (type:app, framework:astro, …)
├── astro.config.mjs    # framework config
├── tsconfig.json
├── Dockerfile          # multi-stage → nginx:alpine
├── nginx.conf
├── README.md           # service-level docs
└── src/
    ├── pages/          # routes
    ├── layouts/
    ├── components/
    └── styles/
```

## Deployment

Services are built and deployed by the shared **`monorepo_nx_pipeline`** (Jenkins).
There is **no per-repo Jenkinsfile**. Each service registers in the pipeline's
service catalog and provides its env config under
`infra/services/<svc>/{development,production}/`.

See [guardrails.md](./guardrails.md) for the pipeline and approval gates.
