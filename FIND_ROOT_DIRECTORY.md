# 🔍 How to Find Root Directory Setting

## 📍 Where to Look

The **Root Directory** setting is in the **General** tab, but you need to scroll down.

### Step-by-Step:

1. **You're already in the right place!** (Settings → General)

2. **Scroll down** on the General settings page
   - Look for a section called **"Root Directory"** or **"Project Root"**
   - It might be near the bottom of the page

3. **If you don't see it:**
   - It might be in **Settings → Build & Development Settings**
   - Or check if there's a **"Advanced"** or **"Configuration"** section

4. **What it should look like:**
   ```
   Root Directory
   [apps/api                    ] [Save]
   ```
   - If it's **empty** or shows `.` or `/`, that's the problem!
   - It **MUST** be set to: `apps/api`

## 🔧 Alternative: Check via Vercel CLI

If you can't find it in the dashboard, check via CLI:

```bash
cd apps/api
vercel project ls
```

Then check the project settings:
```bash
vercel project inspect api
```

## 📸 What to Look For

The Root Directory field should show:
- ✅ **Correct:** `apps/api`
- ❌ **Wrong:** (empty) or `.` or `/` or `./`

## 🆘 Still Can't Find It?

1. **Try searching the page:**
   - Press `Cmd+F` (Mac) or `Ctrl+F` (Windows)
   - Search for: "root" or "directory"

2. **Check Build Settings:**
   - Sometimes it's under **Settings → Build & Development Settings**
   - Look for "Root Directory" or "Project Root"

3. **Check if it's a monorepo setting:**
   - Some Vercel projects have it under **Settings → Git**
   - Or **Settings → General → Build & Development Settings**

## ✅ Once You Find It

1. **Change it to:** `apps/api`
2. **Click Save**
3. **Go to Deployments tab**
4. **Redeploy** the latest deployment
5. **Wait 2-3 minutes**
6. **Test:** `curl https://api-three-pearl.vercel.app/api/widget-config/5796`

---

**The Root Directory setting is definitely there - just need to scroll or look in Build settings!** 🔍

