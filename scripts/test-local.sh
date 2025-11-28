#!/bin/bash

# Local Testing Helper Script
# This script helps you test the widget locally before deploying

echo "🧪 Homesfy Chat Widget - Local Testing Helper"
echo "=============================================="
echo ""

# Check if API is running
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ API server is running on http://localhost:4000"
else
    echo "❌ API server is NOT running"
    echo "   Start it with: npm run dev:api"
    echo ""
fi

# Check if Widget dev server is running
if curl -s http://localhost:5001 > /dev/null 2>&1; then
    echo "✅ Widget dev server is running on http://localhost:5001"
else
    echo "❌ Widget dev server is NOT running"
    echo "   Start it with: npm run dev:widget"
    echo ""
fi

echo ""
echo "📋 Quick Commands:"
echo "   Terminal 1: npm run dev:api"
echo "   Terminal 2: npm run dev:widget"
echo "   Then open: test-widget-local.html"
echo ""
echo "💡 Tips:"
echo "   - Edit apps/api/data/widget-config.json → refresh browser → see changes"
echo "   - Edit apps/widget/src/ → auto-reloads → test immediately"
echo "   - When ready: git push origin main → auto-deploys"
echo ""

