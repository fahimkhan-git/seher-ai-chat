# File-Based Widget Config (No MongoDB)

## ✅ Simple & Secure Setup

Your widget config now uses **file-based storage** - no MongoDB needed!

### How It Works

1. **Config File**: `apps/api/data/widget-config.json` (committed to git)
2. **Deployment**: Config file is deployed with your API to Vercel
3. **Updates**: Update the file locally, commit, push → Vercel auto-deploys

### Update Config (3 Steps)

```bash
# 1. Update config locally
./update-config-file.sh 5796

# 2. Commit the change
git add apps/api/data/widget-config.json
git commit -m 'Update widget config'

# 3. Push to deploy
git push
```

Vercel will automatically deploy with the new config!

### Why This is Better

✅ **No MongoDB** - No database setup, no connection issues  
✅ **Simple** - Just a JSON file in git  
✅ **Secure** - Config is in your repo, version controlled  
✅ **Fast** - No database queries, just file reads  
✅ **Free** - No database costs  

### Local Development

- Config updates work immediately (file is writable)
- Use `./update-config-file.sh` to update locally
- Changes take effect after restarting API

### Production

- Config is read-only (deployed from git)
- To update: edit file locally → commit → push
- Vercel redeploys automatically

### Remove MongoDB from Vercel

You can now remove these environment variables from Vercel:
- `MONGO_URI` (not needed anymore)
- `DATA_STORE` (defaults to "file")

Keep only:
- `WIDGET_CONFIG_API_KEY` (for securing config updates if needed)

---

**That's it!** Simple, secure, no MongoDB needed. 🎉

