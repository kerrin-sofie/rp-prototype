#!/bin/bash

# Deployment script that uses Personal Access Token
# Usage: GITHUB_TOKEN=your_token_here ./deploy-with-token.sh

set -e

cd "$(dirname "$0")"

echo "🚀 Deploying rp-new to GitHub Pages..."
echo ""

# Check if token is provided
if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GITHUB_TOKEN environment variable not set"
    echo ""
    echo "Usage:"
    echo "  GITHUB_TOKEN=your_token_here ./deploy-with-token.sh"
    echo ""
    echo "To create a token:"
    echo "  1. Go to: https://github.com/settings/tokens/new"
    echo "  2. Select 'repo' scope"
    echo "  3. Generate and copy the token"
    echo ""
    exit 1
fi

# Remove problematic .git if it exists
if [ -d ".git" ]; then
    echo "⚠️  Removing existing .git directory..."
    rm -rf .git 2>/dev/null || sudo rm -rf .git
fi

# Initialize git repository
echo "📦 Initializing git repository..."
git init

# Configure git
git config user.name "kerrin-sofie" || true
git config user.email "kerrin-sofie@users.noreply.github.com" || true

# Add remote with token embedded in URL
echo "🔗 Adding remote repository..."
REMOTE_URL="https://${GITHUB_TOKEN}@github.com/kerrin-sofie/rp-prototype.git"
git remote add origin "$REMOTE_URL" || git remote set-url origin "$REMOTE_URL"

# Add all files
echo "📝 Staging files..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Update: Latest version of rp-new prototype - $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

# Set main branch
echo "🌿 Setting main branch..."
git branch -M main

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push -u origin main --force

# Clean up - remove token from remote URL for security
echo "🔒 Cleaning up credentials..."
git remote set-url origin https://github.com/kerrin-sofie/rp-prototype.git

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site should be available at:"
echo "   https://kerrin-sofie.github.io/rp-prototype/"
echo ""
echo "⏱️  GitHub Pages may take 1-2 minutes to update."
