# Modules Monorepo — Setup Guide

## What Was Created

A **standalone monorepo** for the Modules platform at `/Users/otakutekkurai/repos/iar/modules/`.

### Initialized With

✅ **Git repository** (main branch)  
✅ **Nx configuration** (v19.8.0) for task orchestration  
✅ **pnpm workspaces** (10.32.1) for package management  
✅ **TypeScript 5.9.2** with strict mode  
✅ **ESLint + Prettier** for code quality  
✅ **Base directory structure** (packages/, services/, tools/)  
✅ **Documentation** (README, ARCHITECTURE, CLAUDE)  
✅ **GitHub Actions CI** template  

## Directory Structure

```
/Users/otakutekkurai/repos/iar/modules/
├── packages/              # Shared libraries (@modules/*)
├── services/              # Standalone apps/microservices
├── tools/                 # Internal CLI & build tools
├── .github/workflows/     # CI/CD pipelines
├── CLAUDE.md             # Agent working rules
├── ARCHITECTURE.md       # Detailed architecture guide
├── README.md             # Project overview
├── package.json          # Root workspace config
├── pnpm-workspace.yaml   # pnpm workspaces + version catalogs
├── nx.json               # Nx configuration
├── tsconfig.json         # TypeScript root config
├── .eslintrc.json        # ESLint rules
└── .npmrc                # npm/pnpm registry settings
```

## Next Steps

### 1. Install Dependencies (Local)

```bash
cd /Users/otakutekkurai/repos/iar/modules
pnpm install
```

This will:
- Install root dependencies
- Set up pnpm workspace linking
- Prepare Nx for task orchestration

### 2. Verify Setup

```bash
pnpm nx --version      # Should show ~19.8.0
pnpm nx graph          # View dependency graph (empty for now)
```

### 3. Create First Package

```bash
mkdir packages/utils
cd packages/utils

# Create package.json with this content:
cat > package.json << 'EOF'
{
  "name": "@modules/utils",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "eslint": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
EOF

# Create src/index.ts
mkdir src
echo "export const add = (a: number, b: number) => a + b;" > src/index.ts
```

Then:

```bash
cd ../..  # Back to repo root
pnpm install
pnpm nx build @modules/utils
```

### 4. Create First Service

```bash
mkdir services/api
cd services/api

# Create package.json
cat > package.json << 'EOF'
{
  "name": "api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "devDependencies": {
    "@types/node": "catalog:",
    "eslint": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
EOF

# Similar setup as package
```

### 5. Update GitHub Workflows

The CI workflow at `.github/workflows/ci.yml` is ready to use:

```bash
git add -A
git commit -m "chore: initialize modules monorepo"
git push origin main
```

GitHub Actions will:
- Lint all packages on every PR
- Run tests
- Type check
- Build everything

## Common Commands

```bash
# Development
pnpm install                              # Install dependencies
pnpm nx graph                            # View dependency graph
pnpm build                               # Build all packages
pnpm lint                                # Lint all code
pnpm typecheck                           # Type check all code
pnpm test                                # Run all tests
pnpm format                              # Format with Prettier

# Specific packages
pnpm nx build @modules/utils             # Build one package
pnpm nx test @modules/utils --coverage   # Test with coverage
pnpm nx lint api                         # Lint one service

# Nx
pnpm nx affected --target=build          # Build only changed packages
pnpm nx reset                            # Clear Nx cache
```

## Configuration Reference

### `pnpm-workspace.yaml`

Defines workspaces and version catalogs. All package versions are pinned here — **never hardcode versions in package.json**.

### `nx.json`

Nx configuration:
- Task runners
- Caching settings
- TypeScript paths
- Release configuration

### `tsconfig.json`

Root TypeScript configuration. All packages extend this via `"extends": "../../tsconfig.json"`.

### `.npmrc`

pnpm registry and behavior settings.

### `.eslintrc.json`

ESLint rules enforcing module boundaries (no invalid cross-dependencies).

## Important Notes

⚠️ **Use pnpm, not npm or yarn** — the monorepo requires pnpm workspaces

⚠️ **Never hardcode versions** — use `catalog:` in package.json dependencies

⚠️ **Enable TypeScript strict mode** — all new code must pass strict type checking

⚠️ **Run `pnpm install` from repo root** — this links workspace packages

## Support

- Read `CLAUDE.md` for agent working rules
- Read `ARCHITECTURE.md` for detailed architecture
- Read `README.md` for quick start
- Run `pnpm nx --help` for Nx command reference
- Visit https://nx.dev for Nx documentation

## Troubleshooting

**"Cannot find module '@modules/package'"**
- Make sure you ran `pnpm install` from repo root
- Verify `tsconfig.json` has correct path mapping

**"ESLint error: missing nx plugin"**
- Run `pnpm install` again
- Clear cache: `pnpm nx reset`

**"pnpm: command not found"**
- Install pnpm: `npm install -g pnpm@10.32.1`
- Or use: `corepack enable pnpm`

**"TypeScript errors in IDE but tests pass"**
- IDE might be using wrong TypeScript version
- Restart IDE or run: `pnpm typecheck`
