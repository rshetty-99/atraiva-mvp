/**
 * Playwright MCP Integration Helpers for UI Design Workflow
 * Provides utilities for visual testing, accessibility scanning, and responsive design validation
 */

import { Page } from "@playwright/test";

export interface ScreenshotOptions {
  fullPage?: boolean;
  clip?: { x: number; y: number; width: number; height: number };
  path?: string;
  quality?: number;
  type?: "png" | "jpeg";
}

export interface ResponsiveBreakpoint {
  name: string;
  width: number;
  height: number;
  device?: string;
}

export interface AccessibilityViolation {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical";
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    impact: string;
    any: Array<{ id: string; data: unknown; message: string }>;
  }>;
}

export interface UIAuditResult {
  url: string;
  timestamp: string;
  accessibility: {
    violations: AccessibilityViolation[];
    passes: number;
    inapplicable: number;
    incomplete: number;
  };
  performance: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    tti: number;
  };
  responsive: {
    breakpoint: ResponsiveBreakpoint;
    screenshotPath: string;
    layoutShifts: boolean;
    touchTargetViolations: Array<{
      selector: string;
      size: { width: number; height: number };
    }>;
  };
}

/**
 * Standard responsive breakpoints for testing
 */
export const RESPONSIVE_BREAKPOINTS: ResponsiveBreakpoint[] = [
  { name: "mobile-small", width: 320, height: 568, device: "iPhone SE" },
  { name: "mobile", width: 375, height: 667, device: "iPhone 8" },
  {
    name: "mobile-large",
    width: 414,
    height: 896,
    device: "iPhone 11 Pro Max",
  },
  { name: "tablet", width: 768, height: 1024, device: "iPad" },
  {
    name: "tablet-landscape",
    width: 1024,
    height: 768,
    device: "iPad Landscape",
  },
  { name: "desktop", width: 1280, height: 720, device: "Desktop HD" },
  { name: "desktop-large", width: 1920, height: 1080, device: "Desktop FHD" },
  { name: "desktop-4k", width: 3840, height: 2160, device: "Desktop 4K" },
];

/**
 * Takes screenshots across multiple responsive breakpoints
 */
export async function captureResponsiveScreenshots(
  page: Page,
  url: string,
  outputDir: string = "./screenshots"
): Promise<{ [breakpoint: string]: string }> {
  const screenshots: { [breakpoint: string]: string } = {};

  await page.goto(url, { waitUntil: "networkidle" });

  for (const breakpoint of RESPONSIVE_BREAKPOINTS) {
    await page.setViewportSize({
      width: breakpoint.width,
      height: breakpoint.height,
    });

    // Wait for layout to settle
    await page.waitForTimeout(500);

    const screenshotPath = `${outputDir}/${breakpoint.name}-${breakpoint.width}x${breakpoint.height}.png`;

    await page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: "png",
    });

    screenshots[breakpoint.name] = screenshotPath;
  }

  return screenshots;
}

/**
 * Runs accessibility audit using axe-core
 */
export async function runAccessibilityAudit(
  page: Page
): Promise<AccessibilityViolation[]> {
  // Inject axe-core into the page
  await page.addScriptTag({
    url: "https://unpkg.com/axe-core@4.7.2/axe.min.js",
  });

  // Run axe accessibility scan
  const results = await page.evaluate(async () => {
    // @ts-expect-error - axe is loaded dynamically
    return await axe.run(document, {
      rules: {
        // WCAG 2.1 AA compliance rules
        "color-contrast": { enabled: true },
        "keyboard-navigation": { enabled: true },
        "focus-order-semantics": { enabled: true },
        "aria-labels": { enabled: true },
        "heading-order": { enabled: true },
        "landmark-unique": { enabled: true },
        "link-name": { enabled: true },
        "button-name": { enabled: true },
        "form-field-multiple-labels": { enabled: true },
        "input-image-alt": { enabled: true },
        "image-alt": { enabled: true },
      },
      tags: ["wcag2a", "wcag2aa", "wcag21aa"],
    });
  });

  return results.violations;
}

