# 🚀 Redeploy Instructions

## ✅ Current Status

You're ready to redeploy! Here's what to do:

### Step 1: Complete Redeploy
1. **Environment:** Production ✅ (correct)
2. **Use existing Build Cache:** ✅ (good - faster)
3. **Click "Redeploy"**

### Step 2: Wait for Deployment
- Deployment takes **2-3 minutes**
- You'll see build logs in real-time
- Wait for "Ready" status

### Step 3: Test API
After deployment completes, test:

```bash
curl https://api-three-pearl.vercel.app/api/widget-config/5796
```

**Expected result:**
- ✅ JSON response with widget config
- ❌ NOT 404 or NOT_FOUND

## ⚠️ Important: Check Root Directory First

**Before redeploying**, make sure Root Directory is set:

1. Go to **Settings → General** (or **Build & Development Settings**)
2. Find **Root Directory**
3. Should be: `apps/api`
4. If not set, **set it now** before redeploying

## 🔍 After Redeployment

If API still returns 404:

1. **Check deployment logs:**
   - Click on the deployment
   - Check "Function Logs"
   - Look for errors

2. **Verify Root Directory:**
   - Settings → General → Root Directory = `apps/api`

3. **Check if files are deployed:**
   - In deployment logs, verify:
     - `api/index.js` exists
     - `vercel.json` exists
     - `src/server.js` exists

## ✅ Success Indicators

After successful deployment:
- ✅ API returns JSON (not 404)
- ✅ `/api/widget-config/5796` works
- ✅ `/health` endpoint works
- ✅ Widget can fetch config

**Go ahead and click Redeploy!** 🚀

