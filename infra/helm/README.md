# Modules Helm Charts

Kubernetes deployment manifests for the Modules platform using Helm.

## Chart: modules

Main Helm chart for deploying Modules platform services.

### Quick Start

```bash
# Validate chart
helm lint infra/helm/charts/modules

# Install chart
helm install modules infra/helm/charts/modules \
  --namespace modules \
  --create-namespace

# Upgrade chart
helm upgrade modules infra/helm/charts/modules \
  --namespace modules

# Uninstall chart
helm uninstall modules --namespace modules
```

### Chart Structure

```
modules/
├── Chart.yaml              # Chart metadata
├── values.yaml              # Default values
├── templates/
│   ├── deployment.yaml      # Service deployments
│   ├── service.yaml         # Kubernetes services
│   ├── configmap.yaml       # Configuration
│   ├── _helpers.tpl         # Template helpers
│   └── ...
└── tests/
```

### Configuration

All configuration is in `values.yaml`. Key sections:

#### Global Settings

```yaml
global:
  environment: development
  domain: modules.local
  timezone: UTC
```

#### Service Configuration

```yaml
services:
  - api
  - dashboard
  - worker
```

#### Image Configuration

```yaml
image:
  registry: gcr.io/your-project
  pullPolicy: IfNotPresent
```

#### Resource Limits

```yaml
resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 500m
    memory: 512Mi
```

#### Health Checks

```yaml
healthChecks:
  enabled: true
  livenessProbe:
    initialDelaySeconds: 30
    periodSeconds: 10
```

#### Autoscaling

```yaml
autoscaling:
  enabled: false
  minReplicas: 1
  maxReplicas: 3
  targetCPUUtilizationPercentage: 80
```

### Values Override Examples

#### Development

```bash
helm install modules infra/helm/charts/modules \
  --namespace modules \
  --values values-dev.yaml
```

Create `values-dev.yaml`:

```yaml
global:
  environment: development
replicaCount: 1
autoscaling:
  enabled: false
```

#### Production

```bash
helm install modules infra/helm/charts/modules \
  --namespace modules-prod \
  --values values-prod.yaml
```

Create `values-prod.yaml`:

```yaml
global:
  environment: production
replicaCount: 3
autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
```

### Generated Manifests

View what Helm will deploy:

```bash
helm template modules infra/helm/charts/modules

# Or to a file
helm template modules infra/helm/charts/modules > manifests.yaml
```

### Troubleshooting

**Validate syntax:**
```bash
helm lint infra/helm/charts/modules
```

**Debug template rendering:**
```bash
helm template modules infra/helm/charts/modules --debug
```

**Check deployed resources:**
```bash
kubectl get all -n modules
kubectl describe deployment modules-api -n modules
```

**View Helm release history:**
```bash
helm history modules --namespace modules
helm rollback modules 1 --namespace modules
```

### Future Enhancements

- [ ] Per-service Helm charts
- [ ] Network policies
- [ ] Pod disruption budgets
- [ ] Persistent volume claims
- [ ] Secrets management
- [ ] Ingress rules
- [ ] RBAC configuration
- [ ] ServiceMonitor for Prometheus
