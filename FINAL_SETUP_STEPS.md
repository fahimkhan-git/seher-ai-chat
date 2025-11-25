# Final Setup Steps - Complete Everything

## 🎯 What Needs to Be Done

### 1. Disable Deployment Protection (REQUIRED - Manual Step)

**This must be done via Vercel Dashboard:**

1. Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/deployment-protection
2. Find "Deployment Protection" section
3. **Disable** "Password Protection" or "Vercel Authentication"
4. Set to **"Public"** access
5. Click **"Save"**

**Why:** The API is currently password-protected, preventing public access.

### 2. Set Environment Variables

#### Option A: Use the Setup Script (Recommended)

```bash
cd "/Volumes/homesfy workspace/chat-boat 2"
./complete-setup.sh
```

This will:
- ✅ Check current variables
- ✅ Prompt for MONGO_URI
- ✅ Prompt for GEMINI_API_KEY (optional)
- ✅ Verify all variables
- ✅ Guide you through disabling protection
- ✅ Redeploy API
- ✅ Test the API

#### Option B: Manual CLI Setup

```bash
cd "/Volumes/homesfy workspace/chat-boat 2/apps/api"

# Set MongoDB URI
vercel env add MONGO_URI production
# Paste: mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority

# Set Gemini API Key (optional)
vercel env add GEMINI_API_KEY production
# Paste: Your Gemini API key

# Verify
vercel env ls

# Redeploy
vercel --prod
```

#### Option C: Vercel Dashboard (Easiest)

1. **Set MONGO_URI:**
   - Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables
   - Click "Add New"
   - Key: `MONGO_URI`
   - Value: Your MongoDB connection string
   - Environment: Production
   - Save

2. **Set GEMINI_API_KEY:**
   - Same page, click "Add New"
   - Key: `GEMINI_API_KEY`
   - Value: Your Gemini API key
   - Environment: Production
   - Save

3. **Redeploy:**
   - Go to: https://vercel.com/fahimkhan-gits-projects/api/deployments
   - Click latest deployment → "Redeploy"

### 3. Verify Everything Works

#### Test API Health
```bash
curl https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "ai": {
    "available": true/false,
    "model": "gemini-2.5-flash",
    "mode": "full-ai" or "fallback-keyword-matching"
  }
}
```

#### Test Widget
Open in browser:
```
https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
```
Should load JavaScript file (not HTML).

#### Test Dashboard
Open in browser:
```
https://dashboard-jn9tty076-fahimkhan-gits-projects.vercel.app
```
Should load the dashboard interface.

## 📋 What You Need

### MongoDB Connection String

**If you don't have MongoDB Atlas:**

1. Go to: https://cloud.mongodb.com/
2. Sign up (free tier available)
3. Create a cluster (M0 - Free)
4. Create database user:
   - Database Access → Add New User
   - Username: `homesfy_user`
   - Password: (create secure password)
5. Whitelist IP:
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Clusters → Connect → Connect your application
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `homesfy_chat`

**Example:**
```
mongodb+srv://homesfy_user:YourPassword123@cluster0.xxxxx.mongodb.net/homesfy_chat?retryWrites=true&w=majority
```

### Gemini API Key (Optional)

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

**Note:** Without this, the API will use fallback keyword matching (still works, but less intelligent).

## ✅ Complete Checklist

- [ ] Disable deployment protection in Vercel Dashboard
- [ ] Set MONGO_URI environment variable
- [ ] Set GEMINI_API_KEY environment variable (optional)
- [ ] Redeploy API
- [ ] Test API health endpoint
- [ ] Test widget loads correctly
- [ ] Test dashboard loads correctly
- [ ] Test complete flow (widget → API → MongoDB)

## 🚀 Quick Start

**Fastest way to complete everything:**

1. **Disable Protection:**
   - https://vercel.com/fahimkhan-gits-projects/api/settings/deployment-protection
   - Disable protection → Save

2. **Run Setup Script:**
   ```bash
   cd "/Volumes/homesfy workspace/chat-boat 2"
   ./complete-setup.sh
   ```
   - Follow prompts
   - Enter MongoDB URI when asked
   - Enter Gemini API key (or skip)
   - Script will redeploy and test

3. **Verify:**
   ```bash
   curl https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app/health
   ```

## 🐛 Troubleshooting

### API still shows authentication page
- Check deployment protection is disabled
- Wait 1-2 minutes for changes to propagate
- Try incognito/private browser window

### API returns 500 error
- Check MongoDB URI is correct
- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check Vercel logs: `vercel logs`

### Environment variables not working
- Make sure they're set for "Production" environment
- Redeploy after setting variables
- Check variable names are exact (case-sensitive)

## 📊 Current Status

### ✅ Already Done
- API deployed
- Widget deployed
- Dashboard deployed
- Basic environment variables set (DATA_STORE, NODE_ENV, API_PORT, ALLOWED_ORIGINS)
- Dashboard API URL configured

### ⚠️ Still Needed
- Disable deployment protection (manual step)
- Set MONGO_URI
- Set GEMINI_API_KEY (optional)
- Redeploy API
- Test everything

## 🎉 After Completion

Once everything is set up:

1. **API will be publicly accessible**
2. **Widget can connect to API**
3. **Dashboard can fetch data**
4. **Leads will be stored in MongoDB**
5. **AI chat will work (if Gemini key is set)**

Your Seher AI Chat system will be fully operational! 🚀

