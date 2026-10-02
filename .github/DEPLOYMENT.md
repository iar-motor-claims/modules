# Modules Platform — GitHub & Jenkins Deployment Guide

## Step 1: Create GitHub Repository

### Using GitHub UI

1. Go to GitHub: https://github.com/iar-motor-claims
2. Click **New** (top-left, or "+" menu)
3. Repository name: **`modules`**
4. Description: "Modular product platform — selling everything as modules"
5. **Do NOT initialize** with README, .gitignore, or license (we already have them)
6. Click **Create repository**

### Result

```
Repository: https://github.com/iar-motor-claims/modules
SSH:        git@github.com:iar-motor-claims/modules.git
HTTPS:      https://github.com/iar-motor-claims/modules.git
```

---

## Step 2: Push to GitHub

After creating the repository, run:

```bash
cd /Users/otakutekkurai/repos/iar/modules

# Add remote (if not already added)
git remote add origin git@github.com:iar-motor-claims/modules.git

# Verify remote
git remote -v

# Push to main branch
git push -u origin main

# Push all branches
git push -u origin --all

# Push all tags
git push -u origin --tags
```

**Expected output:**
```
Counting objects: 33, done.
...
To github.com:iar-motor-claims/modules.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Step 3: Set Up GitHub Branch Protection

### Protect the `main` Branch

1. Go to: https://github.com/iar-motor-claims/modules/settings/branches
2. Click **Add rule**
3. **Branch name pattern:** `main`
4. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1 approval)
   - ✅ Require status checks to pass before merging
   - ✅ Require code review before merging
   - ✅ Require CODEOWNERS review
5. Click **Create**

---

## Step 4: Configure GitHub Webhooks for Jenkins

### Enable GitHub Webhook

1. Go to: https://github.com/iar-motor-claims/modules/settings/hooks
2. Click **Add webhook**
3. Configure:
   - **Payload URL:** `https://jenkins.iarservices.in/github-webhook/`
   - **Content type:** `application/json`
   - **Trigger on:** Let me select individual events
   - **Events to trigger:**
     - ✅ Push
     - ✅ Pull requests
   - ✅ Active
4. Click **Add webhook**

---

## Step 5: Create Jenkins Pipeline Job

### Jenkins Configuration

#### 5.1 Create New Pipeline Job

1. Go to your Jenkins instance
2. Click **New Item**
3. **Item name:** `modules-monorepo-pipeline`
4. **Type:** Pipeline
5. Click **OK**

#### 5.2 Configure Pipeline

1. **Description:**
   ```
   CI/CD pipeline for Modules Platform monorepo
   Orchestrates build, test, and deployment for packages and services
   ```

2. **Advanced Project Options**
   - Check: ✅ **This project is parameterized** (optional)
   - Check: ✅ **Throttle builds**
     - Max concurrent builds: `1`

3. **Build Triggers**
   - ✅ **GitHub hook trigger for GITScm polling**
   - ✅ **Poll SCM** (backup, optional)
     - Schedule: `H H * * *` (daily)

#### 5.3 Pipeline Definition

1. **Definition:** Pipeline script from SCM
2. **SCM:** Git
3. **Repository URL:** `git@github.com:iar-motor-claims/modules.git`
   - Or: `https://github.com/iar-motor-claims/modules.git`
4. **Credentials:** Select SSH key or HTTPS token
5. **Branch specifier:** `*/main` `*/develop`
6. **Script path:** `Jenkinsfile`
7. **Lightweight checkout:** ✅ (optional, for faster checkout)

#### 5.4 Save & Test

1. Click **Save**
2. Click **Build Now** to test
3. Monitor logs: **Console Output**

**Expected first run:**
```
[Pipeline] Start of Pipeline
[Pipeline] node
[Pipeline] stage
[Pipeline] checkout
Cloning the remote Git repository
...
[Pipeline] Setup
[Pipeline] container
+ pnpm install --frozen-lockfile
...
[Pipeline] Lint
[Pipeline] Build
[Pipeline] End of Pipeline
```

---

## Step 6: Configure Jenkins Kubernetes Pod

### Prerequisites

- Kubernetes cluster accessible from Jenkins
- Docker socket available or Docker-in-Docker enabled
- Service account for Jenkins pods

### Pod Security

The Jenkinsfile uses a Kubernetes pod with:
- Node.js 22.15.3 container
- Docker 25 DinD (Docker-in-Docker)
- Requests: 1.5 CPU, 1.5 GB RAM
- Limits: 1 CPU, 1 GB RAM (per container)

### Verify Kubernetes Connection

In Jenkins, go to **Manage Jenkins** → **Configure System** → **Cloud** → **Kubernetes**

Ensure:
- ✅ Kubernetes URL configured
- ✅ Credentials set up
- ✅ Namespace: `jenkins`
- ✅ Jenkins URL reachable from pods

---

## Step 7: Set Up Credentials

### GitHub Access Token (for HTTPS)

If using HTTPS instead of SSH:

