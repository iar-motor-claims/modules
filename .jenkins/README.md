# Jenkins Configuration

Documentation for Jenkins setup and configuration for the Modules platform.

## Jenkinsfile Overview

The root `Jenkinsfile` orchestrates the complete CI/CD pipeline for the monorepo.

### Pipeline Stages

1. **Checkout** — Clone the repository and capture git metadata
2. **Setup** — Install pnpm and dependencies
3. **Lint** — Run ESLint across all packages
4. **Type Check** — Run TypeScript type checking
5. **Test** — Run vitest test suites
6. **Build** — Build all packages and services
7. **Build Docker Images** — Build Docker images (main branch only)
8. **Deploy to Staging** — Deploy to staging (develop branch only)
9. **Deploy to Production** — Deploy to production (main branch, with approval)

### Environment

- **Agent:** Kubernetes pod with Node.js 22.15.3 + Docker-in-Docker
- **Workspace:** Jenkins workspace directory
- **pnpm:** Version 10.32.1
- **Node:** Version 22.15.3

### Build Configuration

```groovy
options {
  buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
  timeout(time: 60, unit: 'MINUTES')
  timestamps()
  disableConcurrentBuilds()
}
```

- Keeps last 20 builds
- Keeps last 10 artifacts
- 60-minute timeout
- No concurrent builds

## Setting Up Jenkins

### Prerequisites

- Jenkins 2.300+ with Kubernetes plugin
- Docker registry access (for image builds)
- Kubernetes cluster configured as Jenkins agent

### Creating a Pipeline Job

1. **New Job:** Create a new "Pipeline" job
2. **Name:** `modules-monorepo-pipeline` (or similar)
3. **Pipeline Configuration:**
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `https://github.com/your-org/modules.git`
   - **Branch Specifier:** `*/main`, `*/develop`
   - **Script Path:** `Jenkinsfile`

### Configuring Webhooks

GitHub webhook to trigger Jenkins on push:

1. Go to repository Settings → Webhooks
2. Add webhook:
   - **Payload URL:** `https://jenkins.your-domain.com/github-webhook/`
   - **Content type:** `application/json`
   - **Trigger:** Push events
   - **Branches:** main, develop

### Jenkins Credentials

Set up these credentials in Jenkins:

- **Docker Registry:**
  - Type: Username with password
  - Scope: Global
  - ID: `docker-registry`
  - Username: Your registry username
  - Password: Your registry password

- **Kubernetes:**
  - Type: Kubernetes configuration (kubeconfig)
  - Scope: Global
  - ID: `k8s-config`
  - kubeconfig: Your cluster config

## Running the Pipeline

### Manual Trigger

1. Go to Jenkins job
2. Click "Build Now"
3. Select branch/commit if prompted
4. Monitor progress

### Automatic Trigger

Pipeline triggers automatically on:
- Push to `main` branch → runs full pipeline
- Push to `develop` branch → runs full pipeline + staging deploy
- Pull request → runs lint/test/build

## Troubleshooting

### Pod Not Starting

Check Kubernetes connectivity:
```bash
kubectl get pods -n jenkins
kubectl describe pod <pod-name> -n jenkins
```

### pnpm Install Fails

Clear cache:
```bash
rm -rf ~/.pnpm-store
pnpm install --frozen-lockfile
```

### Docker Build Fails

Verify Docker daemon is running:
```bash
docker ps
docker info
```

## Future Enhancements

- [ ] Automated security scanning (SAST)
- [ ] Code coverage reporting
- [ ] Performance benchmarking
- [ ] Artifact signing
- [ ] Slack notifications
- [ ] Email notifications
- [ ] Performance metrics collection
- [ ] Deployment tracking

## References

- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [Jenkinsfile Documentation](https://www.jenkins.io/doc/book/pipeline/jenkinsfile/)
- [Kubernetes Plugin](https://plugins.jenkins.io/kubernetes/)
