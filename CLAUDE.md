# Modules Platform — Marketing Website Agent Rules

## Repository Overview

**Modules** is a marketing website for the Modules product platform.

- **Framework:** Astro 6.0
- **Styling:** Tailwind CSS 4
- **Components:** React 19
- **Node.js:** 22.15.3+
- **pnpm:** 10.32.1+
- **CI/CD:** monorepo_nx_pipeline integration

## Service Configuration

**Pipeline:** monorepo_nx_pipeline  
**Service Name:** `modules-website`  
**Kind:** `frontend`  
**Language:** `node`  

## Project Structure

```
modules/
├── src/
│   ├── pages/              # Astro pages (routes)
│   ├── components/         # React components
│   ├── layouts/            # Page layouts
│   └── styles/             # Global CSS
├── public/                 # Static assets
├── tests/                  # E2E tests (Playwright)
├── infra/services/modules-website/
│   ├── development/envs.conf
│   └── production/envs.conf
└── docker files (Dockerfile, nginx.conf)
```

## Before Starting Work

1. **Check:** Is this a page, component, or styling change?
2. **Astro:** Use Astro file format for pages (`.astro`)
3. **React:** Use `.tsx` for interactive components
4. **Tailwind:** Use Tailwind classes for styling
5. **Assets:** Use shared assets from root `assets/` directory

## Adding a New Page

1. Create file: `src/pages/page-name.astro`
2. Follow Astro layout structure
3. Use React components as needed
4. Style with Tailwind CSS
5. Test with `pnpm dev`

Example page:

```astro
---
import '../styles/global.css';
---

<html lang="en">
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <h1>Welcome</h1>
  </body>
</html>
```

## Adding a New Component

1. Create file: `src/components/ComponentName.tsx`
2. Export React component
3. Import in Astro pages with `client:load` if interactive

Example component:

```tsx
export interface Props {
  title: string;
}

export default function MyComponent({ title }: Props) {
  return <div className="text-2xl font-bold">{title}</div>;
}
```

## Common Commands

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Quality
pnpm lint             # ESLint
pnpm typecheck        # TypeScript
pnpm test             # Vitest
pnpm test:e2e         # Playwright E2E tests
```

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

## Support

For issues:
1. Check Astro documentation
2. Check Tailwind documentation
3. Review existing pages/components for patterns
4. Run `pnpm dev` and debug in browser DevTools
