# Modules Platform — Deployment Quick Start

**Jenkins URL:** https://jenkins.iarservices.in  
**GitHub Org:** iar-motor-claims  
**Estimated Time:** ~30 minutes

---

## 📚 Documentation Files (Use These)

Read in this order:

### 1. GitHub Setup (~15 min)
**File:** `.github/GITHUB_SETUP_INSTRUCTIONS.md`

What you'll do:
- Create GitHub repository `iar-motor-claims/modules`
- Push code from local repository
- Enable branch protection on `main`
- Configure webhook for Jenkins

### 2. Jenkins Setup (~20 min)
**File:** `.jenkins/JENKINS_SETUP_CHECKLIST.md`

What you'll do:
- Set up GitHub credentials in Jenkins
- Create pipeline job `modules-monorepo-pipeline`
- Configure Jenkinsfile from repository
- Test manual build
- Verify webhook auto-triggers builds

### 3. Reference Guides
- **Full Deployment Guide:** `.github/DEPLOYMENT.md`
- **Jenkins Architecture:** `.jenkins/README.md`

---

## ⚡ TL;DR — Quick Setup (If you've done this before)

### GitHub (10 minutes)

```bash
# 1. Create repository at https://github.com/iar-motor-claims
#    Name: "modules"
#    DO NOT initialize with README/gitignore

# 2. Push code
cd /Users/otakutekkurai/repos/iar/modules
git remote add origin git@github.com:iar-motor-claims/modules.git
git push -u origin main

# 3. Enable branch protection
# Go to: https://github.com/iar-motor-claims/modules/settings/branches
# Add rule for "main" → Require 1 approval

# 4. Add webhook
# Go to: https://github.com/iar-motor-claims/modules/settings/hooks
# Add webhook:
#   URL: https://jenkins.iarservices.in/github-webhook/
#   Events: Push, Pull requests
```

### Jenkins (15 minutes)

```
1. Go to: https://jenkins.iarservices.in
2. Manage Jenkins → Manage Credentials
3. Add GitHub SSH key (or personal access token)
   ID: "github-modules-ssh"

4. New Item
   Name: modules-monorepo-pipeline
   Type: Pipeline
   
5. Configure:
   - Build triggers: ✅ GitHub hook trigger
   - Pipeline:
     * Definition: Pipeline script from SCM
     * SCM: Git
     * Repository: git@github.com:iar-motor-claims/modules.git
     * Credentials: github-modules-ssh
     * Branch: */main */develop
     * Script path: Jenkinsfile
   
6. Build Now → Verify success

7. Test webhook:
   git commit --allow-empty -m "test: webhook"
   git push origin main
   # Should auto-trigger build in Jenkins
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] GitHub repository exists: https://github.com/iar-motor-claims/modules
- [ ] All code pushed: 36+ files visible on GitHub
- [ ] Branch protection enabled on `main`
- [ ] Webhook configured: Recent Deliveries show HTTP 200 (green)
- [ ] Jenkins job created: `modules-monorepo-pipeline`
- [ ] First manual build succeeded
- [ ] Push auto-triggers Jenkins build (via webhook)
- [ ] All pipeline stages complete:
  - [ ] Checkout
  - [ ] Setup
  - [ ] Lint
  - [ ] Type Check
  - [ ] Test
  - [ ] Build

---

## 🚀 After Setup

### Deploy to Kubernetes

```bash
# Install Helm chart
helm install modules infra/helm/charts/modules \
  --namespace modules \
  --create-namespace

# Verify
kubectl get deployments -n modules
kubectl get services -n modules
```

### Create First Package

```bash
# Follow .claude/SETUP.md "Create First Package" section
mkdir packages/utils
cd packages/utils

# Add package.json, tsconfig.json, src/index.ts
# (See SETUP.md for template)

