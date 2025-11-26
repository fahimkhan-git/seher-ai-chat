# Easy Deployment Setup

## ✅ Automatic Deployment from Git

Your project is now configured for automatic deployment from Git to Vercel.

### How It Works

1. **Push to Git** → Vercel automatically detects changes
2. **Vercel builds** → Includes config file from `apps/api/data/widget-config.json`
3. **Deploys** → Both API and Widget are deployed automatically

### Vercel Token (Already Configured)

Your Vercel token is set. Projects are linked to:
- **API**: `fahimkhan-gits-projects/api`
- **Widget**: `fahimkhan-gits-projects/widget-eight-ebon`

### Update Config & Deploy

**Simple 3-step process:**

```bash
# 1. Update config locally
./update-config-file.sh 5796

# 2. Commit and push
git add apps/api/data/widget-config.json
git commit -m 'Update widget config'
git push

# 3. Vercel auto-deploys! 🚀
```

That's it! Vercel will automatically:
- Build the API with the new config
- Build the Widget
- Deploy both to production

### Verify Deployment

After pushing, check:
```bash
# Check API config
curl https://api-avearw3pv-fahimkhan-gits-projects.vercel.app/api/widget-config/5796

# Should return your config (not {})
```

### Troubleshooting

**If config returns `{}`:**
1. Check Vercel logs: `vercel logs api-avearw3pv-fahimkhan-gits-projects.vercel.app`
2. Look for "Config file loaded from:" message
3. Verify the file is in git: `git ls-files apps/api/data/widget-config.json`

**If build fails:**
1. Check Vercel dashboard: https://vercel.com/fahimkhan-gits-projects
2. Look at build logs for errors
3. Ensure all dependencies are in package.json

---

**That's it!** Just commit and push - Vercel handles the rest. 🎉

