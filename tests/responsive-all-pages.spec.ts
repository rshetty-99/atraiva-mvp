import { test, Page, BrowserContext, Browser } from "@playwright/test";
import { writeFileSync, mkdirSync } from "fs";
import {
  authenticateUser,
  saveAuthState,
  loadAuthState,
  hasAuthState,
} from "./helpers/auth-setup";

interface ResponsiveIssue {
  page: string;
  viewport: string;
  issue: string;
  severity: "high" | "medium" | "low";
  screenshot?: string;
}

const issues: ResponsiveIssue[] = [];

// Viewport sizes to test
const viewports = [
  { name: "mobile", width: 375, height: 812 },
  { name: "mobile-landscape", width: 812, height: 375 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "desktop", width: 1280, height: 720 },
  { name: "desktop-large", width: 1920, height: 1080 },
];

// Public website pages
const publicPages = [
  "/",
  "/home",
  "/features",
  "/resources",
  "/aboutus",
  "/contact-us",
  "/price",
];

// Dashboard pages (require authentication)
const dashboardPages = [
  "/dashboard",
  "/admin/dashboard",
  "/org/dashboard",
  "/partner/dashboard",
  "/admin/blog",
  "/admin/members",
  "/admin/organization",
  "/org/profile",
  "/org/incidents",
  "/org/users",
];

