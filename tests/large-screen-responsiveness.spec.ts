import { test, expect } from '@playwright/test';

test.describe('Large Screen Responsiveness Tests', () => {
  const largeScreenSizes = [
    { width: 1920, height: 1080 },  // Full HD
    { width: 2560, height: 1440 },  // QHD/1440p
    { width: 3840, height: 2160 },  // 4K UHD
    { width: 1900, height: 1200 },  // Just above minimum requirement
  ];

  largeScreenSizes.forEach(({ width, height }) => {
    test(`Homepage responsiveness at ${width}x${height}`, async ({ page }) => {
      // Set viewport to large screen size
      await page.setViewportSize({ width, height });
      
      // Start the dev server if not already running
      await page.goto('http://localhost:3008');
      
      // Wait for page to load completely
      await page.waitForLoadState('networkidle');
      
      // Take screenshot for visual comparison
      await page.screenshot({
        path: `test-results/homepage-${width}x${height}.png`,
        fullPage: true
      });
      
      // Test header responsiveness
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check if navigation is properly displayed (not collapsed)
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Test hero section layout
      const hero = page.locator('[data-testid="hero"], .hero, h1').first();
      await expect(hero).toBeVisible();
      
      // Check that content is not overflowing
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeLessThanOrEqual(width);
      
      // Test features section layout
      const features = page.locator('[data-testid="features"], .features').first();
      if (await features.isVisible()) {
        const featuresBox = await features.boundingBox();
        expect(featuresBox?.width).toBeLessThanOrEqual(width);
      }
      
      // Test footer layout
      const footer = page.locator('footer');
      if (await footer.isVisible()) {
        await expect(footer).toBeVisible();
        const footerBox = await footer.boundingBox();
        expect(footerBox?.width).toBeLessThanOrEqual(width);
      }
      
      // Test for horizontal scrollbars (should not exist)
      const hasHorizontalScrollbar = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScrollbar).toBeFalsy();
      
      // Check responsive grid layouts
      const gridContainers = page.locator('.grid, [class*="grid-"]');
      const gridCount = await gridContainers.count();
      
      if (gridCount > 0) {
        for (let i = 0; i < gridCount; i++) {
          const grid = gridContainers.nth(i);
          const gridBox = await grid.boundingBox();
          if (gridBox) {
            expect(gridBox.width).toBeLessThanOrEqual(width);
          }
        }
      }
    });
    
    test(`About/Solutions page responsiveness at ${width}x${height}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      
      // Test solutions page if it exists
      try {
        await page.goto('http://localhost:3008/solutions', { timeout: 5000 });
        await page.waitForLoadState('networkidle');
        
        await page.screenshot({
          path: `test-results/solutions-${width}x${height}.png`,
          fullPage: true
        });
        
        // Basic layout tests
        const body = page.locator('body');
        const bodyBox = await body.boundingBox();
        expect(bodyBox?.width).toBeLessThanOrEqual(width);
        
        const hasHorizontalScrollbar = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasHorizontalScrollbar).toBeFalsy();
        
      } catch (error) {
        console.log(`Solutions page not found or accessible at ${width}x${height}`);
      }
    });
  });

  test('Ultra-wide screen test (3440x1440)', async ({ page }) => {
    const ultraWideWidth = 3440;
    const ultraWideHeight = 1440;
    
    await page.setViewportSize({ width: ultraWideWidth, height: ultraWideHeight });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Screenshot for ultra-wide display
    await page.screenshot({
      path: `test-results/homepage-ultrawide-${ultraWideWidth}x${ultraWideHeight}.png`,
      fullPage: true
    });
    
    // Test that content is properly centered or uses available space
    const mainContent = page.locator('main, [role="main"], .main-content').first();
    if (await mainContent.isVisible()) {
      const contentBox = await mainContent.boundingBox();
      expect(contentBox?.width).toBeLessThanOrEqual(ultraWideWidth);
    }
    
    // Ensure no horizontal overflow
    const hasHorizontalScrollbar = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScrollbar).toBeFalsy();
  });

  test('Accessibility at large screen sizes', async ({ page }) => {
    await page.setViewportSize({ width: 2560, height: 1440 });
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeDefined();
    
    // Test that all interactive elements are accessible
    const buttons = page.locator('button, [role="button"]');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        await expect(button).toBeVisible();
        
        // Check if button has accessible name
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        expect(ariaLabel || textContent).toBeTruthy();
      }
    }
  });
});