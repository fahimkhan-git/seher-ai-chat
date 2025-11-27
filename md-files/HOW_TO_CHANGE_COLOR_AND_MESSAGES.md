# How to Change Widget Color and Messages

## 🎨 Quick Method (Recommended)

Use the interactive script:

```bash
./update-config-file.sh 5796
```

Then choose:
- **1** = Change color only
- **2** = Change messages only  
- **3** = Change color + messages
- **4** = Full configuration

After updating, deploy:
```bash
./deploy.sh 'Update widget color and messages'
```

---


<!-- 
# Edit the default config
nano apps/api/data/widget-config.json

# Find "projectId": "default" and update values
# Then deploy
./deploy.sh 'Update default widget config'

./update-config-file.sh default
 -->



## 📝 Manual Method

### Step 1: Edit the Config File

Open: `apps/api/data/widget-config.json`

Find your project (projectId: "5796") and update:

```json
{
  "projectId": "5796",
  "primaryColor": "#1b6b4b",           // ← Change this (hex color)
  "agentName": "Riya from Homesfy",   // ← Change this
  "welcomeMessage": "Hi, I'm Riya from Homesfy 👋\nHow can I help you today?",  // ← Change this
  "followupMessage": "Sure… I'll send that across right away!",  // ← Change this
  "bhkPrompt": "Which configuration you are looking for?",  // ← Change this
  "phonePrompt": "Please enter your mobile number...",  // ← Change this
  "thankYouMessage": "Thanks! Our expert will call you shortly 📞"  // ← Change this
}
```

### Step 2: Deploy Changes

```bash
git add apps/api/data/widget-config.json
git commit -m 'Update widget color and messages'
git push
```

Vercel will auto-deploy! 🚀

---

## 🎨 Color Examples

- Blue: `#6158ff`
- Green: `#1b6b4b`
- Red: `#ff4444`
- Orange: `#ff8800`
- Purple: `#9b59b6`
- Teal: `#1abc9c`

Use any hex color code: `#RRGGBB`

---

## 💬 Message Fields

- **welcomeMessage**: First message shown when widget opens
- **followupMessage**: After user clicks CTA button
- **bhkPrompt**: When asking for BHK preference
- **namePrompt**: When asking for name
- **phonePrompt**: When asking for phone number
- **thankYouMessage**: After form submission

---

## ✅ Quick Reference

**Current Config for Project 5796:**
- Color: `#1b6b4b` (green)
- Agent: `Riya from Homesfy`
- Welcome: `Hi, I'm Riya from Homesfy 👋\nHow can I help you today?`

**File Location:** `apps/api/data/widget-config.json`

**After Changes:** Run `./deploy.sh` to deploy to production

