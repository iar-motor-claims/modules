# Shared Assets

IAR brand assets live here **once** and are shared across all services. Don't invent
per-service logos — pull from here. Mirrors the canonical set in the claims repo.

```
assets/
├── favicon/
│   └── favicon.png
├── icons/
│   ├── icon-192.png        # PWA / apple-touch
│   └── icon-512.png        # PWA
└── logo/
    ├── iar_logo_blue.svg        # mark only, blue (light bg)
    ├── iar_logo_white.svg       # mark only, white (dark bg)
    ├── iar_full_logo_blue.svg   # full lockup, blue (light bg)
    ├── iar_full_logo_white.svg  # full lockup, white (dark bg)
    └── *.png                    # raster fallbacks of the above
```

Brand palette (navy / teal / amber) is encoded per service — see
`services/bragi/src/styles/globals.css` for the reference tokens.

## Using assets in a service

Static-site services (Astro) serve from their own `public/`, so copy what the
service needs into `services/<svc>/public/`. Keep this `assets/` directory as the
single source of truth — update here first, then propagate to services.
