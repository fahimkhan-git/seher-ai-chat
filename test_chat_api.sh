#!/bin/bash
# Test the AI chat API with Nivasa Enchante property data

API_URL="http://localhost:4000/api/chat"
PROJECT_ID="5796"

echo "Testing AI Chat API with Nivasa Enchante property data..."
echo "========================================================="
echo ""

# Test question 1: Project name
echo "Test 1: What is the name of this project?"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the name of this project?",
    "conversation": [],
    "projectId": "'$PROJECT_ID'",
    "microsite": "nivasa-enchante",
    "selectedCta": null,
    "selectedBhk": null
  }' | jq -r '.response' 2>/dev/null || echo "Error or jq not installed"
echo ""
echo "---"
echo ""

# Test question 2: Location
echo "Test 2: Where is the location?"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Where is the location?",
    "conversation": [],
    "projectId": "'$PROJECT_ID'",
    "microsite": "nivasa-enchante",
    "selectedCta": null,
    "selectedBhk": null
  }' | jq -r '.response' 2>/dev/null || echo "Error or jq not installed"
echo ""
echo "---"
echo ""

echo "Note: Make sure propertyInfo is configured in dashboard for project '$PROJECT_ID'"
echo "Note: Make sure GEMINI_API_KEY is set in API environment"
