# Test Helpers

## Authentication Setup (`auth-setup.ts`)

This helper handles authentication for dashboard page tests.

### Environment Variables

Set these environment variables before running responsive tests:

```bash
# Required for dashboard tests
export TEST_AUTH_EMAIL="rajesh@atraiva.ai"
export TEST_AUTH_PASSWORD="your_password"

# Or create a .env.local file in the project root
TEST_AUTH_EMAIL=rajesh@atraiva.ai
TEST_AUTH_PASSWORD=your_password
```

### How It Works

1. **First Run**: Authenticates with Clerk and saves the authentication state to `.auth/auth-state.json`
2. **Subsequent Runs**: Reuses the saved authentication state (no need to re-authenticate)
3. **Authentication State**: Contains cookies and localStorage that Clerk uses to maintain the session

### Usage

The authentication helper is automatically used by the responsive test suite. You don't need to call it manually.

### Manual Authentication (if needed)

```typescript
import { authenticateUser, saveAuthState } from './helpers/auth-setup';

// In your test
const page = await browser.newPage();
await authenticateUser(page);
await saveAuthState(page.context());
```

### Clearing Authentication State

If you need to re-authenticate (e.g., password changed):

```bash
# Delete the saved auth state
rm -rf tests/.auth/auth-state.json

# Or on Windows
del tests\.auth\auth-state.json
```

### Troubleshooting

**Authentication fails:**
- Check that `TEST_AUTH_EMAIL` and `TEST_AUTH_PASSWORD` are set correctly
- Verify the account exists in your Clerk development instance
- Check that the sign-in page hasn't changed (selectors may need updating)

**Tests skip authentication:**
- Check the console output for authentication errors
- Ensure the dev server is running on the correct port
- Verify Clerk environment variables are set correctly
