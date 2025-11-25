# Production URLs - Seher AI Chat

## Latest Deployment URLs

### API Server
- **Production**: https://api-825pnmuvj-fahimkhan-gits-projects.vercel.app
- **Inspect**: https://vercel.com/fahimkhan-gits-projects/api/6Ga2brRHWbPwZaNnEX3QFiw6j9J8
- **Health Check**: https://api-825pnmuvj-fahimkhan-gits-projects.vercel.app/health

### Widget Bundle
- **Production**: https://widget-eight-ebon-cm6fwvh6y-fahimkhan-gits-projects.vercel.app
- **Widget JS**: https://widget-eight-ebon-cm6fwvh6y-fahimkhan-gits-projects.vercel.app/widget.js
- **Inspect**: https://vercel.com/fahimkhan-gits-projects/widget-eight-ebon/CEEP8eDDzdUinWTdsfpWHEWzJYTt

### Dashboard
- **Production**: https://dashboard-k4jyb2ugp-fahimkhan-gits-projects.vercel.app
- **Inspect**: https://vercel.com/fahimkhan-gits-projects/dashboard/rqZ5kGqohAE3mTMQAymydiZfbTdM

## GitHub Repository
- **Repository**: https://github.com/fahimkhan-git/seher-ai-chat
- **Branch**: `main`

## Vercel Projects
- **API**: https://vercel.com/fahimkhan-gits-projects/api
- **Widget**: https://vercel.com/fahimkhan-gits-projects/widget-eight-ebon
- **Dashboard**: https://vercel.com/fahimkhan-gits-projects/dashboard

## Widget Embed Script

Use this to embed the widget on your website:

```html
<script 
  src="https://widget-eight-ebon-cm6fwvh6y-fahimkhan-gits-projects.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://api-825pnmuvj-fahimkhan-gits-projects.vercel.app"
  async>
</script>
```

## Environment Variables Needed

### API Project
Set in: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables

```
DATA_STORE=mongo
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority
GEMINI_API_KEY=your-actual-gemini-api-key
ALLOWED_ORIGINS=https://dashboard-k4jyb2ugp-fahimkhan-gits-projects.vercel.app,https://widget-eight-ebon-cm6fwvh6y-fahimkhan-gits-projects.vercel.app
API_PORT=4000
NODE_ENV=production
```

### Dashboard Project
Set in: https://vercel.com/fahimkhan-gits-projects/dashboard/settings/environment-variables

```
VITE_API_BASE_URL=https://api-825pnmuvj-fahimkhan-gits-projects.vercel.app
```

## Last Updated
November 25, 2025

