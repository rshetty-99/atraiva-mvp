# Firebase API Key Configuration Fix

## Error Message

```
FirebaseError: Installations: Create Installation request failed with error "400 INVALID_ARGUMENT: API key not valid. Please pass a valid API key." (installations/request-failed).
```

## Root Cause

This error occurs when:

1. Firebase API key is missing or invalid in environment variables
2. Firebase project is not properly configured
3. API key restrictions are preventing access

## Solution

### Step 1: Check Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id (optional)
```

### Step 2: Get Your Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select "Project settings"
5. Scroll down to "Your apps" section
6. Select your web app or create one
7. Copy the configuration values

Your config will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX",
};
```

### Step 3: Update `.env.local`

Replace the placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Step 4: Restart Development Server

```bash
# Stop the current dev server (Ctrl+C)
# Then restart
npm run dev
```

### Step 5: Verify Firebase Connection

Check `lib/firebase.ts` to ensure it's reading environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
```

## API Key Restrictions (Optional Security)

If you've set API key restrictions in Firebase Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" > "Credentials"
4. Find your API key
5. Click "Edit"
6. Under "Application restrictions":
   - For development: Select "None"
   - For production: Add your domain to "HTTP referrers"

## Firestore Security Rules

Ensure your Firestore has proper security rules in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // State Regulations - Read access for authenticated users
    match /state_regulations/{regulationId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['super_admin', 'platform_admin'];
    }
  }
}
```

Deploy rules:

```bash
firebase deploy --only firestore:rules
```

## Troubleshooting

### Still Getting API Key Error?

1. **Clear browser cache and localStorage**

   - Open DevTools (F12)
   - Application tab > Clear storage

2. **Check if environment variables are loaded**

   ```javascript
   console.log(
     "Firebase API Key:",
     process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.substring(0, 10)
   );
   ```

3. **Verify Firebase project is active**

   - Check Firebase Console billing status
   - Ensure project is not suspended

4. **Check browser console for more details**
   - Open DevTools (F12)
   - Look for additional error messages

### API Key Not Found in .env.local?

Make sure:

- File is named exactly `.env.local` (not `.env.txt`)
- File is in the project root directory
- All variables start with `NEXT_PUBLIC_` for client-side access
- No quotes around values
- No spaces around `=`

## Security Notes

⚠️ **Important Security Practices:**

1. **Never commit `.env.local` to version control**

   - Add `.env.local` to `.gitignore`

2. **Use different Firebase projects for development/production**

   ```env
   # Development (.env.local)
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-app-dev

   # Production (.env.production)
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-app-prod
   ```

3. **Implement proper Firestore security rules**

   - Never use `allow read, write: if true;` in production

4. **Set up API key restrictions for production**
   - Restrict to specific domains
   - Enable only necessary APIs

## State Regulations Data Structure

The `state_regulations` collection expects documents with this structure:

```json
{
  "state": "AR",
  "source_id": "https://...",
  "url": "https://...",
  "fetched_at": "2025-10-06T17:44:31.190253",
  "metadata": {},
  "parsed": {
    "breach_notification": {},
    "requirements": {},
    "timelines": [],
    "penalties": {},
    "exemptions": [],
    "definitions": {},
    "state": "AR",
    "url": "https://...",
    "metadata": {},
    "parsed_at": "2025-10-06T17:44:31.190571",
    "extractor": "ai_extractor",
    "law_type": "general_privacy",
    "industry": "general"
  },
  "keywords": [],
  "changes": ["definitions", "penalties"],
  "industry": "general",
  "scan_type": "full",
  "updated_at": "2025-10-06T17:44:31.191110"
}
```

## Quick Test

After configuration, test Firebase connection:

```javascript
// Add to any page temporarily
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testFirebase() {
  try {
    const snapshot = await getDocs(collection(db!, 'state_regulations'));
    console.log('✅ Firebase connected! Documents:', snapshot.size);
  } catch (error) {
    console.error('❌ Firebase error:', error);
  }
}
```

---

**Need Help?**

1. Check Firebase Console for project status
2. Verify billing is enabled (required for some features)
3. Review Firebase [documentation](https://firebase.google.com/docs)
4. Check Firestore data in Firebase Console