async function checkResponsiveIssues(
  page: Page,
  url: string,
  viewportName: string,
  viewport: { width: number; height: number }
): Promise<void> {
  await page.setViewportSize({
    width: viewport.width,
    height: viewport.height,
  });

  // Use "load" instead of "networkidle" - Fast Refresh in dev mode prevents networkidle
  // Add timeout to prevent hanging
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
  } catch (error: any) {
    if (error.message?.includes("ERR_CONNECTION_REFUSED")) {
      throw new Error(
        `Cannot connect to server at ${
          page.context().baseURL || "http://localhost:3000"
        }. ` +
          `If using SKIP_SERVER=true, ensure the dev server is running manually with "npm run dev".`
      );
    }
    throw error;
  }

  // Wait for page to be interactive (optional, but helps with dynamic content)
  await page.waitForLoadState("domcontentloaded");

  // Take screenshot for reference
  const screenshotPath = `test-results/responsive/${url.replace(
    /\//g,
    "_"
  )}-${viewportName}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });

  // Check if page is still valid (not closed)
  if (page.isClosed()) {
    throw new Error("Page was closed before checks could complete");
  }

  // Check for horizontal scroll
  const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = viewport.width;
  if (bodyScrollWidth > viewportWidth) {
    issues.push({
      page: url,
      viewport: viewportName,
      issue: `Horizontal overflow detected: ${bodyScrollWidth}px > ${viewportWidth}px (overflow: ${
        bodyScrollWidth - viewportWidth
      }px)`,
      severity: "high",
      screenshot: screenshotPath,
    });
  }

  // Check for elements that overflow viewport
  const overflowElements = await page.evaluate(() => {
    const elements: Array<{ tag: string; overflow: number }> = [];
    document.querySelectorAll("*").forEach((el) => {
      const scrollWidth = el.scrollWidth;
      const clientWidth = el.clientWidth;
      if (scrollWidth > clientWidth && clientWidth > 0) {
        elements.push({
          tag: el.tagName.toLowerCase(),
          overflow: scrollWidth - clientWidth,
        });
      }
    });
    return elements.filter((e) => e.overflow > 10); // Only significant overflow
  });

  if (overflowElements.length > 0) {
    const significant = overflowElements.filter((e) => e.overflow > 50);
    if (significant.length > 0) {
      issues.push({
        page: url,
        viewport: viewportName,
        issue: `Elements with overflow: ${significant
          .map((e) => `${e.tag} (+${e.overflow}px)`)
          .join(", ")}`,
        severity: significant.some((e) => e.overflow > 100) ? "high" : "medium",
        screenshot: screenshotPath,
      });
    }
  }

  // Check for text truncation issues (text that's too small to read)
  const textElements = await page
    .locator("p, h1, h2, h3, h4, h5, h6, span, a, button")
    .filter({ hasText: /.+/ });
  const textCount = await textElements.count();

  for (let i = 0; i < Math.min(textCount, 20); i++) {
    const element = textElements.nth(i);
    const isVisible = await element.isVisible();
    if (isVisible) {
      const fontSize = await element.evaluate((el) => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.fontSize);
      });
      if (fontSize < 10 && viewportName.includes("mobile")) {
        issues.push({
          page: url,
          viewport: viewportName,
          issue: `Text too small (${fontSize}px) - may be unreadable on mobile`,
          severity: "medium",
          screenshot: screenshotPath,
        });
        break; // Only report once per page
      }
    }
  }

  // Check for touch targets on mobile (should be at least 44x44px)
  if (viewportName.includes("mobile")) {
    const buttons = page.locator('button, a, [role="button"]');
    const buttonCount = await buttons.count();
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const isVisible = await button.isVisible();
      if (isVisible) {
        const box = await button.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          issues.push({
            page: url,
            viewport: viewportName,
            issue: `Touch target too small: ${box.width.toFixed(
              0
            )}x${box.height.toFixed(0)}px (minimum: 44x44px)`,
            severity: "medium",
            screenshot: screenshotPath,
          });
          break; // Only report once per page
        }
      }
    }
  }

  // Check for overlapping elements
  const overlapping = await page.evaluate(() => {
    const overlaps: string[] = [];
    const elements = Array.from(document.querySelectorAll("*"));
    for (let i = 0; i < elements.length; i++) {
      for (let j = i + 1; j < elements.length; j++) {
        const rect1 = elements[i].getBoundingClientRect();
        const rect2 = elements[j].getBoundingClientRect();
        if (
          rect1.top < rect2.bottom &&
          rect1.bottom > rect2.top &&
          rect1.left < rect2.right &&
          rect1.right > rect2.left
        ) {
          const z1 = window.getComputedStyle(elements[i]).zIndex;
          const z2 = window.getComputedStyle(elements[j]).zIndex;
          if (z1 === z2 || (z1 === "auto" && z2 === "auto")) {
            const tag1 = elements[i].tagName.toLowerCase();
            const tag2 = elements[j].tagName.toLowerCase();
            overlaps.push(`${tag1} overlaps ${tag2}`);
          }
        }
      }
    }
    return overlaps;
  });

  if (overlapping.length > 5) {
    issues.push({
      page: url,
      viewport: viewportName,
      issue: `Multiple overlapping elements detected (${overlapping.length} pairs)`,
      severity: "low",
      screenshot: screenshotPath,
    });
  }

  // Check for images that don't scale
  const images = page.locator("img");
  const imageCount = await images.count();
  for (let i = 0; i < Math.min(imageCount, 10); i++) {
    const img = images.nth(i);
    const isVisible = await img.isVisible();
    if (isVisible) {
      const box = await img.boundingBox();
      const naturalWidth = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth
      );
      const naturalHeight = await img.evaluate(
        (el: HTMLImageElement) => el.naturalHeight
      );

      if (box && naturalWidth > 0 && naturalHeight > 0) {
        const scaleX = box.width / naturalWidth;

        // Check if image is significantly larger than viewport
        if (naturalWidth > viewport.width * 1.5 && scaleX > 0.9) {
          issues.push({
            page: url,
            viewport: viewportName,
            issue: `Image not properly scaled: ${naturalWidth}x${naturalHeight}px displayed at ${box.width.toFixed(
              0
            )}x${box.height.toFixed(0)}px`,
            severity: "medium",
            screenshot: screenshotPath,
          });
          break;
        }
      }
    }
  }
}

test.describe("Responsive Design - All Pages", () => {
  // Create output directory
  test.beforeAll(() => {
    mkdirSync("test-results/responsive", { recursive: true });
  });

  // Test public pages
  for (const pagePath of publicPages) {
    for (const viewport of viewports) {
      test(`${pagePath} - ${viewport.name}`, async ({ page }) => {
        try {
          await checkResponsiveIssues(page, pagePath, viewport.name, viewport);
        } catch (error) {
          // If page was closed, skip gracefully
          if (error instanceof Error && error.message.includes("closed")) {
            test.skip(true, `Page closed: ${error.message}`);
            return;
          }
          throw error;
        }
      });
    }
  }
});

// Separate test suite for authenticated dashboard pages
test.describe("Responsive Design - Dashboard Pages (Authenticated)", () => {
  let authenticatedContext: BrowserContext | null = null;
  let browserInstance: Browser | null = null;
  const authStatePath = loadAuthState();

  // Setup authentication before all tests
  // Increased timeout for authentication flow (set in config)
  test.beforeAll(async () => {
    // Create output directory
    mkdirSync("test-results/responsive", { recursive: true });

    // Launch browser directly (Playwright beforeAll doesn't support fixtures)
    const { chromium } = await import("playwright");
    browserInstance = await chromium.launch();

    // If we have saved auth state, use it; otherwise authenticate
    if (authStatePath && hasAuthState()) {
      console.log("Using saved authentication state...");
      authenticatedContext = await browserInstance.newContext({
        storageState: authStatePath,
      });
    } else {
      console.log("No saved auth state found. Authenticating...");
      // Create a new context for authentication
      const authContext = await browserInstance.newContext();
      const authPage = await authContext.newPage();

      try {
        await authenticateUser(authPage);
        await saveAuthState(authContext);
        authenticatedContext = authContext;
      } catch (error) {
        console.error("Authentication failed:", error);
        console.warn(
          "Dashboard tests will be skipped. Set TEST_AUTH_EMAIL and TEST_AUTH_PASSWORD environment variables."
        );
        await authPage.close();
        await authContext.close();
        // Set to null so tests are skipped gracefully
        authenticatedContext = null;
      }
    }
  });

  // Cleanup after all tests
  test.afterAll(async () => {
    if (authenticatedContext) {
      await authenticatedContext.close();
    }
    if (browserInstance) {
      await browserInstance.close();
    }
  });

  // Test dashboard pages with authentication
  for (const pagePath of dashboardPages) {
    for (const viewport of viewports) {
      test(`${pagePath} - ${viewport.name}`, async () => {
        // Skip if authentication failed
        if (!authenticatedContext) {
          test.skip(true, "Authentication failed - skipping dashboard tests");
          return;
        }

        const page = await authenticatedContext.newPage();
        try {
          await checkResponsiveIssues(page, pagePath, viewport.name, viewport);
        } finally {
          await page.close();
        }
      });
    }
  }

  // Generate report (runs after all tests complete)
  test.afterAll(() => {
    generateReport();
  });
});

// Generate report function (shared between test suites)
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    totalIssues: issues.length,
    issuesBySeverity: {
      high: issues.filter((i) => i.severity === "high").length,
      medium: issues.filter((i) => i.severity === "medium").length,
      low: issues.filter((i) => i.severity === "low").length,
    },
    issues: issues,
  };

  writeFileSync(
    "test-results/responsive/issues.json",
    JSON.stringify(report, null, 2)
  );

  // Generate markdown report
  let markdown = "# Responsive Design Issues Report\n\n";
  markdown += `Generated: ${new Date().toISOString()}\n\n`;
  markdown += `Total Issues: ${issues.length}\n`;
  markdown += `- High: ${report.issuesBySeverity.high}\n`;
  markdown += `- Medium: ${report.issuesBySeverity.medium}\n`;
  markdown += `- Low: ${report.issuesBySeverity.low}\n\n`;

  const issuesByPage = issues.reduce((acc, issue) => {
    if (!acc[issue.page]) acc[issue.page] = [];
    acc[issue.page].push(issue);
    return acc;
  }, {} as Record<string, ResponsiveIssue[]>);

  for (const [page, pageIssues] of Object.entries(issuesByPage)) {
    markdown += `## ${page}\n\n`;
    for (const issue of pageIssues) {
      markdown += `### ${issue.viewport} - ${issue.severity.toUpperCase()}\n`;
      markdown += `${issue.issue}\n\n`;
      if (issue.screenshot) {
        markdown += `Screenshot: ${issue.screenshot}\n\n`;
      }
    }
  }

  writeFileSync("test-results/responsive/issues.md", markdown);
  console.log(`\n📊 Responsive test report generated:`);
  console.log(`   - JSON: test-results/responsive/issues.json`);
  console.log(`   - Markdown: test-results/responsive/issues.md\n`);
}
