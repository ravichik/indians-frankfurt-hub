# Deployment Guide for Indians in Frankfurt Hub

## 🚀 Deploying to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub repository connected

### Deployment Options

## Option 1: Deploy Frontend and Backend Separately (Recommended)

### Deploy Frontend to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `frontend` folder as root directory

2. **Configure Build Settings**
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app/api
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Deploy Backend to Vercel

1. **Create New Project**
   - Go to Vercel Dashboard
   - Click "New Project"
   - Import same GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Build Settings**
   - Framework Preset: `Other`
   - Build Command: leave empty
   - Output Directory: leave empty
   - Install Command: `npm install`

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"

## Option 2: Deploy as Monorepo

1. **Import Project**
   - Import GitHub repository
   - Keep root directory as is

2. **Configure for Monorepo**
   - Vercel will detect the monorepo structure
   - Configure each app separately in Vercel dashboard

## 🔧 Post-Deployment Configuration

### Update Frontend API URL
1. Go to Frontend project in Vercel
2. Settings → Environment Variables
3. Update `REACT_APP_API_URL` with your backend URL
4. Redeploy

### Update CORS Settings
In `backend/server.js`, update CORS origin:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-frontend-url.vercel.app'
  ],
  credentials: true
}));
```

### Configure Google OAuth Redirect
1. Go to Google Cloud Console
2. Add your Vercel frontend URL to Authorized JavaScript origins
3. Update redirect URIs

## 🐛 Troubleshooting

### 404 Not Found Error
If you get 404 errors:
- Ensure `vercel.json` is present in the frontend folder
- Check that rewrites are configured for React Router

### API Connection Issues
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS configuration in backend
- Ensure backend is deployed and running

### MongoDB Connection Issues
- Whitelist Vercel IP addresses in MongoDB Atlas
- Use MongoDB Atlas (not local MongoDB)
- Check connection string format

### Environment Variables Not Working
- Redeploy after adding environment variables
- Use `REACT_APP_` prefix for React env vars
- Check variable names match exactly

## 📝 Vercel Configuration Files

### frontend/vercel.json
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### backend/vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

## 🌐 Alternative Deployment Options

### Netlify (Frontend)
1. Connect GitHub repo
2. Build command: `npm run build`
3. Publish directory: `frontend/build`

### Heroku (Backend)
1. Create new app
2. Connect GitHub
3. Add buildpack: `heroku/nodejs`
4. Configure environment variables

### Railway (Full Stack)
1. Import GitHub repo
2. Configure services for frontend and backend
3. Set environment variables
4. Deploy

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas IP whitelist updated
- [ ] Google OAuth redirect URLs updated
- [ ] CORS origins updated
- [ ] API URL updated in frontend
- [ ] SSL certificates active
- [ ] Error logging configured
- [ ] Performance monitoring enabled

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google Cloud Console](https://console.cloud.google.com/)

## Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints independently
4. Check browser console for errors