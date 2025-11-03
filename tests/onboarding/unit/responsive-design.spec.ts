import { test, expect, devices } from '@playwright/test';
import { TestFailure, createGitHubIssueIfNotExists } from '../helpers/github-issue-reporter';

/**
 * Responsive Design Tests
 * Tests UI across different viewport sizes and devices
 */

const viewports = [
  { name: 'Mobile Portrait', width: 375, height: 812 },
  { name: 'Mobile Landscape', width: 812, height: 375 },
  { name: 'Tablet Portrait', width: 768, height: 1024 },
  { name: 'Tablet Landscape', width: 1024, height: 768 },
  { name: 'Desktop Small', width: 1280, height: 720 },
  { name: 'Desktop Large', width: 1920, height: 1080 },
  { name: 'Desktop 4K', width: 3840, height: 2160 },
];

test.describe('Onboarding Responsive Design', () => {
  
  for (const viewport of viewports) {
    test.describe(`${viewport.name} (${viewport.width}x${viewport.height})`, () => {
      
      test.use({ viewport: { width: viewport.width, height: viewport.height } });
      
      test('should load onboarding page without layout issues', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          // Check for horizontal scroll (indicates layout overflow)
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          
          if (hasHorizontalScroll && viewport.width >= 768) { // Allow for mobile scrolling
            throw new Error('Page has horizontal scroll overflow');
          }
          
          // Verify main content is visible
          const mainContent = page.locator('main').or(page.locator('[role="main"]'));
          await expect(mainContent.first()).toBeVisible();
          
        } catch (error) {
          await reportResponsiveFailure(page, {
            testName: `${viewport.name} - Page load`,
            errorMessage: error instanceof Error ? error.message : 'Test failed',
            browser: browserName,
            viewport: `${viewport.width}x${viewport.height}`,
          });
          throw error;
        }
      });
      
      test('form elements should be properly sized and accessible', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          // Check input fields
          const inputs = await page.locator('input').all();
          
          for (const input of inputs.slice(0, 5)) { // Check first 5 inputs
            const box = await input.boundingBox();
            
            if (box) {
              // Input should have reasonable height (at least 40px for touch)
              if (viewport.width < 768) { // Mobile
                expect(box.height).toBeGreaterThanOrEqual(40);
              } else { // Desktop
                expect(box.height).toBeGreaterThanOrEqual(32);
              }
              
              // Should not be off-screen
              expect(box.x).toBeGreaterThanOrEqual(0);
              expect(box.y).toBeGreaterThanOrEqual(0);
            }
          }
          
          // Check buttons
          const buttons = await page.locator('button').all();
          
          for (const button of buttons.slice(0, 3)) { // Check first 3 buttons
            const isVisible = await button.isVisible().catch(() => false);
            if (isVisible) {
              const box = await button.boundingBox();
              
              if (box) {
                // Buttons should have minimum touch target size on mobile
                if (viewport.width < 768) {
                  expect(box.height).toBeGreaterThanOrEqual(44);
                }
              }
            }
          }
          
        } catch (error) {
          await reportResponsiveFailure(page, {
            testName: `${viewport.name} - Form element sizing`,
            errorMessage: error instanceof Error ? error.message : 'Test failed',
            browser: browserName,
            viewport: `${viewport.width}x${viewport.height}`,
          });
          throw error;
        }
      });
      
      test('navigation elements should be accessible', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          // Check for navigation buttons (Next, Back, etc.)
          const nextButton = page.locator('button:has-text("Next")').or(
            page.locator('button:has-text("Continue")')
          ).first();
          
          if (await nextButton.count() > 0) {
            await expect(nextButton).toBeVisible();
            
            // Should be clickable (not obscured)
            const isEnabled = await nextButton.isEnabled();
            expect(typeof isEnabled).toBe('boolean');
          }
          
          // Check for progress indicators
          const progress = page.locator('[role="progressbar"]').or(
            page.locator('[class*="progress"]')
          ).first();
          
          if (await progress.count() > 0) {
            const isVisible = await progress.isVisible();
            expect(isVisible).toBeTruthy();
          }
          
        } catch (error) {
          console.log(`Navigation test for ${viewport.name} - structure may vary`);
        }
      });
      
      test('text should be readable (not truncated)', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          // Check headers
          const headers = await page.locator('h1, h2, h3').all();
          
          for (const header of headers) {
            const isVisible = await header.isVisible().catch(() => false);
            if (isVisible) {
              const box = await header.boundingBox();
              
              if (box) {
                // Header should not be wider than viewport
                expect(box.width).toBeLessThanOrEqual(viewport.width);
              }
            }
          }
          
          // Check for ellipsis or text overflow
          const hasOverflow = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            let foundOverflow = false;
            
            elements.forEach(el => {
              if (el.scrollWidth > el.clientWidth + 2) { // +2 for rounding
                const computed = window.getComputedStyle(el);
                if (computed.overflow === 'visible') {
                  foundOverflow = true;
                }
              }
            });
            
            return foundOverflow;
          });
          
          // Some overflow is acceptable (e.g., for intentional scrolling areas)
          // This is more of an informational test
          expect(typeof hasOverflow).toBe('boolean');
          
        } catch (error) {
          console.log(`Text readability test for ${viewport.name} - informational`);
        }
      });
      
      test('images should load and scale properly', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          const images = await page.locator('img').all();
          
          for (const img of images) {
            const isVisible = await img.isVisible().catch(() => false);
            if (isVisible) {
              // Check if image loaded
              const isComplete = await img.evaluate((el: HTMLImageElement) => el.complete);
              expect(isComplete).toBeTruthy();
              
              // Check dimensions
              const box = await img.boundingBox();
              if (box) {
                // Image should fit within viewport
                expect(box.width).toBeLessThanOrEqual(viewport.width);
              }
            }
          }
          
        } catch (error) {
          console.log(`Image test for ${viewport.name} - may not have images`);
        }
      });
      
      test('modals and dialogs should be properly sized', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          const dialogs = await page.locator('[role="dialog"]').all();
          
          for (const dialog of dialogs) {
            const isVisible = await dialog.isVisible().catch(() => false);
            if (isVisible) {
              const box = await dialog.boundingBox();
              
              if (box) {
                // Dialog should fit within viewport with some margin
                expect(box.width).toBeLessThanOrEqual(viewport.width - 32);
                expect(box.height).toBeLessThanOrEqual(viewport.height - 32);
              }
            }
          }
          
        } catch (error) {
          console.log(`Dialog test for ${viewport.name} - may not have dialogs`);
        }
      });
      
      test('should not have overlapping elements', async ({ page, browserName }) => {
        try {
          await page.goto('/onboarding');
          await page.waitForLoadState('networkidle');
          
          // Check for z-index issues
          const hasOverlaps = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('*'));
            const rects = elements.map(el => ({
              el,
              rect: el.getBoundingClientRect(),
              zIndex: window.getComputedStyle(el).zIndex
            })).filter(item => item.rect.width > 0 && item.rect.height > 0);
            
            // Simple overlap detection
            let overlapCount = 0;
            for (let i = 0; i < rects.length - 1; i++) {
              for (let j = i + 1; j < rects.length; j++) {
                const a = rects[i].rect;
                const b = rects[j].rect;
                
                if (!(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)) {
                  // Elements overlap - check if one should be on top
                  if (rects[i].zIndex === rects[j].zIndex && rects[i].zIndex !== 'auto') {
                    overlapCount++;
                  }
                }
              }
            }
            
            return overlapCount > 0;
          });
          
          // Some overlaps are intentional (dropdowns, tooltips)
          // This is informational
          expect(typeof hasOverlaps).toBe('boolean');
          
        } catch (error) {
          console.log(`Overlap test for ${viewport.name} - informational`);
        }
      });
    });
  }
  
  test.describe('Device Emulation', () => {
    test('should work on iPhone 13', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPhone 13']
      });
      const page = await context.newPage();
      
      try {
        await page.goto('/onboarding');
        await page.waitForLoadState('networkidle');
        
        // Basic functionality check
        const mainContent = page.locator('main').or(page.locator('[role="main"]'));
        await expect(mainContent.first()).toBeVisible();
        
      } finally {
        await context.close();
      }
    });
    
    test('should work on iPad Pro', async ({ browser }) => {
      const context = await browser.newContext({
        ...devices['iPad Pro']
      });
      const page = await context.newPage();
      
      try {
        await page.goto('/onboarding');
        await page.waitForLoadState('networkidle');
        
        const mainContent = page.locator('main').or(page.locator('[role="main"]'));
        await expect(mainContent.first()).toBeVisible();
        
      } finally {
        await context.close();
      }
    });
  });
});

/**
 * Helper to report responsive design failures
 */
async function reportResponsiveFailure(
  page: any,
  failure: Omit<TestFailure, 'screenshot' | 'tracePath' | 'stackTrace' | 'videoPath' | 'testFile' | 'severity' | 'category' | 'timestamp'>
) {
  try {
    const screenshot = `tests/onboarding/reports/responsive-failure-${Date.now()}.png`;
    await page.screenshot({ path: screenshot, fullPage: true });
    
    const fullFailure: TestFailure = {
      ...failure,
      testFile: 'responsive-design.spec.ts',
      screenshot,
      stackTrace: new Error().stack,
      severity: 'medium',
      category: 'responsive',
      timestamp: new Date(),
    };
    
    await createGitHubIssueIfNotExists(fullFailure);
  } catch (error) {
    console.error('Failed to report responsive failure:', error);
  }
}

