# Modules Platform — Architecture Guide

## Overview

The **Modules** platform is a standalone monorepo designed to build and sell composable, independent modules. It uses a three-tier architecture with clear separation of concerns.

## Three-Tier Structure

### Tier 1: Packages (`/packages`)

**Shared libraries and utilities** published as `@modules/*` on npm.

**Purpose:**
- Reusable UI components
- Utility functions
- Validation & types (Zod schemas)
- Shared domain logic
- Constants & configuration

**Characteristics:**
- Published to npm (not private)
- Consumed by services and other packages
- No external dependencies on services
- Must be well-tested and documented
- Versioned independently

**Example Packages:**
- `@modules/ui` — Shared React components
- `@modules/utils` — Helper functions, formatters
- `@modules/types` — Shared TypeScript types
- `@modules/schemas` — Zod validation schemas
- `@modules/hooks` — Reusable React hooks

### Tier 2: Services (`/services`)

**Standalone applications and microservices** that use packages.

**Purpose:**
- REST/GraphQL APIs
- React/Next.js frontends
- Python/Node.js background workers
- Real-time services (WebSocket)
- Batch processors

**Characteristics:**
- Not published to npm
- Can depend on packages (not vice-versa)
- Each service has its own deployment lifecycle
- Can have service-specific dependencies
- Fully isolated databases/storage (recommended)

**Example Services:**
- `api` — Core REST API
- `dashboard` — React frontend
- `worker` — Background job processor
- `realtime` — WebSocket server

### Tier 3: Tools (`/tools`)

**Development utilities, CLIs, and build helpers** for the monorepo.

**Purpose:**
- Code generators
- CLI tools
- Build scripts & webpack plugins
- Migration utilities
- Test helpers

**Characteristics:**
- Private to the monorepo (not published)
- Run locally or in CI/CD
- Can depend on packages
- Help with developer experience

**Example Tools:**
- `cli` — Custom CLI for module generation
- `codegen` — TypeScript code generator
- `migrate` — Data migration scripts
- `scripts` — Build & deployment helpers

## Dependency Rules

```
┌─────────────────────┐
│   packages/*        │  ← No external dependencies
│   (shared libs)     │
└─────────────────────┘
        ↑
        │ (consumed by)
        │
┌─────────────────────┐
│   services/*        │  ← Depends on packages
│   (apps)            │     Can be independent
└─────────────────────┘

┌─────────────────────┐
│   tools/*           │  ← Dev-only, depends on packages
│   (build helpers)   │
└─────────────────────┘
```

**Golden Rules:**
1. `packages/` → **nothing** (self-contained)
2. `services/` → `packages/` only (no service → service)
3. `tools/` → `packages/` only (dev dependencies)

## Monorepo Tooling

### Nx

Task orchestration, caching, dependency tracking.

```bash
# Build changed packages only
pnpm nx affected --target=build

# View dependency graph
pnpm nx graph

# Run tasks in parallel
pnpm nx run-many --target=test --all
```

### pnpm

Package manager with workspace support.

- **Version catalogs** in `pnpm-workspace.yaml` ensure consistency
- **Hoisting** configured via `.npmrc`
- **Monorepo linking** — packages reference each other locally

### TypeScript

All code written in TypeScript with strict mode enabled.

- **Root config:** `tsconfig.json`
- **Path mapping:** `@modules/*` → `packages/*`
- **No circular imports** enforced by eslint

### ESLint + Prettier

Code quality & formatting.

- Enforced module boundaries (no invalid cross-dependencies)
- Prettier for consistent formatting (100-char line width)
- No TypeScript errors allowed in commits

## File Organization Within Packages

```
packages/my-package/
├── src/
│   ├── index.ts           # Public exports
│   ├── types.ts           # TypeScript types
│   ├── utils/
│   ├── components/        # React components (if applicable)
│   └── hooks/             # React hooks (if applicable)
├── __tests__/
│   └── utils.test.ts      # Unit tests
├── package.json
├── tsconfig.json
├── eslintrc.json
└── README.md
```

## File Organization Within Services

```
services/my-service/
├── src/
│   ├── main.ts            # Entry point
│   ├── routes/            # API routes or pages
│   ├── lib/               # Internal utilities
│   ├── types/             # Local types
│   └── config.ts          # Configuration
├── __tests__/
├── package.json
├── tsconfig.json
└── README.md
```

## Publishing Packages

Packages in `packages/` can be published to npm:

1. Bump version in `package.json`
2. Tag release: `git tag @modules/my-package@1.0.0`
3. Push tags: `git push --tags`
4. CI automatically publishes to npm

(GitHub Actions workflow in `.github/workflows/release.yml`)

## CI/CD Pipeline

### On Every PR

1. **Lint** — ESLint + Prettier check
2. **Type check** — TypeScript strict mode
3. **Test** — Unit tests with coverage
4. **Build** — Verify build succeeds

### On Merge to `main`

1. Run full test suite
2. Build all packages
3. Auto-bump versions (if `--changesets` present)
4. Publish to npm
5. Deploy services (per service CD config)

## Scaling the Monorepo

### Adding a New Package

```bash
mkdir packages/new-package
cd packages/new-package
# Create package.json with @modules/new-package
# Create src/index.ts
pnpm install  # from repo root
```

### Adding a New Service

```bash
mkdir services/new-service
cd services/new-service
# Create package.json with service-specific name
# Create src/main.ts
pnpm install
```

### Adding a New Tool

```bash
mkdir tools/new-tool
# Create package.json (private: true)
# Create src/index.ts
pnpm install
```

## Common Patterns

### Using a Package in a Service

```ts
// services/api/src/main.ts
import { MyComponent, formatDate } from '@modules/ui';
import { useMyHook } from '@modules/hooks';
```

### Importing from Monorepo Tools

```ts
// tools/codegen/src/generate.ts
import { readFileSync } from 'fs';
import { formatCode } from '@modules/utils';
```

### Sharing Types Across Packages

```ts
// packages/types/src/index.ts
export interface User {
  id: string;
  name: string;
}

// packages/api/src/user.ts
import type { User } from '@modules/types';
```

## Performance Considerations

1. **Nx caching** — Only rebuilt changed packages
2. **Parallel tasks** — Up to 5 tasks run concurrently (configured in `nx.json`)
3. **pnpm hoisting** — Deduplicates dependencies
4. **TypeScript incremental builds** — Faster rebuilds

## Future Enhancements

- [ ] Changesets for versioning
- [ ] Automated npm publishing
- [ ] Per-service deployment workflows
- [ ] E2E testing across services
- [ ] Performance monitoring
- [ ] API documentation generation
- [ ] Storybook for UI packages
