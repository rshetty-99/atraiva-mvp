const STANDARD_TIMEOUT_MS = 30000;
const HEADLESS_TIMEOUT_MS = 35000;
const MIN_HTML_LENGTH = 2000;
const MIN_TEXT_LENGTH = 1200;

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36";

export type FetchMode = "standard" | "headless";

export interface FetchHtmlResult {
  html: string;
  mode: FetchMode;
}

/**
 * Fetch HTML using a regular fetch and fall back to a headless browser if the
 * returned markup looks incomplete (e.g., rendered via client-side JS).
 */
export async function fetchHtmlWithFallback(
  url: string
): Promise<FetchHtmlResult> {
  const standardHtml = await fetchWithStandardRequest(url);

  if (standardHtml && !shouldFallbackToHeadless(standardHtml)) {
    return { html: standardHtml, mode: "standard" };
  }

  const headlessHtml = await fetchWithHeadlessBrowser(url);

  if (headlessHtml) {
    return { html: headlessHtml, mode: "headless" };
  }

  if (standardHtml) {
    console.warn(
      "[blog] Headless fetch failed; returning standard HTML response."
    );
    return { html: standardHtml, mode: "standard" };
  }

  throw new Error("Unable to retrieve HTML content from the provided URL.");
}

/**
 * Perform a standard fetch request for the page HTML.
 */
async function fetchWithStandardRequest(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), STANDARD_TIMEOUT_MS);

    const response = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(
        `[blog] Standard fetch returned status ${response.status} for ${url}`
      );
      return null;
    }

    const html = await response.text();
    return html || null;
  } catch (error) {
    console.warn("[blog] Standard fetch failed", error);
    return null;
  }
}

/**
 * Determine if we should escalate to headless scraping.
 */
function shouldFallbackToHeadless(html: string): boolean {
  if (!html) {
    return true;
  }

  const paragraphMatches = html.match(/<p[\s>]/gi)?.length ?? 0;
  const articleMatches = html.match(/<article[\s>]/gi)?.length ?? 0;

  // Strip HTML tags to get raw text length
  const textLength = html.replace(/<[^>]+>/g, " ").trim().length;

  // Many JS-rendered pages return placeholder shells with very little content.
  if (html.length < MIN_HTML_LENGTH || textLength < MIN_TEXT_LENGTH) {
    return true;
  }

  if (paragraphMatches < 3 && articleMatches === 0) {
    return true;
  }

  const requiresJsPhrases = [
    "enable javascript",
    "please enable javascript",
    "requires javascript",
    "use a browser that supports javascript",
  ];

  const lowerHtml = html.toLowerCase();
  if (requiresJsPhrases.some((phrase) => lowerHtml.includes(phrase))) {
    return true;
  }

  return false;
}

/**
 * Use a headless browser (Puppeteer) to fetch the fully rendered HTML.
 */
async function fetchWithHeadlessBrowser(url: string): Promise<string | null> {
  try {
    const puppeteerModule = await loadPuppeteer();
    if (!puppeteerModule) {
      console.warn("[blog] Puppeteer is not available in this environment.");
      return null;
    }

    const launchOptions = await resolveLaunchOptions();
    const browser = await puppeteerModule.launch(launchOptions);

    try {
      const page = await browser.newPage();
      await page.setUserAgent(USER_AGENT);

      await page.goto(url, {
        waitUntil: ["domcontentloaded", "networkidle0"],
        timeout: HEADLESS_TIMEOUT_MS,
      });

      // Allow late-loading scripts a brief moment to settle.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const html = await page.content();
      return html || null;
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.warn("[blog] Headless fetch failed", error);
    return null;
  }
}

type PuppeteerModule = {
  launch: (options?: Record<string, unknown>) => Promise<{
    newPage: () => Promise<{
      setUserAgent: (ua: string) => Promise<void>;
      goto: (url: string, options?: Record<string, unknown>) => Promise<void>;
      content: () => Promise<string>;
    }>;
    close: () => Promise<void>;
  }>;
};

async function loadPuppeteer(): Promise<PuppeteerModule | null> {
  try {
    const puppeteerModule = (await import("puppeteer-core")) as unknown as
      | PuppeteerModule
      | ({ default: PuppeteerModule } & Record<string, unknown>);

    if (
      typeof puppeteerModule === "object" &&
      puppeteerModule !== null &&
      "default" in puppeteerModule &&
      puppeteerModule.default
    ) {
      return puppeteerModule.default;
    }

    return puppeteerModule as PuppeteerModule;
  } catch (error) {
    console.warn(
      "[blog] Puppeteer-core is not available; headless scraping disabled.",
      error
    );
    return null;
  }
}

async function resolveLaunchOptions(): Promise<Record<string, unknown>> {
  const baseArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-accelerated-2d-canvas",
    "--disable-gpu",
    "--no-first-run",
    "--no-zygote",
    "--single-process",
  ];

  try {
    const chromiumModule = await import("@sparticuz/chromium");
    const chromium = chromiumModule.default ?? chromiumModule;

    const executablePath = await chromium.executablePath();

    return {
      args: chromium.args ?? baseArgs,
      defaultViewport: chromium.defaultViewport ?? { width: 1280, height: 720 },
      executablePath,
      headless:
        typeof chromium.headless === "boolean"
          ? chromium.headless
          : chromium.headless ?? true,
    };
  } catch (error) {
    console.warn(
      "[blog] Falling back to bundled Chromium",
      error instanceof Error ? error.message : error
    );

    return {
      args: baseArgs,
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    };
  }
}
