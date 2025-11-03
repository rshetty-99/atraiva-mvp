# Onboarding Test Suite 🧪

Comprehensive testing framework for the Atraiva onboarding feature using Playwright, covering form validation, responsive design, theme visibility, and Clerk/Firestore integration.

## 📁 Folder Structure

```
tests/onboarding/
├── unit/                           # Unit tests
│   ├── form-validation.spec.ts    # Form field validation tests
│   ├── responsive-design.spec.ts  # Responsive UI tests
│   └── theme-visibility.spec.ts   # Dark/light mode tests
├── integration/                    # Integration tests
│   └── clerk-firestore-integration.spec.ts
├── e2e/                           # End-to-end tests (future)
├── fixtures/                      # Test data
│   └── mock-data-generator.ts    # Generates 5 enterprises + 20 users
├── helpers/                       # Utility functions
│   ├── clerk-helper.ts           # Clerk API interactions
│   ├── firestore-helper.ts       # Firestore operations
│   ├── github-issue-reporter.ts  # Automatic issue creation
│   ├── data-seeder.ts            # Seeds test data
│   ├── global-setup.ts           # Test setup
│   └── global-teardown.ts        # Test cleanup
├── reports/                       # Test reports and artifacts
├── playwright.config.ts           # Playwright configuration
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file with:
   ```env
   # Clerk
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # GitHub (optional - for auto-issue creation)
   GITHUB_TOKEN=your_github_personal_access_token
   
   # Firebase (should be configured in your project)
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   # ... other Firebase config

   # Base URL and test behavior (used by CI and local runs)
   BASE_URL=http://localhost:3001
   HEADLESS=false
   SLOW_MO=0
   AUTO_CLEANUP=false
   SKIP_SERVER=false
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # Server should be running on http://localhost:3001
   ```

### Running Tests

#### Run All Tests
```bash
npx playwright test --config=tests/onboarding/playwright.config.ts
```

#### Run Specific Test Suite
```bash
# Form validation tests
npx playwright test tests/onboarding/unit/form-validation.spec.ts

# Responsive design tests
npx playwright test tests/onboarding/unit/responsive-design.spec.ts

# Theme visibility tests
npx playwright test tests/onboarding/unit/theme-visibility.spec.ts

# Integration tests
npx playwright test tests/onboarding/integration/
```

#### Run Tests in UI Mode (Recommended for Development)
```bash
npx playwright test --config=tests/onboarding/playwright.config.ts --ui
```

#### Run Tests with Codegen (Record New Tests)
```bash
npx playwright codegen http://localhost:3001/onboarding
```

#### View Test Results
```bash
# Open HTML report
npx playwright show-report tests/onboarding/reports/html

# View trace for specific test
npx playwright show-trace tests/onboarding/reports/test-artifacts/trace.zip
```

## 📊 Test Coverage

### 1. Form Validation Tests (`unit/form-validation.spec.ts`)

Tests all form fields in the onboarding flow:

- **Organization Setup**
  - ✅ Organization name required
  - ✅ Minimum length validation
  - ✅ Email format validation
  - ✅ Phone number format
  - ✅ Industry selection required

- **User Information**
  - ✅ First name required
  - ✅ Last name required
  - ✅ Password requirements

- **Role Selection**
  - ✅ Role selection required

- **Form Submission**
  - ✅ Submit button state
  - ✅ Loading states

- **Error Messages**
  - ✅ Proper English grammar
  - ✅ Clear and actionable
  - ✅ No developer jargon

### 2. Responsive Design Tests (`unit/responsive-design.spec.ts`)

Tests UI across multiple viewports:

**Viewports Tested:**
- 📱 Mobile Portrait (375x812)
- 📱 Mobile Landscape (812x375)
- 📱 Tablet Portrait (768x1024)
- 📱 Tablet Landscape (1024x768)
- 💻 Desktop Small (1280x720)
- 💻 Desktop Large (1920x1080)
- 🖥️ Desktop 4K (3840x2160)

**Device Emulation:**
- iPhone 13
- iPad Pro

**Tests:**
- ✅ No horizontal scroll overflow
- ✅ Form elements properly sized
- ✅ Touch targets meet minimum size (44px on mobile)
- ✅ Navigation elements accessible
- ✅ Text not truncated
- ✅ Images scale correctly
- ✅ Modals fit within viewport
- ✅ No overlapping elements

### 3. Theme Visibility Tests (`unit/theme-visibility.spec.ts`)

Tests both dark and light modes:

**Light Mode Tests:**
- ✅ Text readable against background (WCAG AA contrast)
- ✅ Input fields clearly visible
- ✅ Buttons have clear affordance
- ✅ Error messages visible
- ✅ Links distinguishable
- ✅ Focus indicators visible
- ✅ Disabled elements clearly indicated
- ✅ Placeholder text visible but distinct

**Dark Mode Tests:**
- ✅ Same tests as light mode
- ✅ Theme switching maintains visibility

### 4. Integration Tests (`integration/clerk-firestore-integration.spec.ts`)

Tests Clerk and Firestore integration:

- ✅ Organization creation in both systems
- ✅ User creation in both systems
- ✅ User-organization linking
- ✅ Authentication flow
- ✅ Data synchronization

## 🎭 Mock Data

The test suite includes a comprehensive mock data generator that creates:

### Enterprises (5 total)
1. **MediCare Health Systems** (Healthcare)
2. **SecureBank Financial Group** (Financial Services)
3. **RetailMart Corporation** (Retail)
4. **TechInnovate Solutions** (Technology)
5. **Global Education Institute** (Education)

### Users (20 total - 4 per enterprise)
Each enterprise has:
- 1 Super Admin
- 1 Platform Admin
- 1 Org Admin
- 1 User

**Example:**
- james.smith@medicare-health.com (Super Admin)
- mary.johnson@medicare-health.com (Platform Admin)
- john.williams@medicare-health.com (Org Admin)
- patricia.brown@medicare-health.com (User)

### Passwords
All test users use the password: `Test@{role}123!`
- Example: `Test@super_admin123!`, `Test@user123!`

## 🌱 Seeding Test Data

### Generate Mock Data
```typescript
import { generateAllMockData } from './fixtures/mock-data-generator';