/**
 * Validates touch target sizes for mobile accessibility
 */
export async function validateTouchTargets(page: Page): Promise<
  Array<{
    selector: string;
    size: { width: number; height: number };
  }>
> {
  const violations = await page.evaluate(() => {
    const minTouchSize = 44; // WCAG minimum touch target size
    const violations: Array<{
      selector: string;
      size: { width: number; height: number };
    }> = [];

    // Check all interactive elements
    const interactiveSelectors = [
      "button",
      "a[href]",
      'input:not([type="hidden"])',
      "select",
      "textarea",
      "[onclick]",
      '[role="button"]',
      '[role="link"]',
      '[role="menuitem"]',
      '[tabindex]:not([tabindex="-1"])',
    ];

    interactiveSelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        if (rect.width < minTouchSize || rect.height < minTouchSize) {
          const uniqueSelector = `${selector}:nth-child(${index + 1})`;
          violations.push({
            selector: uniqueSelector,
            size: { width: rect.width, height: rect.height },
          });
        }
      });
    });

    return violations;
  });

  return violations;
}

/**
 * Measures Core Web Vitals performance metrics
 */
export async function measurePerformanceMetrics(page: Page): Promise<{
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  tti: number;
}> {
  // Start performance observation
  await page.evaluate(() => {
    // @ts-expect-error - performanceMetrics is dynamically added
    window.performanceMetrics = {
      lcp: 0,
      fid: 0,
      cls: 0,
      fcp: 0,
      tti: 0,
    };

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      // @ts-expect-error - performanceMetrics is dynamically added
      window.performanceMetrics.lcp = lastEntry.startTime;
    }).observe({ entryTypes: ["largest-contentful-paint"] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // @ts-expect-error - performanceMetrics is dynamically added
        window.performanceMetrics.fid = entry.processingStart - entry.startTime;
      });
    }).observe({ entryTypes: ["first-input"] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // @ts-expect-error - performanceMetrics is dynamically added
        if (!entry.hadRecentInput) {
          // @ts-expect-error - entry has value property
          clsValue += entry.value;
          // @ts-expect-error - performanceMetrics is dynamically added
          window.performanceMetrics.cls = clsValue;
        }
      }
    }).observe({ entryTypes: ["layout-shift"] });

    // First Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        // @ts-expect-error - performanceMetrics is dynamically added
        window.performanceMetrics.fcp = entry.startTime;
      });
    }).observe({ entryTypes: ["paint"] });
  });

  // Wait for metrics to be collected
  await page.waitForTimeout(3000);

  // Retrieve metrics
  const metrics = await page.evaluate(() => {
    // performanceMetrics is dynamically added
    return (
      (window as any).performanceMetrics || {
        lcp: 0,
        fid: 0,
        cls: 0,
        fcp: 0,
        tti: 0,
      }
    );
  });

  return metrics;
}

/**
 * Performs comprehensive UI audit
 */
export async function performUIAudit(
  page: Page,
  url: string,
  breakpoint: ResponsiveBreakpoint
): Promise<UIAuditResult> {
  // Set viewport for testing
  await page.setViewportSize({
    width: breakpoint.width,
    height: breakpoint.height,
  });

  // Navigate to page
  await page.goto(url, { waitUntil: "networkidle" });

  // Take screenshot
  const screenshotPath = `./audit-screenshots/${
    breakpoint.name
  }-${Date.now()}.png`;
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
    type: "png",
  });

  // Run accessibility audit
  const accessibilityViolations = await runAccessibilityAudit(page);

  // Validate touch targets
  const touchTargetViolations = await validateTouchTargets(page);

  // Measure performance
  const performanceMetrics = await measurePerformanceMetrics(page);

  // Check for layout shifts
  const layoutShifts = await page.evaluate(() => {
    return new Promise((resolve) => {
      let hasLayoutShift = false;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          hasLayoutShift = true;
        }
        observer.disconnect();
        resolve(hasLayoutShift);
      });
      observer.observe({ entryTypes: ["layout-shift"] });

      // Timeout after 2 seconds
      setTimeout(() => {
        observer.disconnect();
        resolve(hasLayoutShift);
      }, 2000);
    });
  });

  return {
    url,
    timestamp: new Date().toISOString(),
    accessibility: {
      violations: accessibilityViolations,
      passes: 0, // Would need to implement pass counting
      inapplicable: 0,
      incomplete: 0,
    },
    performance: performanceMetrics,
    responsive: {
      breakpoint,
      screenshotPath,
      layoutShifts: layoutShifts as boolean,
      touchTargetViolations,
    },
  };
}

