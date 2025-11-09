# Responsive Design Testing Guide

This guide explains how to test responsive design for both public and authenticated dashboard pages.

## Quick Start

### 1. Set Environment Variables

Create a `.env.local` file or export environment variables:

```bash
# Required for dashboard tests
export TEST_AUTH_EMAIL="rajesh@atraiva.ai"
export TEST_AUTH_PASSWORD="your_password"
```

### 2. Start Dev Server (if not already running)

```bash
# Start the dev server in a separate terminal
npm run dev

# The server should be running on http://localhost:3000
```

### 3. Run Tests

```bash
# Option A: Let Playwright start the server (default)
npm run test:responsive

# Option B: Use existing dev server (faster, recommended)
npm run test:responsive:skip-server

# Test with UI mode (recommended for first run)
npm run test:responsive:ui

# Test only public pages (no auth needed)
npx playwright test --config=playwright.responsive.config.ts --grep "Responsive Design - All Pages"
```

**Note**: If you're already running `npm run dev`, use `test:responsive:skip-server` to avoid port conflicts.

## How Authentication Works

### First Run
1. Tests automatically authenticate using `TEST_AUTH_EMAIL` and `TEST_AUTH_PASSWORD`
2. Authentication state is saved to `tests/.auth/auth-state.json`
3. This state contains cookies and localStorage needed for Clerk sessions

### Subsequent Runs
1. Tests reuse the saved authentication state
2. No re-authentication needed (faster tests)
3. If authentication fails, tests will skip dashboard pages with a warning

### Clearing Authentication State

If you need to re-authenticate (e.g., password changed):

```bash
# Delete the saved auth state
rm -rf tests/.auth/auth-state.json

# Or on Windows PowerShell
Remove-Item -Recurse -Force tests\.auth\auth-state.json
```

## Test Structure

### Public Pages (No Authentication)
- `/`, `/home`
- `/features`, `/resources`, `/aboutus`
- `/contact-us`, `/price`

### Dashboard Pages (Requires Authentication)
- `/dashboard`, `/admin/dashboard`
- `/org/dashboard`, `/partner/dashboard`
- `/admin/blog`, `/admin/members`
- `/admin/organization`, `/org/profile`
- `/org/incidents`, `/org/users`

## Viewport Sizes Tested

- **Mobile**: 375x812 (iPhone 12/13)
- **Mobile Landscape**: 812x375
- **Tablet**: 768x1024 (iPad)
- **Tablet Landscape**: 1024x768
- **Desktop**: 1280x720
- **Desktop Large**: 1920x1080

## Test Reports

After running tests, reports are generated in:
- **JSON**: `test-results/responsive/issues.json`
- **Markdown**: `test-results/responsive/issues.md`
- **Screenshots**: `test-results/responsive/*.png`

## Troubleshooting

### Web Server Timeout

**Symptoms**: `Error: Timed out waiting 120000ms from config.webServer`

**Solutions**:
1. **Option 1 (Recommended)**: Use existing dev server:
   ```bash
   # Start dev server manually
   npm run dev
   
   # Then run tests with SKIP_SERVER
   npm run test:responsive:skip-server
   ```

2. **Option 2**: Check if port 3000 is in use:
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3000
   
   # Kill the process if needed, then run tests normally
   npm run test:responsive
   ```

3. **Option 3**: Use a different port:
   ```bash
   # Set BASE_URL to match your dev server port
   $env:BASE_URL="http://localhost:3003"
   npm run test:responsive:skip-server
   ```

### Authentication Fails

**Symptoms**: Tests skip dashboard pages with "Authentication failed" message

**Solutions**:
1. Verify `TEST_AUTH_EMAIL` and `TEST_AUTH_PASSWORD` are set correctly
2. Check that the account exists in your Clerk development instance
3. Ensure the dev server is running on the correct port (default: 3000)
4. Check that Clerk environment variables are set correctly

### Tests Hang on Authentication

**Symptoms**: Tests hang waiting for authentication

**Solutions**:
1. Check the sign-in page hasn't changed (selectors may need updating)
2. Verify Clerk is configured correctly in `.env.local`
3. Try clearing the auth state and re-authenticating
4. Run with `--headed` flag to see what's happening:
   ```bash
   npx playwright test tests/responsive-all-pages.spec.ts --headed
   ```

### Selectors Not Found

If Clerk updates their UI, you may need to update selectors in `tests/helpers/auth-setup.ts`:

```typescript
// Update these selectors if Clerk changes their UI
const emailInput = page.locator('input[type="email"]').first();
const passwordInput = page.locator('input[type="password"]').first();
const continueButton = page.locator('button:has-text("Continue")').first();
```

## Best Practices

1. **Run tests regularly**: Catch responsive issues early
2. **Review screenshots**: Visual inspection helps identify issues
3. **Fix high-severity issues first**: Focus on horizontal overflow
4. **Test on multiple viewports**: Especially mobile (375px)
5. **Keep auth credentials secure**: Don't commit `.auth/` directory

## CI/CD Integration

For CI/CD, set environment variables as secrets:

```yaml
env:
  TEST_AUTH_EMAIL: ${{ secrets.TEST_AUTH_EMAIL }}
  TEST_AUTH_PASSWORD: ${{ secrets.TEST_AUTH_PASSWORD }}
```

The authentication state will be recreated on each CI run (since the file won't persist between runs).
