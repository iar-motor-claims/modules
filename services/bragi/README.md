# Bragi — Modules Website

> **Codename:** Bragi (Norse god of poetry & eloquence)
> **Role:** Public-facing marketing/product website for the Modules platform
> **Package:** `@modules/bragi` · **Pipeline service:** `bragi`

## Stack

Astro 6 + React 19 + Tailwind CSS 4, served as static files via nginx.

## Develop (via mise, from repo root)

```bash
mise run dev bragi        # start dev server
mise run build bragi      # build static site → dist/
mise run lint bragi       # lint
mise run typecheck bragi  # astro check
```

## Structure

```
services/bragi/
├── src/
│   ├── pages/        # routes (index.astro, etc.)
│   ├── layouts/      # BaseLayout.astro
│   ├── components/   # .astro / .tsx components
│   └── styles/       # globals.css (Tailwind)
├── public/           # static files served as-is
├── astro.config.mjs
├── Dockerfile        # multi-stage → nginx:alpine
├── nginx.conf
└── project.json      # Nx targets + tags
```

## Deploy

Built and deployed by `monorepo_nx_pipeline` as service `bragi`.
Env config: `infra/services/bragi/{development,production}/envs.conf`

## Shared assets

Reference shared brand assets from the repo-root `assets/` directory.
