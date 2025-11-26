# 🔧 Vercel API Setup - Final Fix

## ✅ What Was Fixed

The `vercel.json` was missing the `builds` section. I've added it:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ]
}
```

## ⚠️ Important: Vercel Project Settings

If the API still returns 404 after deployment, check your Vercel project settings:

### 1. Root Directory
- Go to Vercel Dashboard → Your API Project → Settings → General
- **Root Directory:** Should be `apps/api`
- If it's not set, Vercel won't find the `vercel.json` file

### 2. Build Settings
- **Framework Preset:** Other
- **Build Command:** (leave empty - Vercel auto-detects)
- **Output Directory:** (leave empty)
- **Install Command:** `npm install`

### 3. Environment Variables
Make sure these are set in Vercel:
- `NODE_ENV=production`
- `ALLOWED_ORIGINS=*` (or your specific domains)
- Any other variables from `apps/api/.env`

## 🧪 Test After Deployment

Wait 1-3 minutes, then test:

```bash
curl https://api-three-pearl.vercel.app/api/widget-config/5796
```

Should return JSON, not 404.

## 🔍 If Still Not Working

1. **Check Vercel Logs:**
   - Go to Deployments → Latest → Functions
   - Look for errors in the logs

2. **Verify Project Structure:**
   - Root directory must be `apps/api`
   - `api/index.js` must exist
   - `vercel.json` must be in `apps/api/`

3. **Try Redeploying:**
   - In Vercel dashboard, click "Redeploy" on the latest deployment

## ✅ Expected Result

After fix, you should see:
```json
{
  "id": "...",
  "projectId": "5796",
  "primaryColor": "#6158ff",
  "welcomeMessage": "Hello! 👋 Welcome to Homesfy...",
  ...
}
```

**The fix is deployed! Check Vercel project settings if still 404.** 🚀

