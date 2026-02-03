# Easy Deployment Guide

## Quick Solution: Use Personal Access Token

### Step 1: Get Your Token
1. Visit: https://github.com/settings/tokens/new
2. Name: `rp-prototype-deploy`
3. Expiration: Choose your preference
4. **Check the `repo` checkbox** (gives full repository access)
5. Click **"Generate token"**
6. **COPY THE TOKEN** immediately (you won't see it again!)

### Step 2: Deploy
Run this command (replace `YOUR_TOKEN_HERE` with your actual token):

```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new
GITHUB_TOKEN=YOUR_TOKEN_HERE ./deploy-with-token.sh
```

Or if the script doesn't have execute permissions:

```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new
GITHUB_TOKEN=YOUR_TOKEN_HERE bash deploy-with-token.sh
```

---

## Alternative: Use GitHub CLI (Easiest Long-term)

### Install GitHub CLI:
```bash
brew install gh
```

### Authenticate:
```bash
gh auth login
# Choose: GitHub.com
# Choose: HTTPS
# Choose: Login with a web browser
# Follow the browser prompts
```

### Then deploy normally:
```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new
rm -rf .git
git init
git remote add origin https://github.com/kerrin-sofie/rp-prototype.git
git add .
git commit -m "Update: Latest version"
git branch -M main
git push -u origin main --force
```

---

## Alternative: Use SSH (No Token Needed)

### 1. Generate SSH key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
# Press Enter for default location
# Press Enter for no passphrase (or set one)
```

### 2. Copy your public key:
```bash
cat ~/.ssh/id_ed25519.pub
```

### 3. Add to GitHub:
1. Go to: https://github.com/settings/keys
2. Click "New SSH key"
3. Paste your public key
4. Click "Add SSH key"

### 4. Change remote to SSH and deploy:
```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new
rm -rf .git
git init
git remote add origin git@github.com:kerrin-sofie/rp-prototype.git
git add .
git commit -m "Update: Latest version"
git branch -M main
git push -u origin main --force
```

---

## Troubleshooting

**"Permission denied" or authentication errors:**
- Make sure your token has `repo` scope
- For SSH: Make sure your SSH key is added to GitHub
- Try the GitHub CLI method (easiest)

**"Repository not found":**
- Check that the repository exists: https://github.com/kerrin-sofie/rp-prototype
- Make sure you have write access to the repository
