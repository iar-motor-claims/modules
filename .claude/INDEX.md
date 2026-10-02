# Modules Monorepo — Documentation Index

## Quick Links

- **SETUP.md** — Local setup, install, first package
- **CLAUDE.md** — Working rules, conventions, commands
- **ARCHITECTURE.md** — Detailed design, dependency rules
- **../README.md** — Project overview
- **../package.json** — Root workspace config

## File Reference

### Root Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace, scripts, deps |
| `pnpm-workspace.yaml` | pnpm workspaces, version catalogs |
| `nx.json` | Nx tasks, caching, plugins |
| `tsconfig.json` | TypeScript root config |
| `tsconfig.app.json` | TypeScript app config |
| `.eslintrc.json` | ESLint rules, module boundaries |
| `.npmrc` | npm/pnpm settings |
| `.prettierrc.json` | Prettier formatting rules |
| `.gitignore` | Git ignore patterns |

### Directory Structure

```
modules/
├── .claude/              # Claude Code configuration
│   ├── SETUP.md         # Local setup guide
│   ├── INDEX.md         # This file
│   └── ...
├── .github/
│   └── workflows/       # CI/CD workflows
│       └── ci.yml       # PR/push linting, testing, building
├── packages/            # Shared libraries (@modules/*)
│   └── [empty]          # Add packages here
├── services/            # Standalone services
│   └── [empty]          # Add services here
├── tools/               # Internal tooling
│   └── [empty]          # Add tools here
├── README.md            # Project overview
├── ARCHITECTURE.md      # Design & patterns
├── CLAUDE.md           # Working rules
└── [config files]
```

## Getting Started

1. **Read:** `SETUP.md` for local installation
2. **Read:** `CLAUDE.md` for conventions & commands
3. **Read:** `ARCHITECTURE.md` for design patterns
4. **Create:** First package following SETUP.md
5. **Push:** To GitHub with `git add . && git commit && git push`

## Common Tasks

### Create a New Package

```bash
# See SETUP.md "Create First Package"
mkdir packages/my-package
cd packages/my-package
# Copy template from SETUP.md
```

Then: `pnpm install && pnpm nx build @modules/my-package`

### Create a New Service

```bash
# See SETUP.md "Create First Service"
mkdir services/my-service
cd services/my-service
# Similar to package, but with service config
```

Then: `pnpm install && pnpm nx build my-service`

### Run Tests

```bash
pnpm test                          # All packages
pnpm nx test @modules/utils        # Specific package
pnpm nx test my-service --coverage # With coverage
```

### Build & Lint

```bash
pnpm build                  # Build all
pnpm nx build @modules/ui   # Build one package

pnpm lint                   # Lint all
pnpm format                 # Format all with Prettier
pnpm typecheck              # Type check all
```

### View Dependency Graph

```bash
pnpm nx graph
pnpm nx graph --file=graph.html  # Export to HTML
```

## Important Files to Know

### `CLAUDE.md` (Working Rules)

Defines:
- Monorepo structure overview
- Before starting work checklist
- When adding packages/services
- Nx command reference
- Linting & formatting rules
- Dependency management
- Never do's

### `ARCHITECTURE.md` (Design Patterns)

Explains:
- Three-tier structure (packages → services → tools)
- Dependency rules (golden rules)
- File organization per tier
- Publishing packages to npm
- CI/CD pipeline
- Scaling patterns

### `SETUP.md` (First Time Setup)

Provides:
- What was created
- Directory structure
- Next steps
- Step-by-step package creation
- First service creation
- Common commands
- Troubleshooting

## Dependencies

All versions pinned in `pnpm-workspace.yaml` catalogs:

```yaml
catalogs:
  default:
    typescript: 5.9.2
    vite: ^6.0.5
    # ... more
  react19:
    react: 19.2.0
    # ... more
```

Use in package.json:
```json
{
  "dependencies": {
    "typescript": "catalog:",
    "react": "catalog:react19"
  }
}
```

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`):

**Runs on:**
- Every push to main/develop
- Every PR to main/develop

**Steps:**
1. Lint (ESLint)
2. Type check (TypeScript)
3. Test (vitest)
4. Build (pnpm build)

## Next Phase Roadmap

- [ ] Changesets for automatic versioning
- [ ] Automated npm publishing
- [ ] Per-service deployment workflows
- [ ] E2E testing infrastructure
- [ ] Performance monitoring
- [ ] API documentation generation
- [ ] Storybook for UI components

## Support

**Questions?** Start here:

1. Read the relevant doc (SETUP, CLAUDE, ARCHITECTURE)
2. Check troubleshooting in SETUP.md
3. Run `pnpm nx --help` for Nx help
4. Visit https://nx.dev for Nx docs
5. Visit https://pnpm.io for pnpm docs
