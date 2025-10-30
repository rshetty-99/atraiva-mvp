import { test, expect } from '@playwright/test';

test('Analyze Figma prototype design', async ({ page }) => {
  // Navigate to the Figma prototype
  await page.goto('https://www.figma.com/proto/fPXwXN8jzKLA7a8p2qAmkJ/Atraiva.ai?node-id=629-1408&t=3XvOizEMbw18FYjb-0&scaling=min-zoom&content-scaling=fixed&page-id=1%3A5');

  // Wait for the page to load completely
  await page.waitForLoadState('networkidle');

  // Take full page screenshots at different viewport sizes

  // Desktop view (1920x1080)
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.waitForTimeout(2000); // Allow time for layout adjustments
  await page.screenshot({
    path: 'test-results/figma-desktop-full.png',
    fullPage: true
  });

  // Take a screenshot of just the viewport area
  await page.screenshot({
    path: 'test-results/figma-desktop-viewport.png',
    fullPage: false
  });

  // Tablet view (768px width)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: 'test-results/figma-tablet-full.png',
    fullPage: true
  });

  // Mobile view (375px width)
  await page.setViewportSize({ width: 375, height: 667 });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: 'test-results/figma-mobile-full.png',
    fullPage: true
  });

  // Try to interact with the prototype if there are interactive elements
  try {
    // Look for buttons or interactive elements
    const buttons = await page.locator('button, [role="button"], a').all();
    console.log(`Found ${buttons.length} interactive elements`);

    // Take additional screenshots if there are interactive states
    if (buttons.length > 0) {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await buttons[0].hover();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: 'test-results/figma-desktop-hover-state.png',
        fullPage: false
      });
    }
  } catch (error) {
    console.log('No interactive elements found or interaction failed');
  }
});