# Modules Platform — Marketing Website

Marketing website for Modules, a modular product platform. Built with **Astro**, integrated into **monorepo_nx_pipeline**.

## Quick Start

### Prerequisites

- **Node.js:** 22.15.3 or higher
- **pnpm:** 10.32.1 or higher

### Installation

```bash
cd modules
pnpm install
```

### Development

```bash
# Start development server (localhost:3000)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Run tests
pnpm test

# E2E tests
pnpm test:e2e
```

## Project Structure

```
modules/
├── src/
│   ├── pages/              # Astro pages (URL routes)
│   ├── components/         # React components
│   ├── layouts/            # Page layouts
│   └── styles/             # Global CSS
├── public/                 # Static assets
├── tests/                  # E2E tests (Playwright)
├── Dockerfile              # Docker image for deployment
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## CI/CD Integration

**Pipeline:** `monorepo_nx_pipeline` (shared with other services)  
**Service Name:** `modules-website`  
**Kind:** `frontend`  
**Language:** `node`  

### Deployment

1. **Build:** `pnpm build` → static site in `/dist`
2. **Docker:** Multi-stage build → Nginx image
3. **Deploy:** Kubernetes via Helm OR Cloudflare Pages

### Environment Configuration

```bash
infra/services/modules-website/
├── development/
│   └── envs.conf         # Development env vars
└── production/
    └── envs.conf         # Production env vars
```

## Architecture

- **Framework:** Astro 6.0 (static site generator)
- **Styling:** Tailwind CSS 4
- **Runtime:** React 19 (islands)
- **Deployment:** Docker + Nginx
- **Hosting:** Kubernetes (GKE) or Cloudflare Pages

## Features

✅ Fast static site generation  
✅ React components for interactivity  
✅ Tailwind CSS for styling  
✅ TypeScript for type safety  
✅ E2E tests with Playwright  
✅ Production-optimized Nginx config  
✅ Health checks built-in  

## Best Practices

1. **Pages:** Create Astro files in `src/pages/` for new routes
2. **Components:** React components in `src/components/`
3. **Styling:** Use Tailwind CSS classes or `src/styles/global.css`
4. **Assets:** Reference shared assets from root `assets/` directory
5. **Testing:** Add E2E tests in `tests/` for critical flows

## Docker Build & Run

```bash
# Build image
docker build -t modules-website:latest .

# Run container
docker run -p 80:8080 modules-website:latest

# Access at http://localhost
```

## Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)
- [Playwright Documentation](https://playwright.dev)

## Related

- **GitHub:** https://github.com/iar-motor-claims/modules
- **Jenkins:** https://jenkins.iarservices.in → modules-website service
- **Portal:** https://modules.iarservices.in
