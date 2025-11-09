import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://127.0.0.1:3008',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium-large-screen',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'firefox-large-screen',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'webkit-large-screen',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    // Ultra-wide and 4K testing
    {
      name: 'chromium-4k',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 3840, height: 2160 }
      },
    },
    {
      name: 'chromium-ultrawide',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 3440, height: 1440 }
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3008',
    reuseExistingServer: true,
    timeout: 120000,
  },
});