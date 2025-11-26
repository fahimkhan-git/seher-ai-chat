#!/bin/bash

# Simple deployment script - just commit and push!
# Vercel will automatically deploy from Git

set -e

echo "🚀 Deploying to Vercel via Git"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if there are changes
if [ -z "$(git status --porcelain)" ]; then
  echo "✅ No changes to deploy"
  exit 0
fi

# Show what will be committed
echo "📋 Changes to deploy:"
git status --short
echo ""

# Ask for commit message
if [ -z "$1" ]; then
  read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
  COMMIT_MSG=${COMMIT_MSG:-"Update project"}
else
  COMMIT_MSG="$1"
fi

# Commit and push
echo ""
echo "📦 Committing changes..."
git add -A
git commit -m "$COMMIT_MSG"

echo ""
echo "🚀 Pushing to Git..."
git push

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Pushed to Git!"
echo ""
echo "Vercel will automatically:"
echo "  1. Detect the push"
echo "  2. Build API and Widget"
echo "  3. Deploy to production"
echo ""
echo "📊 Check deployment status:"
echo "   https://vercel.com/fahimkhan-gits-projects"
echo ""

