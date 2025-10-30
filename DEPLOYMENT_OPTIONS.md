# Deployment Options for Atraiva

## ⚠️ Why Static Export Doesn't Work

Your application **cannot use static export** (`output: 'export'`) because it requires:

1. **Middleware** - Used by Clerk for authentication (requires Node.js runtime)
2. **API Routes** - Backend endpoints for members, registrations, invitations, etc.
3. **Server-Side Rendering** - Dynamic content and authentication

Static export only works for purely client-side apps with no server features.

## ✅ Recommended Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Best for**: Next.js apps with full features (middleware, API routes, SSR)

#### Why Vercel?

- Created by Next.js team
- Zero configuration needed
- Automatic deployment on git push
- Built-in CI/CD
- Edge functions support
- Free tier available

#### Deployment Steps

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **Set Environment Variables** in Vercel Dashboard:

   - Go to your project → Settings → Environment Variables
   - Add all your `NEXT_PUBLIC_*` variables
   - Add Clerk keys
   - Add Firebase keys

5. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

#### Vercel Dashboard Setup

1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Configure environment variables
4. Deploy automatically on every push

---

### Option 2: Firebase Hosting with Cloud Functions

**Best for**: Apps already using Firebase services

#### Why Firebase + Cloud Functions?

- Use existing Firebase project
- Firestore already integrated
- Keep all services in one place

#### Important Notes

⚠️ Requires Firebase **Blaze Plan** (pay-as-you-go) for Cloud Functions
⚠️ More complex setup than Vercel

#### Deployment Steps

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:

   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting & Functions**:

   ```bash
   firebase init hosting
   firebase init functions
   ```

4. **Configure for Next.js**:

   Install Next.js Firebase adapter:

   ```bash
   npm install -D @vercel/next
   ```

   Update `firebase.json`:

   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "function": "nextjsServer"
         }
       ]
     },
     "functions": {
       "source": ".",
       "runtime": "nodejs20"
     }
   }
   ```

5. **Create Cloud Function** (`functions/index.js`):

   ```javascript
   const { onRequest } = require("firebase-functions/v2/https");
   const next = require("next");

   const dev = process.env.NODE_ENV !== "production";
   const app = next({ dev, conf: { distDir: ".next" } });
   const handle = app.getRequestHandler();

   exports.nextjsServer = onRequest(async (req, res) => {
     await app.prepare();
     return handle(req, res);
   });
   ```

6. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

---

### Option 3: Self-Hosted (VPS/Cloud)

**Best for**: Full control and custom infrastructure

#### Options

- AWS EC2
- Google Cloud Compute Engine
- DigitalOcean Droplets
- Linode
- Azure Virtual Machines

#### Deployment Steps

1. **Build your app**:

   ```bash
   npm run build
   ```

2. **Start production server**:

   ```bash
   npm start
   ```

3. **Use Process Manager** (PM2):

   ```bash
   npm install -g pm2
   pm2 start npm --name "atraiva" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up Nginx** as reverse proxy:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set up SSL** with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## 🔧 Current Configuration

### Removed from `next.config.ts`:

```typescript
// ❌ Removed - Incompatible with middleware
output: "export";

// ❌ Removed - Not needed anymore
trailingSlash: true;

// ❌ Removed - Using optimized images now
images: {
  unoptimized: true;
}
```

### Current Configuration:

```typescript
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.clerk.com", "images.clerk.dev"], // Clerk images
  },
  // Temporary - remove after fixing linter errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};
```

---

## 🚀 Quick Start - Vercel Deployment

**Fastest way to deploy right now:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy (follow prompts)
vercel

# 4. Add environment variables in Vercel dashboard
# 5. Deploy to production
vercel --prod
```

That's it! Your app will be live with a `*.vercel.app` URL.

---

## 📋 Environment Variables Checklist

Make sure to set these in your deployment platform:

### Clerk Authentication

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

### Firebase

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional)

### Application

- `NEXT_PUBLIC_APP_URL` (your production URL)
- `NODE_ENV=production`

---

## ⚡ Build Command

For all platforms:

```bash
npm run build
```

This will:

1. Compile TypeScript
2. Build Next.js app
3. Generate optimized production bundle
4. Prepare for deployment

---

## 🧪 Test Build Locally

Before deploying, test the production build:

```bash
# Build
npm run build

# Start production server locally
npm start

# Visit http://localhost:3000
```

---

## 🐛 Troubleshooting

### Build Fails

1. Check that all environment variables are set
2. Run `npm install` to ensure dependencies are installed
3. Check for TypeScript/ESLint errors (temporarily disabled in config)

### Middleware Error

- Ensure `output: 'export'` is NOT in `next.config.ts`
- Middleware requires server runtime

### API Routes Not Working

- API routes require server-side platform (Vercel, Cloud Functions, VPS)
- Cannot use static hosting (GitHub Pages, Netlify static, etc.)

### Authentication Issues

- Verify Clerk environment variables are set
- Check Clerk dashboard for authorized domains
- Ensure callback URLs are correct

---

## 📊 Platform Comparison

| Feature          | Vercel             | Firebase + Functions | Self-Hosted VPS   |
| ---------------- | ------------------ | -------------------- | ----------------- |
| Setup Difficulty | ⭐ Easy            | ⭐⭐⭐ Complex       | ⭐⭐⭐⭐ Advanced |
| Cost             | Free tier → $20/mo | Pay-as-you-go        | $5-50/mo          |
| Auto Scaling     | ✅ Yes             | ✅ Yes               | ❌ Manual         |
| CI/CD            | ✅ Built-in        | ⚠️ Manual            | ❌ Manual         |
| Edge Functions   | ✅ Yes             | ✅ Yes (limited)     | ❌ No             |
| Custom Domain    | ✅ Easy            | ✅ Easy              | ⚠️ Manual         |
| SSL              | ✅ Auto            | ✅ Auto              | ⚠️ Manual         |
| Monitoring       | ✅ Built-in        | ✅ Google Cloud      | ⚠️ Manual         |
| Support          | ✅ Good            | ⚠️ Forums            | ❌ Self-support   |

---

## ✅ Recommendation

**Deploy to Vercel** for the fastest, easiest deployment with full Next.js feature support.

**Use Firebase** only if you need Firebase-specific features like Cloud Functions integration or are already heavily invested in the Firebase ecosystem.

---

**Questions?**

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Firebase Hosting: https://firebase.google.com/docs/hosting

---

**Updated**: October 19, 2025  
**Next.js Version**: 15.x  
**Deployment Status**: Ready for Vercel or Firebase with Cloud Functions
