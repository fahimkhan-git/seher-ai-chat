# 🔧 Fix Widget Color Not Updating on Live Site

## ✅ Good News!
- ✅ API is working correctly
- ✅ Config file has the new color (`#049B5A`)
- ✅ Live API returns the correct color

## ❌ Problem
Widget on live microsite shows old color (browser cache).

## 🔧 Solutions

### Solution 1: Clear Browser Cache (Quick Fix)

**For Users:**
1. **Hard Refresh:**
   - **Chrome/Edge:** `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - **Firefox:** `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
   - **Safari:** `Cmd+Option+R`

2. **Or Clear Cache:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Or Use Incognito/Private Window:**
   - Open site in incognito mode
   - This bypasses cache completely

### Solution 2: Force Widget Bundle Update (Permanent Fix)

The widget bundle (`widget.js`) might be cached. Force a new version:

1. **Rebuild Widget:**
   ```bash
   npm run build:widget
   ```

2. **Deploy Widget:**
   ```bash
   ./deploy.sh 'Update widget bundle'
   ```

3. **Or manually:**
   ```bash
   git add apps/widget/dist
   git commit -m 'Update widget bundle'
   git push
   ```

### Solution 3: Add Cache-Busting to Widget URL

If the widget is embedded, add a version parameter:

```html
<script
  src="https://widget-eight-ebon.vercel.app/widget.js?v=2"
  data-project="5796"
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-1"
  async
></script>
```

Change `?v=2` to `?v=3` when you want to force update.

### Solution 4: Check Widget Bundle Cache Headers

The widget bundle should have cache headers. Check Vercel widget project:
- Settings → Headers
- Should have: `Cache-Control: public, max-age=31536000, immutable`

If it's too aggressive, it might cache forever.

## 🧪 Test After Fix

1. **Clear browser cache** (Solution 1)
2. **Reload page**
3. **Check widget color** - should be `#049B5A` (green)
4. **Open DevTools → Network tab**
5. **Check widget.js request:**
   - Should show 200 (not 304 cached)
   - Check response headers

## ✅ Quick Test

Open browser console on your microsite and run:
```javascript
fetch('https://api-three-pearl.vercel.app/api/widget-config/5796')
  .then(r => r.json())
  .then(config => console.log('Current color:', config.primaryColor))
```

Should show: `Current color: #049B5A`

## 🎯 Most Likely Fix

**Try Solution 1 first** (hard refresh). If that works, the issue is browser cache.

If it still doesn't work, **try Solution 2** (rebuild and redeploy widget).

---

**Start with a hard refresh!** 🔄

