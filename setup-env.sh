#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you set the remaining environment variables

set -e

echo "=== Vercel Environment Variables Setup ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Error: Vercel CLI is not installed${NC}"
    echo "Install it with: npm i -g vercel"
    exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Vercel${NC}"
    echo "Please login first:"
    echo "  vercel login"
    echo ""
    read -p "Press Enter to continue with login, or Ctrl+C to cancel..."
    vercel login
fi

echo -e "${GREEN}✅ Logged in to Vercel${NC}"
echo ""

# API Project Setup
echo "=== API Project Environment Variables ==="
cd "$(dirname "$0")/apps/api"

# Check current variables
echo "Current environment variables:"
vercel env ls
echo ""

# Set MONGO_URI
if vercel env ls | grep -q "MONGO_URI"; then
    echo -e "${GREEN}✅ MONGO_URI is already set${NC}"
else
    echo -e "${YELLOW}Setting MONGO_URI...${NC}"
    echo "Enter your MongoDB connection string:"
    echo "Format: mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority"
    read -p "MONGO_URI: " mongo_uri
    if [ -n "$mongo_uri" ]; then
        echo "$mongo_uri" | vercel env add MONGO_URI production
        echo -e "${GREEN}✅ MONGO_URI set${NC}"
    else
        echo -e "${RED}⚠️  MONGO_URI not set (skipped)${NC}"
    fi
fi
echo ""

# Set GEMINI_API_KEY
if vercel env ls | grep -q "GEMINI_API_KEY"; then
    echo -e "${GREEN}✅ GEMINI_API_KEY is already set${NC}"
else
    echo -e "${YELLOW}Setting GEMINI_API_KEY...${NC}"
    echo "Enter your Gemini API key:"
    echo "Get it from: https://makersuite.google.com/app/apikey"
    read -p "GEMINI_API_KEY: " gemini_key
    if [ -n "$gemini_key" ]; then
        echo "$gemini_key" | vercel env add GEMINI_API_KEY production
        echo -e "${GREEN}✅ GEMINI_API_KEY set${NC}"
    else
        echo -e "${RED}⚠️  GEMINI_API_KEY not set (skipped)${NC}"
    fi
fi
echo ""

# Verify all variables
echo "=== Final Environment Variables ==="
vercel env ls
echo ""

# Ask to redeploy
read -p "Redeploy API to apply new environment variables? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Redeploying API..."
    vercel --prod
    echo -e "${GREEN}✅ API redeployed${NC}"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Test API: curl https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app/health"
echo "2. Check logs if needed: vercel logs"
echo "3. Test widget and dashboard"

