// Blog post templates for various content types
import { BlogTemplate } from "@/types/blog";

export const blogTemplates: BlogTemplate[] = [
  // ========================================
  // 1. BREACH WATCH TEMPLATE
  // ========================================
  {
    id: "breach-watch",
    name: "Breach Watch",
    description:
      "Template for regulatory breach notifications and enforcement actions",
    category: "news",
    icon: "🚨",
    defaultTitle: "[Company Name] Settles Data Breach Case: Key Lessons",
    defaultExcerpt:
      "Recent enforcement action highlights critical security requirements and penalties for non-compliance.",
    defaultTags: ["data-breach", "compliance", "security", "enforcement"],
    defaultCategory: "Breach Notifications",
    defaultContent: `
<h2>Executive Summary</h2>
<p><strong>Company:</strong> [COMPANY_NAME]</p>
<p><strong>Industry:</strong> [INDUSTRY]</p>
<p><strong>Incident Date:</strong> [INCIDENT_DATE]</p>
<p><strong>Notification Date:</strong> [NOTIFICATION_DATE]</p>
<p><strong>Individuals Affected:</strong> [NUMBER_AFFECTED]</p>
<p><strong>Penalty:</strong> $[PENALTY_AMOUNT]</p>
<p><strong>Regulator:</strong> [REGULATOR_NAME]</p>

<h2>What Happened</h2>
<p>[Describe the incident: What type of attack? How was the company compromised? When did it occur?]</p>

<h3>Timeline</h3>
<ul>
  <li><strong>[DATE]</strong> - [Event: e.g., "Ransomware attack detected"]</li>
  <li><strong>[DATE]</strong> - [Event: e.g., "Investigation completed"]</li>
  <li><strong>[DATE]</strong> - [Event: e.g., "Consumers notified"]</li>
  <li><strong>[DATE]</strong> - [Event: e.g., "Settlement announced"]</li>
</ul>

<h2>Data Exposed</h2>
<p>The breach exposed the following types of personal information:</p>
<ul>
  <li>[Type 1: e.g., "Social Security Numbers"]</li>
  <li>[Type 2: e.g., "Names and addresses"]</li>
  <li>[Type 3: e.g., "Financial account information"]</li>
  <li>[Add more as needed]</li>
</ul>

<h2>Violations & Failures</h2>
<p>The investigation revealed the following security failures:</p>

<h3>Technical Failures</h3>
<ul>
  <li><strong>[Failure 1]</strong>: [Description and impact]</li>
  <li><strong>[Failure 2]</strong>: [Description and impact]</li>
  <li><strong>[Failure 3]</strong>: [Description and impact]</li>
</ul>

<h3>Compliance Failures</h3>
<ul>
  <li><strong>[Failure 1]</strong>: [Description, e.g., "Delayed breach notification by 16 months"]</li>
  <li><strong>[Failure 2]</strong>: [Description]</li>
</ul>

<h2>Penalties & Consequences</h2>

<h3>Financial Penalties</h3>
<ul>
  <li><strong>Total Settlement:</strong> $[AMOUNT]</li>
  <li><strong>Credit Monitoring:</strong> [Duration] of free credit monitoring for affected individuals</li>
</ul>

<h3>Required Remediation Measures</h3>
<p>As part of the settlement, [COMPANY_NAME] must implement the following security measures:</p>
<ol>
  <li><strong>Comprehensive Security Program</strong>: [Details]</li>
  <li><strong>Data Encryption</strong>: [Requirements]</li>
  <li><strong>Data Inventory</strong>: [Requirements]</li>
  <li><strong>Access Controls</strong>: [Requirements]</li>
  <li><strong>Vulnerability Management</strong>: [Requirements]</li>
  <li><strong>Incident Response Plan</strong>: [Requirements]</li>
  <li><strong>Employee Training</strong>: [Requirements]</li>
</ol>

<h2>Key Takeaways for Your Business</h2>

<h3>1. [Takeaway Title]</h3>
<p>[Lesson learned and actionable advice]</p>

<h3>2. [Takeaway Title]</h3>
<p>[Lesson learned and actionable advice]</p>

<h3>3. [Takeaway Title]</h3>
<p>[Lesson learned and actionable advice]</p>

<h3>4. [Takeaway Title]</h3>
<p>[Lesson learned and actionable advice]</p>

<h2>Industry-Specific Implications</h2>
<p><strong>For [INDUSTRY] Companies:</strong> [Specific guidance for companies in the same industry]</p>

<h2>Compliance Checklist</h2>
<p>Use this checklist to ensure your organization meets the standards highlighted in this case:</p>

<h3>✅ Data Security</h3>
<ul>
  <li>[ ] All sensitive data is encrypted at rest and in transit</li>
  <li>[ ] Multi-factor authentication is enabled for all systems</li>
  <li>[ ] Regular security audits are conducted</li>
  <li>[ ] Vulnerability scanning is performed regularly</li>
</ul>

<h3>✅ Access Controls</h3>
<ul>
  <li>[ ] Principle of least privilege is enforced</li>
  <li>[ ] Employee access is reviewed quarterly</li>
  <li>[ ] Strong password policies are in place</li>
</ul>

<h3>✅ Incident Response</h3>
<ul>
  <li>[ ] Incident response plan exists and is tested</li>
  <li>[ ] Breach notification procedures are documented</li>
  <li>[ ] Response team roles are clearly defined</li>
</ul>

<h3>✅ Training & Awareness</h3>
<ul>
  <li>[ ] Annual security training for all employees</li>
  <li>[ ] Phishing simulation exercises conducted</li>
  <li>[ ] Security policies are accessible and understood</li>
</ul>

<h2>State-Specific Requirements</h2>
<p>This incident occurred in [STATE]. Key state-specific requirements include:</p>
<ul>
  <li><strong>Notification Timeline:</strong> [Details]</li>
  <li><strong>Required Notices:</strong> [Who must be notified]</li>
  <li><strong>Penalties:</strong> [Range of penalties]</li>
</ul>

<blockquote>
  <p><strong>Important:</strong> Breach notification laws vary by state. Companies must understand requirements in all states where affected individuals reside.</p>
</blockquote>

<h2>How Atraiva Can Help</h2>
<p>This case demonstrates the complexity of data breach compliance. Atraiva provides:</p>

<ul>
  <li><strong>🔍 Real-Time Breach Monitoring</strong>: Stay informed of regulatory actions in your industry</li>
  <li><strong>📋 50-State Compliance Tracking</strong>: Know your obligations in every jurisdiction</li>
  <li><strong>⚡ Automated Breach Response</strong>: Pre-built templates and timelines for compliant notification</li>
  <li><strong>🎓 Training Management</strong>: Track and manage security awareness training</li>
  <li><strong>📊 Compliance Dashboard</strong>: Monitor your security posture in real-time</li>
</ul>

<p style="text-align: center; margin-top: 30px;">
  <a href="/contact" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Schedule a Compliance Assessment</a>
</p>

<h2>Additional Resources</h2>
<ul>
  <li><a href="[SOURCE_URL]" target="_blank" rel="noopener noreferrer">Official Press Release from [REGULATOR]</a></li>
  <li><a href="/resources/state-regulations" target="_blank">State-by-State Breach Notification Requirements</a></li>
  <li><a href="/resources/incident-response" target="_blank">Incident Response Planning Guide</a></li>
</ul>

<hr style="margin: 40px 0;" />

<p style="font-size: 14px; color: #666;">
  <strong>About This Series:</strong> Atraiva's Breach Watch series analyzes real enforcement actions to help organizations learn from others' mistakes and strengthen their own security posture. Subscribe to stay informed of the latest regulatory actions and compliance requirements.
</p>

<p style="font-size: 14px; color: #666;">
  <strong>Source:</strong> <a href="[SOURCE_URL]" target="_blank" rel="noopener noreferrer">[SOURCE_NAME]</a>, [DATE]
</p>
`,
    sections: [
      {
        id: "summary",
        name: "Executive Summary",
        description: "Quick facts about the breach",
        required: true,
        order: 1,
      },
      {
        id: "what-happened",
        name: "What Happened",
        description: "Incident description and timeline",
        required: true,
        order: 2,
      },
      {
        id: "data-exposed",
        name: "Data Exposed",
        description: "Types of data compromised",
        required: true,
        order: 3,
      },
      {
        id: "violations",
        name: "Violations & Failures",
        description: "What went wrong",
        required: true,
        order: 4,
      },
      {
        id: "penalties",
        name: "Penalties & Consequences",
        description: "Financial and operational impacts",
        required: true,
        order: 5,
      },
      {
        id: "takeaways",
        name: "Key Takeaways",
        description: "Lessons for readers",
        required: true,
        order: 6,
      },
      {
        id: "checklist",
        name: "Compliance Checklist",
        description: "Actionable items",
        required: false,
        order: 7,
      },
      {
        id: "cta",
        name: "Call to Action",
        description: "How Atraiva helps",
        required: false,
        order: 8,
      },
    ],
    placeholders: [
      {
        id: "COMPANY_NAME",
        label: "Company Name",
        type: "text",
        example: "Acme Corporation",
      },
      {
        id: "INDUSTRY",
        label: "Industry",
        type: "text",
        example: "Healthcare, Finance, Accounting",
      },
      {
        id: "INCIDENT_DATE",
        label: "Incident Date",
        type: "date",
        example: "July 28, 2023",
      },
      {
        id: "NOTIFICATION_DATE",
        label: "Notification Date",
        type: "date",
        example: "November 15, 2024",
      },
      {
        id: "NUMBER_AFFECTED",
        label: "Number of Individuals Affected",
        type: "number",
        example: "4,726",
      },
      {
        id: "PENALTY_AMOUNT",
        label: "Penalty Amount",
        type: "number",
        example: "60,000",
      },
      {
        id: "REGULATOR_NAME",
        label: "Regulator",
        type: "text",
        example: "New York Attorney General",
      },
      { id: "STATE", label: "State", type: "text", example: "New York" },
      {
        id: "SOURCE_URL",
        label: "Source URL",
        type: "url",
        example: "https://ag.ny.gov/...",
      },
      {
        id: "SOURCE_NAME",
        label: "Source Name",
        type: "text",
        example: "NY Attorney General Press Release",
      },
    ],
  },

  // ========================================
  // 2. COMPLIANCE UPDATE TEMPLATE
  // ========================================
  {
    id: "compliance-update",
    name: "Compliance Update",
    description:
      "Template for new regulations, law changes, and compliance requirements",
    category: "news",
    icon: "📋",
    defaultTitle:
      "New [State/Federal] [Topic] Requirements: What You Need to Know",
    defaultExcerpt:
      "Stay compliant with the latest regulatory changes affecting your business.",
    defaultTags: ["compliance", "regulations", "updates"],
    defaultCategory: "Regulatory Updates",
    defaultContent: `
<h2>Summary</h2>
<p><strong>Regulation:</strong> [REGULATION_NAME]</p>
<p><strong>Jurisdiction:</strong> [STATE/FEDERAL]</p>
<p><strong>Effective Date:</strong> [EFFECTIVE_DATE]</p>
<p><strong>Who's Affected:</strong> [AFFECTED_ENTITIES]</p>

<h2>What's Changing</h2>
<p>[Describe the new or updated requirements]</p>

<h2>Key Requirements</h2>
<ol>
  <li><strong>[Requirement 1]</strong>: [Details]</li>
  <li><strong>[Requirement 2]</strong>: [Details]</li>
  <li><strong>[Requirement 3]</strong>: [Details]</li>
</ol>

<h2>Implementation Timeline</h2>
<ul>
  <li><strong>[DATE]</strong> - [Milestone]</li>
  <li><strong>[DATE]</strong> - [Milestone]</li>
  <li><strong>[DATE]</strong> - [Milestone]</li>
</ul>

<h2>Action Steps</h2>
<ol>
  <li>[Action step with deadline]</li>
  <li>[Action step with deadline]</li>
  <li>[Action step with deadline]</li>
</ol>

<h2>How Atraiva Can Help</h2>
<p>[Describe relevant Atraiva features and services]</p>
`,
    sections: [
      {
        id: "summary",
        name: "Summary",
        description: "Key facts about the update",
        required: true,
        order: 1,
      },
      {
        id: "changes",
        name: "What's Changing",
        description: "Description of changes",
        required: true,
        order: 2,
      },
      {
        id: "requirements",
        name: "Key Requirements",
        description: "Specific requirements",
        required: true,
        order: 3,
      },
      {
        id: "timeline",
        name: "Implementation Timeline",
        description: "Important dates",
        required: true,
        order: 4,
      },
      {
        id: "action-steps",
        name: "Action Steps",
        description: "What to do",
        required: true,
        order: 5,
      },
    ],
    placeholders: [
      { id: "REGULATION_NAME", label: "Regulation Name", type: "text" },
      { id: "JURISDICTION", label: "Jurisdiction", type: "text" },
      { id: "EFFECTIVE_DATE", label: "Effective Date", type: "date" },
      { id: "AFFECTED_ENTITIES", label: "Affected Entities", type: "text" },
    ],
  },

  // ========================================
  // 3. HOW-TO GUIDE TEMPLATE
  // ========================================
  {
    id: "how-to-guide",
    name: "How-To Guide",
    description: "Step-by-step tutorial for compliance or security tasks",
    category: "tutorial",
    icon: "📚",
    defaultTitle: "How to [Task]: A Step-by-Step Guide",
    defaultExcerpt:
      "Learn how to [accomplish specific task] with this comprehensive guide.",
    defaultTags: ["tutorial", "guide", "how-to"],
    defaultCategory: "Guides",
    defaultContent: `
<h2>Overview</h2>
<p>[Brief description of what this guide covers and why it's important]</p>

<h3>What You'll Learn</h3>
<ul>
  <li>[Learning objective 1]</li>
  <li>[Learning objective 2]</li>
  <li>[Learning objective 3]</li>
</ul>

<h3>Prerequisites</h3>
<ul>
  <li>[Prerequisite 1]</li>
  <li>[Prerequisite 2]</li>
</ul>

<h3>Estimated Time</h3>
<p>⏱️ [TIME] minutes</p>

<h2>Step 1: [Step Name]</h2>
<p>[Detailed instructions for step 1]</p>

<h3>Example</h3>
<pre><code>[Code or example if applicable]</code></pre>

<h2>Step 2: [Step Name]</h2>
<p>[Detailed instructions for step 2]</p>

<h2>Step 3: [Step Name]</h2>
<p>[Detailed instructions for step 3]</p>

<h2>Common Issues & Solutions</h2>

<h3>Issue: [Problem]</h3>
<p><strong>Solution:</strong> [Resolution]</p>

<h3>Issue: [Problem]</h3>
<p><strong>Solution:</strong> [Resolution]</p>

<h2>Best Practices</h2>
<ul>
  <li>[Best practice 1]</li>
  <li>[Best practice 2]</li>
  <li>[Best practice 3]</li>
</ul>

<h2>Next Steps</h2>
<p>[What to do after completing this guide]</p>

<h2>Additional Resources</h2>
<ul>
  <li><a href="[URL]">[Resource title]</a></li>
  <li><a href="[URL]">[Resource title]</a></li>
</ul>
`,
    sections: [
      {
        id: "overview",
        name: "Overview",
        description: "Introduction and prerequisites",
        required: true,
        order: 1,
      },
      {
        id: "steps",
        name: "Steps",
        description: "Step-by-step instructions",
        required: true,
        order: 2,
      },
      {
        id: "troubleshooting",
        name: "Common Issues",
        description: "Troubleshooting guide",
        required: false,
        order: 3,
      },
      {
        id: "best-practices",
        name: "Best Practices",
        description: "Tips and recommendations",
        required: false,
        order: 4,
      },
    ],
    placeholders: [
      { id: "TASK", label: "Task Name", type: "text" },
      { id: "TIME", label: "Estimated Time", type: "number" },
    ],
  },

  // ========================================
  // 4. CASE STUDY TEMPLATE
  // ========================================
  {
    id: "case-study",
    name: "Case Study",
    description:
      "Success story showcasing how a client achieved compliance goals",
    category: "case-study",
    icon: "💼",
    defaultTitle: "How [Company] Achieved [Goal] with Atraiva",
    defaultExcerpt:
      "Discover how [Company] overcame compliance challenges and achieved remarkable results.",
    defaultTags: ["case-study", "success-story", "customer-story"],
    defaultCategory: "Case Studies",
    defaultContent: `
<h2>Client Overview</h2>
<p><strong>Company:</strong> [COMPANY_NAME]</p>
<p><strong>Industry:</strong> [INDUSTRY]</p>
<p><strong>Size:</strong> [SIZE]</p>
<p><strong>Location:</strong> [LOCATION]</p>

<h2>The Challenge</h2>
<p>[Describe the compliance or security challenges the client faced]</p>

<h3>Key Pain Points</h3>
<ul>
  <li>[Pain point 1]</li>
  <li>[Pain point 2]</li>
  <li>[Pain point 3]</li>
</ul>

<h2>The Solution</h2>
<p>[Describe how Atraiva helped solve the problem]</p>

<h3>Implementation</h3>
<ol>
  <li><strong>[Phase 1]</strong>: [What was done]</li>
  <li><strong>[Phase 2]</strong>: [What was done]</li>
  <li><strong>[Phase 3]</strong>: [What was done]</li>
</ol>

<h2>The Results</h2>

<h3>Key Metrics</h3>
<ul>
  <li><strong>[METRIC_1]%</strong> - [Description, e.g., "reduction in compliance time"]</li>
  <li><strong>[METRIC_2]</strong> - [Description]</li>
  <li><strong>[METRIC_3]</strong> - [Description]</li>
</ul>

<blockquote>
  <p>"[Client testimonial quote]"</p>
  <p><em>— [NAME], [TITLE] at [COMPANY]</em></p>
</blockquote>

<h2>Key Takeaways</h2>
<ol>
  <li>[Lesson or insight 1]</li>
  <li>[Lesson or insight 2]</li>
  <li>[Lesson or insight 3]</li>
</ol>

<h2>Ready to Achieve Similar Results?</h2>
<p>[Call to action text]</p>

<p style="text-align: center; margin-top: 30px;">
  <a href="/contact" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Schedule a Demo</a>
</p>
`,
    sections: [
      {
        id: "overview",
        name: "Client Overview",
        description: "Background information",
        required: true,
        order: 1,
      },
      {
        id: "challenge",
        name: "The Challenge",
        description: "Problems faced",
        required: true,
        order: 2,
      },
      {
        id: "solution",
        name: "The Solution",
        description: "How Atraiva helped",
        required: true,
        order: 3,
      },
      {
        id: "results",
        name: "The Results",
        description: "Outcomes and metrics",
        required: true,
        order: 4,
      },
      {
        id: "takeaways",
        name: "Key Takeaways",
        description: "Lessons learned",
        required: false,
        order: 5,
      },
    ],
    placeholders: [
      { id: "COMPANY_NAME", label: "Company Name", type: "text" },
      { id: "INDUSTRY", label: "Industry", type: "text" },
      { id: "SIZE", label: "Company Size", type: "text" },
      { id: "LOCATION", label: "Location", type: "text" },
      { id: "GOAL", label: "Main Goal", type: "text" },
    ],
  },

  // ========================================
  // 5. PRODUCT ANNOUNCEMENT TEMPLATE
  // ========================================
  {
    id: "product-announcement",
    name: "Product Announcement",
    description: "Announce new features, products, or platform updates",
    category: "announcement",
    icon: "🚀",
    defaultTitle: "Introducing [Feature Name]: [Brief Description]",
    defaultExcerpt:
      "We're excited to announce [feature] to help you [benefit].",
    defaultTags: ["product", "announcement", "features"],
    defaultCategory: "Product Updates",
    defaultContent: `
<h2>What's New</h2>
<p>[Brief overview of the new feature or product]</p>

<h2>Why We Built This</h2>
<p>[Explain the problem this solves and customer feedback that led to development]</p>

<h2>Key Features</h2>

<h3>🎯 [Feature 1]</h3>
<p>[Description and benefits]</p>

<h3>⚡ [Feature 2]</h3>
<p>[Description and benefits]</p>

<h3>🔐 [Feature 3]</h3>
<p>[Description and benefits]</p>

<h2>How It Works</h2>
<ol>
  <li>[Step 1]</li>
  <li>[Step 2]</li>
  <li>[Step 3]</li>
</ol>

<h2>Who Benefits</h2>
<ul>
  <li><strong>[User Type 1]</strong>: [Specific benefits]</li>
  <li><strong>[User Type 2]</strong>: [Specific benefits]</li>
  <li><strong>[User Type 3]</strong>: [Specific benefits]</li>
</ul>

<h2>Getting Started</h2>
<p>[Instructions on how to access and use the new feature]</p>

<h2>Pricing & Availability</h2>
<p>[Pricing details and availability information]</p>

<h2>What's Next</h2>
<p>[Roadmap teaser and upcoming features]</p>

<p style="text-align: center; margin-top: 30px;">
  <a href="/sign-up" style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">Try It Now</a>
</p>
`,
    sections: [
      {
        id: "whats-new",
        name: "What's New",
        description: "Feature overview",
        required: true,
        order: 1,
      },
      {
        id: "why",
        name: "Why We Built This",
        description: "Problem and motivation",
        required: true,
        order: 2,
      },
      {
        id: "features",
        name: "Key Features",
        description: "Feature details",
        required: true,
        order: 3,
      },
      {
        id: "how-it-works",
        name: "How It Works",
        description: "Usage instructions",
        required: true,
        order: 4,
      },
      {
        id: "getting-started",
        name: "Getting Started",
        description: "Access instructions",
        required: true,
        order: 5,
      },
    ],
    placeholders: [{ id: "FEATURE_NAME", label: "Feature Name", type: "text" }],
  },

  // ========================================
  // 6. QUICK TIP / BEST PRACTICE TEMPLATE
  // ========================================
  {
    id: "quick-tip",
    name: "Quick Tip",
    description: "Short, actionable advice on compliance or security topics",
    category: "general",
    icon: "💡",
    defaultTitle: "Quick Tip: [Topic]",
    defaultExcerpt:
      "A quick, actionable tip to improve your [compliance/security] posture.",
    defaultTags: ["tips", "best-practices", "quick-win"],
    defaultCategory: "Tips & Tricks",
    defaultContent: `
<h2>The Tip</h2>
<p><strong>✨ [Your main tip in one clear sentence]</strong></p>

<h2>Why It Matters</h2>
<p>[Explain the importance and potential consequences of not following this tip]</p>

<h2>How to Implement</h2>
<ol>
  <li>[Quick step 1]</li>
  <li>[Quick step 2]</li>
  <li>[Quick step 3]</li>
</ol>

<h2>Example</h2>
<p>[Provide a concrete example or scenario]</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>❌ [Mistake 1]</li>
  <li>❌ [Mistake 2]</li>
</ul>

<h2>Pro Tips</h2>
<ul>
  <li>✅ [Pro tip 1]</li>
  <li>✅ [Pro tip 2]</li>
</ul>

<h2>Related Resources</h2>
<ul>
  <li><a href="[URL]">[Resource title]</a></li>
</ul>
`,
    sections: [
      {
        id: "tip",
        name: "The Tip",
        description: "Main advice",
        required: true,
        order: 1,
      },
      {
        id: "why",
        name: "Why It Matters",
        description: "Importance",
        required: true,
        order: 2,
      },
      {
        id: "how-to",
        name: "How to Implement",
        description: "Action steps",
        required: true,
        order: 3,
      },
      {
        id: "example",
        name: "Example",
        description: "Concrete example",
        required: false,
        order: 4,
      },
    ],
    placeholders: [{ id: "TOPIC", label: "Topic", type: "text" }],
  },
];

// Helper function to get template by ID
export function getTemplateById(id: string): BlogTemplate | undefined {
  return blogTemplates.find((template) => template.id === id);
}

// Helper function to get templates by category
export function getTemplatesByCategory(
  category: BlogTemplate["category"]
): BlogTemplate[] {
  return blogTemplates.filter((template) => template.category === category);
}

// Helper function to get all template categories
export function getTemplateCategories(): BlogTemplate["category"][] {
  return ["news", "tutorial", "case-study", "announcement", "general"];
}

// Helper function to apply template with placeholder values
export function applyTemplate(
  template: BlogTemplate,
  placeholderValues?: Record<string, string>
): {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
} {
  let content = template.defaultContent;
  let title = template.defaultTitle || "";
  let excerpt = template.defaultExcerpt || "";

  // Replace placeholders with provided values
  if (placeholderValues) {
    Object.entries(placeholderValues).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      content = content.replace(new RegExp(placeholder, "g"), value);
      title = title.replace(new RegExp(placeholder, "g"), value);
      excerpt = excerpt.replace(new RegExp(placeholder, "g"), value);
    });
  }

  return {
    title,
    excerpt,
    content,
    tags: template.defaultTags || [],
    category: template.defaultCategory || "",
  };
}
