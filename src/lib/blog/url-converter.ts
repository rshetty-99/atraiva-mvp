// Utility functions for converting URLs to blog posts
import { blogTemplates, applyTemplate } from "./templates";
import { extractStructuredData, applyExtractedDataToTemplate } from "./template-extractor";

export interface ConvertedBlogData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  category: string;
  templateId: string;
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .substring(0, 100); // Limit length
}

/**
 * Identify which blog template to use based on content
 */
export function identifyTemplate(content: string, title: string): string {
  const text = (title + " " + content).toLowerCase();

  // Breach Watch keywords
  const breachKeywords = [
    "data breach",
    "security breach",
    "breach notification",
    "breach notification requirements", // High weight - if this appears, it's breach watch
    "breach notification statute",
    "settlement",
    "attorney general",
    "enforcement",
    "penalty",
    "fine",
    "notification",
    "incident",
    "compromise",
    "violation",
    "regulatory",
    "consumer notification",
    "affected residents",
    "individuals affected",
    "personal information",
    "pii",
    "ssn",
    "exposed",
    "compromised",
    "security incident",
    "data security",
    "notification deadline",
    "timeline",
    "data exposed",
  ];

  // Compliance Update keywords
  const complianceKeywords = [
    "new law",
    "regulation",
    "compliance requirement",
    "statute",
    "legislation",
    "deadline",
    "mandate",
    "legal requirement",
    "statutory",
  ];

  // Count matches (weight certain keywords higher)
  const breachMatches = breachKeywords.filter((keyword) =>
    text.includes(keyword)
  ).length;
  
  // High-weight keywords that strongly indicate breach watch
  const highWeightBreachKeywords = [
    "breach notification requirements",
    "breach notification statute",
    "data breach",
    "settlement",
    "attorney general",
    "penalty",
    "affected residents",
  ];
  
  const highWeightMatches = highWeightBreachKeywords.filter((keyword) =>
    text.includes(keyword)
  ).length;
  
  const complianceMatches = complianceKeywords.filter((keyword) =>
    text.includes(keyword)
  ).length;

  // If high-weight breach keywords found, definitely breach watch
  if (highWeightMatches >= 2) {
    return "breach-watch";
  }

  // Default to Breach Watch if it's clearly a breach notification
  if (breachMatches >= 3) {
    return "breach-watch";
  }

  // Use Compliance Update for regulatory changes (if not clearly breach-related)
  if (complianceMatches >= 2 && breachMatches < 2) {
    return "compliance-update";
  }

  // Default to Breach Watch for legal/news content with any breach keywords
  if (breachMatches >= 1) {
    return "breach-watch";
  }

  // Default to Compliance Update for other legal content
  return "compliance-update";
}

/**
 * Extract title from HTML
 */