1. Go to GitHub: https://github.com/settings/tokens
2. Click **Generate new token** (classic)
3. **Token name:** `jenkins-modules`
4. **Scopes:**
   - ✅ `repo` (full control)
   - ✅ `workflow` (Actions)
5. Click **Generate token**
6. Copy token

Then in Jenkins:
1. **Manage Jenkins** → **Manage Credentials**
2. **System** → **Global credentials**
3. **Add Credentials**
   - **Kind:** Username with password
   - **Username:** `github-modules`
   - **Password:** `<paste-token>`
   - **ID:** `github-modules-token`
4. Click **Create**

### Docker Registry Credentials (for future image builds)

1. **Manage Jenkins** → **Manage Credentials**
2. **Add Credentials**
   - **Kind:** Username with password
   - **Username:** `<docker-registry-user>`
   - **Password:** `<docker-registry-password>`
   - **ID:** `docker-registry`
3. Click **Create**

---

## Step 8: Monitor & Verify

### Check Pipeline Runs

1. Go to Jenkins job: **modules-monorepo-pipeline**
2. View **Build History** (left sidebar)
3. Click latest build → **Console Output**

### Expected Pipeline Stages

```
✅ Checkout       (git clone + metadata)
✅ Setup          (pnpm install)
✅ Lint           (ESLint)
✅ Type Check     (TypeScript)
✅ Test           (vitest)
✅ Build          (Nx build)
⏭️  Build Docker   (main branch only)
⏭️  Deploy Staging (develop branch only)
⏭️  Deploy Prod    (main branch, approval required)
```

### Webhook Verification

To verify webhook is working:

1. Go to GitHub: https://github.com/iar-motor-claims/modules/settings/hooks
2. Click the webhook
3. Scroll to **Recent Deliveries**
4. Verify 200 OK responses

---

## Step 9: Environment Configuration

### Jenkins Environment

Set these in Jenkins **Manage Jenkins** → **Configure System** → **Global properties**:

```properties
CI=true
NODE_ENV=test
PNPM_HOME=${WORKSPACE}/.pnpm
PATH=${WORKSPACE}/.pnpm:${PATH}
```

### Pod Resource Requests

Adjust in `Jenkinsfile` if needed:

```yaml
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

---

## Step 10: Future: Deployment Configuration

### Staging Deployment (develop branch)

When develop branch builds pass, auto-deploy to staging:

```groovy
stage('Deploy to Staging') {
  when { branch 'develop' }
  steps {
    // Add deployment commands here
    // Example: kubectl apply -f infra/helm/values-staging.yaml
  }
}
```

### Production Deployment (main branch)

Production requires manual approval:

```groovy
stage('Deploy to Production') {
  when { branch 'main' }
  input {
    message "Deploy to production?"
    ok "Deploy"
  }
  steps {
    // Add production deployment commands here
    // Example: helm upgrade modules infra/helm/charts/modules -f values-prod.yaml
  }
}
```

---

## Troubleshooting

### Webhook Not Triggering

1. Verify webhook payload URL is reachable
2. Check GitHub webhook **Recent Deliveries** for errors
3. Verify Jenkins credentials have repo access
4. Check Jenkins logs: **Manage Jenkins** → **System Log**

### Pipeline Not Starting

1. Verify Jenkinsfile syntax: `groovy -l Jenkinsfile`
2. Check pod scheduling: `kubectl get pods -n jenkins`
3. Review Kubernetes plugin config: **Manage Jenkins** → **Configure System** → **Cloud**

### pnpm Install Fails

1. Clear cache: `rm -rf ~/.pnpm-store`
2. Use `--frozen-lockfile` flag (already in Jenkinsfile)
3. Check Node.js version matches (should be 22.15.3)

### Docker Build Fails

1. Verify Docker-in-Docker is enabled
2. Check Docker daemon logs
3. Ensure sufficient disk space in pod

---

## Quick Reference

| Item | Value |
|------|-------|
| GitHub Repo | `git@github.com:iar-motor-claims/modules.git` |
| Jenkins Instance | `https://jenkins.iarservices.in` |
| Jenkins Job | `modules-monorepo-pipeline` |
| Jenkinsfile | Root `Jenkinsfile` |
| Webhook URL | `https://jenkins.iarservices.in/github-webhook/` |
| Node.js | 22.15.3 |
| pnpm | 10.32.1 |
| Build Timeout | 60 minutes |
| Parallel Tasks | 5 (Nx) |

---

## Next Steps After Setup

1. ✅ Push to GitHub
2. ✅ Create GitHub repository
3. ✅ Configure branch protection
4. ✅ Set up GitHub webhook
5. ✅ Create Jenkins pipeline job
6. ✅ Configure Kubernetes credentials
7. ✅ Run first build
8. Customize deployment stages for your environment
9. Set up monitoring & notifications
10. Configure per-service deployment

---

## Support

- **Jenkinsfile:** See root `Jenkinsfile` for pipeline stages
- **Jenkins Setup:** See `.jenkins/README.md` for detailed configuration
- **Kubernetes:** See `infra/helm/README.md` for Helm deployment
- **Architecture:** See `ARCHITECTURE.md` for monorepo design

