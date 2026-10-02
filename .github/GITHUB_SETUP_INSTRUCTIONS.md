# GitHub Repository Setup — Step by Step

**GitHub Org:** iar-motor-claims  
**Repository:** modules  
**URL:** https://github.com/iar-motor-claims/modules

This guide walks you through creating and configuring the GitHub repository.

---

## Step 1: Create the Repository on GitHub

### Action Required: Manual GitHub UI

1. **Open GitHub:**
   - Go to: https://github.com/iar-motor-claims
   - (Or click your organization dropdown → "New repository")

2. **Click "New"** button (top-left, green button)

3. **Fill in Repository Details:**

   | Field | Value |
   |-------|-------|
   | Owner | `iar-motor-claims` |
   | Repository name | `modules` |
   | Description | `Modular product platform — selling everything as modules` |
   | Visibility | Public (or Private, your choice) |

4. **DO NOT CHECK:**
   - ❌ "Add a README file"
   - ❌ "Add .gitignore"
   - ❌ "Choose a license"
   
   *(We already have these files)*

5. **Click "Create repository"**

### Result

You'll see:
```
Quick setup — if you've done this kind of thing before
or
…or create a new repository on the command line
```

---

## Step 2: Push Code to GitHub

### Action Required: Run Commands Locally

**Copy the SSH commands shown on GitHub (or use these):**

```bash
# Navigate to modules repo
cd /Users/otakutekkurai/repos/iar/modules

# Verify git status
git status

# Add GitHub remote (if not already set)
git remote add origin git@github.com:iar-motor-claims/modules.git

# Verify remote was added
git remote -v

# Expected output:
# origin  git@github.com:iar-motor-claims/modules.git (fetch)
# origin  git@github.com:iar-motor-claims/modules.git (push)
```

**Push the repository:**

```bash
# Push main branch to GitHub
git push -u origin main

# Expected output:
# Counting objects: 35, done.
# ...
# To github.com:iar-motor-claims/modules.git
#  * [new branch]      main -> main
# Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Verify push succeeded:**

```bash
# Check git branches
git branch -a

# Should show:
#   main
# * remotes/origin/main

# Check remote URL
git remote -v
```

### Success Indicator

✅ If you can see https://github.com/iar-motor-claims/modules/commits/main with all commits, the push succeeded.

---

## Step 3: Configure Branch Protection

### Action Required: Manual GitHub UI

**Protect the `main` branch to require reviews before merging:**

1. **Go to Settings:**
   - GitHub Repo → Settings tab (top navigation)
   - Or direct link: https://github.com/iar-motor-claims/modules/settings/branches

2. **Add Branch Protection Rule:**
   - Click "Add rule"
   - **Branch name pattern:** `main`

3. **Enable Protections:**
   - ✅ **Require a pull request before merging**
     - Require approvals: `1`
   - ✅ **Require code review before merging**
   - ✅ **Require status checks to pass before merging**
     - (Will populate after Jenkins builds complete)
   - ✅ **Require branches to be up to date before merging** (optional)
   - ✅ **Include administrators** (if desired)

4. **Click "Create"**

### Result

From now on:
- Direct pushes to `main` will be rejected
- All changes must go through Pull Requests
- Requires 1 approval before merging
- Build status must pass

---

## Step 4: Configure GitHub Webhook for Jenkins

### Action Required: Manual GitHub UI

**Enable GitHub to notify Jenkins on push/PR events:**

1. **Go to Webhooks:**
   - GitHub Repo → Settings tab → Webhooks
   - Or direct link: https://github.com/iar-motor-claims/modules/settings/hooks

2. **Click "Add webhook"**

3. **Configure Webhook:**

   | Setting | Value |
   |---------|-------|
   | Payload URL | `https://jenkins.iarservices.in/github-webhook/` |
   | Content type | `application/json` |
   | Secret | (leave blank, or generate one) |
   | Which events would you like to trigger this webhook? | Let me select individual events |

4. **Select Events:**
   - ✅ Push events
   - ✅ Pull requests
   - (You can add more later)

5. **Active:**
   - ✅ Checked

6. **Click "Add webhook"**

### Verify Webhook

After adding, scroll down to **Recent Deliveries:**

- You should see a test delivery
- It should show a **green checkmark** (HTTP 200)
- If red, check Jenkins URL accessibility

**Test webhook manually:**

```bash
# Push a test commit
git commit --allow-empty -m "test: verify webhook"
git push origin main

# Wait ~10 seconds, then check:
# GitHub: Settings → Webhooks → Recent Deliveries
# Should see new entry with 200 OK response
```

---

## Step 5: Verify Repository Configuration

### Check Everything is Set Up

**On GitHub Repository:**

1. ✅ Repo exists at `iar-motor-claims/modules`
2. ✅ All files visible in file browser
3. ✅ Commit history visible (`commits/main`)
4. ✅ Branch protection rule enabled on `main`
5. ✅ Webhook added and showing green deliveries

