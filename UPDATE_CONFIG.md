# How to Update Widget Config

## Problem
When you update `apps/api/data/widget-config.json` locally, it doesn't automatically sync to production because:
- **Vercel uses MongoDB** (not file storage) for production
- The local file is only used for local development

## Solution: Update via API

### Step 1: Get Your API Key
If you don't have one, generate it:
```bash
./generate-api-key.sh
```

Then set it in Vercel:
1. Go to https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables
2. Add: `WIDGET_CONFIG_API_KEY` = `your-generated-key`

### Step 2: Update Config on Production

**Option A: Simple Script (Recommended)**
```bash
export WIDGET_CONFIG_API_KEY='your-api-key'
./update-config-simple.sh 5796
```

**Option B: Manual curl**
```bash
curl -X POST https://api-three-pearl.vercel.app/api/widget-config/5796 \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "primaryColor": "#1b6b4b",
    "agentName": "Riya from Homesfy",
    "welcomeMessage": "Hi, I'm Riya from Homesfy 👋\nHow can I help you today?",
    "followupMessage": "Sure… I'll send that across right away!",
    "bhkPrompt": "Which configuration you are looking for?"
  }'
```

### Step 3: Verify Config is Updated
```bash
curl https://api-three-pearl.vercel.app/api/widget-config/5796
```

You should see your config (not `{}`).

### Step 4: Test Widget
1. Clear browser cache (or use incognito)
2. Load your microsite with the widget
3. Check browser console for: `HomesfyChat: Widget theme fetched: Theme loaded`

## Troubleshooting

### Config still shows `{}`
- Check MongoDB connection in Vercel logs
- Verify API key is correct
- Make sure projectId matches (5796)

### Widget not updating
- Clear browser cache
- Check widget.js cache headers (may need to redeploy widget)
- Verify API URL in embed script matches: `https://api-three-pearl.vercel.app`

### Local vs Production
- **Local**: Uses `apps/api/data/widget-config.json` (file storage)
- **Production**: Uses MongoDB (updated via API)

## Quick Reference

**Production URLs:**
- API: `https://api-three-pearl.vercel.app`
- Widget: `https://widget-eight-ebon.vercel.app`

**Embed Script:**
```html
<script
  src="https://widget-eight-ebon.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-1"
  async
></script>
```

