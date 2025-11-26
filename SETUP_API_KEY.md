# Setup API Key in Vercel

## Step 1: Add API Key to Vercel

1. Go to Vercel Dashboard: https://vercel.com/fahimkhan-gits-projects/api/settings/environment-variables

2. Click **"Add New"** or **"Add Environment Variable"**

3. Fill in:
   - **Key**: `WIDGET_CONFIG_API_KEY`
   - **Value**: `e2c34993f394e8273273e62059a33a92f23d736ce78119cfe1947351b8455555`
   - **Environment**: Select **Production** (and optionally Preview/Development)

4. Click **"Save"**

## Step 2: Redeploy API

After adding the environment variable, you need to redeploy the API:

```bash
cd apps/api
vercel --prod
```

Or trigger a redeploy from Vercel Dashboard:
- Go to: https://vercel.com/fahimkhan-gits-projects/api/deployments
- Click on the latest deployment
- Click **"Redeploy"**

## Step 3: Verify API Key is Set

After redeploy, check Vercel logs to confirm:
```bash
vercel logs api-three-pearl.vercel.app
```

You should NOT see: `⚠️  WIDGET_CONFIG_API_KEY not set`

## Step 4: Update Config

Now run the update script:
```bash
export WIDGET_CONFIG_API_KEY='e2c34993f394e8273273e62059a33a92f23d736ce78119cfe1947351b8455555'
./update-config-now.sh 5796
```

## Troubleshooting

### Still getting 403?
1. **Check Vercel environment variables** - Make sure the key is exactly the same (no extra spaces)
2. **Redeploy** - Environment variables only apply after redeploy
3. **Check logs** - Look for API key mismatch warnings in Vercel logs

### API key not working?
- Make sure there are no extra spaces or newlines in the Vercel environment variable
- The key should be exactly: `e2c34993f394e8273273e62059a33a92f23d736ce78119cfe1947351b8455555`
- Copy-paste directly from the generate script output