**Locally:**

```bash
cd /Users/otakutekkurai/repos/iar/modules

# Verify remote
git remote -v
# Should show: origin  git@github.com:iar-motor-claims/modules.git

# Verify branch tracking
git branch -vv
# Should show: main  ...  [origin/main] ...

# Check git status
git status
# Should show: "On branch main" and "nothing to commit"
```

---

## Step 6: Create Development Workflow

### Protection Bypass (for active development)

If you want to push directly to `main` during initial development, you can temporarily disable the protection:

1. Settings → Branches → Edit the `main` rule
2. Uncheck "Require a pull request before merging"
3. Click "Save changes"

**⚠️ Re-enable this after initial setup!**

### Working with Branches

Once protection is enabled:

```bash
# Create a feature branch
git checkout -b feat/my-feature

# Make changes and commit
git add .
git commit -m "feat: add something"

# Push to GitHub
git push -u origin feat/my-feature

# Create a Pull Request on GitHub
# 1. Go to GitHub
# 2. Click "Compare & pull request"
# 3. Add description
# 4. Click "Create pull request"
# 5. Wait for Jenkins build to pass
# 6. Request review (if configured)
# 7. Merge when approved
```

---

## Step 7: Add Collaborators (Optional)

### Invite Team Members

1. **Settings** → **Access** → **Collaborators**
2. Click "Add people"
3. Search for GitHub username
4. Select permission level:
   - **Maintain** — Can merge, manage (recommended for leads)
   - **Push** — Can push directly to most branches
   - **Pull** — Read-only
5. Click "Add"

---

## Step 8: Configure GitHub Secrets (Optional)

### For Future CI/CD Secrets

1. **Settings** → **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Add secrets (examples):
   ```
   DOCKER_USERNAME
   DOCKER_PASSWORD
   KUBECONFIG (base64-encoded)
   ```

These can be used in `.github/workflows/` for deployment.

---

## Troubleshooting GitHub Setup

### Push Fails: "Repository not found"

**Cause:** Remote URL incorrect or SSH key not configured

**Solution:**
```bash
# Check remote URL
git remote -v

# If wrong, remove and re-add
git remote remove origin
git remote add origin git@github.com:iar-motor-claims/modules.git

# Verify SSH key
ssh -T git@github.com
# Should show: "Hi username! You've successfully authenticated..."
```

### Webhook Not Triggering Jenkins

**Cause:** Jenkins URL not accessible or webhook misconfigured

**Solution:**
1. Verify Jenkins URL is accessible: `curl -I https://jenkins.iarservices.in`
2. Check GitHub webhook settings → Recent Deliveries
3. If HTTP 500+ error, check Jenkins logs
4. Verify webhook payload URL: `https://jenkins.iarservices.in/github-webhook/`

### Branch Protection Issues

**Issue:** Can't push directly to `main`

**Expected:** This is by design (branch protection enabled)

**Solution:** Use pull requests instead:
```bash
git checkout -b my-branch
git push -u origin my-branch
# Then create PR on GitHub
```

**To bypass temporarily:**
1. Settings → Branches → Edit rule
2. Disable protection
3. Push
4. Re-enable protection

---

## Quick Checklist

Copy this and use as verification:

```
GitHub Repository Setup Checklist:

Setup & Push:
  [ ] Repository created at iar-motor-claims/modules
  [ ] Code pushed to main branch
  [ ] All commits visible on GitHub
  [ ] Git remotes configured locally

Branch Protection:
  [ ] Branch protection rule enabled on main
  [ ] Requires 1 approval enabled
  [ ] Status checks configured (will populate after Jenkins builds)

Webhooks:
  [ ] GitHub webhook added to Jenkins
  [ ] Webhook URL: https://jenkins.iarservices.in/github-webhook/
  [ ] Recent deliveries show HTTP 200 (green checkmark)
  [ ] Test push triggered Jenkins build

Verification:
  [ ] Can view code on GitHub
  [ ] Direct push to main is rejected
  [ ] Branch protection rules enforced
  [ ] Webhook test delivery succeeds
```

---

## Next Step: Jenkins Setup

Once GitHub is configured, proceed to Jenkins setup:

See: `.jenkins/JENKINS_SETUP_CHECKLIST.md` for detailed Jenkins configuration steps.

**Preview of Jenkins flow:**
1. Create GitHub credentials in Jenkins
2. Create pipeline job
3. Configure Jenkinsfile from this repo
4. Run first build
5. Verify webhook triggers builds automatically

---

## Support & Resources

- **GitHub Docs:** https://docs.github.com
- **Branch Protection:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- **Webhooks:** https://docs.github.com/en/developers/webhooks-and-events/webhooks
- **Jenkins GitHub Integration:** https://plugins.jenkins.io/github/

