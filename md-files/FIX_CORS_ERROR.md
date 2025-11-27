# 🔧 Fix CORS Error

## ❌ Problem
```
Access to fetch at 'https://api-fv42pvnxv-fahimkhan-gits-projects.vercel.app/api/events' 
from origin 'https://www.homeesfytestwebsite.com' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
It does not have HTTP ok status.
```

## ✅ Solution

I've fixed the CORS preflight handling. The API now:
1. ✅ Handles OPTIONS requests explicitly
2. ✅ Returns proper CORS headers
3. ✅ Returns 200 status for preflight

## 🚀 Deployed

The fix is deployed. Wait 2-3 minutes, then:

1. **Hard refresh your microsite:**
   - `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

2. **Check browser console:**
   - CORS errors should be gone
   - Events should POST successfully

## 🔍 Note About API URL

I noticed the error shows:
- `api-fv42pvnxv-fahimkhan-gits-projects.vercel.app`

But your widget should use:
- `api-three-pearl.vercel.app`

**Check your widget embed script** - make sure it's using the correct API URL:
```html
<script
  src="https://widget-eight-ebon.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-1"
  async
></script>
```

## ✅ After Fix

- ✅ No CORS errors in console
- ✅ Events POST successfully
- ✅ Widget works normally

**Wait 2-3 minutes for deployment, then hard refresh!** 🚀

