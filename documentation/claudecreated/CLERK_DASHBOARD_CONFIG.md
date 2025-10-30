# Clerk Configuration for Custom Pages (Official Instructions)

## Issue
When clicking "Get Started" or social login buttons, users are redirected to Clerk's hosted pages (like `https://evolving-sponge-78.accounts.dev/sign-up`) instead of our custom pages.

## Solution
Based on official Clerk documentation, this issue is resolved through **environment variables** and **component configuration**. Clerk automatically uses path-based routing for Next.js applications.

## Official Solution (No Dashboard Changes Required)

According to Clerk's official documentation, **Next.js applications automatically use path-based routing** and don't require dashboard configuration changes. The solution is purely through environment variables and component props.

### ✅ Environment Variables (Already Configured)

Our `.env.local` now includes the correct variables from Clerk's documentation:

```env
# Sign-in/Sign-up Page URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Force Redirect URLs (Server-side)
CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard

# Fallback URLs (Server-side)
CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

### ✅ Component Configuration (Already Configured)

Our sign-in and sign-up components are properly configured with:
- `routing="path"` (path-based routing)
- `path="/sign-in"` and `path="/sign-up"`
- `afterSignInUrl="/dashboard"` and `afterSignUpUrl="/dashboard"`
- `forceRedirectUrl="/dashboard"` for explicit redirection

### ✅ ClerkProvider Configuration (Already Configured)

Our root layout includes proper ClerkProvider configuration:
- `signInUrl="/sign-in"`
- `signUpUrl="/sign-up"`
- `afterSignInUrl="/dashboard"`
- `afterSignUpUrl="/dashboard"`

### 4. Configure Social Providers (CRITICAL)
1. Navigate to **User & Authentication** → **Social Connections**
2. For each enabled provider (Google, GitHub, etc.):
   - Make sure redirect URLs include your localhost/domain
   - Add: `http://localhost:3009/sign-up/sso-callback`
   - Add: `http://localhost:3009/sign-in/sso-callback`

### 5. Configure Username Requirements (CRITICAL FOR SOCIAL AUTH)
1. Navigate to **User & Authentication** → **Email, Phone, Username**
2. **Username Settings**:
   - Set "Username requirement" to **OPTIONAL** (not required)
   - This prevents Clerk from redirecting to hosted pages to collect username after social sign-up
3. **Email Settings**:
   - Ensure "Email address" is set to **REQUIRED**
   - Enable "Verify at sign-up" if desired

### 6. Path-Based Routing Configuration (ESSENTIAL)
1. Navigate to **Paths**
2. Ensure **"Path-based routing"** is selected (NOT "Hosted pages")
3. Set the following paths:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - User profile URL: `/user-profile`
   - After sign-in URL: `/dashboard`
   - After sign-up URL: `/dashboard`

### 5. Session & Security Settings
1. Go to **User & Authentication** → **Sessions**
2. Ensure these are set:
   - **Session lifetime:** As desired (default is fine)
   - **Multi-session:** Enable if you want multiple sessions

## Environment Variables (Already Configured)

These environment variables are already set in `.env.local`:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Verification Steps

After making these changes:

1. **Clear browser cache** and cookies for localhost:3008
2. **Restart the development server**: `npm run dev`
3. **Test the flow**:
   - Click "Get Started" from homepage
   - Should go to `http://localhost:3008/sign-up` (NOT Clerk hosted page)
   - Try social login - should use SSO callback correctly
   - After authentication, should redirect to `/dashboard`

## Common Issues

### Still Redirecting to Hosted Pages?
- Double-check that path-based routing is selected (not hosted)
- Make sure you saved the changes in Clerk Dashboard
- Clear browser cache completely
- Check that the correct publishable key is being used

### Social Login Not Working?
- Verify SSO callback routes exist: `/sign-up/sso-callback` and `/sign-in/sso-callback`
- Check that social provider redirect URLs include your domain
- Ensure callback routes are created (already done in our setup)

### Environment Variables Not Taking Effect?
- Restart the development server
- Check that `.env.local` file is in the project root
- Verify no typos in environment variable names

## Production Setup

For production deployment:

1. Update Clerk Dashboard URLs to use your production domain
2. Update environment variables for production
3. Test the entire authentication flow in production environment

## Additional Notes

- Our custom pages are located at `/src/app/sign-in/page.tsx` and `/src/app/sign-up/page.tsx`
- SSO callback handlers are at `/src/app/sign-in/sso-callback/page.tsx` and `/src/app/sign-up/sso-callback/page.tsx`
- The AuthLayout provides consistent header/footer across auth pages
- All styling is customized to match the Atraiva.ai brand