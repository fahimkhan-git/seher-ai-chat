# Troubleshooting: Chat Widget Not Visible

## 🔍 Quick Debugging Steps

### 1. Check Browser Console

Open your microsite and press **F12** (or right-click → Inspect → Console tab).

**Look for:**
- ✅ `HomesfyChat: Widget script loaded successfully`
- ✅ `HomesfyChat: Initializing widget...`
- ✅ `HomesfyChat: Widget initialized`

**If you see errors:**
- ❌ `Failed to load resource` → Script URL issue
- ❌ `CORS policy` → CORS configuration issue
- ❌ `TypeError` → JavaScript error

### 2. Verify Script is Loading

**Check Network Tab:**
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Look for `widget.js` request
5. Check if it returns **200 OK**

**If 404 or error:**
- Verify the widget URL is correct
- Check if widget is deployed

### 3. Test Widget URL Directly

Open in browser:
```
https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
```

**Should see:** JavaScript code (not HTML)

**If you see HTML or error:**
- Widget deployment issue
- URL might be incorrect

### 4. Test API Connection

Open browser console and run:
```javascript
fetch('https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app/api/widget-config/5796')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Should return:** Widget configuration JSON

**If error:**
- API not accessible
- CORS issue
- Project ID incorrect

### 5. Check Script Placement

**Make sure script is:**
- ✅ Before closing `</body>` tag
- ✅ Not inside another script tag
- ✅ Not commented out
- ✅ Has all required attributes

**Correct placement:**
```html
<body>
    <!-- Your content -->
    
    <!-- Widget script here -->
    <script 
      src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
      data-project="5796"
      data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
      data-microsite="your-microsite-name"
      async>
    </script>
</body>
```

### 6. Common Issues & Fixes

#### Issue: Script Not Loading
**Symptoms:** No network request for widget.js
**Fix:**
- Check internet connection
- Verify URL is correct
- Try without `async` attribute

#### Issue: CORS Error
**Symptoms:** Console shows "CORS policy" error
**Fix:**
- Check `ALLOWED_ORIGINS` in API settings
- Add your microsite domain to allowed origins
- Verify API is accessible

#### Issue: Widget Config Error
**Symptoms:** "Failed to fetch widget config"
**Fix:**
- Verify project ID is correct (5796)
- Check API is running
- Test API endpoint directly

#### Issue: Multiple Scripts
**Symptoms:** Widget tries to initialize multiple times
**Fix:**
- Ensure script is only added once
- Check for duplicate script tags
- Clear browser cache

### 7. Debug Script

Add this before the widget script to see what's happening:

```html
<script>
  // Debug logging
  window.HomesfyChatDebug = true;
  console.log('HomesfyChat: Debug mode enabled');
  
  // Check if script loads
  window.addEventListener('load', function() {
    console.log('HomesfyChat: Page loaded');
    console.log('HomesfyChat: Widget available?', typeof window.HomesfyChat !== 'undefined');
  });
</script>

<!-- Your widget script here -->
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="your-microsite-name"
  async>
</script>
```

### 8. Manual Initialization

If auto-init doesn't work, try manual initialization:

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="your-microsite-name"
  async
  onload="if(window.HomesfyChat && window.HomesfyChat.init) { window.HomesfyChat.init(); }">
</script>
```

### 9. Check Widget Configuration

Verify widget config exists for project 5796:

```bash
curl https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app/api/widget-config/5796
```

**Should return:** JSON with widget configuration

**If 404:**
- Widget config doesn't exist
- Need to create config in dashboard
- Project ID might be wrong

### 10. Test with Minimal HTML

Create a test page with just the widget:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test</title>
</head>
<body>
    <h1>Widget Test Page</h1>
    
    <script 
      src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
      data-project="5796"
      data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
      data-microsite="test"
      async>
    </script>
</body>
</html>
```

If this works, the issue is with your microsite setup.

## 🔧 Quick Fixes

### Fix 1: Remove `async` (Temporary Test)
```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="your-microsite-name">
</script>
```

### Fix 2: Add Error Handler
```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="your-microsite-name"
  async
  onerror="console.error('HomesfyChat: Failed to load widget script')"
  onload="console.log('HomesfyChat: Script loaded')">
</script>
```

### Fix 3: Check CORS Settings

Make sure your microsite domain is in `ALLOWED_ORIGINS`:
- Go to: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables
- Check `ALLOWED_ORIGINS` includes your microsite domain
- Or use `*` for all origins (development only)

## 📞 Still Not Working?

1. **Share browser console errors** (screenshot or copy text)
2. **Share Network tab** showing widget.js request
3. **Share your microsite URL** (if public)
4. **Check widget deployment status** in Vercel

## ✅ Expected Behavior

When working correctly:
1. Script loads (check Network tab)
2. Console shows: "HomesfyChat: Widget script loaded successfully"
3. Chat bubble appears in bottom-right corner
4. Clicking bubble opens chat window
5. Chat connects to API

