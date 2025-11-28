# 🚀 Perfect Deployment Workflow

This guide ensures a clean, reliable workflow: **Test Locally → Push → Auto-Deploy**

---

## 📋 Quick Start Workflow

### 1. **Test Locally First** ✅
```bash
# Start API server (Terminal 1)
npm run dev:api

# Start Widget dev server (Terminal 2)
npm run dev:widget

# Open test page
open test-widget-local.html
# OR visit: http://localhost:5001
```

### 2. **Make Changes**
- Edit widget code: `apps/widget/src/`
- Edit API code: `apps/api/src/`
- Edit config: `apps/api/data/widget-config.json`

### 3. **Verify Locally**
- ✅ Widget opens/closes correctly
- ✅ Config changes appear immediately
- ✅ No console errors
- ✅ All features work as expected

### 4. **Push to Git** 🚀
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### 5. **Auto-Deploy** ✨
- Vercel automatically detects the push
- Builds and deploys both API and Widget
- Latest changes appear on live in ~2-3 minutes

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 20.x (LTS)
- npm 10.x

### Initial Setup (One-Time)
```bash
# Clone repository
git clone https://github.com/fahimkhan-git/seher-ai-chat.git
cd seher-ai-chat

# Install dependencies
npm install

# Copy environment files (if needed)
cp apps/api/env.example apps/api/.env
```

### Daily Development

**Terminal 1 - API Server:**
```bash
npm run dev:api
# API runs on http://localhost:4000
# Config file: apps/api/data/widget-config.json
```

**Terminal 2 - Widget Dev Server:**
```bash
npm run dev:widget
# Widget runs on http://localhost:5001
# Test page: test-widget-local.html
```

**Test the Widget:**
- Open `test-widget-local.html` in browser
- Or visit `http://localhost:5001` and use the test page
- Widget will use local API (`http://localhost:4000`)

---

## 📝 Common Tasks

### Update Widget Config

1. **Edit Config File:**
   ```bash
   # Edit: apps/api/data/widget-config.json
   # Change: agentName, primaryColor, welcomeMessage, etc.
   ```

2. **Test Locally:**
   - API auto-reloads config on every request
   - Refresh browser → see changes immediately
   - No restart needed!

3. **Deploy:**
   ```bash
   git add apps/api/data/widget-config.json
   git commit -m "Update widget config: new agent name and color"
   git push origin main
   ```

4. **Verify Live:**
   - Wait 2-3 minutes for Vercel deploy
   - Hard refresh browser (Ctrl+Shift+R)
   - Widget uses latest config automatically

### Update Widget Code

1. **Edit Code:**
   ```bash
   # Edit: apps/widget/src/ChatWidget.jsx
   # Or: apps/widget/src/widget.jsx
   ```

2. **Test Locally:**
   - Widget dev server auto-reloads
   - Test in browser immediately
   - Fix any issues

3. **Build & Test:**
   ```bash
   npm run build:widget
   # Verify build succeeds
   ```

4. **Deploy:**
   ```bash
   git add apps/widget/src/
   git commit -m "Fix: widget opening issue"
   git push origin main
   ```

### Update API Code

1. **Edit Code:**
   ```bash
   # Edit: apps/api/src/routes/widgetConfig.js
   # Or any API file
   ```

2. **Test Locally:**
   - API auto-reloads (nodemon)
   - Test API endpoints
   - Verify widget still works

3. **Deploy:**
   ```bash
   git add apps/api/src/
   git commit -m "Fix: API config loading"
   git push origin main
   ```

---

## ✅ Pre-Deployment Checklist

Before pushing to production, verify:

- [ ] **Widget opens/closes correctly**
- [ ] **Config changes appear in widget**
- [ ] **No console errors**
- [ ] **Widget uses latest config from API**
- [ ] **All features work (CTA, BHK, name, phone)**
- [ ] **Lead submission works**
- [ ] **Build succeeds:** `npm run build:widget`
- [ ] **API starts without errors**

---

## 🔍 Troubleshooting

### Widget Not Using Latest Config

**Problem:** Widget shows old config after deploy

**Solution:**
1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. Check browser console for errors
3. Verify API is returning latest config:
   ```bash
   curl https://api-three-pearl.vercel.app/api/widget-config/default
   ```
4. Widget cache is 2 seconds - wait a moment and refresh

### CORS Errors

**Problem:** `Access to fetch blocked by CORS policy`

**Solution:**
- Already fixed! Widget no longer sends custom headers
- If persists, check API CORS config in `apps/api/src/server.js`

### Widget Not Opening

**Problem:** Widget doesn't open when clicked

**Solution:**
- Check browser console for errors
- Verify widget script loaded: `window.HomesfyChat` exists
- Check network tab for failed requests

### API Not Loading Config

**Problem:** API returns empty config or defaults

**Solution:**
1. Check `apps/api/data/widget-config.json` exists
2. Verify file has valid JSON
3. Check API logs on Vercel dashboard
4. API always reloads from file - no cache issues

---

## 📦 Deployment Architecture

### Vercel Projects

1. **API:** `api-three-pearl.vercel.app`
   - Deploys from `apps/api/`
   - Reads config from `apps/api/data/widget-config.json`
   - Always reloads config (no caching)

2. **Widget:** `widget-eight-ebon.vercel.app`
   - Deploys from `apps/widget/`
   - Builds to `apps/widget/dist/`
   - Serves `widget.js` bundle

### Auto-Deploy Flow

```
Git Push → GitHub → Vercel Webhook → Build → Deploy → Live
```

**No manual steps needed!** Just push to `main` branch.

---

## 🎯 Best Practices

1. **Always test locally first**
   - Catch issues before deploying
   - Faster iteration
   - No broken production

2. **Commit frequently**
   - Small, focused commits
   - Clear commit messages
   - Easy to rollback if needed

3. **Verify after deploy**
   - Check Vercel deployment status
   - Test on live site
   - Monitor for errors

4. **Use descriptive commit messages**
   ```bash
   git commit -m "Fix: widget not opening on click"
   git commit -m "Update: change agent name to Ziya"
   git commit -m "Feature: add new CTA option"
   ```

---

## 🚨 Emergency Rollback

If something breaks in production:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or revert to specific commit
git revert <commit-hash>
git push origin main
```

Vercel will automatically redeploy the previous version.

---

## 📚 Additional Resources

- **Config Guide:** `md-files/HOW_TO_CHANGE_COLOR_AND_MESSAGES.md`
- **API Fixes:** `md-files/API_FIX_SUMMARY.md`
- **CORS Fixes:** `md-files/FIX_CORS_ERROR.md`
- **Main README:** `README.md`

---

## ✨ Summary

**The Perfect Workflow:**
1. ✅ Test locally (`npm run dev:api` + `npm run dev:widget`)
2. ✅ Verify everything works
3. ✅ Push to git (`git push origin main`)
4. ✅ Vercel auto-deploys
5. ✅ Changes appear on live in 2-3 minutes

**That's it!** No manual deployment steps needed. 🎉

