import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";

// Load environment variables from .env.local if it exists
const envPath = join(__dirname, ".env.local");
if (existsSync(envPath)) {
  config({ path: envPath });
}

/**
 * Playwright Configuration for Responsive Design Tests
 *
 * This config assumes the dev server is already running.
 * If you want Playwright to start the server automatically,
 * set SKIP_SERVER=false in your environment.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/responsive-all-pages.spec.ts"],
  fullyParallel: false, // Run sequentially to avoid overloading the server
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for responsive tests
  reporter: "html",
  timeout: 60000, // 60s timeout for all tests (default is 30s)

  use: {
    // Use port 3000 by default (Next.js default)
    // Override with BASE_URL environment variable if needed
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Only start web server if SKIP_SERVER is not set to 'true'
  // This allows you to run your own dev server and reuse it
  webServer:
    process.env.SKIP_SERVER === "true"
      ? undefined
      : {
          command: "npm run dev",
          url: process.env.BASE_URL || "http://localhost:3000",
          reuseExistingServer: !process.env.CI, // Reuse server if not in CI
          timeout: 120000,
        },
});
