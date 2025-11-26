#!/bin/bash

# Update widget config for production (file-based, no MongoDB)
# This updates the local file and provides instructions for deployment

set -e

PROJECT_ID="${1:-5796}"

echo "🔄 Updating Widget Config for Production"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Using file-based storage (no MongoDB needed)"
echo "   Config file: apps/api/data/widget-config.json"
echo ""

# Use the existing update-config-file.sh script
if [ -f "./update-config-file.sh" ]; then
  echo "✅ Using update-config-file.sh to update config..."
  echo ""
  ./update-config-file.sh "$PROJECT_ID"
  
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 Next Steps to Deploy to Production:"
  echo ""
  echo "1. Review the updated config file:"
  echo "   cat apps/api/data/widget-config.json"
  echo ""
  echo "2. Commit and push to deploy:"
  echo "   git add apps/api/data/widget-config.json"
  echo "   git commit -m 'Update widget config for project $PROJECT_ID'"
  echo "   git push"
  echo ""
  echo "3. Vercel will auto-deploy with the new config"
  echo ""
  echo "✅ Config updated locally! Commit and push to deploy to production."
else
  echo "❌ update-config-file.sh not found"
  exit 1
fi
