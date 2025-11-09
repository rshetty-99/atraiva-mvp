import { Page, BrowserContext } from "@playwright/test";
import { existsSync, unlinkSync } from "fs";
import { join } from "path";
import { config } from "dotenv";

// Load environment variables from .env.local if it exists
const envPath = join(__dirname, "../../../.env.local");
if (existsSync(envPath)) {
  config({ path: envPath });
}

const AUTH_STATE_PATH = join(__dirname, "../.auth/auth-state.json");

/**
 * Authentication credentials for testing
 * These should be set via environment variables (.env.local) for security
 * Falls back to rajesh@atraiva.ai if not set
 */
const AUTH_EMAIL = process.env.TEST_AUTH_EMAIL || "rajesh@atraiva.ai";
const AUTH_PASSWORD = process.env.TEST_AUTH_PASSWORD || "password";

/**
 * Authenticate and save the authentication state
 * This will be reused across all dashboard tests
 */
export async function authenticateUser(page: Page): Promise<void> {
  console.log(`Authenticating as ${AUTH_EMAIL}...`);

  // Navigate to sign-in page
  // Use "load" instead of "networkidle" - Fast Refresh in dev mode prevents networkidle
  await page.goto("/sign-in", { waitUntil: "load", timeout: 30000 });

  // Wait for Clerk form to be ready
  await page.waitForLoadState("domcontentloaded");

  // Wait for Clerk to initialize (check for form elements)
  await page.waitForSelector(
    'input[type="email"], input[type="password"], input[placeholder*="email" i]',
    {
      timeout: 10000,
      state: "attached",
    }
  );

  // Step 1: Find and fill email input
  // Try multiple selectors for email field
  const emailSelectors = [
    'input[type="email"]',
    'input[name="identifier"]',
    'input[autocomplete="username"]',
    'input[placeholder*="email" i]',
    'input[placeholder*="username" i]',
  ];

  let emailInput = null;
  for (const selector of emailSelectors) {
    const inputs = page.locator(selector);
    const count = await inputs.count();
    if (count > 0) {
      emailInput = inputs.first();
      const isVisible = await emailInput.isVisible();
      if (isVisible) {
        break;
      }
    }
  }

  if (!emailInput || !(await emailInput.isVisible())) {
    throw new Error("Email input field not found or not visible");
  }

  await emailInput.fill(AUTH_EMAIL);
  await page.waitForTimeout(500); // Wait for form validation

  // Step 2: Click continue button for email
  // Try multiple selectors and ensure button is visible and enabled
  const continueSelectors = [
    'button[type="submit"]:visible',
    'button:has-text("Continue"):visible',
    '[data-testid="form-button-primary"]:visible',
    "button.cl-formButtonPrimary:visible",
  ];

  let continueButton = null;
  for (const selector of continueSelectors) {
    const buttons = page.locator(selector);
    const count = await buttons.count();
    if (count > 0) {
      const button = buttons.first();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      if (isVisible && isEnabled) {
        continueButton = button;
        break;
      }
    }
  }

  if (!continueButton || !(await continueButton.isVisible())) {
    // Try pressing Enter as fallback
    await emailInput.press("Enter");
  } else {
    await continueButton.click();
  }

  // Step 3: Wait for password field to appear
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  await page.waitForTimeout(500); // Wait for form transition

  // Step 4: Fill in password
  const passwordInput = page.locator('input[type="password"]:visible').first();
  await passwordInput.waitFor({ state: "visible", timeout: 5000 });
  await passwordInput.fill(AUTH_PASSWORD);
  await page.waitForTimeout(500); // Wait for form validation

  // Step 5: Submit the form
  // Try multiple selectors for submit button
  const submitSelectors = [
    'button[type="submit"]:visible:enabled',
    'button:has-text("Continue"):visible:enabled',
    'button:has-text("Sign in"):visible:enabled',
    '[data-testid="form-button-primary"]:visible:enabled',
    "button.cl-formButtonPrimary:visible:enabled",
  ];

  let submitButton = null;
  for (const selector of submitSelectors) {
    const buttons = page.locator(selector);
    const count = await buttons.count();
    if (count > 0) {
      const button = buttons.first();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      if (isVisible && isEnabled) {
        submitButton = button;
        break;
      }
    }
  }

  if (!submitButton || !(await submitButton.isVisible())) {
    // Try pressing Enter as fallback
    await passwordInput.press("Enter");
  } else {
    await submitButton.click();
  }

  // Step 6: Wait for redirect to dashboard (indicates successful authentication)
  try {
    await page.waitForURL(/\/dashboard/, { timeout: 30000 });
    console.log("Authentication successful!");
  } catch {
    // Check if we're already on a dashboard page or got redirected elsewhere
    const currentUrl = page.url();
    if (currentUrl.includes("/dashboard")) {
      console.log("Authentication successful! (already on dashboard)");
    } else {
      throw new Error(
        `Authentication may have failed. Current URL: ${currentUrl}`
      );
    }
  }
}

/**
 * Save authentication state to file for reuse
 */
export async function saveAuthState(context: BrowserContext): Promise<void> {
  const authDir = join(__dirname, "../.auth");
  if (!existsSync(authDir)) {
    const { mkdirSync } = await import("fs");
    mkdirSync(authDir, { recursive: true });
  }

  await context.storageState({ path: AUTH_STATE_PATH });
  console.log(`Authentication state saved to ${AUTH_STATE_PATH}`);
}

/**
 * Load saved authentication state
 */
export function loadAuthState(): string | null {
  if (existsSync(AUTH_STATE_PATH)) {
    return AUTH_STATE_PATH;
  }
  return null;
}

/**
 * Check if authentication state exists
 */
export function hasAuthState(): boolean {
  return existsSync(AUTH_STATE_PATH);
}

/**
 * Clear saved authentication state
 */
export function clearAuthState(): void {
  if (existsSync(AUTH_STATE_PATH)) {
    unlinkSync(AUTH_STATE_PATH);
    console.log("Authentication state cleared");
  }
}
