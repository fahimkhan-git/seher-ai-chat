# 🎨 Default Config Setup - All Microsites Share Same Config

## ✅ How It Works

- **Widget Config**: Always uses `"default"` project (same config for ALL microsites)
- **Lead Submission**: Uses project ID from embed script (`data-project` attribute) to send to CRM

## 📋 Configuration

### Default Config Location
Edit: `apps/api/data/widget-config.json`

Find the config with `"projectId": "default"` and update:
- `primaryColor` - Widget color
- `agentName` - Agent name
- `welcomeMessage` - Welcome message
- `followupMessage` - Follow-up message
- `bhkPrompt` - BHK selection prompt
- `namePrompt` - Name input prompt
- `phonePrompt` - Phone input prompt
- `thankYouMessage` - Thank you message
- All other widget settings

### Example Config
```json
{
  "projectId": "default",
  "primaryColor": "#049B5A",
  "agentName": "Ziya from Homesfy",
  "welcomeMessage": "Hello! 👋 Welcome to Homesfy\nHow can I assist you today?",
  ...
}
```

## 🔄 Flow

```
1. Widget loads on ANY microsite
   ↓
2. Fetches config from: /api/widget-config/default
   ↓
3. Widget displays with DEFAULT config (same for all)
   ↓
4. User submits lead
   ↓
5. Lead sent to CRM with project_id from data-project attribute
```

## 📝 Example

### Embed Script
```html
<!-- Microsite A -->
<script
  src="https://widget-eight-ebon.vercel.app/widget.js"
  data-project="5717"  <!-- ← Used for lead submission -->
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-1"
  async
></script>

<!-- Microsite B -->
<script
  src="https://widget-eight-ebon.vercel.app/widget.js"
  data-project="5823"  <!-- ← Different project ID -->
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-2"
  async
></script>
```

### What Happens
- **Both microsites**: Use the same DEFAULT widget config
- **Microsite A**: Submits leads with `project_id: 5717`
- **Microsite B**: Submits leads with `project_id: 5823`

## ✅ Benefits

- ✅ **One config for all** - Update once, applies to all 1000+ microsites
- ✅ **Correct lead tracking** - Each microsite's leads go to the right project in CRM
- ✅ **Easy maintenance** - Change widget appearance once, applies everywhere
- ✅ **Simple management** - Just edit the "default" project config

## 🔧 How to Change Config

### Method 1: Edit JSON File
```bash
# Edit the default config
nano apps/api/data/widget-config.json

# Find "projectId": "default" and update values
# Then deploy
./deploy.sh 'Update default widget config'
```

### Method 2: Use Update Script
```bash
./update-config-file.sh default
```

## 🎯 Summary

- **Config**: Always from `"default"` project (same for all microsites)
- **Leads**: Use project ID from `data-project` attribute (different per microsite)
- **Management**: Edit `widget-config.json` → `"default"` project
- **Deployment**: Push to Git → Vercel auto-deploys

---

**✅ Setup Complete!** All microsites use the same default config, but leads are submitted with the correct project ID.
