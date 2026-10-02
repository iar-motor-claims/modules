# Environment & secret configuration

How environment variables and secrets are declared for each service. Read this before
touching any `envs.conf` or adding a config value. Adapted from the IAR convention —
kept lightweight to match this repo's current layout.

## Where config lives

Per service, under `infra/services/<codename>/`:

```
infra/services/<codename>/
├── development/
│   ├── envs.conf       # dev env vars (+ secret refs)
│   └── values.yaml     # deploy values (image, resources, hostnames)
└── production/
    ├── envs.conf       # prod env vars (+ secret refs)
    └── values.yaml
```

If a service also needs local-dev defaults, add `services/<codename>/.env.example`
(committed, **no real values**) as the source of truth for what vars exist. Real
`.env` files are gitignored and must never be read or committed by an agent.

## The sync rule

**Every env var exists with the same key across all environments.** When you add,
remove, or rename a variable, update it in *both* `development/envs.conf` and
`production/envs.conf` (and `.env.example` if present) in the **same commit**. The
values differ per environment; the **keys must not drift**.

Example (bragi):

| Key | development | production |
|---|---|---|
| `ENVIRONMENT` | `development` | `production` |
| `SITE_URL` | `https://modules-dev.iarservices.in` | `https://modules.iarservices.in` |
| `ASTRO_TELEMETRY_DISABLED` | `true` | `true` |

## Secrets — referenced, never inlined

- **Never put a secret value in `envs.conf`, `values.yaml`, or anything committed.**
- Secrets are referenced by name and resolved from the secret manager at deploy time
  (the add-a-service playbook uses `google_secret:<key>`).
- Agents: `envs.conf` tells you *which* vars exist — that's all you need. Do not try
  to read or reconstruct values.

## Rules

1. Keys stay in sync across `development/` and `production/`.
2. Secret **values** never land in the repo — reference them by name.
3. Changing config for a service is a `services/**` + `infra/services/**` change —
   commit the env files together.
4. Production env/infra changes are gated — see
   [guardrails.md](./guardrails.md) and `AGENTS.md` → *Guardrails for agents*.
