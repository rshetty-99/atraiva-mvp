/**
 * Playwright script to create the Wojeski breach blog post
 * using the Breach Watch template
 *
 * Run with: npx ts-node scripts/create-wojeski-blog-post.ts
 * Or: npx playwright test scripts/create-wojeski-blog-post.ts --headed
 */

import { chromium, Browser, Page } from "playwright";

// Blog post data from NY AG press release
const blogPostData = {
  // Meta
  title:
    "Accounting Firm Pays $60K for Data Breach: 16-Month Delay and Missing Encryption",
  slug: "wojeski-accounting-breach-60k-settlement-2025",
  excerpt:
    "Wojeski & Company settles for $60,000 after ransomware attack exposed 4,726 New Yorkers' data. Learn the critical failures that led to this penalty and how to protect your business.",

  // SEO
  seoTitle: "Accounting Firm Pays $60K for Data Breach: 16-Month Delay",
  seoDescription:
    "Wojeski & Company settles for $60,000 after ransomware attack exposed 4,726 New Yorkers' data. Learn from their mistakes.",
  seoKeywords:
    "data breach, accounting firm, wojeski, ransomware, ny ag settlement, encryption, phishing",

  // Content - Full HTML from template
  content: `<h2>Executive Summary</h2>
<p><strong>Company:</strong> Wojeski & Company</p>
<p><strong>Industry:</strong> Accounting</p>
<p><strong>Incident Date:</strong> July 28, 2023</p>
<p><strong>Notification Date:</strong> November 2024</p>
<p><strong>Individuals Affected:</strong> 4,726 New Yorkers (5,881 total)</p>
<p><strong>Penalty:</strong> $60,000</p>
<p><strong>Regulator:</strong> New York Attorney General Letitia James</p>

<h2>What Happened</h2>
<p>On July 28, 2023, employees at Wojeski & Company, a certified public accounting firm, discovered they were locked out of their systems—a telltale sign of a ransomware attack. The investigation revealed that a phishing email sent to one of their employees had compromised the network, giving attackers access to sensitive client data.</p>

<p>The breach investigation uncovered a critical security failure: customers' Social Security Numbers were stored unencrypted across parts of the company's network. While the firm worked to contain the initial breach, a second incident occurred on May 31, 2024, when an employee from a firm hired to help with the breach investigation improperly accessed customer data and sent it to several external email addresses without authorization.</p>

<h3>Timeline</h3>
<ul>
  <li><strong>July 28, 2023</strong> - Ransomware attack detected when employees couldn't access files</li>
  <li><strong>May 31, 2024</strong> - Second data breach by investigation contractor</li>
  <li><strong>November 2024</strong> - Customers finally notified (16 months after first breach)</li>
  <li><strong>October 20, 2025</strong> - $60,000 settlement announced by NY Attorney General</li>
</ul>

<h2>Data Exposed</h2>
<p>The breach exposed the following types of personal information:</p>
<ul>
  <li>Social Security Numbers (unencrypted)</li>
  <li>Names and dates of birth</li>
  <li>Driver's license numbers</li>
  <li>Email addresses and phone numbers</li>
  <li>Financial account numbers</li>
  <li>Medical benefits information</li>
  <li>Entitlement information</li>
</ul>

<p>The 2023 breach affected 5,881 individuals (4,726 New York residents), and the 2024 breach affected 351 individuals (267 New York residents).</p>

<h2>Violations & Failures</h2>
<p>The investigation by the New York Attorney General's Office revealed multiple security and compliance failures:</p>

<h3>Technical Failures</h3>
<ul>
  <li><strong>No Encryption</strong>: Social Security Numbers and other sensitive data were stored in plain text without encryption, violating basic data security standards</li>
  <li><strong>Phishing Vulnerability</strong>: Employees lacked adequate training to recognize and report phishing emails, the #1 cause of ransomware attacks</li>
  <li><strong>Poor Vendor Management</strong>: The firm hired to help investigate the breach had improper access to customer data and no adequate oversight</li>
  <li><strong>Weak Access Controls</strong>: Employees and contractors had excessive access to sensitive information without proper authentication or monitoring</li>
</ul>

<h3>Compliance Failures</h3>
<ul>
  <li><strong>Massive Notification Delay</strong>: Wojeski took over a year and a half (16 months) to notify customers of the breach, far exceeding New York's requirement for prompt notification</li>
  <li><strong>Inadequate Incident Response</strong>: The company lacked a proper incident response plan, leading to confusion and delays in containment and notification</li>
</ul>

<h2>Penalties & Consequences</h2>

<h3>Financial Penalties</h3>
<ul>
  <li><strong>Total Settlement:</strong> $60,000</li>
  <li><strong>Credit Monitoring:</strong> One year of free credit report monitoring for all affected individuals</li>
</ul>

<h3>Required Remediation Measures</h3>
<p>As part of the settlement, Wojeski & Company must implement the following security measures:</p>
<ol>
  <li><strong>Comprehensive Security Program</strong>: Maintain a comprehensive information security program to protect the security, integrity, and confidentiality of customer information</li>
  <li><strong>Data Encryption</strong>: Encrypt all personal information that the company collects, stores, transmits, and/or maintains</li>
  <li><strong>Data Inventory</strong>: Develop and maintain an inventory of where personal data is stored within its network</li>
  <li><strong>Access Controls</strong>: Maintain reasonable account management and authentication processes that limit employees' access to sensitive information as necessary</li>
  <li><strong>Vulnerability Management</strong>: Establish a program designed to identify and correct security vulnerabilities within its computer network</li>
  <li><strong>Incident Response Plan</strong>: Implement an incident response plan ensuring timely notice to consumers</li>
  <li><strong>Employee Training</strong>: Implement a cybersecurity training program to be completed by all employees</li>
</ol>

<h2>Key Takeaways for Your Business</h2>

<h3>1. Encrypt Everything—Especially Social Security Numbers</h3>
<p>The failure to encrypt Social Security Numbers was a critical vulnerability that directly contributed to this settlement. Encryption is not optional—it's a legal requirement in most states and a fundamental security control. If attackers access your encrypted data, it's essentially worthless to them.</p>
<p><strong>Action:</strong> Audit your systems today. If any SSNs, financial data, or health information isn't encrypted both at rest and in transit, prioritize fixing this immediately.</p>

<h3>2. Employee Training Prevents 90% of Breaches</h3>
<p>This breach started with a single phishing email. One employee clicking one malicious link gave attackers the keys to the kingdom. Regular security awareness training and phishing simulations are not just best practices—they're essential business continuity measures.</p>
<p><strong>Action:</strong> Implement quarterly phishing simulations and annual security training for all employees. Track completion rates and retrain employees who fall for simulated attacks.</p>

<h3>3. Notification Delays Compound Penalties</h3>
<p>Wojeski's 16-month delay in notifying customers turned a bad situation into a costly settlement. New York law requires businesses to notify affected individuals "in the most expeditious time possible and without unreasonable delay." Most states require notification within 30-60 days of discovering a breach.</p>
<p><strong>Action:</strong> Document your breach notification procedures now. Know exactly who to notify, when, and how. Template your notification letters in advance.</p>

<h3>4. Vendor Management is Your Responsibility</h3>
<p>The second breach—caused by a vendor hired to help with the first breach—demonstrates that third-party risk is your risk. When you give vendors access to customer data, you're responsible for their security practices.</p>
<p><strong>Action:</strong> Conduct security assessments of all vendors with data access. Include security requirements in contracts. Monitor vendor activity and limit access to only what's necessary.</p>

<h2>How Atraiva Can Help</h2>
<p>This case demonstrates the complexity of data breach compliance. Atraiva provides:</p>

<ul>
  <li><strong>🔍 Real-Time Breach Monitoring</strong>: Stay informed of regulatory actions in your industry so you can learn from others' mistakes before they become your own</li>
  <li><strong>📋 50-State Compliance Tracking</strong>: Know your obligations in every jurisdiction where you do business, with automatic updates when laws change</li>
  <li><strong>⚡ Automated Breach Response</strong>: Pre-built templates and timelines for compliant notification in all 50 states, ensuring you meet every deadline</li>
  <li><strong>🎓 Training Management</strong>: Track and manage security awareness training completion across your organization</li>
  <li><strong>📊 Compliance Dashboard</strong>: Monitor your security posture in real-time with automated compliance assessments and remediation tracking</li>
</ul>

<p style="text-align: center; margin-top: 30px;">
  <a href="/contact" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Schedule a Compliance Assessment</a>
</p>

<h2>Additional Resources</h2>
<ul>
  <li><a href="https://ag.ny.gov/press-release/2025/attorney-general-james-announces-settlement-accounting-firm-failing-protect-new" target="_blank" rel="noopener noreferrer">Official Press Release from New York Attorney General</a></li>
  <li><a href="/resources/state-regulations" target="_blank">State-by-State Breach Notification Requirements</a></li>
  <li><a href="/resources/incident-response" target="_blank">Incident Response Planning Guide</a></li>
</ul>

<hr style="margin: 40px 0;" />

<p style="font-size: 14px; color: #666;">
  <strong>About This Series:</strong> Atraiva's Breach Watch series analyzes real enforcement actions to help organizations learn from others' mistakes and strengthen their own security posture. Subscribe to stay informed of the latest regulatory actions and compliance requirements.
</p>

<p style="font-size: 14px; color: #666;">
  <strong>Source:</strong> <a href="https://ag.ny.gov/press-release/2025/attorney-general-james-announces-settlement-accounting-firm-failing-protect-new" target="_blank" rel="noopener noreferrer">New York Attorney General Press Release</a>, October 20, 2025
</p>`,

  tags: [
    "data-breach",
    "compliance",
    "security",
    "enforcement",
    "accounting",
    "ransomware",
    "phishing",
    "new-york",
  ],
  category: "Breach Notifications",
  status: "published",
};

