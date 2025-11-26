#!/bin/bash

# 🎨 Simple Widget Color & Message Changer
# This makes it super easy to update widget settings

set -e

CONFIG_FILE="apps/api/data/widget-config.json"
PROJECT_ID="${1:-5796}"

echo "🎨 Change Widget Color and Messages"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Config file not found: $CONFIG_FILE"
  exit 1
fi

# Show current settings
echo "📋 Current Settings for Project: $PROJECT_ID"
echo ""
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf-8'));
const config = data.configs.find(c => c.projectId === '$PROJECT_ID');
if (config) {
  console.log('   Color:', config.primaryColor);
  console.log('   Agent:', config.agentName);
  console.log('   Welcome:', config.welcomeMessage?.substring(0, 50) + '...');
} else {
  console.log('   Config not found for project $PROJECT_ID');
  process.exit(1);
}
"
echo ""

# Get new color
echo "🎨 Enter New Color (hex code like #6158ff):"
read -p "   Color (or press Enter to keep current): " NEW_COLOR

# Get new messages
echo ""
echo "💬 Enter New Messages (press Enter to keep current):"
read -p "   Welcome Message: " NEW_WELCOME
read -p "   CTA Acknowledgement: " NEW_CTA
read -p "   BHK Prompt: " NEW_BHK
read -p "   Thank You Message: " NEW_THANKS

# Update config
echo ""
echo "🔄 Updating config..."

node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$CONFIG_FILE', 'utf-8'));
const index = data.configs.findIndex(c => c.projectId === '$PROJECT_ID');

if (index === -1) {
  console.error('❌ Config not found for project $PROJECT_ID');
  process.exit(1);
}

const config = data.configs[index];
const now = new Date().toISOString();

// Update only if new value provided
if ('$NEW_COLOR' && '$NEW_COLOR'.trim()) {
  config.primaryColor = '$NEW_COLOR'.trim();
  console.log('✅ Color updated to:', config.primaryColor);
}
if ('$NEW_WELCOME' && '$NEW_WELCOME'.trim()) {
  config.welcomeMessage = '$NEW_WELCOME'.trim();
  console.log('✅ Welcome message updated');
}
if ('$NEW_CTA' && '$NEW_CTA'.trim()) {
  config.followupMessage = '$NEW_CTA'.trim();
  console.log('✅ CTA acknowledgement updated');
}
if ('$NEW_BHK' && '$NEW_BHK'.trim()) {
  config.bhkPrompt = '$NEW_BHK'.trim();
  console.log('✅ BHK prompt updated');
}
if ('$NEW_THANKS' && '$NEW_THANKS'.trim()) {
  config.thankYouMessage = '$NEW_THANKS'.trim();
  console.log('✅ Thank you message updated');
}

config.updatedAt = now;
data.configs[index] = config;

fs.writeFileSync('$CONFIG_FILE', JSON.stringify(data, null, 2));
console.log('');
console.log('✅ Config updated successfully!');
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Next: Deploy to production"
echo ""
read -p "Deploy now? (y/N): " DEPLOY_NOW

if [[ $DEPLOY_NOW =~ ^[Yy]$ ]]; then
  echo ""
  echo "🚀 Deploying..."
  git add "$CONFIG_FILE"
  git commit -m "Update widget config for project $PROJECT_ID"
  git push
  echo ""
  echo "✅ Deployed! Changes will be live in 1-2 minutes."
else
  echo ""
  echo "📝 To deploy later, run:"
  echo "   ./deploy.sh 'Update widget config'"
fi

