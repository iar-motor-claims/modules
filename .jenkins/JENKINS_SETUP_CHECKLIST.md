# Jenkins Setup Checklist — Modules Platform

**Jenkins URL:** https://jenkins.iarservices.in  
**GitHub Org:** iar-motor-claims  
**Repository:** modules  
**Jenkinsfile Path:** Root `Jenkinsfile`

---

## Pre-Requisites

- [ ] Jenkins 2.300+ installed
- [ ] Kubernetes plugin installed
- [ ] GitHub plugin installed
- [ ] SSH key pair configured (or GitHub token for HTTPS)
- [ ] Kubernetes cluster configured as Jenkins agent
- [ ] Docker available (for DinD in pods)

---

## Phase 1: GitHub Repository Setup

### 1.1 Create GitHub Repository

- [ ] Go to: https://github.com/iar-motor-claims
- [ ] Click **New**
- [ ] Repository name: `modules`
- [ ] Description: "Modular product platform — selling everything as modules"
- [ ] Do NOT initialize with README or .gitignore (already have them)
- [ ] Click **Create repository**

**Result:**
```
URL:  https://github.com/iar-motor-claims/modules
SSH:  git@github.com:iar-motor-claims/modules.git
```

### 1.2 Push Local Repository to GitHub

```bash
cd /Users/otakutekkurai/repos/iar/modules

# Set remote
git remote add origin git@github.com:iar-motor-claims/modules.git

# Verify
git remote -v

# Push main branch
git push -u origin main

# Verify push succeeded
git branch -a  # Should show: remotes/origin/main
```

---

## Phase 2: GitHub Security Configuration

### 2.1 Branch Protection Rules

- [ ] Go to: https://github.com/iar-motor-claims/modules/settings/branches
- [ ] Click **Add rule**
- [ ] Pattern: `main`
- [ ] Enable:
  - [ ] Require a pull request before merging
  - [ ] Require approvals: `1`
  - [ ] Require status checks to pass
  - [ ] Require code review before merging
- [ ] Click **Create**

### 2.2 Configure GitHub Webhook

- [ ] Go to: https://github.com/iar-motor-claims/modules/settings/hooks
- [ ] Click **Add webhook**
- [ ] **Payload URL:** `https://jenkins.iarservices.in/github-webhook/`
- [ ] **Content type:** `application/json`
- [ ] **Events:** Push, Pull requests
- [ ] **Active:** ✅ Checked
- [ ] Click **Add webhook**
- [ ] **Verify:** Scroll to **Recent Deliveries** → See green checkmarks

---

## Phase 3: Jenkins Credentials Setup

### 3.1 GitHub SSH Key Credentials

**Option A: Using SSH Key**

- [ ] Go to Jenkins: https://jenkins.iarservices.in
- [ ] **Manage Jenkins** → **Manage Credentials**
- [ ] **System** → **Global credentials** → **Add Credentials**
- [ ] **Kind:** SSH Username with private key
- [ ] **Username:** `github-modules`
- [ ] **Private Key:** Paste your SSH private key (from `~/.ssh/id_rsa`)
- [ ] **ID:** `github-modules-ssh`
- [ ] **Passphrase:** (if key is passphrase-protected)
- [ ] Click **Create**

**Option B: Using GitHub Personal Access Token**

- [ ] Go to GitHub: https://github.com/settings/tokens
- [ ] Click **Generate new token (classic)**
- [ ] **Token name:** `jenkins-modules`
- [ ] **Scopes:** `repo`, `workflow`
- [ ] Click **Generate token**
- [ ] Copy token

Then in Jenkins:
- [ ] **Manage Jenkins** → **Manage Credentials** → **System** → **Global credentials**
- [ ] **Add Credentials**
- [ ] **Kind:** Username with password
- [ ] **Username:** `github-modules`
- [ ] **Password:** Paste GitHub token
- [ ] **ID:** `github-modules-token`
- [ ] Click **Create**

### 3.2 Docker Registry Credentials (Optional)

For future Docker image builds:

- [ ] **Manage Jenkins** → **Manage Credentials** → **System** → **Global credentials**
- [ ] **Add Credentials**
- [ ] **Kind:** Username with password
- [ ] **Username:** Docker registry username
- [ ] **Password:** Docker registry password/token
- [ ] **ID:** `docker-registry`
- [ ] Click **Create**

---

## Phase 4: Kubernetes Configuration

### 4.1 Verify Kubernetes Cloud Plugin

- [ ] **Manage Jenkins** → **Configure System**
- [ ] Scroll to **Cloud** section
- [ ] Verify **Kubernetes** is configured:
  - [ ] **Kubernetes URL:** Points to your cluster
  - [ ] **Kubernetes Namespace:** `jenkins`
  - [ ] **Jenkins URL:** Reachable from pods (e.g., `http://jenkins.jenkins.svc.cluster.local:8080`)
  - [ ] **Credentials:** Set up (usually kubeconfig)
