# Firebase Hosting Deployment Guide for Atraiva

## 🚀 Quick Deployment

Your application is now configured for Firebase Hosting deployment!

---

## 📋 Prerequisites

✅ Firebase CLI installed (version 14.0.1)  
✅ Logged in to Firebase  
✅ Next.js configured for static export  
✅ Build scripts added to package.json

---

## 🎯 Step 1: Choose/Create Firebase Project

You have 14 existing Firebase projects. Choose one of these options:

### Option A: Use Existing Project

If you want to use an existing project from your list:

- `aiproally`
- `tipcyber-dev` (recommended for development)
- `tipcyber-uat` (recommended for staging)
- `tipcyber-113b1` (recommended for production)
- Or any other project from your list

### Option B: Create New Project (Recommended)

```bash
# Create a new Firebase project for Atraiva
firebase projects:create atraiva-app
```

---

## 🎯 Step 2: Initialize Firebase Project

### Create `.firebaserc` file

Choose one of these commands based on your preferred project:

```bash
# For a new Atraiva project
firebase use --add atraiva-app

# OR use an existing project (replace PROJECT_ID)
firebase use --add tipcyber-dev
```

This will create `.firebaserc` automatically.

**OR manually create `.firebaserc`:**

```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

---

## 🎯 Step 3: Build for Production

```bash
# Build the application (creates static export in 'out' directory)
npm run build
```

This will:

- ✅ Compile Next.js with static export
- ✅ Generate optimized static files
- ✅ Output to `out/` directory
- ⚠️ Show warnings (non-critical, won't prevent deployment)

---

## 🎯 Step 4: Deploy to Firebase Hosting

### Deploy Hosting Only (Fastest)

```bash
npm run deploy
```

### Deploy Everything (Hosting + Firestore Rules + Storage)

```bash
npm run deploy:full
```

### Manual Deployment

```bash
# Deploy hosting only
firebase deploy --only hosting

# Deploy specific services
firebase deploy --only hosting,firestore
```

---

## 📦 What Gets Deployed

From the `out/` directory:

- ✅ HTML files
- ✅ CSS files
- ✅ JavaScript files
- ✅ Images and assets
- ✅ Public files
- ✅ Next.js static pages

---

## ⚙️ Configuration Files

### `next.config.ts` (Updated)

```typescript
{
  output: 'export',           // Static export
  images: { unoptimized: true }, // Disable image optimization
  trailingSlash: true,        // Better routing
  reactStrictMode: true       // Production optimization
}
```

### `firebase.json` (Already Configured)

```json
{
  "hosting": {
    "public": "out",          // Deploy from 'out' directory
    "rewrites": [...],        // SPA routing
    "headers": [...]          // Caching rules
  }
}
```

### `package.json` (New Scripts)

```json
{
  "scripts": {
    "export": "next build", // Build static export
    "deploy": "npm run export && firebase deploy --only hosting", // Deploy hosting
    "deploy:full": "npm run export && firebase deploy" // Deploy everything
  }
}
```

---

## 🔍 Verify Deployment

After deployment completes, Firebase will show:

```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/YOUR_PROJECT_ID/overview
Hosting URL: https://YOUR_PROJECT_ID.web.app
```

Visit your Hosting URL to see your live application!

---

## 🚨 Important Notes

### API Routes & Server-Side Features

⚠️ **Static export limitations:**

With `output: 'export'`, Next.js creates a static site. This means:

- ❌ API routes (`/api/*`) won't work
- ❌ Server-side rendering (SSR) won't work
- ❌ Incremental Static Regeneration (ISR) won't work
- ✅ Client-side routing works
- ✅ Static pages work
- ✅ Client-side API calls work (to external APIs)

### If You Need API Routes

If your app uses API routes (`src/app/api/*`), you have two options:

#### Option 1: Move APIs to External Service

- Deploy APIs to Vercel, Netlify, or similar
- Update client code to call external API URL

#### Option 2: Use Firebase Functions (Advanced)

Requires changing from static export to Firebase Functions:

```bash
npm install firebase-functions firebase-admin
# Configure Next.js for Firebase Functions
# Update firebase.json for functions
```

---

## 🎨 Environment Variables

For production deployment, set Firebase environment variables:

```bash
# Set environment variables for Firebase Functions (if using)
firebase functions:config:set someservice.key="THE API KEY"

# OR use .env files (for client-side vars)
# Add to .env.production
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: "${{ secrets.GITHUB_TOKEN }}"
          firebaseServiceAccount: "${{ secrets.FIREBASE_SERVICE_ACCOUNT }}"
          projectId: your-project-id
```

---

## 📊 Deployment Checklist

Before deploying:

- [ ] Firebase project selected (`.firebaserc` created)
- [ ] Environment variables configured
- [ ] Build completes successfully (`npm run build`)
- [ ] Test locally: `npx serve out` (install serve: `npm i -g serve`)
- [ ] Review build output in `out/` directory
- [ ] Check firebase.json configuration
- [ ] Verify Firestore rules if using database
- [ ] Update security rules for production

---

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next out
npm run build
```

### Deployment Fails

```bash
# Check Firebase login
firebase login

# Check project
firebase projects:list
firebase use --add

# Deploy with debug
firebase deploy --only hosting --debug
```

### Images Not Loading

- Ensure `images: { unoptimized: true }` in next.config.ts
- Check image paths are relative
- Verify images are in public/ directory

### 404 Errors

- Check firebase.json has proper rewrites
- Ensure `trailingSlash: true` in next.config.ts

---

## 🎯 Quick Reference

```bash
# Build
npm run build

# Deploy (hosting only)
npm run deploy

# Deploy (everything)
npm run deploy:full

# View logs
firebase hosting:channel:list

# Rollback (if needed)
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## 🌟 Next Steps After Deployment

1. **Custom Domain** (Optional)

   ```bash
   firebase hosting:sites:list
   # Follow instructions in Firebase Console
   ```

2. **SSL Certificate** (Automatic)

   - Firebase automatically provisions SSL
   - HTTPS enabled by default

3. **Performance Monitoring**

   - Enable in Firebase Console
   - Add Firebase Performance SDK

4. **Analytics**
   - Enable Firebase Analytics
   - Track user behavior

---

## 📞 Need Help?

- Firebase Docs: https://firebase.google.com/docs/hosting
- Next.js Static Export: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
- Firebase CLI Reference: https://firebase.google.com/docs/cli

---

## ✅ Summary

Your application is **ready to deploy**! Just run:

```bash
# 1. Choose project
firebase use --add YOUR_PROJECT_ID

# 2. Build and deploy
npm run deploy
```

That's it! 🚀

---

_Last Updated: [Current Date]_  
_Status: ✅ Ready for Deployment_
