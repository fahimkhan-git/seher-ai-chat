# ⚡ Quick Edit Guide - Change Widget Color & Messages

## 🎯 EASIEST METHOD - Edit the File Directly

### Step 1: Open the Config File

Open: `apps/api/data/widget-config.json`

### Step 2: Find Your Project (Line ~50)

Look for: `"projectId": "5796"`

### Step 3: Change These Lines

```json
{
  "projectId": "5796",
  "primaryColor": "#1b6b4b",        // ← LINE 53: Change this color
  "welcomeMessage": "Hi, I'm Riya from Homesfy 👋\nHow can I help you today?",  // ← LINE 61: Change this message
  "followupMessage": "Sure… I'll send that across right away!",  // ← LINE 54: Change this
  "bhkPrompt": "Which configuration you are looking for?",  // ← LINE 55: Change this
  "thankYouMessage": "Thanks! Our expert will call you shortly 📞"  // ← LINE 58: Change this
}
```

### Step 4: Save the File

Just save it (Cmd+S or Ctrl+S)

### Step 5: Deploy

Run this command:
```bash
./deploy.sh 'Update widget color and messages'
```

**Done!** Changes will be live in 1-2 minutes 🚀

---

## 🎨 Color Examples

Replace `#1b6b4b` with:
- `#6158ff` (Blue)
- `#ff4444` (Red)
- `#ff8800` (Orange)
- `#9b59b6` (Purple)
- Any hex color: `#RRGGBB`

---

## 💬 Message Examples

**Welcome Message:**
```json
"welcomeMessage": "Hello! 👋 How can I help you today?"
```

**Thank You Message:**
```json
"thankYouMessage": "Thank you! We'll contact you soon 📞"
```

Use `\n` for line breaks:
```json
"welcomeMessage": "Hi! 👋\nWelcome to Homesfy\nHow can I help?"
```

---

## ✅ Quick Checklist

- [ ] Open `apps/api/data/widget-config.json`
- [ ] Find `"projectId": "5796"`
- [ ] Change `primaryColor` (line 53)
- [ ] Change `welcomeMessage` (line 61)
- [ ] Save file
- [ ] Run `./deploy.sh 'Update widget'`
- [ ] Wait 1-2 minutes
- [ ] Check your widget - changes should be live!

---

## 🆘 Still Not Working?

1. **Check the file was saved** - Look at the file timestamp
2. **Check you deployed** - Run `git status` to see if file is committed
3. **Check Vercel logs** - Go to Vercel dashboard → API → Logs
4. **Clear browser cache** - Hard refresh (Cmd+Shift+R)

---

**That's it!** Just edit the file and deploy. Super simple! 🎉

