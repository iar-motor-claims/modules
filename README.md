# Modules Platform

**Modules** is a comprehensive product platform providing **composable, sellable AI and business modules** that can be integrated into any application.

## What is Modules?

A modular product ecosystem containing:

- **AI Modules** — LLM, document processing, agentic AI capabilities
- **Claims Module** — Insurance/claims management system
- **Document Processing** — OCR, extraction, analysis
- **Agentic AI** — Autonomous agent frameworks
- **More Modules** — Built and added as needed

Each module is independently deployable, versioned, and can be sold/licensed separately or as a bundle.

## Quick Start

### Prerequisites

- **Node.js:** 22.15.3 or higher
- **pnpm:** 10.32.1 or higher
- **mise:** Optional but recommended for task automation

### Installation

```bash
cd modules
pnpm install
```

### Development

Using **mise** (recommended):

```bash
mise run dev          # Start development server
mise run build        # Build all modules
mise run lint         # Lint all code
mise run typecheck    # Type check
mise run test         # Run all tests
```

Or using **pnpm**:

```bash
pnpm dev              # Start dev server
pnpm build            # Build
pnpm lint             # Lint
pnpm typecheck        # Type check
pnpm test             # Tests
```

## Project Structure

```
modules/
├── modules/                           # Core product modules
│   ├── ai/                           # AI module (LLM, agents)
│   ├── claims/                       # Claims management module
│   ├── document-processing/          # Document processing module
│   ├── agentic-ai/                   # Agentic AI framework
│   └── [other-modules]/
│
├── packages/                         # Shared libraries
│   ├── types/                        # Shared TypeScript types
│   ├── utils/                        # Shared utilities
│   ├── api-client/                   # API client SDK
│   └── [shared-libs]/
│
├── docs/                             # Documentation & marketing site
│   ├── pages/                        # Astro pages
│   ├── components/                   # React components
│   ├── styles/                       # Styling
│   └── [site-structure]/
│
├── infra/                            # Infrastructure configs
│   └── services/                     # Service deployment configs
│
├── .mise.toml                        # Development task automation
├── package.json                      # Root workspace
└── pnpm-workspace.yaml               # pnpm workspaces config
```

## Modules Overview

### AI Module (`modules/ai/`)
- Large Language Model integration
- Prompt engineering & optimization
- Token management & cost tracking
- Multi-model support

### Claims Module (`modules/claims/`)
- Claims processing engine
- Policy validation
- Settlement calculation
- Document verification

### Document Processing (`modules/document-processing/`)
- OCR capabilities
- Text extraction
- Document classification
- Field extraction

### Agentic AI (`modules/agentic-ai/`)
- Agent framework & orchestration
- Task decomposition
- Multi-agent coordination
- Tool integration

## Shared Packages

**types/** — TypeScript definitions used across all modules  
**utils/** — Common utilities (formatting, validation, etc.)  
**api-client/** — SDK for consuming modules via API  

## Documentation & Marketing Site

**Location:** `docs/` folder (Astro + React)

Built-in documentation includes:
- Module overview & features
- API reference & examples
- Integration guides
- Pricing & licensing
- Contact & support

Access at: `https://modules.iarservices.in`

## CI/CD Integration

**Pipeline:** `monorepo_nx_pipeline` (shared with other services)

### Multi-Service Build

The pipeline handles:
- Detecting changed modules
- Building only affected modules in parallel
- Running tests per module
- Publishing module releases
- Deploying to staging/production

### Environment Configuration

```bash
infra/services/
├── modules-ai/
│   ├── development/envs.conf
│   └── production/envs.conf
├── modules-claims/
│   ├── development/envs.conf
│   └── production/envs.conf
└── [other-modules]/
```

## Publishing Modules

Each module can be:
- **Published to npm** as a package (e.g., `@modules/ai`)
- **Deployed as a service** (Docker + Kubernetes)
- **Used as a library** in other applications
- **Sold/licensed** independently

## Best Practices

1. **Module independence** — Each module is self-contained
2. **Shared types** — Use `packages/types/` for cross-module types
3. **Versioning** — Modules are versioned independently
4. **Documentation** — Every module has API docs & examples
5. **Testing** — All modules have unit + E2E tests
6. **No circular dependencies** — Modules depend on packages, not each other

## Architecture Benefits

✅ **Modular** — Each capability is independent  
✅ **Composable** — Mix & match modules as needed  
✅ **Sellable** — License modules individually or as bundles  
✅ **Scalable** — Deploy/scale each module independently  
✅ **Maintainable** — Clear separation of concerns  
✅ **Tested** — Comprehensive test coverage per module  
✅ **Documented** — Built-in documentation site  

## Resources

- **Astro Docs:** https://docs.astro.build
- **pnpm Docs:** https://pnpm.io
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **Jenkins Pipeline:** https://jenkins.iarservices.in
- **GitHub:** https://github.com/iar-motor-claims/modules

## Related

- **Documentation Site:** https://modules.iarservices.in
- **GitHub Organization:** https://github.com/iar-motor-claims
- **Jenkins Instance:** https://jenkins.iarservices.in
