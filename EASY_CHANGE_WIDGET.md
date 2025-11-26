# ⚡ EASY WAY to Change Widget Color & Messages

## 🎯 The Problem
Changes aren't reflecting because they need to be:
1. ✅ Saved in the file
2. ✅ Committed to Git
3. ✅ Pushed to GitHub
4. ✅ Deployed on Vercel (automatic after push)

---

## 🚀 SUPER SIMPLE METHOD (3 Steps)

### Step 1: Edit the File
Open: `apps/api/data/widget-config.json`

Find project `"5796"` (around line 50) and change:
- Line 53: `"primaryColor": "#YOUR_COLOR"`
- Line 61: `"welcomeMessage": "Your message"`

**Example:**
```json
"primaryColor": "#6158ff",  // Changed from #1b6b4b
"welcomeMessage": "Hello! 👋 Welcome to Homesfy\nHow can I assist you today?"
```

### Step 2: Save the File
Press `Cmd+S` (Mac) or `Ctrl+S` (Windows)

### Step 3: Deploy
Run this ONE command:
```bash
./deploy.sh 'Update widget color and messages'
```

**That's it!** Wait 1-2 minutes and check your widget.

---

## ✅ Verify It Worked

After deploying, test the API:
```bash
curl https://api-three-pearl.vercel.app/api/widget-config/5796
```

You should see your new color and messages in the JSON response.

---

## 🔍 Troubleshooting

### Changes Not Showing?

1. **Check if file was saved:**
   ```bash
   cat apps/api/data/widget-config.json | grep -A 2 "5796"
   ```

2. **Check if changes were committed:**
   ```bash
   git status apps/api/data/widget-config.json
   ```
   If it shows "modified", you need to deploy.

3. **Check if deployed:**
   ```bash
   git log -1 --oneline
   ```
   Should show your latest commit.

4. **Test the API:**
   ```bash
   curl https://api-three-pearl.vercel.app/api/widget-config/5796
   ```
   Should return JSON with your new values.

5. **Clear browser cache:**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
   - Or open in incognito/private window

---

## 📝 Quick Reference

**File to edit:** `apps/api/data/widget-config.json`

**Lines to change:**
- Line 53: `primaryColor` (hex color like `#6158ff`)
- Line 54: `followupMessage` (CTA acknowledgement)
- Line 55: `bhkPrompt` (BHK selection prompt)
- Line 58: `thankYouMessage` (final message)
- Line 61: `welcomeMessage` (initial greeting)

**Deploy command:**
```bash
./deploy.sh 'Your commit message'
```

**Test command:**
```bash
curl https://api-three-pearl.vercel.app/api/widget-config/5796
```

---

## 🎨 Color Examples

- Blue: `#6158ff`
- Green: `#1b6b4b`
- Red: `#ff4444`
- Orange: `#ff8800`
- Purple: `#9b59b6`

---

**Remember:** Always run `./deploy.sh` after making changes! 🚀

