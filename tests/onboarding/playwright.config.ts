import { defineConfig, devices } from '@playwright/test';
import path from 'path';

/**
 * Playwright Configuration for Onboarding Tests
 * Comprehensive testing setup with multiple browsers, devices, and features
 */

export default defineConfig({
  testDir: './',
  testMatch: ['**/*.spec.ts'],
  
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
    ['html', { outputFolder: './reports/html', open: 'never' }],
    ['json', { outputFile: './reports/test-results.json' }],
    ['junit', { outputFile: './reports/junit.xml' }],
    ['list'],
  ],
  
  // Global test configuration
  use: {
    // Base URL for tests
    baseURL: process.env.BASE_URL || 'http://localhost:3001',
    
    // Browser options
    headless: process.env.HEADLESS !== 'false',
    
    // Screenshot and video settings
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    
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
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Enable trace viewer
        trace: 'on-first-retry',
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        trace: 'on-first-retry',
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        trace: 'on-first-retry',
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
    
    // Tablet
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
      },
    },
  ],
  
  // Web server configuration (if needed)
  webServer: process.env.SKIP_SERVER ? undefined : {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  
  // Output folder
  outputDir: './reports/test-artifacts',
  
  // Global setup/teardown
  globalSetup: path.resolve(__dirname, './helpers/global-setup.ts'),
  globalTeardown: path.resolve(__dirname, './helpers/global-teardown.ts'),
});

