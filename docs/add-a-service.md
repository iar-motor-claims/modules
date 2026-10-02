# Adding a Service

Every service follows the same shape. Use `services/bragi/` as the reference.

## 1. Pick a Norse codename

See [conventions.md](./conventions.md#naming). Add it to the services table there
with a one-line "why". No generic names.

## 2. Scaffold `services/<codename>/`

Mirror Bragi:

```
services/<codename>/
├── package.json        # name: @modules/<codename>, scripts (dev/build/lint/typecheck)
├── project.json        # Nx targets + tags (type:app, scope:services, framework:…)
├── <framework config>  # e.g. astro.config.mjs / vite.config.ts
├── tsconfig.json
├── Dockerfile          # multi-stage → nginx:alpine for static frontends
├── nginx.conf          # for web services
├── README.md           # service-level docs (codename + role + why + how to run)
└── src/
```

- `package.json` dependencies use `catalog:` references (no hardcoded versions).
- `project.json` must define `build`, `lint`, `typecheck` targets so Nx + the hooks
  and pipeline pick the service up.

## 3. Add deploy config

```
infra/services/<codename>/
├── development/
│   ├── envs.conf       # env vars; secrets as google_secret:<key>
│   └── values.yaml     # Helm values (image, resources, HPA, probes, hostnames)
└── production/
    ├── envs.conf
    └── values.yaml
```

## 4. Register in the pipeline

Add the service to the catalog in the root `Jenkinsfile`:

```groovy
services: [
    'bragi'     : [ kind: 'frontend', lang: 'node' ],
    '<codename>': [ kind: 'frontend', lang: 'node' ],   // or kind:'backend', lang:'go'|'python'
]
```

## 5. Install & run

```bash
mise run setup
mise run dev <codename>
mise run build <codename>
```

## 6. Open a PR

- CODEOWNERS auto-requests review (service code → developers).
- Commit messages must be conventional (`feat(<codename>): …`).
- `pre-commit`/`pre-push` hooks run `nx affected` checks.
- The pipeline builds the service; production deploy requires approval.

## Checklist

- [ ] Norse codename chosen + recorded in conventions.md
- [ ] `services/<codename>/` created (package.json, project.json, framework, Dockerfile, README)
- [ ] deps use `catalog:`
- [ ] `infra/services/<codename>/{development,production}/{envs.conf,values.yaml}`
- [ ] registered in root `Jenkinsfile` catalog
- [ ] `mise run build <codename>` passes
