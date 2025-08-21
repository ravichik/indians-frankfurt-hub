# Environment Variables for Deployment

## ⚠️ CRITICAL: Vercel Does NOT Read .env Files!
**You MUST set these variables in the Vercel Dashboard. See VERCEL_ENV_SETUP.md for detailed instructions.**

## Frontend (Vercel/Netlify/Railway)

Set these environment variables in your deployment platform's dashboard:

### For React App (Create React App):
```
REACT_APP_API_URL=https://indians-frankfurt-hub-backend-production.up.railway.app/api
REACT_APP_GOOGLE_CLIENT_ID=702337048289-hl5pqbnb9b0s3r3h1qfp3kiu4m2lpmcg.apps.googleusercontent.com
```

### For Next.js (if migrating):
```
NEXT_PUBLIC_API_URL=https://indians-frankfurt-hub-backend-production.up.railway.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=702337048289-hl5pqbnb9b0s3r3h1qfp3kiu4m2lpmcg.apps.googleusercontent.com
```

## Backend (Railway)

Set these environment variables in Railway:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://adminIIF:BeKVVss4U75LZuKZ@YOUR_ACTUAL_CLUSTER_NAME.mongodb.net/indians-frankfurt-hub?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
GOOGLE_CLIENT_ID=702337048289-hl5pqbnb9b0s3r3h1qfp3kiu4m2lpmcg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=https://your-frontend-url.vercel.app
```

⚠️ **IMPORTANT**: Replace `YOUR_ACTUAL_CLUSTER_NAME` with your actual MongoDB Atlas cluster name (e.g., `cluster0`)

## How to Set Environment Variables

### Vercel
1. Go to your project dashboard
2. Click on "Settings" tab
3. Navigate to "Environment Variables"
4. Add each variable with its value
5. Choose the environment (Production/Preview/Development)
6. Click "Save"

### Railway
1. Go to your project dashboard
2. Click on your service
3. Go to "Variables" tab
4. Add each variable
5. Railway will automatically redeploy

### Netlify
1. Go to Site settings
2. Navigate to "Environment variables"
3. Add variables
4. Save and redeploy

## Local Development

For local development, use the `.env` file with:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=702337048289-hl5pqbnb9b0s3r3h1qfp3kiu4m2lpmcg.apps.googleusercontent.com
```

## Testing Production Build Locally

To test production build locally:
```bash
npm run build
npx serve -s build
```

The app will use `.env.production.local` if present, otherwise `.env.production`.