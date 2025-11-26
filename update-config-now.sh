#!/bin/bash

# Interactive script to update widget config on production
# This will sync your local config to MongoDB on Vercel

set -e

PROJECT_ID="${1:-5796}"
API_URL="https://api-three-pearl.vercel.app"

echo "🔄 Updating Widget Config for Project: $PROJECT_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Get API Key
if [ -z "$WIDGET_CONFIG_API_KEY" ]; then
  echo "⚠️  API Key not found in environment"
  echo ""
  echo "You can get it from:"
  echo "   https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables"
  echo ""
  echo "Or generate a new one with: ./generate-api-key.sh"
  echo ""
  read -sp "Enter your WIDGET_CONFIG_API_KEY: " API_KEY
  echo ""
  echo ""
  if [ -z "$API_KEY" ]; then
    echo "❌ API Key is required. Exiting."
    exit 1
  fi
else
  API_KEY="$WIDGET_CONFIG_API_KEY"
  echo "✅ Using API Key from environment"
  echo ""
fi

# Read config from local file
echo "📖 Reading config from: apps/api/data/widget-config.json"
CONFIG=$(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('apps/api/data/widget-config.json', 'utf-8'));
const config = data.configs.find(c => c.projectId === '$PROJECT_ID');
if (!config) {
  console.error('❌ Config not found for projectId: $PROJECT_ID');
  console.error('Available projectIds:', data.configs.map(c => c.projectId).join(', '));
  process.exit(1);
}
const update = {
  agentName: config.agentName,
  avatarUrl: config.avatarUrl,
  primaryColor: config.primaryColor,
  followupMessage: config.followupMessage,
  bhkPrompt: config.bhkPrompt,
  inventoryMessage: config.inventoryMessage,
  phonePrompt: config.phonePrompt,
  thankYouMessage: config.thankYouMessage,
  bubblePosition: config.bubblePosition,
  autoOpenDelayMs: config.autoOpenDelayMs,
  welcomeMessage: config.welcomeMessage
};
if (config.propertyInfo) update.propertyInfo = config.propertyInfo;
console.log(JSON.stringify(update));
" 2>&1)

if [ $? -ne 0 ]; then
  echo "$CONFIG"
  exit 1
fi

echo "✅ Config loaded:"
echo "   - Primary Color: $(echo "$CONFIG" | node -e "const c=JSON.parse(require('fs').readFileSync(0,'utf-8')); console.log(c.primaryColor)")"
echo "   - Agent Name: $(echo "$CONFIG" | node -e "const c=JSON.parse(require('fs').readFileSync(0,'utf-8')); console.log(c.agentName)")"
echo ""

# Update via API
echo "🚀 Updating config on production API..."
echo "   URL: $API_URL/api/widget-config/$PROJECT_ID"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$API_URL/api/widget-config/$PROJECT_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "$CONFIG")

# Extract HTTP code and body (compatible with macOS)
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo "✅ SUCCESS! Config updated (HTTP $HTTP_CODE)"
  echo ""
  echo "Updated config:"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
  echo "❌ ERROR: Failed to update config (HTTP $HTTP_CODE)"
  echo ""
  echo "Response:"
  echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
  echo ""
  echo "💡 Troubleshooting:"
  echo "   - Check if API key is correct"
  echo "   - Verify API key is set in Vercel environment variables"
  echo "   - Check Vercel logs for errors"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Verifying config..."
VERIFY=$(curl -s "$API_URL/api/widget-config/$PROJECT_ID")
if [ "$VERIFY" != "{}" ] && [ -n "$VERIFY" ]; then
  echo "✅ Config verified! It's now available on production."
  echo ""
  echo "Test it:"
  echo "   curl $API_URL/api/widget-config/$PROJECT_ID"
else
  echo "⚠️  Config might not be visible yet (could be caching)"
  echo "   Try: curl $API_URL/api/widget-config/$PROJECT_ID"
fi
echo ""
echo "🎉 Done! Your widget should now use the updated config."
echo "   Clear browser cache or use incognito to see changes."

