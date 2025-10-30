const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function analyzeFigma() {
  let browser = null;
  try {
    console.log('Starting Figma analysis...');

    browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Create results directory
    const resultsDir = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    console.log('Navigating to Figma prototype...');

    try {
      await page.goto('https://www.figma.com/proto/fPXwXN8jzKLA7a8p2qAmkJ/Atraiva.ai?node-id=629-1408&t=3XvOizEMbw18FYjb-0&scaling=min-zoom&content-scaling=fixed&page-id=1%3A5', {
        waitUntil: 'networkidle',
        timeout: 60000
      });

      // Wait for Figma to load
      console.log('Waiting for Figma to load...');
      await page.waitForTimeout(8000);

      // Take screenshots at different viewport sizes
      console.log('Taking desktop screenshot...');
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.waitForTimeout(3000);

      await page.screenshot({
        path: path.join(resultsDir, 'figma-desktop-full.png'),
        fullPage: true,
        quality: 100
      });

      await page.screenshot({
        path: path.join(resultsDir, 'figma-desktop-viewport.png'),
        fullPage: false,
        quality: 100
      });

      // Try mobile viewport
      console.log('Taking mobile screenshot...');
      await page.setViewportSize({ width: 375, height: 812 });
      await page.waitForTimeout(2000);

      await page.screenshot({
        path: path.join(resultsDir, 'figma-mobile.png'),
        fullPage: true,
        quality: 100
      });

      console.log('Screenshots captured successfully!');

      // Try to extract some information about the page
      try {
        const title = await page.title();
        console.log('Page title:', title);

        // Save page info
        fs.writeFileSync(
          path.join(resultsDir, 'figma-info.txt'),
          `URL: ${page.url()}\nTitle: ${title}\nViewport: 1920x1080\nTimestamp: ${new Date().toISOString()}`
        );

      } catch (infoError) {
        console.log('Could not extract page info:', infoError.message);
      }

    } catch (navigationError) {
      console.error('Navigation error:', navigationError.message);

      // Take error screenshot
      try {
        await page.screenshot({
          path: path.join(resultsDir, 'figma-error.png'),
          fullPage: true
        });
      } catch (screenshotError) {
        console.error('Could not take error screenshot:', screenshotError.message);
      }
    }

  } catch (error) {
    console.error('General error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('Browser closed.');
  }
}

analyzeFigma();