- [ ] Click **Save**

### 4.2 Pod Template Configuration

- [ ] Under **Cloud** → **Kubernetes** → **Pod Templates**
- [ ] Verify or add pod template:
  - [ ] **Name:** Default (or custom)
  - [ ] **Namespace:** `jenkins`
  - [ ] **Containers:**
    - [ ] Container 1: `nodejs` (Node.js 22.15.3)
    - [ ] Container 2: `docker` (Docker 25 DinD)
  - [ ] **Resource Requests:** 1.5 CPU, 1.5 GB RAM
  - [ ] **Resource Limits:** 1 CPU, 1 GB RAM (per container)
- [ ] Click **Save**

---

## Phase 5: Create Pipeline Job

### 5.1 New Pipeline Job

- [ ] Go to Jenkins: https://jenkins.iarservices.in
- [ ] Click **New Item** (top-left)
- [ ] **Item name:** `modules-monorepo-pipeline`
- [ ] **Type:** Pipeline
- [ ] Click **OK**

### 5.2 Configure General Settings

- [ ] **Description:**
  ```
  CI/CD pipeline for Modules Platform monorepo
  Orchestrates build, test, and deployment for packages and services
  Repository: https://github.com/iar-motor-claims/modules
  ```
- [ ] **Throttle builds:** ✅ Checked
  - [ ] Max concurrent builds: `1`

### 5.3 Configure Build Triggers

- [ ] ✅ **GitHub hook trigger for GITScm polling**
- [ ] ✅ **Poll SCM** (optional, as backup)
  - [ ] Schedule: `H H * * *` (daily)

### 5.4 Configure Pipeline Definition

- [ ] **Definition:** Pipeline script from SCM
- [ ] **SCM:** Git
- [ ] **Repository URL:**
  - Option A (SSH): `git@github.com:iar-motor-claims/modules.git`
  - Option B (HTTPS): `https://github.com/iar-motor-claims/modules.git`
- [ ] **Credentials:** Select GitHub credentials (SSH or token)
- [ ] **Branch specifier:** `*/main` `*/develop`
- [ ] **Script path:** `Jenkinsfile`
- [ ] **Lightweight checkout:** ✅ Checked (optional, faster)
- [ ] Click **Save**

---

## Phase 6: Test Pipeline

### 6.1 Trigger First Build

- [ ] In Jenkins job: **modules-monorepo-pipeline**
- [ ] Click **Build Now**
- [ ] Monitor: **Console Output**

**Expected stages:**
```
✅ Checkout       ~5 sec
✅ Setup          ~30 sec (pnpm install)
✅ Lint           ~15 sec (ESLint)
✅ Type Check     ~20 sec (TypeScript)
✅ Test           ~30 sec (vitest)
✅ Build          ~20 sec (Nx build)
Total time: ~2-3 minutes
```

### 6.2 Verify Build Success

- [ ] Check **Console Output** for green checkmarks
- [ ] Verify no errors in pod logs: `kubectl logs -n jenkins <pod-name>`
- [ ] Check stage progress indicator (blue bar)

### 6.3 Test Webhook Trigger

- [ ] Go to GitHub: https://github.com/iar-motor-claims/modules
- [ ] Make a test commit to a branch (not main)
- [ ] Push to GitHub: `git push origin test-branch`
- [ ] Wait 30 seconds
- [ ] Check Jenkins: **modules-monorepo-pipeline** → **Build History**
- [ ] Should see new build triggered automatically

### 6.4 Verify Webhook Configuration

- [ ] GitHub: https://github.com/iar-motor-claims/modules/settings/hooks
- [ ] Click webhook
- [ ] Scroll to **Recent Deliveries**
- [ ] Verify green checkmarks (HTTP 200) for push events

---

## Phase 7: Configure Environment

### 7.1 Global Environment Variables

- [ ] **Manage Jenkins** → **Configure System**
- [ ] Scroll to **Global properties**
- [ ] ✅ **Environment variables** (checked)
- [ ] Add variables:
  ```
  CI                true
  NODE_ENV          test
  PNPM_HOME         ${WORKSPACE}/.pnpm
  PATH              ${WORKSPACE}/.pnpm:${PATH}
  ```
- [ ] Click **Save**

### 7.2 Job-Specific Settings

In **modules-monorepo-pipeline**:

- [ ] **Timeout:** 60 minutes (already in Jenkinsfile)
- [ ] **Build discarder:** Keep last 20 builds
- [ ] **Max concurrent:** 1

---

## Phase 8: Configure Notifications (Optional)

### 8.1 Slack Notifications

- [ ] Install Jenkins Slack plugin (if not already installed)
- [ ] **Manage Jenkins** → **Configure System** → **Slack**
- [ ] **Workspace:** Your Slack workspace
- [ ] **Credential:** Add Slack token
- [ ] **Channel:** `#modules-ci` (create if needed)

