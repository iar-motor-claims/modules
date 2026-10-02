# Modules Platform — Working Rules for Developers

## Repository Overview

**Modules** is a comprehensive product platform with **composable, sellable modules**:

- **AI modules** — LLM, document processing, agentic AI
- **Claims module** — Insurance/claims management
- **Shared packages** — Types, utilities, SDKs
- **Documentation** — Built-in marketing site (Astro)

**Technology Stack:**
- **mise:** PRIMARY tooling — manages tool versions, env, and ALL workflows
- **Node.js:** 22.15.3 (installed/pinned by mise)
- **pnpm:** 10.32.1 (installed/pinned by mise, workspaces)
- **CI/CD:** monorepo_nx_pipeline (Jenkins integration)

**mise is the entry point for everything.** Don't call `pnpm`/`nx` directly —
run `mise run <task>`. The tasks pin versions, set env vars, and keep every
contributor (and CI) on the same path. Run `mise run info` to discover tasks.

**Important:** This repository is **language-agnostic**. These rules are for developers contributing to Modules. Use any editor, any AI tool, or manual development — everything should just work via mise.

## Repository Structure

```
modules/
├── modules/              # Product modules (independent, sellable)
│   ├── ai/
│   ├── claims/
│   ├── document-processing/
│   └── agentic-ai/
├── packages/             # Shared libraries
│   ├── types/            # Shared types
│   ├── utils/            # Shared utilities
│   └── api-client/       # SDK
├── docs/                 # Documentation & marketing site
└── infra/                # Deployment configs
```  

## For Any Developer (Regardless of Tools)

This repository works with:
- **VS Code, JetBrains IDEs, Vim, or any editor**
- **GitHub Copilot, Claude, ChatGPT, or manual development**
- **Windows, macOS, or Linux**
- **Docker, Kubernetes, or local development**

### Before Starting Work

1. **Install mise** (if not already): https://mise.jdx.dev/getting-started.html
2. **Run `mise install`** — gets the pinned Node + pnpm
3. **Run `mise run setup`** — installs dependencies
4. **Run `mise run info`** — see every available task
5. **Understand:** Are you building a module, shared package, or documentation?
   - Module → `modules/<module-name>/` (scaffold with `mise run new-module <name>`)
   - Shared code → `packages/types/`, `packages/utils/`, `packages/api-client/`
   - Docs → Astro pages in `docs/pages/`
6. **Always use `mise run <task>`** — not raw `pnpm`/`nx`

## Adding a New Module

**Use the mise task — it scaffolds everything for you:**

```bash
mise run new-module <name>
```

This creates:
- `modules/<name>/package.json` (name: `@modules/<name>`)
- `modules/<name>/src/index.ts`
- `modules/<name>/__tests__/`
- `modules/<name>/README.md` (module-specific docs — ALWAYS fill this in)
- `modules/<name>/tsconfig.json`
- `infra/services/modules-<name>/{development,production}/envs.conf`

After scaffolding:
1. Fill in the module README (overview, API, usage)
2. `mise run setup` (link the new workspace)
3. `mise run dev <name>` to develop
4. Register `modules-<name>` in the monorepo_nx_pipeline catalog

## Adding a Shared Package

1. Create folder: `packages/new-pkg/`
2. Create `package.json` with name (e.g., `@modules-internal/new-pkg`)
3. Other modules import: `import {} from '@modules-internal/new-pkg'`
4. Cannot be sold separately (internal only)

## Adding Documentation Pages

1. Create file: `docs/pages/page-name.astro`
2. Use Astro + React for interactivity
3. Style with Tailwind CSS
4. Deploy via monorepo_nx_pipeline

Example page:

```astro
---
import '../styles/global.css';
---

<html lang="en">
  <head><title>Page</title></head>
  <body>
    <h1>Documentation</h1>
  </body>
</html>
```

## Common Commands (all via mise)

```bash
mise run info               # list all tasks
mise run dev                # start docs site
mise run dev <module>       # develop a specific module
mise run build              # build everything
mise run build <module>     # build one module
mise run test               # all tests
mise run test <module>      # one module's tests
mise run lint               # lint everything
mise run typecheck          # type-check everything
mise run format             # format code
mise run clean              # clear build output + caches
mise run new-module <name>  # scaffold a new module
mise run list-modules       # list modules + packages
mise run docker-build       # build docs Docker image
```

The tasks internally delegate to `nx`/`pnpm`, but contributors should always go
through `mise run` so versions and env stay consistent.

## Styling with Tailwind

- **Classes:** Use Tailwind utility classes
- **Global:** Add global CSS to `src/styles/global.css`
- **Variables:** Define CSS variables in `:root`

Never write custom CSS unless absolutely necessary.

## Environment Configuration

Environments are at: `infra/services/modules-website/{dev,prod}/envs.conf`

Variables loaded by monorepo_nx_pipeline:

```
ENVIRONMENT=development|production
NODE_ENV=production
SITE_URL=https://modules.iarservices.in
```

## Deployment

1. **Build:** `pnpm build` → `/dist` folder
2. **Docker:** `docker build -t modules-website:latest .`
3. **Deploy:** monorepo_nx_pipeline handles everything
4. **Access:** https://modules.iarservices.in (prod)

## Testing

### Unit/Component Tests

```bash
pnpm test              # Vitest
```

### E2E Tests

```bash
pnpm test:e2e          # Playwright
```

Write E2E tests for critical user flows.

## Git Workflow

1. Create branch from main
2. Make changes (pages, components, styles)
3. Test locally: `pnpm dev`
4. Commit with clear message
5. Push and create PR
6. monorepo_nx_pipeline CI runs tests
7. Merge when green

## Docker & Kubernetes

**Dockerfile:** Multi-stage build  
- Stage 1: Build with Node + pnpm
- Stage 2: Serve with Nginx + Alpine

**Health Check:** `/health` endpoint

**Port:** 80 (HTTP)

## Never

- Hardcode environment variables
- Add new npm packages without updating pnpm-lock.yaml
- Skip type checking or linting
- Deploy without running `pnpm build`
- Commit node_modules or dist folder

## Resources

- **Astro:** https://docs.astro.build
- **Tailwind:** https://tailwindcss.com/docs
- **React:** https://react.dev
- **Playwright:** https://playwright.dev
- **monorepo_nx_pipeline:** infra/jenkins/lib/vars/monorepo_nx_pipeline.groovy

## Support & Resources

### For Setup Issues
1. Ensure Node.js 22.15.3+ is installed: `node --version`
2. Ensure pnpm 10.32.1+ is installed: `pnpm --version`
3. Run `pnpm install` from the repo root
4. Check `.mise.toml` for task definitions

### For Development
1. Astro Documentation: https://docs.astro.build
2. pnpm Workspaces: https://pnpm.io/workspaces
3. TypeScript: https://www.typescriptlang.org
4. React: https://react.dev
5. Tailwind CSS: https://tailwindcss.com

### For Deployment
1. Jenkins: https://jenkins.iarservices.in
2. Pipeline: `monorepo_nx_pipeline` (see infra/)
3. Docker: see `Dockerfile` in repo root (if running individual module)

### For Modules Platform
1. GitHub: https://github.com/iar-motor-claims/modules
2. Product Site: https://modules.iarservices.in (when deployed)
3. Organization: https://github.com/iar-motor-claims

## Contributing

1. Fork or clone the repository
2. Create a feature branch
3. Make changes (add module, update package, etc.)
4. Run: `pnpm lint && pnpm typecheck && pnpm test`
5. Commit with clear message
6. Push and create PR
7. monorepo_nx_pipeline CI will run all checks
8. Merge when approved
