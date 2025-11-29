import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { config } from "dotenv";

/**
 * Load environment variables from .env.local or .env files
 * This ensures Playwright tests can access environment variables
 */
const envPath = path.resolve(__dirname, "../../.env.local");
const envFallback = path.resolve(__dirname, "../../.env");

// Try to load .env.local first, then fallback to .env
// Use override: false to not override existing env vars, and error: false to not throw if file doesn't exist
const envLocalResult = config({ path: envPath, override: false, error: false });
const envResult = config({ path: envFallback, override: false, error: false });

// Debug: Log if variables were loaded (only in non-CI environments)
if (!process.env.CI && (envLocalResult.parsed || envResult.parsed)) {
  const loadedFile = envLocalResult.parsed ? '.env.local' : '.env';
  const hasClerkKey = !!process.env.CLERK_SECRET_KEY;
  console.log(`[Playwright Config] Loaded ${loadedFile}, CLERK_SECRET_KEY present: ${hasClerkKey}`);
}

/**
 * Playwright Configuration for Onboarding Tests
 * Comprehensive testing setup with multiple browsers, devices, and features
 */

export default defineConfig({
  testDir: "./",
  testMatch: ["**/*.spec.ts"],

  // Test execution settings
  timeout: 60 * 1000, // 60 seconds per test
  expect: {
    timeout: 10 * 1000, // 10 seconds for assertions
  },

  // Parallel execution
  fullyParallel: false, // Run tests sequentially to avoid conflicts
  workers: 1, // Single worker to avoid rate limiting on APIs

  // Retries
  retries: process.env.CI ? 2 : 1,

  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "./reports/html", open: "never" }],
    ["json", { outputFile: "./reports/test-results.json" }],
    ["junit", { outputFile: "./reports/junit.xml" }],
    ["list"],
  ],

  // Global test configuration
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || "http://localhost:3001",

    // Browser options
    headless: process.env.HEADLESS !== "false",

    // Screenshot and video settings
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",

    // Slow down actions (useful for debugging)
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    },

    // Viewport (can be overridden per test)
    viewport: { width: 1280, height: 720 },

    // Action timeout
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // Multiple browser projects
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Enable trace viewer
        trace: "on-first-retry",
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        trace: "on-first-retry",
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        trace: "on-first-retry",
      },
    },

    // Mobile browsers
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },
    {
      name: "mobile-safari",
      use: {
        ...devices["iPhone 13"],
      },
    },

    // Tablet
    {
      name: "tablet",
      use: {
        ...devices["iPad Pro"],
      },
    },
  ],

  // Web server configuration (if needed)
  webServer: process.env.SKIP_SERVER
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3001",
        timeout: 120 * 1000,
        reuseExistingServer: !process.env.CI,
        stdout: "pipe", // Reduce server output noise
        stderr: "pipe", // Reduce server error noise
      },

  // Output folder
  outputDir: "./reports/test-artifacts",

  // Global setup/teardown
  globalSetup: path.resolve(__dirname, "./helpers/global-setup.ts"),
  globalTeardown: path.resolve(__dirname, "./helpers/global-teardown.ts"),
});
