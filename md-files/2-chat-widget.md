# 2. Chat Widget Setup

## Overview
The chat widget is a React component that gets compiled into a single embeddable JavaScript bundle. It provides the user interface for chatting with the AI agent and submitting leads.

## Prerequisites
- API server running (see `1-api-integration.md`)
- Node.js 20.x

## Environment Configuration

### Step 1: Create `.env` file
```bash
cd apps/widget
cp env.example .env
```

### Step 2: Configure Environment Variables

Edit `apps/widget/.env`:

```env
# API Base URL (where your API server is running)
VITE_WIDGET_API_BASE_URL=http://localhost:4000
# For production:
# VITE_WIDGET_API_BASE_URL=https://api.yourdomain.com

# Default Project ID (optional)
VITE_WIDGET_DEFAULT_PROJECT_ID=default
```

## Installation

```bash
cd apps/widget
npm install
```

## Running Development Server

```bash
npm run dev
```

Widget will be available at `http://localhost:5001`

## Building for Production

```bash
npm run build
```

Production bundle will be in `apps/widget/dist/`:
- `widget.js` - Main widget bundle
- `style.css` - Widget styles

## Embedding the Widget

### Basic Embed
```html
<script
  src="https://cdn.yourdomain.com/widget.js"
  data-project="default"
  data-api-base-url="https://api.yourdomain.com"
  data-microsite="nivasa-enchante"
  async
></script>
```

### With Custom Configuration
```html
<script
  src="https://cdn.yourdomain.com/widget.js"
  data-project="5796"
  data-api-base-url="https://api.yourdomain.com"
  data-microsite="nivasa-enchante"
  async
></script>
```

## Widget Features

### 1. AI-Powered Chat
- Users can ask questions naturally
- AI agent responds with property information
- Uses Gemini AI (gemini-2.5-flash) for intelligent responses

### 2. Lead Capture Flow
- **CTA Selection**: User selects an interest (Pricing, Brochure, etc.)
- **BHK Selection**: User selects property configuration
- **Name Collection**: User enters name
- **Phone Collection**: User enters phone with country code
- **CRM Submission**: Lead automatically submitted to Homesfy CRM

### 3. Property Detection
- Widget automatically detects property information from page
- Extracts: project name, location, pricing, BHK options, amenities
- Sends property context to AI for better responses

### 4. Conversation Storage
- All chat conversations are stored
- Linked to lead when phone is submitted
- Stored in MongoDB (or file storage)

## Widget Configuration

Widget configuration is managed via the API (`/api/widget-config/:projectId`). Configuration includes:

- `agentName`: Name of the AI agent (default: "Riya")
- `avatarUrl`: Agent avatar image URL
- `primaryColor`: Widget theme color
- `welcomeMessage`: Initial greeting
- `propertyInfo`: Property details (name, location, pricing, BHK, amenities)
- `bubblePosition`: Widget position (bottom-right, bottom-left, etc.)

## Testing the Widget

### Local Testing
1. Start API server: `cd apps/api && npm run dev`
2. Start widget dev server: `cd apps/widget && npm run dev`
3. Open `local-microsite/index.html` in browser
4. Widget should appear and be functional

### Testing Property Detection
1. Open `local-microsite/test-property-detection.html`
2. Widget should detect property information from page
3. AI should use property context in responses

## Widget Flow

### User Journey
1. Widget opens automatically (or user clicks bubble)
2. User sees welcome message and CTA options
3. User can either:
   - Select a CTA option → BHK selection → Name → Phone
   - Ask a question directly → AI responds → Lead capture triggered
4. After phone submission:
   - Lead sent to Homesfy CRM API
   - Conversation stored in MongoDB
   - User can continue chatting

### AI Conversation Flow
1. User asks question
2. Widget sends message to `/api/chat` with:
   - User message
   - Conversation history
   - Property information (if detected)
   - Project ID and microsite
3. AI responds with:
   - Intelligent answer based on property context
   - Request for contact details (after 1-2 exchanges)
4. Widget switches to lead capture form
5. User submits name and phone
6. Lead sent to CRM

## CRM Integration

When user submits phone number:
1. Widget validates phone number
2. Prepares payload with:
   - Name and phone
   - Project ID
   - UTM parameters
   - Device/browser info
   - IP address
3. Sends to Homesfy CRM: `https://api.homesfy.in/api/leads/create`
4. Also saves to local API for dashboard tracking

## Troubleshooting

### Widget Not Loading
- Check API server is running
- Verify `VITE_WIDGET_API_BASE_URL` is correct
- Check browser console for errors
- Verify CORS is configured in API

### AI Not Responding
- Check API health endpoint: `/health`
- Verify `GEMINI_API_KEY` is set in API `.env`
- Check API logs for errors
- Widget will use fallback keyword matching if AI unavailable

### Lead Not Submitting
- Check browser console for errors
- Verify CRM API endpoint is accessible
- Check phone number validation
- Verify project ID is correct

## Next Steps
- [ ] Complete widget setup
- [ ] Test widget locally
- [ ] Configure widget for your projects
- [ ] Proceed to MongoDB setup (see `3-mongodb-storage.md`)