const mockData = generateAllMockData();
console.log(mockData);
```

### Seed Data to Clerk and Firestore
```bash
# Run the data seeder
npx ts-node tests/onboarding/helpers/data-seeder.ts
```

Or programmatically:
```typescript
import { seedAllTestData } from './helpers/data-seeder';

const result = await seedAllTestData();
console.log(result);
```

### Manual Verification

After seeding:
1. **Check Clerk Dashboard**: https://dashboard.clerk.com
   - Verify users and organizations created
   
2. **Check Firestore Console**: Firebase Console
   - Verify `users` collection
   - Verify `organizations` collection

3. **Test Login**: http://localhost:3001/sign-in
   - Try logging in with test credentials

## 🐛 Automatic Issue Creation

Failed tests automatically create GitHub issues with:
- ✅ Test name and file
- ✅ Error message and stack trace
- ✅ Screenshot
- ✅ Video recording (if available)
- ✅ Trace viewer link
- ✅ Reproduction steps
- ✅ Appropriate labels

**Setup:**
1. Create a GitHub Personal Access Token with `repo` scope
2. Add to `.env`: `GITHUB_TOKEN=your_token`
3. Issues will be created automatically at: https://github.com/rshetty-99/atraiva-mvp/issues

## 📈 Viewing Reports

### HTML Report
```bash
npx playwright show-report tests/onboarding/reports/html
```

### Trace Viewer (Best for Debugging)
```bash
npx playwright show-trace tests/onboarding/reports/test-artifacts/trace.zip
```

Features:
- 🎬 Video playback
- 📸 Screenshots at each step
- 🌐 Network activity
- 📝 Console logs
- 🎯 Action timeline

### JSON Report
```bash
cat tests/onboarding/reports/test-results.json | jq
```

## 🛠️ Advanced Usage

### Run Tests in Debug Mode
```bash
PWDEBUG=1 npx playwright test --config=tests/onboarding/playwright.config.ts
```

### Run Tests in Headed Mode
```bash
npx playwright test --config=tests/onboarding/playwright.config.ts --headed
```

### Run Tests with Slow Motion
```bash
SLOW_MO=1000 npx playwright test --config=tests/onboarding/playwright.config.ts
```

### Run Specific Browser
```bash
npx playwright test --config=tests/onboarding/playwright.config.ts --project=chromium
npx playwright test --config=tests/onboarding/playwright.config.ts --project=firefox
npx playwright test --config=tests/onboarding/playwright.config.ts --project=webkit
npx playwright test --config=tests/onboarding/playwright.config.ts --project=mobile-chrome
```

### Run Tests on Specific Viewport
```typescript
test.use({ viewport: { width: 375, height: 812 } });
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Clerk API Documentation](https://clerk.com/docs/reference/backend-api)
- [Firebase Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Microsoft Playwright Blog](https://developer.microsoft.com/blog/the-complete-playwright-end-to-end-story-tools-ai-and-real-world-workflows)

## ✅ Test Checklist

Before running the full test suite:

- [ ] Development server running on port 3001
- [ ] Environment variables configured
- [ ] Firebase initialized
- [ ] Clerk configured
- [ ] Test data seeded (if needed)
- [ ] GitHub token configured (optional)

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Onboarding Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - name: Run tests
        env:
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx playwright test --config=tests/onboarding/playwright.config.ts
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: tests/onboarding/reports/
```

## 🤝 Contributing

To add new tests:

1. Create test file in appropriate directory
2. Follow naming convention: `*.spec.ts`
3. Use helper functions from `helpers/`
4. Report failures using GitHub issue reporter
5. Update this README

## 📝 License

Same as main project

---

**Built with ❤️ using Playwright and TypeScript**

