# Widget Embed Guide - Add to Microsites

## 🚀 Quick Embed Script

Add this script to your microsite HTML pages (before closing `</body>` tag):

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  async>
</script>
```

## 📝 Complete HTML Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Microsite</title>
</head>
<body>
    <!-- Your microsite content here -->
    
    <!-- Homesfy Chat Widget -->
    <script 
      src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
      data-project="5796"
      data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
      async>
    </script>
</body>
</html>
```

## 🔧 Script Attributes

### Required Attributes

- **`src`**: Widget JavaScript file URL
  ```
  https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
  ```

- **`data-project`**: Your project ID
  ```
  data-project="5796"
  ```

- **`data-api-base-url`**: API server URL
  ```
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  ```

### Optional Attributes

- **`data-microsite`**: Microsite identifier (for tracking)
  ```html
  data-microsite="property-name"
  ```

- **`data-auto-init`**: Auto-initialize widget (default: true)
  ```html
  data-auto-init="true"
  ```

- **`async`**: Load script asynchronously (recommended)
  ```html
  async
  ```

## 📋 Complete Script with All Options

```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="your-microsite-name"
  data-auto-init="true"
  async>
</script>
```

## 🎯 For Different Projects

If you have multiple projects, change the `data-project` value:

```html
<!-- Project 5796 -->
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  async>
</script>

<!-- Project 5797 (example) -->
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5797"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  async>
</script>
```

## 📍 Where to Place the Script

### Option 1: Before Closing `</body>` Tag (Recommended)
```html
<body>
    <!-- Your content -->
    
    <!-- Widget script at the end -->
    <script 
      src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
      data-project="5796"
      data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
      async>
    </script>
</body>
```

### Option 2: In `<head>` Section
```html
<head>
    <!-- Other head content -->
    
    <script 
      src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
      data-project="5796"
      data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
      async
      defer>
    </script>
</head>
```

## 🔍 Property Detection

The widget automatically detects property information from your page. Make sure your microsite HTML includes property data in one of these formats:

### JSON-LD Format (Recommended)
```html
<script type="application/ld+json">
{
  "@type": "RealEstateAgent",
  "name": "Property Name",
  "address": {
    "addressLocality": "City",
    "addressRegion": "State"
  }
}
</script>
```

### Meta Tags
```html
<meta property="og:title" content="Property Name">
<meta property="og:description" content="Property Description">
<meta property="og:price:amount" content="5000000">
```

### Data Attributes
```html
<div data-property-name="Property Name" 
     data-property-location="Location"
     data-property-price="5000000">
</div>
```

## ✅ Verification

After adding the script:

1. **Open your microsite** in a browser
2. **Check browser console** (F12) for any errors
3. **Look for chat bubble** in bottom-right corner
4. **Test chat functionality** by clicking the bubble

### Expected Console Messages

You should see:
```
HomesfyChat: Widget script loaded successfully
HomesfyChat: Initializing widget...
HomesfyChat: Widget initialized
```

### If Widget Doesn't Appear

1. Check browser console for errors
2. Verify script URL is accessible
3. Check CORS settings (should be automatic)
4. Verify `data-project` and `data-api-base-url` are correct

## 🎨 Customization

The widget will automatically:
- ✅ Detect property information from page
- ✅ Use project-specific configuration
- ✅ Connect to the correct API
- ✅ Store leads in MongoDB
- ✅ Submit to CRM (if configured)

## 📊 Production URLs

- **Widget JS**: https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js
- **API**: https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app

## 🔗 Quick Copy-Paste

**Minimal version (most common):**
```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  async>
</script>
```

**With microsite tracking:**
```html
<script 
  src="https://widget-eight-ebon-5f0drzerp-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-4oq41g49f-fahimkhan-gits-projects.vercel.app"
  data-microsite="property-name"
  async>
</script>
```

## 🚀 That's It!

Just add the script to your microsite HTML and the chat widget will appear automatically!

