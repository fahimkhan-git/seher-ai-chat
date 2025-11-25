# 1. API Integration Setup

## Overview
This document covers the API server setup required for the Homesfy chat widget to function properly. The API handles chat messages, lead submissions, conversation storage, and CRM integration.

## Prerequisites
- Node.js 20.x (LTS)
- MongoDB (local or Atlas) - Optional, can use file storage
- Gemini API Key (for AI chat) - Get from https://makersuite.google.com/app/apikey

## Environment Configuration

### Step 1: Create `.env` file
Copy the example file and configure:

```bash
cd apps/api
cp env.example .env
```

### Step 2: Configure Environment Variables

Edit `apps/api/.env`:

```env
# Server Configuration
API_PORT=4000
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:8080,http://127.0.0.1:8080,https://your-production-domain.com

# Data Storage (choose one)
DATA_STORE=mongo  # Options: "mongo" or "file"
DATA_DIRECTORY=./data  # Only used when DATA_STORE=file

# MongoDB Configuration (required if DATA_STORE=mongo)
MONGO_URI=mongodb://localhost:27017/homesfy_chat
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority

# Gemini AI Configuration (REQUIRED for AI chat)
GEMINI_API_KEY=your-gemini-api-key-here
```

## Installation

```bash
cd apps/api
npm install
```

## Running the API

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/health`
- Returns API status and AI availability

### Chat API
- **POST** `/api/chat`
- Handles chat messages with AI agent
- Requires: `message`, `projectId`, `conversation` (optional)
- Returns: AI response with `aiUsed` flag

### Leads API
- **POST** `/api/leads`
- Creates a new lead
- Requires: `microsite`, `bhkType`, `phone` (optional), `conversation` (optional)
- Automatically creates chat session

### Chat Sessions API
- **GET** `/api/chat-sessions`
- Lists chat sessions
- Query params: `microsite`, `leadId`, `limit`, `skip`

### Widget Config API
- **GET** `/api/widget-config/:projectId`
- **POST** `/api/widget-config/:projectId`
- Manages widget configuration (theme, property info, etc.)

### Events API
- **POST** `/api/events`
- Records analytics events

## Data Storage Options

### Option 1: MongoDB (Recommended for Production)
- Set `DATA_STORE=mongo`
- Configure `MONGO_URI`
- All data stored in MongoDB collections:
  - `leads` - Lead information
  - `chatsessions` - Chat conversations
  - `events` - Analytics events
  - `widgetconfigs` - Widget configurations

### Option 2: File Storage (Development Only)
- Set `DATA_STORE=file`
- Data stored in JSON files in `apps/api/data/`:
  - `leads.json`
  - `chat-sessions.json`
  - `events.json`
  - `widget-config.json`

## Verification

1. Check API is running:
   ```bash
   curl http://localhost:4000/health
   ```

2. Verify AI is configured:
   ```json
   {
     "status": "ok",
     "ai": {
       "available": true,
       "model": "gemini-2.5-flash",
       "mode": "full-ai"
     }
   }
   ```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 4000
lsof -ti:4000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Issues
- Verify MongoDB is running: `mongosh` or check MongoDB Atlas connection string
- Check network connectivity
- Verify credentials in `MONGO_URI`

### AI Not Working
- Verify `GEMINI_API_KEY` is set correctly
- Check API key is valid at https://makersuite.google.com/app/apikey
- API will fallback to keyword matching if key is missing

## Next Steps
- [ ] Complete API setup
- [ ] Configure MongoDB connection
- [ ] Set Gemini API key
- [ ] Test health endpoint
- [ ] Proceed to Chat Widget setup (see `2-chat-widget.md`)