export function extractTitle(html: string): string {
  // Try to find title in various places
  const titleMatch =
    html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
    html.match(/<h1[^>]*>([^<]+)<\/h1>/i) ||
    html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+name=["']title["']\s+content=["']([^"']+)["']/i);

  if (titleMatch) {
    return titleMatch[1].trim();
  }

  return "Untitled Blog Post";
}

/**
 * Extract description/excerpt from HTML
 */
export function extractDescription(html: string): string {
  // Try meta description
  const metaDescMatch =
    html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
    html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);

  if (metaDescMatch) {
    return metaDescMatch[1].trim().substring(0, 300);
  }

  // Try to find first paragraph
  const paragraphMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
  if (paragraphMatch) {
    return paragraphMatch[1].trim().substring(0, 300);
  }

  return "";
}

/**
 * Extract main content from HTML
 */
export function extractContent(html: string): string {
  // Remove script and style tags
  let content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");

  // Try to find main content area (prioritize article, main, or content divs)
  let extractedContent = "";
  
  // Try article tag first
  const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) {
    extractedContent = articleMatch[1];
  } else {
    // Try main tag
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (mainMatch) {
      extractedContent = mainMatch[1];
    } else {
      // Try content-related divs (common patterns)
      const contentDivMatch = content.match(
        /<div[^>]*(?:class|id)=["'][^"']*(?:content|article|post|body|text)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
      );
      if (contentDivMatch) {
        extractedContent = contentDivMatch[1];
      } else {
        // Fallback: use body content
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        extractedContent = bodyMatch ? bodyMatch[1] : content;
      }
    }
  }

  // Clean up the content
  // Remove navigation, header, footer, sidebar, ads
  extractedContent = extractedContent.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
  extractedContent = extractedContent.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
  extractedContent = extractedContent.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
  extractedContent = extractedContent.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");
  extractedContent = extractedContent.replace(/<div[^>]*(?:class|id)=["'][^"']*(?:sidebar|ad|advertisement|social|share)[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, "");
  
  // Remove common unwanted elements
  extractedContent = extractedContent.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, "");
  extractedContent = extractedContent.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, "");
  
  // Preserve important HTML structure
  // Keep headings, paragraphs, lists, links, strong, em, etc.
  const keepTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "a", "strong", "em", "b", "i", "u", "blockquote", "pre", "code", "br", "hr", "div", "span"];
  
  // Remove attributes from kept tags but preserve tag structure
  for (const tag of keepTags) {
    extractedContent = extractedContent.replace(
      new RegExp(`<${tag}[^>]*>`, "gi"),
      `<${tag}>`
    );
  }

  // Clean up excessive whitespace
  extractedContent = extractedContent.replace(/\s+/g, " ");
  extractedContent = extractedContent.replace(/>\s+</g, "><");
  extractedContent = extractedContent.replace(/\n\s*\n/g, "\n");

  // Remove empty tags
  extractedContent = extractedContent.replace(/<(\w+)>\s*<\/\1>/gi, "");

  return extractedContent.trim();
}

/**
 * Extract keywords/tags from content
 */
export function extractKeywords(content: string, title: string): string[] {
  const text = (title + " " + content).toLowerCase();
  const keywords: string[] = [];

  // Common keywords to look for
  const keywordMap: Record<string, string> = {
    "data breach": "data-breach",
    "security breach": "data-breach",
    "compliance": "compliance",
    "california": "california",
    "new york": "new-york",
    "notification": "notification",
    "enforcement": "enforcement",
    "regulation": "regulation",
    "privacy": "privacy",
    "gdpr": "gdpr",
    "hipaa": "hipaa",
    "attorney general": "attorney-general",
    "penalty": "penalty",
    "settlement": "settlement",
    "security": "security",
    "incident response": "incident-response",
    "data protection": "data-protection",
  };

  for (const [keyword, tag] of Object.entries(keywordMap)) {
    if (text.includes(keyword) && !keywords.includes(tag)) {
      keywords.push(tag);
    }
  }

  return keywords.slice(0, 8); // Limit to 8 tags
}

/**
 * Convert raw webpage data to blog post format
 */
export function convertToBlogPost(
  html: string,
  url: string
): ConvertedBlogData {
  const title = extractTitle(html);
  const description = extractDescription(html);
  const rawContent = extractContent(html);
  const slug = generateSlug(title);
  const templateId = identifyTemplate(rawContent, title);
  const tags = extractKeywords(rawContent, title);
  
  // Get default category from template
  const template = blogTemplates.find((t) => t.id === templateId);
  const category = template?.defaultCategory || "Compliance";

  // Extract structured data from content
  const extractedData = extractStructuredData(rawContent, title, url);

  // Apply template with extracted data
  const templatedContent = applyExtractedDataToTemplate(
    templateId,
    extractedData,
    rawContent,
    title
  );

  // Generate SEO data
  const seo = {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    keywords: tags,
  };

  return {
    title,
    slug,
    excerpt: description || `Summary of: ${title}`,
    content: templatedContent, // Use templated content instead of raw
    tags,
    category,
    templateId,
    seo,
  };
}

