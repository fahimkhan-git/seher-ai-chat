#!/bin/bash

# Fix corrupted package-lock.json files

set -e

echo "🧹 Fixing corrupted package-lock.json files..."
echo ""

# Step 1: Remove all package-lock.json files
echo "📦 Step 1: Removing corrupted lockfiles..."
find . -name "package-lock.json" -type f -delete
echo "✅ Removed all package-lock.json files"
echo ""

# Step 2: Clean npm cache
echo "🧹 Step 2: Cleaning npm cache..."
npm cache verify || npm cache clean --force
echo "✅ Cache cleaned"
echo ""

# Step 3: Remove node_modules (optional but recommended)
read -p "Remove node_modules? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "🗑️  Removing node_modules..."
  find . -name "node_modules" -type d -prune -exec rm -rf {} \;
  echo "✅ Removed node_modules"
else
  echo "⏭️  Skipping node_modules removal"
fi
echo ""

# Step 4: Fresh install
echo "📥 Step 3: Installing fresh dependencies..."
npm install
echo ""
echo "✅ Done! Fresh package-lock.json created."
echo ""
echo "🚀 Now commit and push:"
echo "   git add package-lock.json"
echo "   git commit -m 'Fix: regenerate package-lock.json'"
echo "   git push"

