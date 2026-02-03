# Arbio Reservation Prototype

A prototype for the Arbio reservation system.

## Deployment

The site is deployed to GitHub Pages and available at:
**https://kerrin-sofie.github.io/rp-prototype/**

### To Deploy Latest Changes

Run the deployment script:
```bash
./deploy.sh
```

Or manually:
```bash
# Remove the problematic .git directory if needed
rm -rf .git

# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/kerrin-sofie/rp-prototype.git

# Add all files
git add .

# Commit changes
git commit -m "Update: Latest version of rp-new prototype"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

### GitHub Pages Setup

GitHub Pages should already be configured. If not:
1. Go to https://github.com/kerrin-sofie/rp-prototype/settings/pages
2. Select the branch: `main`
3. Select the folder: `/ (root)`
4. Click Save

The site will be available at: `https://kerrin-sofie.github.io/rp-prototype/`
