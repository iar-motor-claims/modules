# Modules Infrastructure

Infrastructure configuration for the Modules platform.

## Structure

```
infra/
├── services/              # Service-specific deployment configs
│   └── [service-name]/   # One folder per service
│       ├── development/
│       │   └── envs.conf
│       └── production/
│           └── envs.conf
└── helm/
    └── charts/           # Helm chart definitions (future)
```

## Service Deployment

Each service in `services/` has development and production environment configurations.

### Adding a New Service

```bash
mkdir -p infra/services/my-service/{development,production}
```

Create `development/envs.conf` and `production/envs.conf` with environment-specific variables.

## Environment Variables

All service environment variables are stored in:
- `services/<service-name>/development/envs.conf` (dev)
- `services/<service-name>/production/envs.conf` (prod)

These must sync with the service's `.env.example` and `.envs.conf` files.

## Deployment

Deployment configuration is handled per-service. See the relevant service's documentation for deployment instructions.

## Future: Helm Charts

Kubernetes deployment charts will live under `helm/charts/` when needed.
