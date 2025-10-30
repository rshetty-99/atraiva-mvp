import { test, expect } from '@playwright/test';

test.describe('Ultra Wide Screen Layout Tests', () => {
  
  test('should handle 2269x1218 resolution properly', async ({ page }) => {
    // Set the specific resolution you mentioned
    await page.setViewportSize({ width: 2269, height: 1218 });
    
    // Navigate to the about us page
    await page.goto('/website/aboutus');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Take a screenshot of the team section
    const teamSection = page.locator('section').filter({ hasText: 'Meet Our Team' });
    await expect(teamSection).toBeVisible();
    
    // Check that cards are properly displayed
    const cards = page.locator('[data-slot="card"], .bg-slate-900\\/90');
    await expect(cards).toHaveCount(6);
    
    // Take a full page screenshot
    await page.screenshot({ 
      path: 'test-results/ultra-wide-2269x1218.png', 
      fullPage: true 
    });
    
    // Check card widths and spacing
    const firstCard = cards.first();
    const cardBounds = await firstCard.boundingBox();
    
    console.log(`Card width at 2269x1218: ${cardBounds?.width}px`);
    console.log(`Card height at 2269x1218: ${cardBounds?.height}px`);
  });

  test('should handle even larger resolution 2560x1440', async ({ page }) => {
    // Test an even larger resolution
    await page.setViewportSize({ width: 2560, height: 1440 });
    
    await page.goto('/website/aboutus');
    await page.waitForLoadState('networkidle');
    
    const teamSection = page.locator('section').filter({ hasText: 'Meet Our Team' });
    await expect(teamSection).toBeVisible();
    
    const cards = page.locator('[data-slot="card"], .bg-slate-900\\/90');
    await expect(cards).toHaveCount(6);
    
    await page.screenshot({ 
      path: 'test-results/ultra-wide-2560x1440.png', 
      fullPage: true 
    });
    
    const firstCard = cards.first();
    const cardBounds = await firstCard.boundingBox();
    
    console.log(`Card width at 2560x1440: ${cardBounds?.width}px`);
    console.log(`Card height at 2560x1440: ${cardBounds?.height}px`);
  });

  test('should handle ultra-wide 3440x1440', async ({ page }) => {
    // Test ultra-wide monitor resolution
    await page.setViewportSize({ width: 3440, height: 1440 });
    
    await page.goto('/website/aboutus');
    await page.waitForLoadState('networkidle');
    
    const teamSection = page.locator('section').filter({ hasText: 'Meet Our Team' });
    await expect(teamSection).toBeVisible();
    
    const cards = page.locator('[data-slot="card"], .bg-slate-900\\/90');
    await expect(cards).toHaveCount(6);
    
    await page.screenshot({ 
      path: 'test-results/ultra-wide-3440x1440.png', 
      fullPage: true 
    });
    
    const firstCard = cards.first();
    const cardBounds = await firstCard.boundingBox();
    
    console.log(`Card width at 3440x1440: ${cardBounds?.width}px`);
    console.log(`Card height at 3440x1440: ${cardBounds?.height}px`);
    
    // Check if cards are getting too wide (which might be the issue)
    if (cardBounds && cardBounds.width > 600) {
      console.log(`WARNING: Cards might be too wide at ${cardBounds.width}px`);
    }
  });
});

