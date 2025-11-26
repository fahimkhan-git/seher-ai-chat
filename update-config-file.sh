#!/bin/bash

# 📝 Update Widget Config Directly in File (No MongoDB Needed!)

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CONFIG_FILE="apps/api/data/widget-config.json"
PROJECT_ID="${1:-5796}"

echo -e "${BLUE}📝 Update Widget Config (File Storage - No MongoDB)${NC}"
echo "=================================================="
echo ""
echo "Project ID: ${GREEN}${PROJECT_ID}${NC}"
echo "Config File: ${GREEN}${CONFIG_FILE}${NC}"
echo ""

# Ensure data directory exists
mkdir -p apps/api/data

# Load existing config
if [ -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}Loading existing config...${NC}"
    EXISTING=$(cat "$CONFIG_FILE")
else
    echo -e "${YELLOW}Creating new config file...${NC}"
    EXISTING='{"configs":[]}'
fi

# Menu
echo "What would you like to update?"
echo "1) Color only"
echo "2) Messages only"
echo "3) Color + Messages"
echo "4) Full configuration"
echo "5) View current config"
echo "6) Exit"
echo ""
read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        read -p "Enter hex color code (e.g., #6158ff): " color
        if [[ ! $color =~ ^#[0-9A-Fa-f]{6}$ ]]; then
            echo -e "${RED}❌ Invalid hex color. Must be in format #RRGGBB${NC}"
            exit 1
        fi
        UPDATE='{"primaryColor":"'$color'"}'
        ;;
    2)
        echo "Enter new messages (press Enter to skip):"
        read -p "Welcome Message: " welcome
        read -p "CTA Acknowledgement: " cta_ack
        read -p "BHK Prompt: " bhk_prompt
        read -p "Name Prompt: " name_prompt
        read -p "Thank You Message: " thank_you
        
        UPDATE="{"
        [ -n "$welcome" ] && UPDATE+="\"welcomeMessage\":\"$welcome\","
        [ -n "$cta_ack" ] && UPDATE+="\"ctaAcknowledgement\":\"$cta_ack\","
        [ -n "$bhk_prompt" ] && UPDATE+="\"bhkPrompt\":\"$bhk_prompt\","
        [ -n "$name_prompt" ] && UPDATE+="\"namePrompt\":\"$name_prompt\","
        [ -n "$thank_you" ] && UPDATE+="\"thankYouMessage\":\"$thank_you\","
        UPDATE="${UPDATE%,}"
        UPDATE+="}"
        ;;
    3)
        read -p "Enter hex color code (e.g., #6158ff): " color
        if [[ ! $color =~ ^#[0-9A-Fa-f]{6}$ ]]; then
            echo -e "${RED}❌ Invalid hex color${NC}"
            exit 1
        fi
        echo ""
        echo "Enter new messages (press Enter to skip):"
        read -p "Welcome Message: " welcome
        read -p "CTA Acknowledgement: " cta_ack
        read -p "BHK Prompt: " bhk_prompt
        
        UPDATE="{\"primaryColor\":\"$color\""
        [ -n "$welcome" ] && UPDATE+=",\"welcomeMessage\":\"$welcome\""
        [ -n "$cta_ack" ] && UPDATE+=",\"ctaAcknowledgement\":\"$cta_ack\""
        [ -n "$bhk_prompt" ] && UPDATE+=",\"bhkPrompt\":\"$bhk_prompt\""
        UPDATE+="}"
        ;;
    4)
        echo "Full Configuration:"
        read -p "Hex Color: " color
        read -p "Agent Name: " agent_name
        read -p "Welcome Message: " welcome
        read -p "CTA Acknowledgement: " cta_ack
        read -p "BHK Prompt: " bhk_prompt
        read -p "Thank You Message: " thank_you
        
        UPDATE="{"
        [ -n "$color" ] && UPDATE+="\"primaryColor\":\"$color\","
        [ -n "$agent_name" ] && UPDATE+="\"agentName\":\"$agent_name\","
        [ -n "$welcome" ] && UPDATE+="\"welcomeMessage\":\"$welcome\","
        [ -n "$cta_ack" ] && UPDATE+="\"ctaAcknowledgement\":\"$cta_ack\","
        [ -n "$bhk_prompt" ] && UPDATE+="\"bhkPrompt\":\"$bhk_prompt\","
        [ -n "$thank_you" ] && UPDATE+="\"thankYouMessage\":\"$thank_you\","
        UPDATE="${UPDATE%,}"
        UPDATE+="}"
        ;;
    5)
        if [ -f "$CONFIG_FILE" ]; then
            echo ""
            echo -e "${GREEN}Current Config:${NC}"
            cat "$CONFIG_FILE" | python3 -m json.tool 2>/dev/null || cat "$CONFIG_FILE"
        else
            echo "No config file found. Will be created on first update."
        fi
        exit 0
        ;;
    6)
        exit 0
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

# Update config using Node.js
NODE_SCRIPT=$(cat <<EOF
const fs = require('fs');
const path = require('path');

const configFile = '${CONFIG_FILE}';
const projectId = '${PROJECT_ID}';
const update = ${UPDATE};

// Load existing config
let store = { configs: [] };
if (fs.existsSync(configFile)) {
    store = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
}

// Find or create config for project
const index = store.configs.findIndex(c => c.projectId === projectId);
const now = new Date().toISOString();

if (index === -1) {
    // Create new config
    const config = {
        id: require('crypto').randomUUID(),
        projectId: projectId,
        agentName: "Riya from Homesfy",
        primaryColor: "#6158ff",
        welcomeMessage: "Hi, I'm Riya from Homesfy 👋\\n\\nHow can I help you today?",
        ctaAcknowledgement: "Sure… I'll send that across right away!",
        bhkPrompt: "Which configuration you are looking for?",
        namePrompt: "Please enter your name",
        thankYouMessage: "Thanks! Our expert will call you shortly 📞",
        createdAt: now,
        updatedAt: now,
        ...update
    };
    store.configs.push(config);
} else {
    // Update existing config
    store.configs[index] = {
        ...store.configs[index],
        ...update,
        projectId: projectId,
        updatedAt: now
    };
}

// Save config
fs.mkdirSync(path.dirname(configFile), { recursive: true });
fs.writeFileSync(configFile, JSON.stringify(store, null, 2) + '\\n');

console.log(JSON.stringify(store.configs.find(c => c.projectId === projectId), null, 2));
EOF
)

echo ""
echo -e "${YELLOW}Updating config...${NC}"
RESULT=$(echo "$NODE_SCRIPT" | node)

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Config updated successfully!${NC}"
    echo ""
    echo "Updated config:"
    echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"
    echo ""
    echo -e "${YELLOW}📝 Next steps:${NC}"
    echo "1. For local development: Restart API server"
    echo "2. For production: Commit this file and redeploy:"
    echo "   git add $CONFIG_FILE"
    echo "   git commit -m 'Update widget config'"
    echo "   git push"
else
    echo -e "${RED}❌ Failed to update config${NC}"
    exit 1
fi