/**
 * Generates HTML audit report
 */
export function generateAuditReport(auditResults: UIAuditResult[]): string {
  const reportDate = new Date().toLocaleDateString();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI Audit Report - ${reportDate}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; margin: 0; padding: 20px; }
    .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; }
    .audit-section { margin-bottom: 40px; }
    .violation { background: #fee2e2; border: 1px solid #fca5a5; border-radius: 6px; padding: 15px; margin: 10px 0; }
    .violation.critical { border-color: #dc2626; }
    .violation.serious { border-color: #ea580c; }
    .violation.moderate { border-color: #d97706; }
    .violation.minor { border-color: #65a30d; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .metric { background: #f8fafc; border-radius: 8px; padding: 20px; text-align: center; }
    .metric.good { background: #dcfce7; }
    .metric.warning { background: #fef3c7; }
    .metric.poor { background: #fee2e2; }
    .screenshot { max-width: 300px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="header">
    <h1>UI Audit Report</h1>
    <p><strong>Generated:</strong> ${reportDate}</p>
    <p><strong>Total Pages Audited:</strong> ${auditResults.length}</p>
  </div>
  
  ${auditResults
    .map(
      (result) => `
    <div class="audit-section">
      <h2>${result.url} - ${result.responsive.breakpoint.name}</h2>
      
      <div class="metrics">
        <div class="metric ${
          result.performance.lcp < 2500
            ? "good"
            : result.performance.lcp < 4000
            ? "warning"
            : "poor"
        }">
          <h3>LCP</h3>
          <p>${result.performance.lcp.toFixed(0)}ms</p>
        </div>
        <div class="metric ${
          result.performance.cls < 0.1
            ? "good"
            : result.performance.cls < 0.25
            ? "warning"
            : "poor"
        }">
          <h3>CLS</h3>
          <p>${result.performance.cls.toFixed(3)}</p>
        </div>
        <div class="metric ${
          result.accessibility.violations.length === 0 ? "good" : "poor"
        }">
          <h3>A11y Issues</h3>
          <p>${result.accessibility.violations.length}</p>
        </div>
      </div>
      
      ${
        result.accessibility.violations.length > 0
          ? `
        <h3>Accessibility Violations</h3>
        ${result.accessibility.violations
          .map(
            (violation) => `
          <div class="violation ${violation.impact}">
            <h4>${violation.id}</h4>
            <p><strong>Impact:</strong> ${violation.impact}</p>
            <p>${violation.description}</p>
            <a href="${violation.helpUrl}" target="_blank">Learn more</a>
          </div>
        `
          )
          .join("")}
      `
          : "<p>✅ No accessibility violations found!</p>"
      }
      
      ${
        result.responsive.touchTargetViolations.length > 0
          ? `
        <h3>Touch Target Violations</h3>
        ${result.responsive.touchTargetViolations
          .map(
            (violation) => `
          <div class="violation minor">
            <p><strong>Element:</strong> ${violation.selector}</p>
            <p><strong>Size:</strong> ${violation.size.width}x${violation.size.height}px (minimum 44x44px required)</p>
          </div>
        `
          )
          .join("")}
      `
          : ""
      }
      
      <h3>Screenshot</h3>
      <img src="${
        result.responsive.screenshotPath
      }" alt="Screenshot" class="screenshot" />
    </div>
  `
    )
    .join("")}
</body>
</html>`;

  return html;
}
