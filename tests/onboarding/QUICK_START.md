# Onboarding Tests - Quick Start Guide 🚀

## 1. Setup (First Time Only)

```bash
# Ensure you're in the project root
cd C:\src\AI\techsamurai\claudecode\atraiva\mockup\final\atraiva

# Install Playwright browsers
npx playwright install --with-deps
```

## 2. Configure Environment

Create or update `.env` (or `.env.local` in the project root):
```env
# Required
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional (for auto-issue creation)
GITHUB_TOKEN=your_github_token

# Base URL (default: http://localhost:3001)
BASE_URL=http://localhost:3001
HEADLESS=false
SLOW_MO=0
AUTO_CLEANUP=false
SKIP_SERVER=false
```

## 3. Start Dev Server

```bash
npm run dev
# Wait for "Ready on http://localhost:3001"
```

## 4. Seed Test Data (Optional but Recommended)

```bash
# Seed 5 enterprises + 20 users
npx ts-node tests/onboarding/helpers/data-seeder.ts
```

This creates:
- 5 enterprises across different categories
- 20 users (4 per enterprise) with different roles
- Data in both Clerk and Firestore

## 5. Run Tests

### Option A: Run All Tests
```bash
npx playwright test --config=tests/onboarding/playwright.config.ts
```

### Option B: Use UI Mode (Recommended for First Run)
```bash
npx playwright test --config=tests/onboarding/playwright.config.ts --ui
```

### Option C: Run Specific Test Suite
```bash
# Form validation only
npx playwright test tests/onboarding/unit/form-validation.spec.ts

# Responsive design only
npx playwright test tests/onboarding/unit/responsive-design.spec.ts

# Theme visibility only
npx playwright test tests/onboarding/unit/theme-visibility.spec.ts
```

## 6. View Results

### HTML Report
```bash
npx playwright show-report tests/onboarding/reports/html
```

### Trace Viewer (for debugging failures)
```bash
npx playwright show-trace tests/onboarding/reports/test-artifacts/trace.zip
```

## 📊 What Gets Tested

✅ **Form Validation** (30+ tests)
- All input field validations
- Error message quality
- Form submission states

✅ **Responsive Design** (50+ tests across 7 viewports)
- Mobile, Tablet, Desktop
- Touch targets
- Layout overflow
- Element visibility

✅ **Theme Visibility** (40+ tests)
- Dark mode contrast
- Light mode contrast
- Color accessibility (WCAG AA)

✅ **Integration** (10+ tests)
- Clerk authentication
- Firestore data persistence
- User login flow

## 🐛 Automatic Issue Creation

If a test fails:
1. Screenshot is captured
2. Trace is saved
3. GitHub issue is created automatically (if `GITHUB_TOKEN` is set)
4. Issue includes all debug information

## 📝 Test Data

**Enterprises:**
- MediCare Health Systems (Healthcare)
- SecureBank Financial Group (Financial)
- RetailMart Corporation (Retail)
- TechInnovate Solutions (Technology)
- Global Education Institute (Education)

**Test Login Credentials:**
```
Email: james.smith@medicare-health.com
Password: Test@super_admin123!

Email: mary.johnson@medicare-health.com
Password: Test@platform_admin123!
```

## ⚡ Quick Commands

```bash
# Run tests with UI (interactive)
npx playwright test --config=tests/onboarding/playwright.config.ts --ui

# Run tests in headed mode (see browser)
npx playwright test --config=tests/onboarding/playwright.config.ts --headed

# Run tests in debug mode (step through)
PWDEBUG=1 npx playwright test --config=tests/onboarding/playwright.config.ts

# Generate test code (record actions)
npx playwright codegen http://localhost:3001/onboarding

# Run only form validation tests
npx playwright test tests/onboarding/unit/form-validation

# Run only on Chrome
npx playwright test --config=tests/onboarding/playwright.config.ts --project=chromium
```

## 🎯 Next Steps

1. Review generated test reports
2. Fix any issues found
3. Check GitHub for auto-created issues
4. Verify data in Clerk dashboard
5. Verify data in Firestore console

## 📚 Full Documentation

See [README.md](./README.md) for complete documentation.

---

Need help? Check the [Playwright Documentation](https://playwright.dev) or the blog post: [The Complete Playwright End-to-End Story](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows)

