# ⚠️ IMPORTANT: Vercel Environment Variables Setup

## The Problem
Vercel does NOT automatically read `.env.production` files. You MUST set environment variables in the Vercel dashboard.

## Current Issue
Your deployed app is using the wrong API URL:
- ❌ Current: `https://indians-frankfurt-hub-backend-production.up.railway.app`
- ✅ Correct: `https://indians-frankfurt-hub-backend-production.up.railway.app/api`

## How to Fix (Step by Step)

### 1. Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project: **indians-frankfurt-hub**

### 2. Navigate to Environment Variables
1. Click on **"Settings"** tab (top navigation)
2. Click on **"Environment Variables"** (left sidebar)

### 3. Add/Update the Environment Variable
1. Look for `REACT_APP_API_URL` in the list
2. If it exists, click the three dots (...) and select **"Edit"**
3. If it doesn't exist, click **"Add New"**

### 4. Set the Correct Value
```
Key: REACT_APP_API_URL
Value: https://indians-frankfurt-hub-backend-production.up.railway.app/api
```

**⚠️ IMPORTANT: Note the `/api` at the end!**

### 5. Select Environments
Check all three boxes:
- ✅ Production
- ✅ Preview
- ✅ Development

### 6. Save and Redeploy
1. Click **"Save"**
2. Go to the **"Deployments"** tab
3. Click on the three dots (...) next to the latest deployment
4. Select **"Redeploy"**
5. Click **"Redeploy"** in the popup

## Verify It's Working
After redeployment (takes 1-2 minutes):
1. Open your deployed site
2. Open browser console (F12)
3. Go to the Register page
4. You should see: `API URL: https://indians-frankfurt-hub-backend-production.up.railway.app/api`
5. Try registering - it should work!

## All Environment Variables Needed

```
REACT_APP_API_URL=https://indians-frankfurt-hub-backend-production.up.railway.app/api
REACT_APP_GOOGLE_CLIENT_ID=702337048289-hl5pqbnb9b0s3r3h1qfp3kiu4m2lpmcg.apps.googleusercontent.com
```

## Common Mistakes to Avoid
1. ❌ Forgetting the `/api` suffix
2. ❌ Only setting for Production (set for all environments)
3. ❌ Not redeploying after changing variables
4. ❌ Typos in the variable name (must be exactly `REACT_APP_API_URL`)

## Need Help?
If registration still doesn't work after following these steps:
1. Check the browser console for the exact error
2. Verify the backend is running at https://indians-frankfurt-hub-backend-production.up.railway.app/api/health
3. Check Railway logs for any backend errors