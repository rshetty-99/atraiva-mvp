import { test, expect } from '@playwright/test';

test('Hero section design analysis', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');

  // Wait for the hero section to load
  await page.waitForSelector('section', { timeout: 10000 });
  await page.waitForTimeout(3000); // Allow animations to complete

  // Take full page screenshot
  await page.screenshot({
    path: 'test-results/hero-desktop-full.png',
    fullPage: true
  });

  // Take viewport screenshot
  await page.screenshot({
    path: 'test-results/hero-desktop-viewport.png',
    fullPage: false
  });

  // Test mobile responsiveness
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'test-results/hero-mobile.png',
    fullPage: true
  });

  // Test tablet responsiveness
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'test-results/hero-tablet.png',
    fullPage: true
  });

  // Test ultra-wide
  await page.setViewportSize({ width: 2560, height: 1440 });
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: 'test-results/hero-ultrawide.png',
    fullPage: false
  });

  // Test dark mode
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: 'test-results/hero-dark-mode.png',
    fullPage: false
  });

  console.log('Hero design screenshots captured successfully!');
});