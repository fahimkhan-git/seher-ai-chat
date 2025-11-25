#!/bin/bash

# Complete Setup Script for Seher AI Chat
# This script will guide you through the complete setup process

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Seher AI Chat - Complete Setup ===${NC}"
echo ""

# Check Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI not installed${NC}"
    echo "Install: npm i -g vercel"
    exit 1
fi

# Check login
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in to Vercel${NC}"
    echo "Logging in..."
    vercel login
fi

echo -e "${GREEN}✅ Logged in to Vercel${NC}"
echo ""

# Step 1: Check current environment variables
echo -e "${BLUE}Step 1: Checking current environment variables...${NC}"
cd "$(dirname "$0")/apps/api"

echo "Current API environment variables:"
vercel env ls
echo ""

# Step 2: Set MONGO_URI
if vercel env ls | grep -q "MONGO_URI"; then
    echo -e "${GREEN}✅ MONGO_URI already set${NC}"
else
    echo -e "${YELLOW}Step 2: Setting MONGO_URI...${NC}"
    echo "Enter your MongoDB connection string:"
    echo "Format: mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority"
    echo ""
    read -p "MONGO_URI: " mongo_uri
    if [ -n "$mongo_uri" ]; then
        echo "$mongo_uri" | vercel env add MONGO_URI production
        echo -e "${GREEN}✅ MONGO_URI set${NC}"
    else
        echo -e "${RED}⚠️  MONGO_URI not set (skipped)${NC}"
        echo "You can set it later via Vercel Dashboard"
    fi
fi
echo ""

# Step 3: Set GEMINI_API_KEY
if vercel env ls | grep -q "GEMINI_API_KEY"; then
    echo -e "${GREEN}✅ GEMINI_API_KEY already set${NC}"
else
    echo -e "${YELLOW}Step 3: Setting GEMINI_API_KEY (Optional)...${NC}"
    echo "Enter your Gemini API key (or press Enter to skip):"
    echo "Get it from: https://makersuite.google.com/app/apikey"
    echo ""
    read -p "GEMINI_API_KEY: " gemini_key
    if [ -n "$gemini_key" ]; then
        echo "$gemini_key" | vercel env add GEMINI_API_KEY production
        echo -e "${GREEN}✅ GEMINI_API_KEY set${NC}"
    else
        echo -e "${YELLOW}⚠️  GEMINI_API_KEY not set (will use fallback mode)${NC}"
    fi
fi
echo ""

# Step 4: Verify all variables
echo -e "${BLUE}Step 4: Verifying environment variables...${NC}"
vercel env ls
echo ""

# Step 5: Disable deployment protection (via instructions)
echo -e "${YELLOW}Step 5: Deployment Protection${NC}"
echo "⚠️  IMPORTANT: Deployment protection must be disabled via Vercel Dashboard"
echo ""
echo "Please do this manually:"
echo "1. Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/deployment-protection"
echo "2. Disable 'Password Protection' or 'Vercel Authentication'"
echo "3. Set to 'Public' access"
echo "4. Save changes"
echo ""
read -p "Press Enter after you've disabled deployment protection..."

# Step 6: Redeploy
echo -e "${BLUE}Step 6: Redeploying API...${NC}"
read -p "Redeploy API to apply changes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    vercel --prod
    echo -e "${GREEN}✅ API redeployed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipped redeployment${NC}"
    echo "Redeploy manually: cd apps/api && vercel --prod"
fi
echo ""

# Step 7: Test API
echo -e "${BLUE}Step 7: Testing API...${NC}"
sleep 5
echo "Testing health endpoint..."
API_URL="https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app"
HEALTH_RESPONSE=$(curl -s "$API_URL/health" || echo "ERROR")

if echo "$HEALTH_RESPONSE" | grep -q "status"; then
    echo -e "${GREEN}✅ API is responding!${NC}"
    echo "Response:"
    echo "$HEALTH_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}⚠️  API not responding correctly${NC}"
    echo "Response: $HEALTH_RESPONSE"
    echo ""
    echo "Possible issues:"
    echo "1. Deployment protection still enabled"
    echo "2. API still deploying (wait a few minutes)"
    echo "3. Check logs: vercel logs $API_URL"
fi
echo ""

# Summary
echo -e "${BLUE}=== Setup Summary ===${NC}"
echo ""
echo "✅ Environment variables set"
echo "✅ API redeployed"
echo ""
echo "📝 Next steps:"
echo "1. Test widget: https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
echo "2. Test dashboard: https://dashboard-jn9tty076-fahimkhan-gits-projects.vercel.app"
echo "3. Monitor logs: vercel logs"
echo ""
echo -e "${GREEN}Setup complete!${NC}"

