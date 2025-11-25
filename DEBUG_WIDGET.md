# Debug Widget Not Visible on Live Microsite

## 🔍 Step-by-Step Debugging

### 1. Check Browser Console (F12)

Open your microsite and check the console for:

**Expected messages:**
- ✅ `HomesfyChat: Auto-initializing widget...`
- ✅ `HomesfyChat: Widget script loaded successfully`
- ✅ `HomesfyChat: Widget initialized`

**Error messages to look for:**
- ❌ `Failed to load resource` → Script URL issue
- ❌ `CORS policy` → CORS configuration
- ❌ `TypeError` → JavaScript error
- ❌ `Cannot read property` → Initialization error

### 2. Check Network Tab

1. Open DevTools (F12) → Network tab
2. Reload page
3. Look for `widget.js` request
4. Check:
   - **Status**: Should be 200 OK
   - **Type**: Should be `script` or `javascript`
   - **Size**: Should be ~200KB
   - **Time**: Should load quickly

**If 401/403:**
- Widget protection still enabled
- Go to: https://vercel.com/fahimkhan-gits-projects/widget-eight-ebon/settings/deployment-protection

**If 404:**
- Wrong URL
- Check script `src` attribute

**If CORS error:**
- Check `ALLOWED_ORIGINS` in API settings
- Add your microsite domain

### 3. Verify Script is in HTML

**View page source** and search for:
```html
widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
```

**Check:**
- ✅ Script tag exists
- ✅ `src` URL is correct
- ✅ `data-project` is set
- ✅ `data-api-base-url` is set
- ✅ Not commented out
- ✅ Not inside another script tag

### 4. Test Widget URL Directly

Open in browser:
```
https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
```

**Should see:** JavaScript code (starts with `(function`)

**If you see HTML:**
- Still password-protected
- Need to disable protection

### 5. Test API Connection

Open browser console and run:
```javascript
fetch('https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app/api/widget-config/5796')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Should return:** JSON object (even if empty)

**If error:**
- API not accessible
- CORS issue
- Project ID wrong

### 6. Manual Initialization Test

If auto-init doesn't work, try manual:

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  async>
</script>
<script>
  // Wait for widget to load, then initialize
  window.addEventListener('load', function() {
    setTimeout(function() {
      if (window.HomesfyChat) {
        console.log('Manually initializing widget...');
        window.HomesfyChat.init();
      } else {
        console.error('Widget not loaded!');
      }
    }, 1000);
  });
</script>
```

### 7. Check for JavaScript Errors

**Common errors:**

1. **"document.currentScript is null"**
   - Script loaded asynchronously
   - Use manual initialization

2. **"Cannot read property 'dataset'"**
   - Script element not found
   - Check script placement

3. **"Failed to fetch"**
   - API not accessible
   - CORS issue
   - Network problem

### 8. Verify Widget Mounts

Check if widget DOM element exists:

```javascript
// In browser console
setTimeout(() => {
  const widgets = document.querySelectorAll('[class*="homesfy-widget"]');
  console.log('Widget elements found:', widgets.length);
  
  // Check shadow DOM
  const shadowHosts = document.querySelectorAll('div[data-homesfy-widget]');
  console.log('Shadow hosts:', shadowHosts.length);
  
  // Check if widget object exists
  console.log('HomesfyChat object:', typeof window.HomesfyChat);
}, 3000);
```

### 9. Check CSS/Styling Issues

Widget might be mounted but not visible:

```javascript
// Check if widget is hidden by CSS
const widget = document.querySelector('[class*="homesfy-widget"]');
if (widget) {
  const style = window.getComputedStyle(widget);
  console.log('Display:', style.display);
  console.log('Visibility:', style.visibility);
  console.log('Opacity:', style.opacity);
  console.log('Z-index:', style.zIndex);
}
```

### 10. Test with Minimal HTML

Create a test page with ONLY the widget:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test</title>
</head>
<body>
    <h1>Test</h1>
    <script 
      src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
      data-project="5796"
      data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
      async>
    </script>
</body>
</html>
```

If this works, the issue is with your microsite setup.

## 🔧 Quick Fixes

### Fix 1: Add Manual Initialization

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  async>
</script>
<script>
  window.addEventListener('load', function() {
    if (window.HomesfyChat && !window.HomesfyChatInitialized) {
      window.HomesfyChat.init();
    }
  });
</script>
```

### Fix 2: Remove `async` (Temporary Test)

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app">
</script>
```

### Fix 3: Use `defer` Instead

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  defer>
</script>
```

## 📋 Checklist

- [ ] Widget URL returns 200 OK
- [ ] Script loads in Network tab
- [ ] No console errors
- [ ] `window.HomesfyChat` exists
- [ ] Widget initializes (check console logs)
- [ ] Chat bubble appears in DOM
- [ ] No CSS hiding the widget
- [ ] Protection disabled on widget project

## 🆘 Still Not Working?

**Share these details:**

1. **Browser console errors** (screenshot or copy text)
2. **Network tab** showing widget.js request
3. **Your microsite URL** (if public)
4. **Script tag** you're using (exact HTML)
5. **Browser and version** (Chrome, Firefox, Safari, etc.)

## ✅ Expected Behavior

When working:
1. Script loads (Network: 200 OK)
2. Console: "HomesfyChat: Auto-initializing widget..."
3. Console: "HomesfyChat: Widget initialized"
4. Chat bubble appears (bottom-right)
5. Clicking opens chat window

