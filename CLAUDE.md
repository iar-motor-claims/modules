# Modules Platform — Agent Working Rules

## Monorepo Overview

**Modules** is a standalone monorepo (separate from `claims/`) for a modular product platform sold as composable modules.

- **Monorepo tool:** Nx + pnpm workspaces
- **Language:** Primarily TypeScript/JavaScript
- **Node.js:** 22.15.3+
- **pnpm:** 10.32.1+

## Project Structure

```
modules/
├── packages/       # Shared libraries (@modules/*)
├── services/       # Standalone services (APIs, frontends, workers)
├── tools/          # Development tooling & CLIs
└── .claude/        # Claude Code configuration
```

## Before Starting Work

1. **Understand the task:** Is it a new package, service, or tooling work?
2. **Follow conventions:** Use `@modules/` namespace for all packages
3. **Use version catalogs:** Never hardcode versions — use `pnpm-workspace.yaml` catalogs
4. **Type safety:** Strict TypeScript in all new code

## When Adding a New Package

1. Create folder: `packages/package-name/`
2. Create `package.json` with name `@modules/package-name`
3. Add `tsconfig.json`, `.eslintrc.json`
4. Add `src/index.ts` as entry point
5. Run `pnpm install` from repo root
6. Test: `pnpm nx test package-name`

Example `package.json`:

```json
{
  "name": "@modules/package-name",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:",
    "eslint": "catalog:"
  }
}
```

## When Adding a New Service

1. Create folder: `services/service-name/`
2. Create `package.json` with name `service-name` (or `@modules/service-name` if published)
3. Follow the same structure as `packages/` but include app-specific logic
4. Register in `.github/workflows/` if it needs CI/CD

## Nx Commands (Most Common)

```bash
# Build specific project
pnpm nx build @modules/package-name

# Run tests
pnpm nx test @modules/package-name
pnpm nx test @modules/package-name --coverage

# Lint
pnpm nx lint @modules/package-name

# Type check
pnpm nx typecheck @modules/package-name

# View dependency graph
pnpm nx graph
pnpm nx graph --file=graph.html

# Run all tasks for affected packages
pnpm nx run-many --target=test --all
```

## Linting & Formatting

- **ESLint:** Configured in `.eslintrc.json` (root) + per-project
- **Prettier:** Uses `.prettierrc.json` (100-char line width)
- **TypeScript strict mode:** Enabled globally

```bash
pnpm lint                # Check all packages
pnpm format:check        # Check formatting
pnpm format              # Auto-format all files
```

## Dependency Management

### Using Version Catalogs

All versions are pinned in `pnpm-workspace.yaml` under `catalogs.default`:

```json
{
  "dependencies": {
    "typescript": "catalog:",
    "prettier": "catalog:",
    "zod": "catalog:"
  }
}
```

**Never** hardcode versions. Always use `catalog:` in `package.json`.

### Adding New Dependencies

1. Update `pnpm-workspace.yaml` catalogs
2. Run `pnpm install`
3. Commit both files together

## GitHub Workflows

Workflows live in `.github/workflows/`. Common patterns:

- **CI/CD:** Build, lint, test on PR
- **Release:** Auto-publish packages
- **Deploy:** Service deployment triggers

## Never

- Use `npm install` — always use `pnpm`
- Hardcode versions in `package.json` — use catalogs
- Mix CommonJS and ESM in the same codebase
- Skip type checking — enable strict mode
- Forget to register new packages in the monorepo

## Useful Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Workspaces + version catalogs |
| `nx.json` | Nx configuration & task defaults |
| `tsconfig.json` | Root TypeScript config |
| `.eslintrc.json` | Linting rules |
| `.prettierrc.json` | Code formatting rules |

## Task Tracking

Work in this monorepo should be tracked in Linear under the **Modules** team (or similar — confirm with your product manager). Reference tickets in commits using standard format: `MODULE-123`.

## Getting Help

- **Nx docs:** https://nx.dev
- **pnpm docs:** https://pnpm.io
- **TypeScript docs:** https://www.typescriptlang.org/docs/
