#!/bin/bash

# Deployment script for rp-new to GitHub Pages
# This script will commit and push the latest changes

set -e  # Exit on error

cd "$(dirname "$0")"

echo "🚀 Deploying rp-new to GitHub Pages..."
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add remote if it doesn't exist
if ! git remote get-url origin &>/dev/null; then
    echo "🔗 Adding remote repository..."
    git remote add origin https://github.com/kerrin-sofie/rp-prototype.git
else
    echo "✅ Remote repository already configured"
    git remote set-url origin https://github.com/kerrin-sofie/rp-prototype.git
fi

# Add all files
echo "📝 Staging files..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit - repository is up to date!"
else
    echo "💾 Committing changes..."
    git commit -m "Update: Latest version of rp-new prototype - $(date '+%Y-%m-%d %H:%M:%S')"
fi

# Ensure we're on main branch
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site should be available at:"
echo "   https://kerrin-sofie.github.io/rp-prototype/"
echo ""
echo "⏱️  GitHub Pages may take a few minutes to update."
echo "   You can check the deployment status at:"
echo "   https://github.com/kerrin-sofie/rp-prototype/settings/pages"
