# Shared Assets

Brand assets live here **once** and are shared across all services. Don't invent
per-service logos — pull from here.

```
assets/
└── brand/
    ├── logo.svg            # IAR primary logo (dark, for light backgrounds)
    ├── logo-white.svg      # IAR logo (white, for dark backgrounds)
    ├── favicon.png
    └── apple-touch-icon.png
```

Source: copied from the IAR company brand set (`claims/webapp`). Brand palette
(navy / teal / amber) is encoded in each service's styles — see
`services/bragi/src/styles/globals.css` for the reference tokens.

## Using assets in a service

Static-site services (Astro) serve from their own `public/`, so copy what the
service needs into `services/<svc>/public/` (e.g. `favicon.png`, `brand/logo.svg`).
Keep this `assets/brand/` directory as the single source of truth — update here
first, then propagate.