async function createBlogPost() {
  console.log("🚀 Starting Playwright automation...\n");

  const browser: Browser = await chromium.launch({
    headless: false, // Set to true for headless mode
    slowMo: 500, // Slow down actions so you can see what's happening
  });

  const context = await browser.newContext();
  const page: Page = await context.newPage();

  try {
    // Navigate to your local dev server
    console.log("📍 Navigating to blog create page...");
    await page.goto("http://localhost:3000/admin/blog/create");

    // Wait for page to load
    await page.waitForLoadState("networkidle");
    console.log("✅ Page loaded\n");

    // Wait for template selector dialog to appear
    console.log("⏳ Waiting for template selector dialog...");
    await page.waitForSelector("text=Choose a Blog Template", {
      timeout: 10000,
    });
    console.log("✅ Template dialog appeared\n");

    // Click on Breach Watch template
    console.log("🚨 Selecting Breach Watch template...");
    await page.click("text=Breach Watch");
    await page.waitForTimeout(1000);
    console.log("✅ Template selected\n");

    // Wait for template to load
    await page.waitForTimeout(2000);

    // Fill in the title
    console.log("📝 Filling in title...");
    await page.fill('input[id="title"]', blogPostData.title);
    console.log("✅ Title filled\n");

    // Fill in the slug
    console.log("🔗 Filling in slug...");
    await page.fill('input[id="slug"]', blogPostData.slug);
    console.log("✅ Slug filled\n");

    // Fill in the excerpt
    console.log("📄 Filling in excerpt...");
    await page.fill('textarea[id="excerpt"]', blogPostData.excerpt);
    console.log("✅ Excerpt filled\n");

    // Fill in the category
    console.log("📁 Filling in category...");
    await page.fill(
      'input[placeholder*="Security, Compliance"]',
      blogPostData.category
    );
    console.log("✅ Category filled\n");

    // The tags and content should already be set by the template
    // But we need to update the content with our specific data

    // Wait for Quill editor to be ready
    console.log("⏳ Waiting for editor...");
    await page.waitForSelector(".ql-editor", { timeout: 10000 });
    await page.waitForTimeout(2000);
    console.log("✅ Editor ready\n");

    // Clear existing content and set our content
    console.log("📝 Setting blog content...");
    await page.evaluate((content) => {
      const editor = document.querySelector(".ql-editor");
      if (editor) {
        editor.innerHTML = content;
      }
    }, blogPostData.content);
    console.log("✅ Content set\n");

    // Fill in SEO fields (if they exist)
    console.log("🔍 Filling in SEO fields...");
    try {
      const seoTitleInput = page
        .locator("input")
        .filter({ hasText: /SEO Title|Meta Title/i });
      if ((await seoTitleInput.count()) > 0) {
        await seoTitleInput.first().fill(blogPostData.seoTitle);
      }

      const seoDescInput = page
        .locator("textarea")
        .filter({ hasText: /SEO Description|Meta Description/i });
      if ((await seoDescInput.count()) > 0) {
        await seoDescInput.first().fill(blogPostData.seoDescription);
      }
    } catch (e) {
      console.log("⚠️  SEO fields not found, skipping...\n");
    }

    // Set status to published
    console.log("📢 Setting status to published...");
    try {
      await page.click('button:has-text("Status")');
      await page.waitForTimeout(500);
      await page.click("text=published");
      await page.waitForTimeout(500);
    } catch (e) {
      console.log("⚠️  Status selector not found, will default to draft\n");
    }

    // Screenshot before submission
    console.log("📸 Taking screenshot...");
    await page.screenshot({
      path: "scripts/blog-post-preview.png",
      fullPage: true,
    });
    console.log("✅ Screenshot saved to scripts/blog-post-preview.png\n");

    // Submit the form
    console.log("🚀 Submitting blog post...");
    await page.click('button:has-text("Create Post")');

    // Wait for success message or redirect
    console.log("⏳ Waiting for submission...");
    await page.waitForTimeout(3000);

    // Check for success
    const currentUrl = page.url();
    if (currentUrl.includes("/admin/blog") && !currentUrl.includes("/create")) {
      console.log("✅ SUCCESS! Blog post created and saved to Firestore!\n");
      console.log(`📍 Redirected to: ${currentUrl}\n`);
    } else {
      console.log("⚠️  Submission status unclear. Please check manually.\n");
    }

    // Take final screenshot
    await page.screenshot({
      path: "scripts/blog-post-success.png",
      fullPage: true,
    });
    console.log("📸 Final screenshot saved\n");

    console.log("🎉 Automation complete!");
    console.log("📊 Post Details:");
    console.log(`   Title: ${blogPostData.title}`);
    console.log(`   Slug: ${blogPostData.slug}`);
    console.log(`   Tags: ${blogPostData.tags.join(", ")}`);
    console.log(`   Status: ${blogPostData.status}`);
    console.log("\n✨ Your blog post should now be live at:");
    console.log(`   http://localhost:3000/resources/${blogPostData.slug}`);
  } catch (error) {
    console.error("❌ Error during automation:", error);
    await page.screenshot({
      path: "scripts/error-screenshot.png",
      fullPage: true,
    });
    console.log("📸 Error screenshot saved to scripts/error-screenshot.png");
  } finally {
    // Keep browser open for 5 seconds to see result
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

// Run the automation
createBlogPost().catch(console.error);