Then in **modules-monorepo-pipeline**:

- [ ] **Post-build Actions** → **Slack Notifications**
- [ ] ✅ Notify on build failure
- [ ] ✅ Notify on build success (optional)

### 8.2 Email Notifications

- [ ] **Manage Jenkins** → **Configure System** → **E-mail Notification**
- [ ] Configure SMTP settings (if not already done)
- [ ] Click **Save**

Then in **modules-monorepo-pipeline**:

- [ ] **Post-build Actions** → **E-mail Notification**
- [ ] Recipients: `admin@iarservices.in`

---

## Phase 9: Verify Jenkins Health

### 9.1 System Logs

- [ ] **Manage Jenkins** → **System Log**
- [ ] Verify no error messages
- [ ] Check for warning about plugins

### 9.2 Plugin Health

- [ ] **Manage Jenkins** → **Plugin Manager**
- [ ] Check for updates
- [ ] Verify key plugins installed:
  - [ ] Kubernetes plugin
  - [ ] GitHub plugin
  - [ ] Pipeline plugin
  - [ ] Docker plugin (optional)

### 9.3 Kubernetes Pod Status

```bash
# Check Jenkins pods
kubectl get pods -n jenkins

# View logs of recent pipeline run
kubectl logs -n jenkins <pod-name> -c nodejs

# Check resource usage
kubectl top pods -n jenkins
```

---

## Phase 10: Production Checklist

Before considering production-ready:

- [ ] First build succeeded
- [ ] Webhook triggering builds automatically
- [ ] Branch protection enabled on main
- [ ] Credentials securely stored
- [ ] Environment variables configured
- [ ] Kubernetes pods running successfully
- [ ] Build artifacts being generated
- [ ] Pipeline stages completing as expected
- [ ] No security warnings in Jenkins
- [ ] Backups configured (Jenkins home directory)

---

## Troubleshooting

### Webhook Not Firing

```bash
# 1. Verify webhook URL is reachable
curl -I https://jenkins.iarservices.in/github-webhook/

# 2. Check GitHub webhook recent deliveries
# Go to: https://github.com/iar-motor-claims/modules/settings/hooks

# 3. Check Jenkins logs
# Manage Jenkins → System Log → Look for 'github' entries
```

### Pod Fails to Start

```bash
# Check pod status
kubectl get pods -n jenkins
kubectl describe pod <pod-name> -n jenkins

# View pod logs
kubectl logs <pod-name> -n jenkins -c nodejs
kubectl logs <pod-name> -n jenkins -c docker
```

### Pipeline Hangs

- Check Kubernetes pod resource limits
- Verify Docker-in-Docker has enough space
- Check Jenkins system logs for deadlocks
- Increase timeout in Jenkinsfile if needed

### pnpm Install Timeout

```bash
# In Jenkinsfile, adjust container resources:
resources:
  requests:
    memory: "2Gi"    # Increase from 1Gi
    cpu: "1000m"     # Increase from 500m
  limits:
    memory: "3Gi"    # Increase from 2Gi
    cpu: "2000m"     # Increase from 1000m
```

---

## Quick Commands Reference

```bash
# Verify git remote
git remote -v

# Push to GitHub
git push -u origin main

# Check Jenkins pipeline logs
kubectl logs -f -n jenkins deployment/jenkins

# Trigger build manually
curl -X POST https://jenkins.iarservices.in/job/modules-monorepo-pipeline/build

# View recent builds
curl https://jenkins.iarservices.in/job/modules-monorepo-pipeline/api/json | jq '.builds | .[0:5]'
```

---

## Success Indicators

✅ When all of these are true, Jenkins is properly configured:

1. GitHub repository exists at `iar-motor-claims/modules`
2. Code is pushed to main branch
3. Webhook URL shows green checkmarks in GitHub settings
4. Jenkins job **modules-monorepo-pipeline** exists
5. Manual **Build Now** completes successfully
6. Push to develop branch triggers automatic build
7. Build logs show all 9 pipeline stages
8. No errors in Jenkins system logs
9. Kubernetes pods complete without crashes
10. Artifacts are generated and accessible

---

## Next: Deploy to Kubernetes

After Jenkins is configured and passing builds:

```bash
# Deploy Helm chart
helm install modules infra/helm/charts/modules \
  --namespace modules \
  --create-namespace

# Verify deployment
kubectl get deployments -n modules
kubectl get services -n modules
```

See `infra/helm/README.md` for detailed Helm deployment instructions.

---

## Support

- **Jenkins Setup:** `.jenkins/README.md`
- **Pipeline Details:** Root `Jenkinsfile`
- **GitHub Setup:** `.github/DEPLOYMENT.md`
- **Kubernetes:** `infra/helm/README.md`
- **Architecture:** `ARCHITECTURE.md`

