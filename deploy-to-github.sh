#!/bin/bash

# Script to deploy rp-new prototype to GitHub
# Run this from the rp-new directory

cd /Users/kerrinspintig/Desktop/Arbio-cursor/rp-new

# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/kerrin-sofie/rp-prototype.git

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Arbio reservation prototype"

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo "Done! Your prototype should now be available on GitHub."
echo "Don't forget to enable GitHub Pages in repository settings:"
echo "Settings → Pages → Source: main branch → Save"
