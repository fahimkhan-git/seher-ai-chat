#!/bin/bash

# 🚀 Run All Services Locally
# This script starts API, Widget, and Dashboard for local development

echo "🚀 Starting All Services Locally..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if .env exists for API
if [ ! -f "apps/api/.env" ]; then
    echo -e "${YELLOW}⚠️  API .env file not found. Creating from env.example...${NC}"
    cp apps/api/env.example apps/api/.env
    echo -e "${GREEN}✅ Created apps/api/.env${NC}"
    echo -e "${YELLOW}📝 Please edit apps/api/.env and set:${NC}"
    echo "   - MONGO_URI (or use file store by setting DATA_STORE=file)"
    echo "   - GEMINI_API_KEY (optional but recommended)"
    echo ""
fi

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing root dependencies...${NC}"
    npm install
fi

if [ ! -d "apps/api/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing API dependencies...${NC}"
    cd apps/api && npm install && cd ../..
fi

if [ ! -d "apps/widget/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Widget dependencies...${NC}"
    cd apps/widget && npm install && cd ../..
fi

if [ ! -d "apps/dashboard/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Dashboard dependencies...${NC}"
    cd apps/dashboard && npm install && cd ../..
fi

echo ""
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping all services...${NC}"
    kill $API_PID $WIDGET_PID $WIDGET_BUILD_PID $DASHBOARD_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start API
echo -e "${GREEN}📡 Starting API on http://localhost:4000...${NC}"
cd apps/api
npm run dev &
API_PID=$!
cd ../..
sleep 2

# Build Widget first (needed for widget.js to be available)
echo -e "${YELLOW}🔨 Building Widget...${NC}"
cd apps/widget
# Build once initially
npm run build
echo -e "${GREEN}✅ Widget built${NC}"

# Start Widget build in watch mode (rebuilds on file changes)
echo -e "${GREEN}👀 Starting Widget build watcher...${NC}"
npx vite build --watch > /dev/null 2>&1 &
WIDGET_BUILD_PID=$!

# Start Widget in preview mode (serves built files)
echo -e "${GREEN}🎨 Starting Widget server on http://localhost:5001...${NC}"
npm run preview &
WIDGET_PID=$!
cd ../..
sleep 3

# Start Dashboard
echo -e "${GREEN}📊 Starting Dashboard on http://localhost:5173...${NC}"
cd apps/dashboard
npm run dev &
DASHBOARD_PID=$!
cd ../..
sleep 2

echo ""
echo -e "${GREEN}✅ All services started!${NC}"
echo ""
echo "📍 Service URLs:"
echo "   API:      http://localhost:4000"
echo "   Widget:   http://localhost:5001"
echo "   Dashboard: http://localhost:5173"
echo ""
echo "🧪 Test URLs:"
echo "   API Health: http://localhost:4000/health"
echo "   Widget:    http://localhost:5001/widget.js"
echo "   Dashboard: http://localhost:5173"
echo ""
echo "📝 Local Test Page:"
echo "   Open: local-microsite/index.html"
echo "   (Update script src to: http://localhost:5001/widget.js)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Wait for all processes
wait



