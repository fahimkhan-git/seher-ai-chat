# Connect Vercel Projects to GitHub Repository

## Current Status

All projects are deployed but need to be connected to the new GitHub repository.

## Projects to Update

1. **api** - https://vercel.com/fahimkhan-gits-projects/api/settings/git
2. **widget-eight-ebon** - https://vercel.com/fahimkhan-gits-projects/widget-eight-ebon/settings/git
3. **dashboard** - https://vercel.com/fahimkhan-gits-projects/dashboard/settings/git

## Steps to Connect

### For Each Project:

1. Go to project settings:
   - API: https://vercel.com/fahimkhan-gits-projects/api/settings/git
   - Widget: https://vercel.com/fahimkhan-gits-projects/widget-eight-ebon/settings/git
   - Dashboard: https://vercel.com/fahimkhan-gits-projects/dashboard/settings/git

2. Click **"Connect Git Repository"** (or "Disconnect" if connected to old repo)

3. Select repository: **fahimkhan-git/seher-ai-chat**

4. Configure:
   - **Production Branch**: `main`
   - **Root Directory**: 
     - API: `apps/api`
     - Widget: `.` (root)
     - Dashboard: `apps/dashboard`

5. Enable **"Auto-deploy"** for production branch

6. Click **"Save"**

## Remove Old Projects (Optional)

If you want to clean up old projects:

1. Go to: https://vercel.com/fahimkhan-gits-projects/dashboard-seven-brown-56/settings
2. Scroll to bottom
3. Click **"Delete Project"**

## After Connection

Once connected:
- ✅ Auto-deploy on push to `main`
- ✅ Preview deployments for PRs
- ✅ Build logs in Vercel dashboard
- ✅ Easy rollback if needed

## Current Production URLs

- **API**: https://api-rh4und7oh-fahimkhan-gits-projects.vercel.app
- **Widget**: https://widget-eight-ebon-3ayume5ql-fahimkhan-gits-projects.vercel.app
- **Dashboard**: https://dashboard-lart1reeq-fahimkhan-gits-projects.vercel.app

## Quick Links

- **API Settings**: https://vercel.com/fahimkhan-gits-projects/api/settings
- **Widget Settings**: https://vercel.com/fahimkhan-gits-projects/widget-eight-ebon/settings
- **Dashboard Settings**: https://vercel.com/fahimkhan-gits-projects/dashboard/settings

