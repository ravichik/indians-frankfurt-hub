// Google OAuth Configuration
// You need to create a project in Google Cloud Console and get these credentials
// https://console.cloud.google.com/

// Use the correct Google Client ID - this MUST be set in environment variables
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '80236679267-iak8shrsske3tlqtgq2bp722ve7seto9.apps.googleusercontent.com';

// This is a demo client ID - replace with your own in production
// To get your own:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google+ API
// 4. Create credentials (OAuth 2.0 Client ID)
// 5. Add http://localhost:3000 to Authorized JavaScript origins
// 6. Add your production URL when deploying