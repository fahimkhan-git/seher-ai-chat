# 🎨 Shared Config with Project-Specific Leads

## ✅ How It Works

- **Widget Configuration**: Always loads from project `5796` (shared config for all microsites)
- **Lead Submission**: Uses the project ID from embed script (`data-project` attribute) to send to CRM

## 📋 Setup

### Widget Config (Shared)
All microsites use the same widget configuration:
- Color, messages, agent name, etc. from project `5796`
- Configure once, applies to all microsites

### Lead Submission (Project-Specific)
Each microsite submits leads with its own project ID:
- Microsite A with `data-project="5796"` → Lead with `project_id: 5796`
- Microsite B with `data-project="5717"` → Lead with `project_id: 5717`
- Microsite C with `data-project="5823"` → Lead with `project_id: 5823`

## 🔄 Flow

```
1. Widget loads
   ↓
2. Fetches config from: /api/widget-config/5796 (shared)
   ↓
3. Widget displays with shared config
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
  data-project="5717"  <!-- ← This ID used for lead submission -->
  data-api-base-url="https://api-three-pearl.vercel.app"
  data-microsite="microsite-1"
  async
></script>
```

### What Happens
1. **Config**: Loads from project `5796` (shared)
   - Same color, messages, etc. for all microsites
   
2. **Lead Submission**: Uses project `5717` (from embed script)
   - Lead sent to CRM with `project_id: 5717`

## ✅ Benefits

- ✅ **One config to manage** - Update project `5796` config, all microsites update
- ✅ **Correct lead tracking** - Each microsite's leads go to the right project in CRM
- ✅ **Easy maintenance** - Change widget appearance once, applies everywhere
- ✅ **Accurate reporting** - Leads are correctly associated with their microsite's project

## 🔧 Configuration

To change the shared config project ID, edit `apps/widget/src/widget.jsx`:

```javascript
const configProjectId = "5796"; // Change this to use a different shared config
```

## 🎯 Use Cases

Perfect for:
- Multiple microsites with same branding/appearance
- Different projects that need the same widget look
- Centralized widget management
- Accurate lead attribution per microsite

---

**✅ Setup Complete!** All microsites share the same widget config, but leads are submitted with the correct project ID.
