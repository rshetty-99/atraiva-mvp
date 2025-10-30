# Firebase Setup Guide

## The Error

You're seeing this error because Firebase is trying to initialize but the API key is invalid or missing:

```
FirebaseError: Installations: Create Installation request failed with error "400 INVALID_ARGUMENT: API key not valid. Please pass a valid API key."
```

## Quick Fix

I've updated the Firebase configuration to handle missing environment variables gracefully. The app will now work without Firebase configured, but you'll see a warning in the console.

## To Properly Set Up Firebase

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Follow the setup wizard

### 2. Get Your Firebase Configuration

1. In your Firebase project, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web (</>) icon
4. Register your app with a nickname
5. Copy the configuration object

### 3. Update Your .env.local File

Add these variables to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-measurement-id

# Clerk Configuration (if using Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
```

### 4. Restart Your Development Server

After updating the environment variables:

```bash
npm run dev
```

## For Development Without Firebase

The app will now work without Firebase configured. You'll see a warning in the console, but the onboarding flow and other features will work normally.

## Firebase Services Used in This Project

- **Firestore**: Database for storing user data and configurations
- **Authentication**: User authentication (though Clerk is the primary auth provider)
- **Storage**: File storage for documents and assets
- **Analytics**: Usage analytics and performance monitoring

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure
- Use Firebase Security Rules to protect your data
- Consider using Firebase App Check for additional security

## Troubleshooting

- Make sure all environment variables start with `NEXT_PUBLIC_` for client-side access
- Verify your Firebase project is active and billing is set up if needed
- Check that your domain is authorized in Firebase Console > Authentication > Settings
- Ensure your API key has the correct permissions

## Need Help?

- Check the [Firebase Documentation](https://firebase.google.com/docs)
- Review the [Next.js Environment Variables Guide](https://nextjs.org/docs/basic-features/environment-variables)
- Contact the development team for assistance
