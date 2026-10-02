# Naming Convention — Norse Mythology

**Every service in `services/` is named after a Norse figure.** The name should
reflect what the service does. This is a hard rule: when a new service is created,
the first question is *"what's its Norse name?"* — no generic names like `web` or `api`.

## Package & pipeline naming

- **Workspace package name:** `@modules/<codename>` (e.g. `@modules/bragi`)
- **Pipeline service name:** `<codename>` (e.g. `bragi`)
- **Deploy config:** `infra/services/<codename>/{development,production}/envs.conf`

## Services

| Codename | Role | Why this name |
|----------|------|---------------|
| **Bragi** | Marketing/product **website** | God of poetry & eloquence — presents and tells the story of the platform |

## Picking a name for a NEW service

1. Identify what the service does.
2. Choose a Norse god/being/artifact whose mythology fits.
3. Check it's unused (`mise run list-services` + table above).
4. Add it to the table with a one-line "why".
5. Create it under `services/<codename>/` following the Bragi layout.

### Unclaimed name ideas (for when we add more)

| Candidate | Fits a service about... |
|-----------|-------------------------|
| **Heimdall** | monitoring / observability / gateway (the all-seeing watchman) |
| **Odin** | AI / reasoning (all-father, wisdom) |
| **Mimir** | document processing / knowledge (keeper of the well of wisdom) |
| **Forseti** | claims / dispute settlement (god of justice) |
| **Loki** | agentic AI (shapeshifter, adaptive) |
| **Saga** | analytics / audit history (goddess of history & storytelling) |
| **Ratatoskr** | messaging / event bus (carries messages across Yggdrasil) |
| **Yggdrasil** | core platform / orchestration (the world tree) |
