# 7. Production Deployment

## Overview
This guide covers deploying the Homesfy chat widget system to production, including API server, widget bundle, and dashboard.

## Deployment Architecture

### Components
1. **API Server**: Express.js API (Vercel, Render, Fly.io)
2. **Widget Bundle**: Static JavaScript file (CDN, Vercel)
3. **Dashboard**: React SPA (Vercel, Netlify)
4. **Database**: MongoDB Atlas (cloud)

## Prerequisites

### Required Accounts
- MongoDB Atlas account (free tier available)
- Vercel account (or alternative hosting)
- Gemini API key
- Domain name (optional, for custom domains)

### Environment Variables
Prepare all environment variables:
- API: `MONGO_URI`, `GEMINI_API_KEY`, `ALLOWED_ORIGINS`
- Widget: `VITE_WIDGET_API_BASE_URL`
- Dashboard: `VITE_API_BASE_URL`

## Step 1: MongoDB Atlas Setup

### Create Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Create new cluster (Free M0 tier)
3. Choose region closest to your users
4. Create cluster (takes 3-5 minutes)

### Configure Access
1. **Database Access**:
   - Create database user
   - Set username and strong password
   - Save credentials securely

2. **Network Access**:
   - Add IP: `0.0.0.0/0` (allows all IPs)
   - Or add specific IPs for security

### Get Connection String
1. Click "Connect" on cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. Replace `<dbname>` with `homesfy_chat`

Example:
```
mongodb+srv://username:password@cluster.mongodb.net/homesfy_chat?retryWrites=true&w=majority
```

## Step 2: Deploy API Server

### Option A: Vercel (Recommended)

#### Setup
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login:
   ```bash
   vercel login
   ```

3. Navigate to API directory:
   ```bash
   cd apps/api
   ```

4. Deploy:
   ```bash
   vercel
   ```

#### Configure Environment Variables
In Vercel dashboard:
1. Go to project settings
2. Navigate to "Environment Variables"
3. Add:
   ```
   DATA_STORE=mongo
   MONGO_URI=mongodb+srv://...
   GEMINI_API_KEY=your-key-here
   ALLOWED_ORIGINS=https://your-dashboard.vercel.app,https://your-widget.vercel.app
   API_PORT=4000
   ```

#### Important Notes
- Vercel file system is read-only
- **MUST** use MongoDB (cannot use file storage)
- Set `DATA_STORE=mongo` in environment variables
- API will fail if `MONGO_URI` is missing

### Option B: Render

1. Create new Web Service
2. Connect GitHub repository
3. Set:
   - **Root Directory**: `apps/api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add environment variables (same as Vercel)
5. Deploy

### Option C: Fly.io

1. Install Fly CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Login:
   ```bash
   fly auth login
   ```

3. Create app:
   ```bash
   cd apps/api
   fly launch
   ```

4. Set secrets:
   ```bash
   fly secrets set MONGO_URI="..." GEMINI_API_KEY="..." DATA_STORE="mongo"
   ```

5. Deploy:
   ```bash
   fly deploy
   ```

## Step 3: Deploy Widget Bundle

### Option A: Vercel (Recommended)

#### Setup
1. Navigate to widget directory:
   ```bash
   cd apps/widget
   ```

2. Deploy:
   ```bash
   vercel
   ```

#### Build Configuration
Vercel automatically:
- Runs `npm run build`
- Serves `dist/` directory
- Provides CDN URL

#### Widget URL
After deployment:
```
https://your-widget.vercel.app/widget.js
https://your-widget.vercel.app/style.css
```

### Option B: Custom CDN

1. Build widget:
   ```bash
   cd apps/widget
   npm run build
   ```

2. Upload `dist/` to CDN:
   - AWS CloudFront
   - Cloudflare
   - Your own server

3. Update widget URLs in embed code

## Step 4: Deploy Dashboard

### Option A: Vercel

1. Navigate to dashboard:
   ```bash
   cd apps/dashboard
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variable:
   ```
   VITE_API_BASE_URL=https://your-api.vercel.app
   ```

### Option B: Netlify

1. Connect GitHub repository
2. Set build settings:
   - **Base directory**: `apps/dashboard`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Add environment variable:
   ```
   VITE_API_BASE_URL=https://your-api.vercel.app
   ```

