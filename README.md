# Modules Platform

A modular product platform built with modern tooling and monorepo architecture. This platform enables selling everything as composable, independent modules.

## Quick Start

### Prerequisites

- **Node.js:** 22.15.3 or higher
- **pnpm:** 10.32.1 or higher
- **TypeScript:** 5.9.2

### Installation

```bash
cd modules
pnpm install
```

### Available Commands

```bash
# Development
pnpm build              # Build all packages
pnpm lint              # Lint all packages
pnpm typecheck         # Type check all packages
pnpm test              # Run tests for all packages
pnpm test:watch        # Run tests in watch mode

# Utilities
pnpm nx                # Run any Nx command
pnpm clean             # Clean Nx cache
pnpm format            # Format code with Prettier
```

## Project Structure

```
modules/
├── packages/          # Shared libraries (@modules/*)
│                      # - Reusable utilities, components, domain logic
├── services/          # Standalone services
│                      # - Microservices, APIs, frontends, workers
├── tools/             # Development tools & utilities
│                      # - CLI tools, code generators, build helpers
├── .github/           # GitHub configuration
│   └── workflows/     # CI/CD pipelines
└── .claude/           # Claude Code configuration
```

## Architecture

### Packages (`/packages`)

Shared libraries published as `@modules/*` modules. Use for:
- UI component libraries
- Utility & helper functions
- Shared domain logic
- Configuration & constants
- Type definitions

### Services (`/services`)

Standalone applications and microservices. Examples:
- REST/GraphQL APIs
- React/Next.js frontends
- Python/Node.js workers
- Real-time services

### Tools (`/tools`)

Internal tooling and CLIs for development. Examples:
- Code generators
- Build scripts
- Migration utilities
- CLI tools

## Development Workflow

### Creating a New Package

```bash
mkdir -p packages/my-package
cd packages/my-package
# Add package.json with @modules/my-package name
```

### Creating a New Service

```bash
mkdir -p services/my-service
cd services/my-service
# Add package.json for the service
```

### Running Nx Commands

```bash
# Build a specific project
pnpm nx build my-package

# Run tests with coverage
pnpm nx test my-package --coverage

# Format changed files
pnpm nx format:write --files="packages/my-package/**/*"

# View dependency graph
pnpm nx graph
```

## Package Management

- **pnpm workspaces:** All packages live in `packages/` and `services/`
- **Version catalogs:** Defined in `pnpm-workspace.yaml`
- **Nx:** Task orchestration and caching for monorepo efficiency

## Configuration Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | pnpm workspaces & version catalogs |
| `nx.json` | Nx configuration & task defaults |
| `tsconfig.json` | TypeScript root configuration |
| `.eslintrc.json` | ESLint rules for all packages |
| `.npmrc` | npm/pnpm registry & behavior settings |

## Best Practices

1. **Module naming:** Use `@modules/module-name` for all packages
2. **Version consistency:** Use version catalogs; never hardcode versions
3. **Shared code:** Put reusable code in `packages/`, not duplicated services
4. **Type safety:** Enable strict mode in all TypeScript projects
5. **Testing:** Write unit tests; run `pnpm test` before committing
6. **Linting:** All code must pass `pnpm lint`

## Next Steps

- [ ] Add CI/CD workflows in `.github/workflows/`
- [ ] Create first shared package in `packages/`
- [ ] Set up service templates in `services/`
- [ ] Configure branch protection rules
- [ ] Set up deployment infrastructure

## Resources

- [Nx Documentation](https://nx.dev)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
