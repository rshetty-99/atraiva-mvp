const { chromium } = require('playwright');

async function captureFigma() {
  console.log('Starting Figma capture...');

  const browser = await chromium.launch({
    headless: false, // Use visible browser to handle any auth requirements
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-first-run',
      '--disable-default-apps'
    ]
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    // Navigate to Figma
    console.log('Navigating to Figma prototype...');
    await page.goto('https://www.figma.com/proto/fPXwXN8jzKLA7a8p2qAmkJ/Atraiva.ai?node-id=629-1408&t=3XvOizEMbw18FYjb-0&scaling=min-zoom&content-scaling=fixed&page-id=1%3A5', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Wait for content to load
    console.log('Waiting for prototype to load...');
    await page.waitForTimeout(5000);

    // Create results directory
    const fs = require('fs');
    const path = require('path');
    const resultsDir = path.join(process.cwd(), 'figma-screenshots');
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    // Take full page screenshot
    console.log('Taking desktop screenshot...');
    await page.screenshot({
      path: path.join(resultsDir, 'figma-desktop-full.png'),
      fullPage: true,
      quality: 100
    });

    // Take viewport screenshot
    await page.screenshot({
      path: path.join(resultsDir, 'figma-desktop-viewport.png'),
      fullPage: false,
      quality: 100
    });

    // Mobile screenshot
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);

    await page.screenshot({
      path: path.join(resultsDir, 'figma-mobile.png'),
      fullPage: true,
      quality: 100
    });

    console.log('Screenshots saved to figma-screenshots directory');

    // Try to get page info
    const title = await page.title();
    const url = page.url();

    fs.writeFileSync(
      path.join(resultsDir, 'page-info.txt'),
      `Title: ${title}\nURL: ${url}\nTimestamp: ${new Date().toISOString()}`
    );

    console.log('Page info saved');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
    console.log('Done!');
  }
}

captureFigma();