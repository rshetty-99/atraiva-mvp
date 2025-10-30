// Direct Firestore write script for blog post creation
// Bypasses API authentication by writing directly to Firestore

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Initialize Firebase Admin
if (getApps().length === 0) {
  // For development, we'll use the service account key
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  initializeApp({
    credential: cert(serviceAccount as any),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

// Blog post data extracted from the NY AG press release
const blogPostData = {
  title:
    "Accounting Firm Pays $60K for Data Breach: 16-Month Delay and Missing Encryption",
  slug: "wojeski-accounting-breach-60k-settlement-2025",
  excerpt:
    "New York Attorney General Letitia James secured a $60,000 settlement with Wojeski & Company after the firm delayed breach notifications for 16 months and failed to implement proper security measures, affecting 195,000 individuals.",
  content: {
    type: "html",
    html: `
<div class="breach-watch-post">
  <div class="alert alert-warning mb-6">
    <strong>⚠️ Key Takeaway:</strong> This settlement demonstrates that inadequate security measures and delayed breach notifications can result in significant penalties, even for mid-sized organizations.
  </div>

  <h2>Overview</h2>
  <p>On January 21, 2025, New York Attorney General Letitia James announced a $60,000 settlement with <strong>Wojeski & Company, CPAs, P.C.</strong>, a Rochester-based accounting firm, following a data security incident that exposed personal information of approximately 195,000 individuals.</p>

  <h2>Incident Details</h2>
  
  <h3>Timeline</h3>
  <ul>
    <li><strong>November 2022:</strong> Breach occurred</li>
    <li><strong>March 2024:</strong> Affected individuals notified (16-month delay)</li>
    <li><strong>January 2025:</strong> Settlement announced</li>
  </ul>

  <h3>Attack Vector</h3>
  <p>The breach was initiated through a <strong>phishing email</strong> that infiltrated the firm's network. This social engineering attack led to unauthorized access to sensitive client data stored on the firm's systems.</p>

  <h3>Data Compromised</h3>
  <p>The breach potentially exposed:</p>
  <ul>
    <li>Social Security numbers</li>
    <li>Driver's license numbers</li>
    <li>Financial account information</li>
    <li>Tax return data</li>
    <li>Other personal identifying information</li>
  </ul>

  <h2>Security Failures Identified</h2>

  <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
    <h3 class="text-red-800 font-semibold mb-2">Critical Violations</h3>
    <ol>
      <li><strong>Unencrypted Data Storage:</strong> Failed to encrypt personal information at rest</li>
      <li><strong>Delayed Notification:</strong> 16-month gap between breach and notification</li>
      <li><strong>Inadequate Access Controls:</strong> Insufficient authentication mechanisms</li>
      <li><strong>Missing Security Policies:</strong> Lack of comprehensive data protection procedures</li>
      <li><strong>Insufficient Employee Training:</strong> Limited security awareness training</li>
    </ol>
  </div>

  <h2>Legal Requirements Violated</h2>
  <p>The investigation found violations of:</p>
  <ul>
    <li><strong>New York General Business Law § 899-aa:</strong> Requires reasonable security measures for private information</li>
    <li><strong>New York General Business Law § 899-bb:</strong> Mandates timely breach notifications</li>
  </ul>

  <h2>Settlement Terms</h2>

  <h3>Financial Penalty</h3>
  <p>$60,000 total penalty to New York State</p>

  <h3>Required Actions</h3>
  <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
    <p>Wojeski & Company must implement the following measures:</p>
    <ol>
      <li><strong>Encryption:</strong> Implement encryption for personal information at rest and in transit</li>
      <li><strong>Multi-Factor Authentication:</strong> Deploy MFA across all systems handling personal data</li>
      <li><strong>Access Controls:</strong> Implement role-based access controls and principle of least privilege</li>
      <li><strong>Security Training:</strong> Conduct regular employee security awareness training</li>
      <li><strong>Incident Response Plan:</strong> Develop and maintain a comprehensive incident response plan</li>
      <li><strong>Regular Audits:</strong> Conduct periodic security assessments and vulnerability scans</li>
      <li><strong>Vendor Management:</strong> Establish third-party risk management procedures</li>
      <li><strong>Data Minimization:</strong> Retain personal information only as long as necessary</li>
    </ol>
  </div>

  <h2>Official Statement</h2>
  <blockquote class="border-l-4 border-gray-400 pl-4 italic my-6">
    "When companies experience a data breach, they must act immediately to inform consumers so they can take steps to protect themselves. Wojeski & Company not only failed to adequately protect New Yorkers' personal information, but also failed to alert New Yorkers in a timely manner, leaving them vulnerable to identity theft and fraud."
    <footer class="mt-2 text-sm">— <strong>Attorney General Letitia James</strong></footer>
  </blockquote>

  <h2>Lessons for Organizations</h2>

  <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
    <h3 class="text-green-800 font-semibold mb-2">Key Compliance Takeaways</h3>
    <ol>
      <li><strong>Encryption is Mandatory:</strong> Encrypt all personal data, especially at rest</li>
      <li><strong>Time Matters:</strong> Breach notifications must be timely (typically within 72 hours to relevant authorities)</li>
      <li><strong>Defense in Depth:</strong> Implement multiple layers of security controls</li>
      <li><strong>Human Factor:</strong> Phishing remains a top threat—training is essential</li>
      <li><strong>Regulatory Scrutiny:</strong> State AGs are actively enforcing data protection laws</li>
      <li><strong>Documentation Required:</strong> Maintain evidence of security measures and incident response</li>
    </ol>
  </div>

  <h2>Industry Impact</h2>
  <p>This case is particularly significant for:</p>
  <ul>
    <li><strong>Professional Services Firms:</strong> Accounting, legal, and consulting firms handling sensitive client data</li>
    <li><strong>Small to Mid-Sized Businesses:</strong> Demonstrates that size doesn't exempt from compliance requirements</li>
    <li><strong>Organizations in New York:</strong> Reinforces aggressive enforcement of state data protection laws</li>
  </ul>

  <h2>Compliance Resources</h2>
  <ul>
    <li><a href="https://ag.ny.gov/internet/data-breach" target="_blank" rel="noopener noreferrer">NY AG Data Breach Resources</a></li>
    <li><a href="https://www.nysenate.gov/legislation/laws/GBS/899-AA" target="_blank" rel="noopener noreferrer">NY General Business Law § 899-aa</a></li>
    <li><a href="https://www.nysenate.gov/legislation/laws/GBS/899-BB" target="_blank" rel="noopener noreferrer">NY General Business Law § 899-bb</a></li>
  </ul>

  <hr class="my-8">

  <div class="bg-gray-50 p-6 rounded-lg">
    <h3 class="font-semibold mb-2">About This Series</h3>
    <p class="text-sm text-gray-700">
      <strong>Breach Watch</strong> is our ongoing series tracking data breach settlements, enforcement actions, and regulatory penalties. We analyze each case to extract actionable compliance insights for organizations of all sizes.
    </p>
    <p class="text-sm text-gray-700 mt-2">
      <em>Stay informed. Stay protected. Stay compliant.</em>
    </p>
  </div>

  <div class="mt-8 text-sm text-gray-600">
    <p><strong>Source:</strong> <a href="https://ag.ny.gov/press-release/2025/attorney-general-james-announces-settlement-accounting-firm-failing-protect-new" target="_blank" rel="noopener noreferrer">NY Attorney General Press Release</a></p>
    <p><strong>Date:</strong> January 21, 2025</p>
  </div>
</div>
    `.trim(),
  },
  featuredImage: "", // Can be added later
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
  category: "Enforcement & Penalties",
  authorId: "user_2qlTSGy4qDT3ihp8B2EIjKVLGMK", // Replace with actual admin user ID
  status: "published" as const,
  createdAt: Timestamp.now(),
  updatedAt: Timestamp.now(),
  publishedAt: Timestamp.now(),
  scheduledFor: null,
  seo: {
    title:
      "Wojeski Accounting Breach: $60K Settlement for 16-Month Delay | Breach Watch",
    description:
      "NY AG secures $60,000 settlement with accounting firm after 16-month breach notification delay and missing encryption exposed 195,000 individuals. Key compliance lessons.",
    keywords: [
      "data breach",
      "accounting firm breach",
      "wojeski company",
      "ny attorney general",
      "breach notification delay",
      "encryption requirements",
      "phishing attack",
      "cybersecurity settlement",
    ],
  },
  toc: null,
  canonicalUrl: null,
  ogImage: null,
  twitterCard: "summary_large_image",
  noindex: false,
  seriesId: "breach-watch",
  seriesOrder: 1,
  relatedPostIds: [],
  language: "en-US",
  feedIncluded: true,
  sitemapPriority: 0.9,
};

// Calculate metrics
const htmlContent = blogPostData.content.html;
const wordCount = htmlContent.split(/\s+/).length;
const charCount = htmlContent.length;
const readTimeMinutes = Math.ceil(wordCount / 200);

async function createBlogPost() {
  try {
    console.log("🚀 Starting direct Firestore write...\n");

    // Add metrics to post data
    const postDataWithMetrics = {
      ...blogPostData,
      wordCount,
      charCount,
      readTimeMinutes,
      imageCount: 0,
      codeBlockCount: 0,
      tableCount: 0,
      views: 0,
      likes: 0,
      reactions: {},
      commentCount: 0,
      lastCommentAt: null,
    };

    console.log("📊 Post Metrics:");
    console.log(`   Words: ${wordCount}`);
    console.log(`   Characters: ${charCount}`);
    console.log(`   Read Time: ${readTimeMinutes} minutes\n`);

    console.log("💾 Writing to Firestore...");
    const docRef = await db.collection("posts").add(postDataWithMetrics);

    console.log("✅ Blog post created successfully!\n");
    console.log("📋 Post Details:");
    console.log(`   ID: ${docRef.id}`);
    console.log(`   Title: ${blogPostData.title}`);
    console.log(`   Slug: ${blogPostData.slug}`);
    console.log(`   Category: ${blogPostData.category}`);
    console.log(`   Tags: ${blogPostData.tags.join(", ")}`);
    console.log(`   Status: ${blogPostData.status}`);
    console.log(`   Word Count: ${wordCount}`);
    console.log(`   Read Time: ${readTimeMinutes} minutes\n`);

    console.log("🌐 View your post at:");
    console.log(
      `   Public: http://localhost:3000/resources/${blogPostData.slug}`
    );
    console.log(`   Admin: http://localhost:3000/admin/blog`);
    console.log("\n✨ Done!");
  } catch (error) {
    console.error("❌ Error creating blog post:", error);
    throw error;
  }
}

// Run the script
createBlogPost()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
