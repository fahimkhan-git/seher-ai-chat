# 🔍 Check Vercel Project Settings

## ❌ Problem
API returns 404: `https://api-three-pearl.vercel.app/`

## ✅ Solution: Check Vercel Dashboard

The code is correct. The issue is likely in **Vercel project settings**.

### Step 1: Go to Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Find your **API project** (should be named "api" or similar)
3. Click on it

### Step 2: Check Root Directory ⚠️ CRITICAL
1. Go to **Settings** → **General**
2. Scroll to **Root Directory**
3. **MUST BE SET TO:** `apps/api`
4. If it's empty or set to something else, **change it to `apps/api`**
5. Click **Save**

### Step 3: Check Build Settings
1. Still in **Settings** → **General**
2. **Framework Preset:** Should be "Other" or "Node.js"
3. **Build Command:** Leave empty (or `npm install`)
4. **Output Directory:** Leave empty
5. **Install Command:** `npm install`

### Step 4: Redeploy
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait 2-3 minutes

### Step 5: Test Again
```bash
curl https://api-three-pearl.vercel.app/api/widget-config/5796
```

## 🔍 Alternative: Check Project Structure

If Root Directory is correct, verify the project structure:

1. **In Vercel Dashboard:**
   - Go to **Deployments** → Latest
   - Click **View Function Logs**
   - Look for errors

2. **Check if files are deployed:**
   - In deployment logs, look for:
     - `api/index.js` should exist
     - `vercel.json` should exist
     - `src/server.js` should exist

## 🆘 Still Not Working?

If after checking all settings it still doesn't work:

1. **Delete and Recreate Project:**
   - In Vercel, delete the API project
   - Create new project from GitHub
   - **IMPORTANT:** Set Root Directory to `apps/api` during setup
   - Deploy

2. **Or Use Vercel CLI:**
   ```bash
   cd apps/api
   vercel --prod
   ```
   This will deploy directly from the `apps/api` directory.

## ✅ Expected Result

After fixing Root Directory and redeploying:
- ✅ API should return JSON, not 404
- ✅ `/api/widget-config/5796` should work
- ✅ `/health` endpoint should work

**The most common issue is Root Directory not set to `apps/api`!** 🎯

