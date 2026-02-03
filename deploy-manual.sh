#!/bin/bash

# Manual deployment script for rp-new
# Run this script in your terminal: bash deploy-manual.sh

set -e

cd "$(dirname "$0")"

echo "🚀 Deploying rp-new to GitHub Pages..."
echo ""

# Remove problematic .git if it exists and is causing issues
if [ -d ".git" ]; then
    echo "⚠️  Removing existing .git directory..."
    sudo rm -rf .git || rm -rf .git
fi

# Initialize git repository
echo "📦 Initializing git repository..."
git init

# Add remote repository
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/kerrin-sofie/rp-prototype.git || git remote set-url origin https://github.com/kerrin-sofie/rp-prototype.git

# Add all files
echo "📝 Staging files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Update: Latest version of rp-new prototype - $(date '+%Y-%m-%d %H:%M:%S')"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site should be available at:"
echo "   https://kerrin-sofie.github.io/rp-prototype/"
echo ""
echo "⏱️  GitHub Pages may take 1-2 minutes to update."