cd ../..
pnpm install
pnpm nx build @modules/utils
```

### Add Collaborators (Optional)

GitHub → Settings → Collaborators → Add people

---

## 🆘 Troubleshooting

### GitHub Webhook Not Triggering Jenkins

1. Verify Jenkins URL is accessible:
   ```bash
   curl -I https://jenkins.iarservices.in
   ```

2. Check GitHub webhook:
   - Go to: https://github.com/iar-motor-claims/modules/settings/hooks
   - Click webhook
   - Check "Recent Deliveries"
   - Should show HTTP 200 (green checkmark)

3. If error, check Jenkins logs:
   - Jenkins → Manage Jenkins → System Log

### Build Fails: "Cannot find module"

Cause: pnpm cache issue

Solution:
```bash
# In Jenkins pod or locally
rm -rf ~/.pnpm-store
pnpm install --frozen-lockfile
```

### Pipeline Hangs on "pnpm install"

Cause: Pod resource limits too low

Solution:
1. Edit `Jenkinsfile`
2. Increase pod resources:
   ```groovy
   resources:
     requests:
       memory: "2Gi"
       cpu: "1000m"
     limits:
       memory: "3Gi"
       cpu: "2000m"
   ```
3. Commit and push
4. Re-trigger build

---

## 📊 Expected Build Output

When everything is configured correctly, a build should look like:

```
[Pipeline] Start of Pipeline
[Pipeline] node
[Pipeline] stage
[Pipeline] checkout
  Cloning the remote Git repository
  git config user.name "Jenkins"
  ...
[Pipeline] stage
[Pipeline] container
[Pipeline] stage
[Pipeline] sh
  + pnpm install --frozen-lockfile
  ...
[Pipeline] stage
[Pipeline] sh
  + pnpm nx run-many --target=lint --all
  ...
[Pipeline] stage
[Pipeline] sh
  + pnpm nx run-many --target=typecheck --all
  ...
[Pipeline] stage
[Pipeline] sh
  + pnpm nx run-many --target=test --all
  ...
[Pipeline] stage
[Pipeline] sh
  + pnpm nx run-many --target=build --all
  ...
[Pipeline] End of Pipeline
```

**Total time:** ~2-3 minutes

---

## 🔑 Key Values

| Item | Value |
|------|-------|
| GitHub Org | `iar-motor-claims` |
| GitHub Repo | `modules` |
| GitHub SSH | `git@github.com:iar-motor-claims/modules.git` |
| Jenkins URL | `https://jenkins.iarservices.in` |
| Jenkins Job | `modules-monorepo-pipeline` |
| Webhook Endpoint | `https://jenkins.iarservices.in/github-webhook/` |
| Jenkinsfile Path | `Jenkinsfile` (root) |
| Node.js | 22.15.3 |
| pnpm | 10.32.1 |
| Build Timeout | 60 minutes |

---

## 📞 Support

**For step-by-step help:** See `.github/GITHUB_SETUP_INSTRUCTIONS.md`

**For Jenkins setup:** See `.jenkins/JENKINS_SETUP_CHECKLIST.md`

**For reference:** See `.github/DEPLOYMENT.md`

**For architecture:** See `ARCHITECTURE.md`

**For working rules:** See `CLAUDE.md`

---

## 🎯 Success Criteria

Your setup is complete when:

1. ✅ GitHub repository `iar-motor-claims/modules` exists
2. ✅ All code visible at https://github.com/iar-motor-claims/modules
3. ✅ Branch protection enforced on `main`
4. ✅ Webhook shows green deliveries in GitHub settings
5. ✅ Jenkins job `modules-monorepo-pipeline` exists
6. ✅ Manual "Build Now" succeeds
7. ✅ Push to `main` auto-triggers Jenkins build
8. ✅ All pipeline stages pass (Checkout → Build)
9. ✅ Kubernetes pods complete without errors

---

**Ready to start? Go to: `.github/GITHUB_SETUP_INSTRUCTIONS.md`**

