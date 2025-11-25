# Vercel Environment Variables Setup

## ✅ Already Set

### API Project (`api`)
- ✅ `DATA_STORE=mongo`
- ✅ `NODE_ENV=production`
- ✅ `API_PORT=4000`
- ✅ `ALLOWED_ORIGINS=https://dashboard-jn9tty076-fahimkhan-gits-projects.vercel.app,https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app,*`

### Dashboard Project (`dashboard`)
- ✅ `VITE_API_BASE_URL=https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app`

## ⚠️ Still Need to Set

### API Project - Required Variables

#### 1. MONGO_URI
**MongoDB connection string**

Get from MongoDB Atlas:
1. Go to: https://cloud.mongodb.com/
2. Select your cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

Format:
```
mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority
```

**Set via CLI:**
```bash
cd apps/api
vercel env add MONGO_URI production
# Paste your MongoDB connection string when prompted
```

**Or via Dashboard:**
1. Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables
2. Click "Add New"
3. Key: `MONGO_URI`
4. Value: Your MongoDB connection string
5. Environment: Production
6. Click "Save"

#### 2. GEMINI_API_KEY
**Google Gemini AI API Key**

Get from:
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Set via CLI:**
```bash
cd apps/api
vercel env add GEMINI_API_KEY production
# Paste your Gemini API key when prompted
```

**Or via Dashboard:**
1. Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables
2. Click "Add New"
3. Key: `GEMINI_API_KEY`
4. Value: Your Gemini API key
5. Environment: Production
6. Click "Save"

## Optional: Widget Project

The widget project doesn't require environment variables as it's a static bundle. However, if you want to set default values:

```bash
cd apps/widget
vercel env add VITE_WIDGET_API_BASE_URL production
# Enter: https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app

vercel env add VITE_WIDGET_DEFAULT_PROJECT_ID production
# Enter: default (or your project ID)
```

## Verify Environment Variables

### Check API variables:
```bash
cd apps/api
vercel env ls
```

### Check Dashboard variables:
```bash
cd apps/dashboard
vercel env ls
```

## After Setting Variables

1. **Redeploy projects** to apply new environment variables:
   ```bash
   cd apps/api && vercel --prod
   cd apps/dashboard && vercel --prod
   ```

2. **Test the API:**
   ```bash
   curl https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app/health
   ```

3. **Check logs** if there are issues:
   ```bash
   vercel logs https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app
   ```

## Quick Setup Commands

If you have your MongoDB URI and Gemini API key ready:

```bash
# Set MongoDB URI
cd "/Volumes/homesfy workspace/chat-boat 2/apps/api"
vercel env add MONGO_URI production
# Paste MongoDB connection string

# Set Gemini API Key
vercel env add GEMINI_API_KEY production
# Paste Gemini API key

# Redeploy
vercel --prod
```

## Current Production URLs

- **API**: https://api-f7jpzjmpm-fahimkhan-gits-projects.vercel.app
- **Widget**: https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app
- **Dashboard**: https://dashboard-jn9tty076-fahimkhan-gits-projects.vercel.app

## Troubleshooting

### API returns 500 error
- Check MongoDB URI is correct
- Verify MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Check Vercel logs: `vercel logs`

### AI chat not working
- Verify GEMINI_API_KEY is set correctly
- Check API logs for Gemini errors
- API will fall back to keyword matching if Gemini is unavailable

### CORS errors
- Verify ALLOWED_ORIGINS includes your widget and dashboard URLs
- Check browser console for specific CORS errors

