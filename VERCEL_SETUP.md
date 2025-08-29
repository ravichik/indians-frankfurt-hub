# 🚀 Complete Vercel Deployment Setup Guide

## ⚠️ IMPORTANT: You need to deploy BOTH frontend and backend separately!

## Step 1: MongoDB Atlas Setup (Required!)

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (free tier is fine)

### 1.2 Configure Database Access
1. Go to **Database Access** → Add New Database User
   - Username: `iifuser`
   - Password: Generate secure password (save this!)
   - Database User Privileges: Atlas Admin

### 1.3 Configure Network Access
1. Go to **Network Access** → Add IP Address
2. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Vercel deployment

### 1.4 Get Connection String
1. Go to **Database** → Connect → Connect your application
2. Copy the connection string:
   ```
   mongodb+srv://iifuser:<password>@cluster.xxxxx.mongodb.net/iifdb?retryWrites=true&w=majority
   ```
3. Replace `<password>` with your actual password

## Step 2: Deploy Backend to Vercel

### 2.1 Create Backend Deployment
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. **IMPORTANT**: Set root directory to `backend`

### 2.2 Configure Build Settings
- **Framework Preset**: Other
- **Build Command**: ` ` (leave empty)
- **Output Directory**: ` ` (leave empty)
- **Install Command**: `npm install`

### 2.3 Add Environment Variables
Click "Environment Variables" and add ALL of these:

```bash
# MongoDB (REQUIRED!)
MONGODB_URI=mongodb+srv://iifuser:yourpassword@cluster.xxxxx.mongodb.net/iifdb?retryWrites=true&w=majority

# JWT Secret (REQUIRED!)
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random

# Google OAuth (Optional but recommended)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL (REQUIRED!)
FRONTEND_URL=https://indians-frankfurt-hub.vercel.app
CLIENT_URL=https://indians-frankfurt-hub.vercel.app

# Node Environment
NODE_ENV=production
```

### 2.4 Deploy
Click **"Deploy"** and wait for completion. Note down your backend URL:
- Example: `https://indians-frankfurt-hub-backend.vercel.app`

### 2.5 Test Backend
Visit: `https://your-backend-url.vercel.app/api/health`
You should see:
```json
{
  "status": "OK",
  "message": "Indians in Frankfurt Hub API is running"
}
```

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Frontend Deployment
1. Go to Vercel Dashboard
2. Click **"New Project"**
3. Import same GitHub repository
4. **IMPORTANT**: Set root directory to `frontend`

### 3.2 Configure Build Settings
- **Framework Preset**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 3.3 Add Environment Variables
Add these environment variables:

```bash
# Backend API URL (REQUIRED! Use your backend URL from Step 2.4)
REACT_APP_API_URL=https://indians-frankfurt-hub-backend.vercel.app/api

# Google OAuth (Optional but recommended)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### 3.4 Deploy
Click **"Deploy"** and wait for completion.

## Step 4: Post-Deployment Setup

### 4.1 Create Admin Account
1. Open your deployed frontend
2. Register a new account
3. Access MongoDB Atlas → Browse Collections
4. Find your user in the `users` collection
5. Change `role` from `"user"` to `"admin"`

### 4.2 Seed Initial Data (Optional)
Run this locally with your production MongoDB URI:
```bash
cd backend
MONGODB_URI="your-mongodb-uri" node seeders/seed.js
```

### 4.3 Update Google OAuth (If using)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Add your frontend URLs to Authorized JavaScript origins:
   - `https://indians-frankfurt-hub.vercel.app`
   - `https://your-frontend-url.vercel.app`

## Step 5: Troubleshooting

### ❌ "Cannot register" or "Cannot see forum posts"
**Solution**: Your backend is not connected properly.
1. Check backend is deployed: Visit `/api/health` endpoint
2. Verify `REACT_APP_API_URL` in frontend environment variables
3. Check MongoDB connection string is correct

### ❌ "Network Error" or CORS errors
**Solution**: Update backend CORS settings
1. Redeploy backend with updated `server.js`
2. Ensure frontend URL is in CORS allowed origins

### ❌ "Database connection failed"
**Solution**: MongoDB Atlas not configured
1. Verify MongoDB URI in backend environment variables
2. Check IP whitelist includes 0.0.0.0/0
3. Verify database user credentials

### ❌ "404 Not Found" on routes
**Solution**: React Router not configured
1. Ensure `vercel.json` exists in frontend folder
2. Contains rewrite rules for React Router

## Step 6: Verify Everything Works

### Test Checklist:
- [ ] Homepage loads correctly
- [ ] Can register new account
- [ ] Can login with credentials
- [ ] Forum posts load and display
- [ ] Can create new forum posts
- [ ] Events page shows events
- [ ] Resources page loads content
- [ ] Profile page works
- [ ] Google OAuth works (if configured)

## Environment Variables Summary

### Backend (.env in Vercel):
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env in Vercel):
```
REACT_APP_API_URL=https://your-backend.vercel.app/api
REACT_APP_GOOGLE_CLIENT_ID=...
```

## 🎉 Success Indicators

When everything is working, you should be able to:
1. ✅ Register and login users
2. ✅ Create and view forum posts
3. ✅ Create and RSVP to events
4. ✅ Access all pages without errors
5. ✅ See data persisting in MongoDB Atlas

## Need Help?

1. Check Vercel Function Logs: Dashboard → Functions → View Logs
2. Check Browser Console for errors (F12)
3. Verify all environment variables are set
4. Test API endpoints directly using Postman
5. Ensure MongoDB Atlas is accessible

## Important URLs to Remember

- Frontend: `https://indians-frankfurt-hub.vercel.app`
- Backend: `https://indians-frankfurt-hub-backend.vercel.app`
- Backend Health: `https://indians-frankfurt-hub-backend.vercel.app/api/health`
- MongoDB Atlas: `https://cloud.mongodb.com/`

---
**Remember**: The most common issue is forgetting to set environment variables or using wrong URLs. Double-check everything!