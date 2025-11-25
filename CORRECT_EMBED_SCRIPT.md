# ✅ Correct Embed Script for Production

## 🔍 Issue Found

Your widget is trying to connect to `http://localhost:4000` instead of the production API. This causes CORS errors because:
- Localhost is not accessible from production websites
- Browser blocks requests to localhost from HTTPS sites

## ✅ Correct Script for Your Microsite

**IMPORTANT:** Make sure `data-api-base-url` is set to the **production API URL**:

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="your-microsite-name"
  async>
</script>
```

## ⚠️ Common Mistakes

### ❌ Wrong (Using localhost):
```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="http://localhost:4000"  <!-- ❌ WRONG -->
  async>
</script>
```

### ✅ Correct (Using production API):
```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"  <!-- ✅ CORRECT -->
  async>
</script>
```

## 🔧 Fix Applied

The widget now automatically uses the production API if:
- You're on a production domain (not localhost)
- No `data-api-base-url` is provided

But it's **better to always specify** the API URL explicitly.

## 📝 Complete Script for Your Microsite

```html
<!-- Add this before closing </body> tag -->
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="www.homeesfytestwebsite.com"
  async>
</script>
<script>
  // Manual initialization (if needed)
  setTimeout(function() {
    if(window.HomesfyChat && !window.HomesfyChatInitialized) {
      window.HomesfyChat.init();
    }
  }, 1000);
</script>
```

## ✅ Production URLs

- **Widget JS**: https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
- **API**: https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app

## 🎯 What to Check

1. **Verify your script has `data-api-base-url`:**
   ```html
   data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
   ```

2. **Make sure it's HTTPS, not HTTP:**
   - ✅ `https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app`
   - ❌ `http://localhost:4000`

3. **Check browser console:**
   - Should see: `HomesfyChat: Using API Base URL: https://api-4oq41g49f...`
   - Should NOT see: `http://localhost:4000`

## 🚀 After Fix

Once you update the script with the correct API URL:
1. Clear browser cache
2. Reload page
3. Widget should connect to production API
4. No more CORS errors
5. Chat should work!