## Step 5: Configure Production URLs

### Update API CORS
In API environment variables:
```
ALLOWED_ORIGINS=https://your-dashboard.vercel.app,https://your-widget.vercel.app,https://your-property-site.com
```

### Update Widget Config
In widget `.env` (build time):
```
VITE_WIDGET_API_BASE_URL=https://your-api.vercel.app
```

### Update Dashboard Config
In dashboard environment variables:
```
VITE_API_BASE_URL=https://your-api.vercel.app
```

## Step 6: Embed Widget

### Production Embed Code
```html
<script
  src="https://your-widget.vercel.app/widget.js"
  data-project="5796"
  data-api-base-url="https://your-api.vercel.app"
  data-microsite="nivasa-enchante"
  async
></script>
```

### Add to Property Sites
1. Add embed code to each property page
2. Update `data-project` for each property
3. Update `data-microsite` for each property
4. Test widget loads and functions

## Step 7: Migration (If Applicable)

### Migrate Existing Data
If you have data in file storage:

1. Set up MongoDB Atlas (Step 1)
2. Update local `.env` with Atlas connection string
3. Run migration:
   ```bash
   npm run migrate:file-to-mongo
   ```
4. Verify data in MongoDB Compass
5. Deploy API with MongoDB

## Step 8: Testing Production

### Test API
```bash
curl https://your-api.vercel.app/health
```

Should return:
```json
{
  "status": "ok",
  "ai": {
    "available": true,
    "model": "gemini-2.5-flash",
    "mode": "full-ai"
  }
}
```

### Test Widget
1. Open property page with widget
2. Test chat functionality
3. Submit test lead
4. Verify lead appears in CRM
5. Check conversation is stored

### Test Dashboard
1. Open dashboard URL
2. Verify leads are displayed
3. Check conversation history
4. Test analytics

## Monitoring

### API Health
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Monitor `/health` endpoint
- Alert on failures

### Error Tracking
- Use error tracking service (Sentry, Rollbar)
- Monitor API errors
- Track widget errors

### Analytics
- Monitor lead conversion rates
- Track conversation quality
- Analyze user engagement

## Security Checklist

- [ ] MongoDB Atlas network access restricted
- [ ] Strong database passwords
- [ ] API CORS configured correctly
- [ ] Environment variables secured
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] API keys not exposed in client code
- [ ] Rate limiting configured (if needed)

## Performance Optimization

### API
- Use MongoDB indexes (automatic)
- Enable connection pooling
- Monitor response times
- Optimize queries

### Widget
- Minified and compressed
- Served from CDN
- Cached appropriately
- Loads asynchronously

### Database
- Monitor database size
- Archive old data
- Optimize indexes
- Use connection pooling

## Backup Strategy

### MongoDB Atlas
- Enable automatic backups (Atlas feature)
- Set backup retention period
- Test restore process

### Manual Backups
```bash
# Export data
mongodump --uri="mongodb+srv://..." --out=backup/

# Restore if needed
mongorestore --uri="mongodb+srv://..." backup/
```

## Troubleshooting

### API Not Responding
- Check Vercel deployment status
- Verify environment variables
- Check MongoDB connection
- Review API logs

### Widget Not Loading
- Verify widget URL is accessible
- Check CORS configuration
- Verify API URL is correct
- Check browser console

### Leads Not Submitting
- Verify CRM API is accessible
- Check phone validation
- Review widget console logs
- Test with different browsers

## Rollback Plan

### If Deployment Fails
1. Keep previous deployment
2. Fix issues locally
3. Test thoroughly
4. Redeploy

### Database Rollback
- Use MongoDB Atlas backups
- Restore from backup if needed
- Verify data integrity

## Post-Deployment

### Immediate Actions
- [ ] Test all functionality
- [ ] Verify leads are submitting
- [ ] Check conversations are storing
- [ ] Monitor error rates

### First Week
- [ ] Monitor performance
- [ ] Review user feedback
- [ ] Check conversion rates
- [ ] Optimize as needed

## Next Steps
- [ ] Complete production deployment
- [ ] Test all functionality
- [ ] Monitor performance
- [ ] Proceed to Testing Checklist (see `8-testing-checklist.md`)
