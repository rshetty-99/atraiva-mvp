const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeFigmaPrototype() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Create results directory if it doesn't exist
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }

  try {
    console.log('Navigating to Figma prototype...');
    await page.goto('https://www.figma.com/proto/fPXwXN8jzKLA7a8p2qAmkJ/Atraiva.ai?node-id=629-1408&t=3XvOizEMbw18FYjb-0&scaling=min-zoom&content-scaling=fixed&page-id=1%3A5', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait a bit more for the prototype to fully load
    console.log('Waiting for prototype to load...');
    await page.waitForTimeout(5000);

    // Desktop view (1920x1080)
    console.log('Taking desktop screenshots...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(resultsDir, 'figma-desktop-full.png'),
      fullPage: true
    });
    await page.screenshot({
      path: path.join(resultsDir, 'figma-desktop-viewport.png'),
      fullPage: false
    });

    // Tablet view (768px width)
    console.log('Taking tablet screenshot...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(resultsDir, 'figma-tablet-full.png'),
      fullPage: true
    });

    // Mobile view (375px width)
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(resultsDir, 'figma-mobile-full.png'),
      fullPage: true
    });

    // Try to interact with elements
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Look for clickable elements
    try {
      const elements = await page.locator('button, [role="button"], a, div[class*="cursor"], div[class*="interactive"]').count();
      console.log(`Found ${elements} potentially interactive elements`);

      // Try hovering over elements to see hover states
      const firstElement = page.locator('button, [role="button"], a').first();
      if (await firstElement.count() > 0) {
        await firstElement.hover();
        await page.waitForTimeout(1000);
        await page.screenshot({
          path: path.join(resultsDir, 'figma-hover-state.png'),
          fullPage: false
        });
      }
    } catch (error) {
      console.log('No interactive elements found or interaction failed:', error.message);
    }

    console.log('Screenshots saved successfully!');

  } catch (error) {
    console.error('Error analyzing Figma prototype:', error);

    // Try to take a fallback screenshot in case of errors
    try {
      await page.screenshot({
        path: path.join(resultsDir, 'figma-error-fallback.png'),
        fullPage: true
      });
    } catch (fallbackError) {
      console.error('Even fallback screenshot failed:', fallbackError);
    }
  } finally {
    await browser.close();
  }
}

analyzeFigmaPrototype();