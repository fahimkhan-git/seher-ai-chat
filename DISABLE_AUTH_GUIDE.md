# How to Disable Vercel Authentication

## Quick Fix: Disable Vercel Authentication

On the Deployment Protection page you're viewing:

1. **Find "Vercel Authentication" section**
2. **Toggle it OFF** (if it's currently ON)
3. **Click "Save"** at the bottom of the page

This will make your API publicly accessible.

## Alternative: Use OPTIONS Allowlist (If You Want to Keep Protection)

If you want to keep protection but allow CORS preflight requests:

1. **Scroll to "OPTIONS Allowlist" section**
2. **Add these paths:**
   - `/api/*`
   - `/health`
   - `/`
3. **Click "Save"**

This allows browsers to make CORS preflight requests without authentication.

## Alternative: Use Protection Bypass for Automation

If you want to keep protection but allow API access:

1. **Scroll to "Protection Bypass for Automation" section**
2. **Click "Add a secret"**
3. **Enter a secret name** (e.g., `api-bypass-token`)
4. **Copy the generated secret**
5. **Use it in API requests:**
   - Header: `x-vercel-protection-bypass: your-secret`
   - Or query param: `?x-vercel-protection-bypass=your-secret`

## Recommended: Disable Vercel Authentication

**For a public API, the best approach is to disable Vercel Authentication:**

1. Toggle OFF "Vercel Authentication"
2. Click "Save"
3. Wait 1-2 minutes
4. Test: `curl https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app/health`

## After Disabling

Your API will be publicly accessible and:
- ✅ Widget can connect
- ✅ Dashboard can fetch data
- ✅ No authentication required
- ✅ CORS will work properly

## Security Note

Since your API is public, make sure:
- ✅ CORS is properly configured (ALLOWED_ORIGINS is set)
- ✅ MongoDB connection is secure
- ✅ API endpoints validate input
- ✅ Rate limiting is considered (if needed)

