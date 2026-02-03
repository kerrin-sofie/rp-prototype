# Deployment Guide for rp-new

## Current Status

✅ **Site is live at:** https://kerrin-sofie.github.io/rp-prototype/

## To Deploy Latest Changes

Due to macOS security restrictions, you'll need to run these commands manually in your terminal:

### Option 1: Quick Deploy (Recommended)

```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new

# Remove the problematic .git directory
rm -rf .git

# Initialize fresh git repository
git init

# Add remote
git remote add origin https://github.com/kerrin-sofie/rp-prototype.git

# Stage all files
git add .

# Commit
git commit -m "Update: Latest version - $(date '+%Y-%m-%d')"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main --force
```

### Option 2: Use the Deployment Script

```bash
cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new
./deploy.sh
```

If you encounter permission errors, use Option 1 instead.

## Verify Deployment

After pushing, wait 1-2 minutes, then visit:
- **Live Site:** https://kerrin-sofie.github.io/rp-prototype/
- **Repository:** https://github.com/kerrin-sofie/rp-prototype

## GitHub Pages Settings

If the site isn't updating, verify GitHub Pages is enabled:
1. Go to: https://github.com/kerrin-sofie/rp-prototype/settings/pages
2. Source: `Deploy from a branch`
3. Branch: `main` / `/ (root)`
4. Click `Save`

## Troubleshooting

**Permission Errors:**
- macOS may block git operations. Try removing `.git` and reinitializing (Option 1)
- If issues persist, check System Preferences → Security & Privacy

**Site Not Updating:**
- GitHub Pages can take 1-5 minutes to update
- Check the Actions tab for deployment status
- Clear your browser cache (Cmd+Shift+R)
