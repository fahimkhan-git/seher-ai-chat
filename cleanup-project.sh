#!/bin/bash

# 🧹 Clean Up Project - Remove Unnecessary Files

echo "🧹 Cleaning up project..."
echo ""

# Remove all .md files except README.md
echo "Removing documentation files (keeping README.md)..."
find . -maxdepth 1 -name "*.md" ! -name "README.md" -type f -delete
echo "✅ Removed .md files"

# Remove test HTML files
echo "Removing test HTML files..."
rm -f test-widget-local.html
rm -f test-local-widget.html
rm -f microsite-widget-test.html
rm -f MANUAL_INIT_FIX.html
rm -f check-widget-status.html
echo "✅ Removed test HTML files"

# Remove test scripts
echo "Removing test scripts..."
rm -f test-local.sh
rm -f test_chat_api.sh
rm -f test-config-update.sh
echo "✅ Removed test scripts"

# Remove one-time setup scripts
echo "Removing one-time setup scripts..."
rm -f complete-setup.sh
rm -f setup-env.sh
rm -f setup-vercel-env.sh
echo "✅ Removed setup scripts"

# Remove redundant scripts
echo "Removing redundant scripts..."
rm -f deploy-all.sh
rm -f deploy-production.sh
rm -f push.sh
rm -f start-all.sh
rm -f build-mongo-uri.sh
rm -f update-widget-config.sh
echo "✅ Removed redundant scripts"

# Remove test folders
echo "Removing test folders..."
rm -rf local-microsite
echo "✅ Removed test folders"

# Remove temporary files in data/
echo "Removing temporary files..."
rm -f apps/api/data/*.tmp
rm -f apps/api/data/*.backup
echo "✅ Removed temporary files"

# Remove test data
echo "Removing test data files..."
rm -f PROPERTY_DATA_FOR_DASHBOARD.json
rm -f THIRD_PARTY_LICENSES.txt
echo "✅ Removed test data"

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📝 Kept essential files:"
echo "   - README.md"
echo "   - run-local.sh (start all services)"
echo "   - update-config-file.sh (update widget config)"
echo "   - generate-api-key.sh (generate API keys)"
echo "   - EMBED_SCRIPT_TEMPLATE.html (embed script template)"
echo ""

