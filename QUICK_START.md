# ⚡ Quick Start Guide

## 🚀 Perfect Deployment Workflow

### Step 1: Test Locally
```bash
# Terminal 1 - Start API
npm run dev:api

# Terminal 2 - Start Widget
npm run dev:widget

# Open test page
open test-widget-local.html
```

### Step 2: Make Changes
- Edit code in `apps/widget/src/` or `apps/api/src/`
- Edit config in `apps/api/data/widget-config.json`
- Test in browser - changes appear immediately!

### Step 3: Deploy
```bash
git add .
git commit -m "Your change description"
git push origin main
```

### Step 4: Done! ✨
- Vercel auto-deploys in 2-3 minutes
- Changes appear on live automatically
- No manual steps needed!

---

## 📝 Common Tasks

### Update Widget Config
1. Edit `apps/api/data/widget-config.json`
2. Refresh browser → see changes
3. `git add apps/api/data/widget-config.json && git commit -m "Update config" && git push`

### Update Widget Code
1. Edit `apps/widget/src/ChatWidget.jsx`
2. Test locally
3. `git add apps/widget/src/ && git commit -m "Fix widget" && git push`

### Update API Code
1. Edit `apps/api/src/`
2. Test locally
3. `git add apps/api/src/ && git commit -m "Fix API" && git push`

---

## ✅ Pre-Push Checklist
- [ ] Widget opens/closes correctly
- [ ] Config changes appear
- [ ] No console errors
- [ ] Build succeeds: `npm run build:widget`

---

## 🔍 Troubleshooting

**Widget not using latest config?**
- Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
- Check console for errors
- Widget cache is 2 seconds

**CORS errors?**
- Already fixed! No action needed

**Widget not opening?**
- Check browser console
- Verify `window.HomesfyChat` exists

---

**Full guide:** See `DEPLOYMENT_WORKFLOW.md` for detailed instructions.

