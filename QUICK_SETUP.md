# Quick Setup Guide - Complete Environment Variables

## 🚀 Fastest Way to Complete Setup

### Option 1: Use the Setup Script (Recommended)

```bash
cd "/Volumes/homesfy workspace/chat-boat 2"
./setup-env.sh
```

This script will:
- ✅ Check if you're logged in to Vercel
- ✅ Guide you through setting MONGO_URI and GEMINI_API_KEY
- ✅ Verify all variables are set
- ✅ Optionally redeploy the API

### Option 2: Manual Setup via Vercel Dashboard (Easiest)

#### Step 1: Login to Vercel
1. Go to: https://vercel.com/login
2. Sign in with your account

#### Step 2: Set API Environment Variables

Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables

**Add MONGO_URI:**
1. Click "Add New"
2. Key: `MONGO_URI`
3. Value: Your MongoDB connection string
   - Get from: https://cloud.mongodb.com/
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority`
4. Environment: Select "Production"
5. Click "Save"

**Add GEMINI_API_KEY:**
1. Click "Add New"
2. Key: `GEMINI_API_KEY`
3. Value: Your Gemini API key
   - Get from: https://makersuite.google.com/app/apikey
4. Environment: Select "Production"
5. Click "Save"

#### Step 3: Redeploy API

After setting variables, redeploy:
1. Go to: https://vercel.com/fahimkhan-gits-projects/api/deployments
2. Click on the latest deployment
3. Click "Redeploy" → "Use Existing Build Cache" → "Redeploy"

### Option 3: CLI Setup (If Already Logged In)

```bash
# Navigate to API directory
cd "/Volumes/homesfy workspace/chat-boat 2/apps/api"

# Set MongoDB URI
vercel env add MONGO_URI production
# Paste your MongoDB connection string when prompted

# Set Gemini API Key
vercel env add GEMINI_API_KEY production
# Paste your Gemini API key when prompted

# Verify
vercel env ls

# Redeploy
vercel --prod
```

## 📋 What You Need

### 1. MongoDB Connection String

**If you don't have MongoDB Atlas:**
1. Go to: https://cloud.mongodb.com/
2. Sign up for free account
3. Create a free cluster (M0)
4. Create a database user
5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `homesfy_chat`

**Example:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/homesfy_chat?retryWrites=true&w=majority
```

**Important:** In MongoDB Atlas Network Access, add `0.0.0.0/0` to allow connections from anywhere (Vercel servers).

### 2. Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key (starts with `AIza...`)

**Note:** The API will work without this key but will use fallback keyword matching instead of full AI.

## ✅ Verify Setup

### Check Environment Variables

```bash
cd "/Volumes/homesfy workspace/chat-boat 2/apps/api"
vercel env ls
```

Should show:
- ✅ DATA_STORE
- ✅ NODE_ENV
- ✅ API_PORT
- ✅ ALLOWED_ORIGINS
- ✅ MONGO_URI (you just added)
- ✅ GEMINI_API_KEY (you just added)

### Test API

```bash
# Health check
curl https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app/health

# Should return:
# {
#   "status": "ok",
#   "ai": {
#     "available": true,
#     "model": "gemini-2.5-flash",
#     "mode": "full-ai"
#   }
# }
```

### Test Widget

Open in browser:
```
https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
```

Should load the widget JavaScript file.

### Test Dashboard

Open in browser:
```
https://dashboard-jn9tty076-fahimkhan-gits-projects.vercel.app
```

Should load the dashboard.

## 🔧 Troubleshooting

### "The specified token is not valid"
**Solution:** Login to Vercel first
```bash
vercel login
```

### API returns 500 error
**Check:**
1. MongoDB URI is correct
2. MongoDB Atlas allows connections from `0.0.0.0/0`
3. Database user has correct permissions
4. Check logs: `vercel logs https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app`

### AI chat not working
**Check:**
1. GEMINI_API_KEY is set correctly
2. API logs for Gemini errors
3. API will use fallback if Gemini is unavailable

### CORS errors
**Check:**
1. ALLOWED_ORIGINS includes your domains
2. Browser console for specific errors

## 📝 Current Status

### ✅ Already Set
- DATA_STORE=mongo
- NODE_ENV=production
- API_PORT=4000
- ALLOWED_ORIGINS (with production URLs)
- VITE_API_BASE_URL (dashboard)

### ⚠️ Need to Set
- MONGO_URI (MongoDB connection string)
- GEMINI_API_KEY (Gemini AI key)

## 🎯 Production URLs

- **API**: https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app
- **Widget**: https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app
- **Dashboard**: https://dashboard-jn9tty076-fahimkhan-gits-projects.vercel.app

## 🚀 After Setup

Once all variables are set and API is redeployed:

1. **Test the complete flow:**
   - Embed widget on a test page
   - Start a chat conversation
   - Submit a lead
   - Check dashboard for the lead

2. **Monitor:**
   - Check Vercel logs regularly
   - Monitor MongoDB Atlas for data
   - Test API endpoints

3. **Production Ready:**
   - All systems operational
   - Data being stored in MongoDB
   - AI chat working (if Gemini key is set)
   - Dashboard showing leads

