# 🎯 Project ID Isolation - Multi-Microsite Support

## ✅ How It Works

Each microsite uses its own project ID from the embed script. The widget automatically:
1. **Loads configuration** for that specific project ID
2. **Submits leads** with the correct project ID
3. **No conflicts** between different microsites

## 📋 Embed Script Structure

```html
<script
  src="https://widget-eight-ebon.vercel.app/widget.js"
  data-project="5717"  <!-- ← Change this for each microsite -->
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-1"  <!-- ← Optional: microsite identifier -->
  async
></script>
```

## 🔄 Project ID Flow

### 1. Widget Initialization
- Reads `data-project` from embed script
- Fetches config from: `GET /api/widget-config/{projectId}`
- Each project ID has its own configuration (color, messages, etc.)

### 2. Lead Submission
- Uses the project ID from embed script (`data-project` attribute)
- Lead is submitted with: `project_id: {projectId}`
- Each lead is correctly associated with its microsite's project

### 3. Isolation
- ✅ Project 5796 → Loads config for 5796 → Submits leads with project_id: 5796
- ✅ Project 5717 → Loads config for 5717 → Submits leads with project_id: 5717
- ✅ No conflicts or cross-contamination

## 🎨 Configuration Per Project

Each project ID can have different:
- Primary color (`primaryColor`)
- Agent name (`agentName`)
- Welcome message (`welcomeMessage`)
- All other widget settings

**Config file:** `apps/api/data/widget-config.json`

```json
{
  "configs": [
    {
      "projectId": "5796",
      "primaryColor": "#9945ff",
      "agentName": "Ziya from Homesfy",
      ...
    },
    {
      "projectId": "5717",
      "primaryColor": "#049B5A",
      "agentName": "Riya from Homesfy",
      ...
    }
  ]
}
```

## ✅ Verification

The widget logs project ID usage in browser console:
- `HomesfyChat: Fetching widget theme from API for project: 5717`
- `HomesfyChat: Lead submission - Project ID: 5717`

## 🚀 For 1000+ Microsites

1. **Same widget script** - Use the same embed script on all microsites
2. **Different project IDs** - Just change `data-project` value
3. **Automatic isolation** - Each microsite gets its own config and leads

**Example:**
- Microsite A: `data-project="5796"`
- Microsite B: `data-project="5717"`
- Microsite C: `data-project="5823"`
- ... and so on

## ⚠️ Important Notes

- ✅ Project ID is read from `data-project` attribute (highest priority)
- ✅ Falls back to URL params if needed
- ✅ Each lead submission includes the correct `project_id`
- ✅ No manual configuration needed per microsite
- ✅ All microsites can use the same widget.js file

## 🔍 Testing

To verify project ID isolation:

1. Open browser console
2. Check logs:
   ```
   HomesfyChat: Fetching widget theme from API for project: 5717
   HomesfyChat: Lead submission - Project ID: 5717
   ```
3. Submit a lead and verify `project_id` in CRM payload

---

**✅ Your setup is correct!** Each microsite with a different `data-project` value will:
- Load its own configuration
- Submit leads with the correct project ID
- Work independently without conflicts
