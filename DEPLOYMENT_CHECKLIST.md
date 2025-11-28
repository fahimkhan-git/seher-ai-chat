# ✅ Deployment Checklist

Use this checklist before every deployment to ensure everything works perfectly.

---

## 🧪 Local Testing (Before Push)

### Setup
- [ ] API server running: `npm run dev:api` (Terminal 1)
- [ ] Widget dev server running: `npm run dev:widget` (Terminal 2)
- [ ] Test page open: `test-widget-local.html`

### Widget Functionality
- [ ] Widget opens when clicking bubble button
- [ ] Widget closes when clicking X button
- [ ] No console errors
- [ ] Widget uses latest config from API
- [ ] Agent name appears correctly
- [ ] Primary color is correct
- [ ] Welcome message displays correctly
- [ ] Bubble position is correct (bottom-left/right)

### User Flow
- [ ] CTA buttons appear and are clickable
- [ ] BHK selection works
- [ ] Name input field appears
- [ ] Phone input field appears
- [ ] Country code selector works
- [ ] Form submission works
- [ ] Thank you message appears after submission

### Config Changes
- [ ] Edit `apps/api/data/widget-config.json`
- [ ] Refresh browser → changes appear immediately
- [ ] No restart needed

### Build Test
- [ ] Run `npm run build:widget`
- [ ] Build succeeds without errors
- [ ] No warnings in build output

---

## 📝 Code Quality

- [ ] Code follows project style
- [ ] No console.log statements left in production code
- [ ] No commented-out code
- [ ] Commit message is clear and descriptive

---

## 🚀 Deployment

### Pre-Push
- [ ] All local tests pass
- [ ] Build succeeds
- [ ] No uncommitted changes (or intentional)
- [ ] Git status is clean

### Push
- [ ] `git add .` (or specific files)
- [ ] `git commit -m "Clear description"`
- [ ] `git push origin main`

### Post-Push
- [ ] Check Vercel dashboard for deployment status
- [ ] Wait 2-3 minutes for deployment
- [ ] Test on live site
- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Verify widget uses latest config
- [ ] Check browser console for errors
- [ ] Test all functionality on live site

---

## 🔍 Post-Deployment Verification

### Widget on Live Site
- [ ] Widget loads without errors
- [ ] Widget opens/closes correctly
- [ ] Latest config is used (agent name, color, messages)
- [ ] All features work (CTA, BHK, form submission)
- [ ] No CORS errors
- [ ] No network errors

### API on Live Site
- [ ] API responds: `curl https://api-three-pearl.vercel.app/api/widget-config/default`
- [ ] Returns latest config
- [ ] No 500 errors in logs

---

## 🚨 If Something Breaks

### Quick Fix
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify config file is valid JSON
4. Test API endpoint directly

### Rollback
```bash
git revert HEAD
git push origin main
```

---

## 📚 Quick Reference

**Local Development:**
```bash
npm run dev:api      # Terminal 1
npm run dev:widget   # Terminal 2
open test-widget-local.html
```

**Deploy:**
```bash
git add .
git commit -m "Description"
git push origin main
```

**Verify Build:**
```bash
npm run build:widget
```

---

**Remember:** Test locally → Push → Auto-deploy → Verify live

