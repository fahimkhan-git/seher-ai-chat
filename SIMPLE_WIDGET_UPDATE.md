# 🎨 Simple Way to Change Widget Color and Messages

## ⚡ Super Easy Method

Just run this command:

```bash
./change-widget.sh 5796
```

Then:
1. Enter new color (or press Enter to skip)
2. Enter new messages (or press Enter to skip)
3. Choose to deploy now or later

**That's it!** 🎉

---

## 📝 Step-by-Step Example

```bash
# 1. Run the script
./change-widget.sh 5796

# 2. It will show current settings:
#    Color: #1b6b4b
#    Agent: Riya from Homesfy
#    Welcome: Hi, I'm Riya from Homesfy 👋...

# 3. Enter new values (or press Enter to keep current):
#    Color: #6158ff
#    Welcome Message: Hi! How can I help?
#    CTA Acknowledgement: Great! Let me get that for you.
#    BHK Prompt: What size are you looking for?
#    Thank You Message: Thanks! We'll call you soon.

# 4. Choose to deploy now (y) or later (n)

# 5. Done! Changes will be live in 1-2 minutes
```

---

## 🎨 Color Examples

Just type the hex code:
- Blue: `#6158ff`
- Green: `#1b6b4b`
- Red: `#ff4444`
- Orange: `#ff8800`
- Purple: `#9b59b6`

---

## 💬 Message Tips

- Use `\n` for line breaks
- Use emojis: 👋 📞 ✅
- Keep messages short and friendly

---

## 🔄 Manual Method (If Script Doesn't Work)

1. Open: `apps/api/data/widget-config.json`
2. Find: `"projectId": "5796"`
3. Change:
   - `"primaryColor": "#YOUR_COLOR"`
   - `"welcomeMessage": "Your message"`
4. Save file
5. Run: `./deploy.sh 'Update widget'`

---

## ✅ After Making Changes

Vercel will automatically deploy when you push to Git.

Check your widget in 1-2 minutes - changes should be live!

