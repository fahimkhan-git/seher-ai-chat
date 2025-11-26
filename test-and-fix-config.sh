#!/bin/bash

# 🔧 Test and Fix Widget Config

set -e

CONFIG_FILE="apps/api/data/widget-config.json"
PROJECT_ID="${1:-5796}"

echo "🔧 Test and Fix Widget Config"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Check if file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Config file not found: $CONFIG_FILE"
  exit 1
fi
echo "✅ Config file exists"

# Step 2: Check if project exists
echo ""
echo "📋 Current config for project $PROJECT_ID:"
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf-8'));
const config = data.configs.find(c => c.projectId === '$PROJECT_ID');
if (config) {
  console.log('   ✅ Project found');
  console.log('   Color:', config.primaryColor);
  console.log('   Agent:', config.agentName);
  console.log('   Welcome:', config.welcomeMessage?.substring(0, 60) + '...');
  console.log('   Updated:', config.updatedAt);
} else {
  console.log('   ❌ Project not found!');
  process.exit(1);
}
"

# Step 3: Test local API (if running)
echo ""
echo "🧪 Testing local API (if running on port 4000):"
LOCAL_TEST=$(curl -s http://localhost:4000/api/widget-config/$PROJECT_ID 2>&1 | head -3)
if echo "$LOCAL_TEST" | grep -q "primaryColor\|projectId"; then
  echo "   ✅ Local API is working"
  echo "$LOCAL_TEST" | python3 -m json.tool 2>/dev/null | head -5 || echo "$LOCAL_TEST"
else
  echo "   ⚠️  Local API not running or not responding"
  echo "   (This is OK if you're only testing production)"
fi

# Step 4: Check git status
echo ""
echo "📦 Git status:"
if git diff --quiet "$CONFIG_FILE"; then
  echo "   ✅ File is committed (no uncommitted changes)"
else
  echo "   ⚠️  File has uncommitted changes:"
  git diff "$CONFIG_FILE" | head -10
  echo ""
  read -p "Commit these changes now? (y/N): " COMMIT_NOW
  if [[ $COMMIT_NOW =~ ^[Yy]$ ]]; then
    git add "$CONFIG_FILE"
    git commit -m "Update widget config for project $PROJECT_ID"
    echo "   ✅ Changes committed"
  fi
fi

# Step 5: Check if pushed
echo ""
echo "🚀 Git push status:"
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
if [ -z "$REMOTE" ]; then
  echo "   ⚠️  No remote branch set"
elif [ "$LOCAL" = "$REMOTE" ]; then
  echo "   ✅ All changes pushed to remote"
else
  echo "   ⚠️  Local is ahead of remote"
  echo "   Run: git push"
fi

# Step 6: Instructions
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Next Steps:"
echo ""
echo "1. If you made changes, deploy them:"
echo "   ./deploy.sh 'Update widget config'"
echo ""
echo "2. Wait 1-2 minutes for Vercel to deploy"
echo ""
echo "3. Test the API:"
echo "   curl https://api-three-pearl.vercel.app/api/widget-config/$PROJECT_ID"
echo ""
echo "4. Clear browser cache and test widget"
echo ""
echo "✅ Done!"

