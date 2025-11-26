#!/bin/bash

# Simple script to update widget config on production
# Usage: ./update-config-simple.sh <projectId> [apiKey]

set -e

PROJECT_ID="${1:-5796}"
API_KEY="${2:-$WIDGET_CONFIG_API_KEY}"
API_URL="https://api-three-pearl.vercel.app"

if [ -z "$API_KEY" ]; then
  echo "❌ Error: API Key required"
  echo "Usage: $0 <projectId> <apiKey>"
  echo "   OR: export WIDGET_CONFIG_API_KEY='your-key' then run: $0 <projectId>"
  exit 1
fi

echo "🔄 Updating config for project: $PROJECT_ID"
echo ""

# Read config from local file
CONFIG=$(node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('apps/api/data/widget-config.json', 'utf-8'));
const config = data.configs.find(c => c.projectId === '$PROJECT_ID');
if (!config) {
  console.error('Config not found for projectId: $PROJECT_ID');
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
")

# Update via API
RESPONSE=$(curl -s -X POST \
  "$API_URL/api/widget-config/$PROJECT_ID" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "$CONFIG")

echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""
echo "✅ Done! Test with: curl $API_URL/api/widget-config/$PROJECT_ID"

