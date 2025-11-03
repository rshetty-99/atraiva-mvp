// Extract structured data from content and apply to templates
import { blogTemplates, applyTemplate } from "./templates";

export interface ExtractedData {
  // For Breach Watch template
  companyName?: string;
  industry?: string;
  incidentDate?: string;
  notificationDate?: string;
  numberAffected?: string;
  penaltyAmount?: string;
  regulatorName?: string;
  state?: string;
  sourceUrl?: string;
  sourceName?: string;
  
  // Timeline events
  timeline?: Array<{ date: string; event: string }>;
  
  // Data types exposed
  dataExposed?: string[];
  
  // Violations/Failures
  technicalFailures?: Array<{ title: string; description: string }>;
  complianceFailures?: Array<{ title: string; description: string }>;
  
  // Key takeaways
  takeaways?: Array<{ title: string; description: string; action?: string }>;
  
  // For Compliance Update template
  lawName?: string;
  effectiveDate?: string;
  deadline?: string;
  requirements?: string[];
  changes?: string[];
}

/**
 * Extract structured data from content text
 */
export function extractStructuredData(
  content: string,
  title: string,
  url: string
): ExtractedData {
  const text = content + " " + title;
  const data: ExtractedData = { sourceUrl: url };

  // Extract dates (common patterns)
  const datePatterns = [
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}/gi,
    /\d{1,2}\/(\d{1,2})\/\d{4}/g,
    /\d{4}-\d{2}-\d{2}/g,
  ];

  const dates: string[] = [];
  for (const pattern of datePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  }

  // Extract monetary amounts
  const amountMatches = text.match(/\$[\d,]+(?:\.\d{2})?(?:K|M|B)?/gi);
  const amounts = amountMatches || [];

  // Extract numbers (for affected individuals, deadlines, etc.)
  const numberMatches = text.match(/(\d{1,3}(?:,\d{3})*|\d+)\s+(?:residents|individuals|people|days|calendar days|months|years)/gi);
  const numbers = numberMatches || [];

  // Extract states
  const stateMatch = text.match(/\b(California|New York|Texas|Florida|Illinois|Pennsylvania|Ohio|Georgia|North Carolina|Michigan|New Jersey|Virginia|Washington|Arizona|Massachusetts|Tennessee|Indiana|Missouri|Maryland|Wisconsin|Colorado|Minnesota|South Carolina|Alabama|Louisiana|Kentucky|Oregon|Oklahoma|Connecticut|Utah|Iowa|Nevada|Arkansas|Mississippi|Kansas|New Mexico|Nebraska|West Virginia|Idaho|Hawaii|New Hampshire|Maine|Rhode Island|Montana|Delaware|South Dakota|North Dakota|Alaska|Vermont|Wyoming|District of Columbia)\b/gi);
  if (stateMatch) {
    data.state = stateMatch[0];
  }

  // Extract regulator names
  const regulatorPatterns = [
    /(Attorney General|AG)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
    /([A-Z][a-z]+)\s+(Attorney General|Department|Office)/gi,
    /(Governor)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/gi,
  ];

  for (const pattern of regulatorPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.regulatorName = match[0];
      break;
    }
  }

  // Extract company/organization names (capitalized entities)
  const companyPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:\s+(?:&|and|Company|Corp|Inc|LLC|LLP))?)\b/g;
  const companyMatches = text.match(companyPattern);
  if (companyMatches && companyMatches.length > 0) {
    // Filter out common words
    const filtered = companyMatches.filter(
      (m) =>
        !["California", "New York", "Senate", "Bill", "Governor", "Attorney", "General"].includes(m)
    );
    if (filtered.length > 0) {
      data.companyName = filtered[0];
    }
  }

  // Extract deadlines/timelines
  const deadlinePattern = /(\d+)\s+(calendar\s+)?days?/gi;
  const deadlineMatch = text.match(deadlinePattern);
  if (deadlineMatch) {
    data.deadline = deadlineMatch[0];
  }

  // Extract affected numbers
  const affectedMatch = text.match(/(\d{1,3}(?:,\d{3})*)\s+(?:California\s+)?residents?(?:\s+\((\d{1,3}(?:,\d{3})*)\s+total\))?/gi);
  if (affectedMatch) {
    data.numberAffected = affectedMatch[0];
  }

  // Extract law/bill names
  const billMatch = text.match(/(Senate|House)\s+Bill\s+(?:No\.?\s+)?(\d+)/gi);
  if (billMatch) {
    data.lawName = billMatch[0];
  }

  // For compliance update articles, try to extract the main topic as "company"
  if (!data.companyName && data.lawName) {
    // Use state name as "company" for regulation articles
    data.companyName = data.state || "State";
  }

  // Extract penalty amounts
  if (amounts.length > 0) {
    // Find the largest amount as likely the penalty
    const penaltyAmounts = amounts
      .map((a) => {
        const num = parseFloat(a.replace(/[$,KM]/gi, ""));
        const multiplier = a.match(/K/i) ? 1000 : a.match(/M/i) ? 1000000 : a.match(/B/i) ? 1000000000 : 1;
        return num * multiplier;
      })
      .sort((a, b) => b - a);
    if (penaltyAmounts.length > 0) {
      const largest = penaltyAmounts[0];
      data.penaltyAmount = amounts.find((a) => {
        const num = parseFloat(a.replace(/[$,KM]/gi, ""));
        const multiplier = a.match(/K/i) ? 1000 : a.match(/M/i) ? 1000000 : 1;
        return num * multiplier === largest;
      });
    }
  }

  // Extract timeline events (looking for date-event patterns)
  const timelineEvents: Array<{ date: string; event: string }> = [];
  const timelinePattern = /<li><strong>([^<]+)<\/strong>\s*-\s*([^<]+)<\/li>/gi;
  const timelineMatches = content.matchAll(timelinePattern);
  for (const match of timelineMatches) {
    timelineEvents.push({
      date: match[1].trim(),
      event: match[2].trim(),
    });
  }
  if (timelineEvents.length > 0) {
    data.timeline = timelineEvents;
  }

  // Extract data types exposed
  const dataTypePattern = /<li>([^<]+(?:Social Security|Names|Addresses|Email|Phone|Financial|Medical|Driver's License|SSN|PII|PHI)[^<]*)<\/li>/gi;
  const dataMatches = Array.from(content.matchAll(dataTypePattern));
  if (dataMatches.length > 0) {
    data.dataExposed = dataMatches.map((m) => m[1].trim());
  }

  // Extract key dates
  if (dates.length > 0) {
    // Try to identify incident date (first date mentioned)
    if (dates.length >= 1) {
      data.incidentDate = dates[0];
    }
    // Try to identify effective date or notification date
    const effectiveMatch = text.match(/(?:takes\s+effect|effective|enacted)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/gi);
    if (effectiveMatch) {
      data.effectiveDate = effectiveMatch[0].match(/([A-Z][a-z]+\s+\d{1,2},?\s+\d{4})/)?.[1] || dates[1] || dates[0];
    }
  }

  // Extract source name
  const sourceMatch = url.match(/\/([^\/]+)\.com/);
  if (sourceMatch) {
    data.sourceName = sourceMatch[1].charAt(0).toUpperCase() + sourceMatch[1].slice(1);
  }

  return data;
}

/**
 * Apply extracted data to template placeholders
 */
export function applyExtractedDataToTemplate(
  templateId: string,
  extractedData: ExtractedData,
  rawContent: string,
  title: string
): string {
  // Create text version for pattern matching (remove HTML tags)
  const text = (title + " " + rawContent).replace(/<[^>]+>/g, " ").toLowerCase();
  const template = blogTemplates.find((t) => t.id === templateId);
  if (!template) {
    return rawContent; // Fallback to raw content
  }

  // Start with template content
  let content = template.defaultContent;

  // Replace placeholders with extracted data
  const replacements: Record<string, string> = {
    "[COMPANY_NAME]": extractedData.companyName || "Company Name",
    "[INDUSTRY]": extractedData.industry || "Industry",
    "[INCIDENT_DATE]": extractedData.incidentDate || "[INCIDENT_DATE]",
    "[NOTIFICATION_DATE]": extractedData.notificationDate || extractedData.effectiveDate || "[NOTIFICATION_DATE]",
    "[NUMBER_AFFECTED]": extractedData.numberAffected || "[NUMBER_AFFECTED]",
    "[PENALTY_AMOUNT]": extractedData.penaltyAmount?.replace("$", "") || "[PENALTY_AMOUNT]",
    "[REGULATOR_NAME]": extractedData.regulatorName || "[REGULATOR_NAME]",
    "[STATE]": extractedData.state || "[STATE]",
    "[SOURCE_URL]": extractedData.sourceUrl || "[SOURCE_URL]",
    "[SOURCE_NAME]": extractedData.sourceName || "Source",
    "[DATE]": new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    "[AMOUNT]": extractedData.penaltyAmount?.replace("$", "") || "[AMOUNT]",
  };

  // Apply replacements
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder.replace(/[\[\]]/g, "\\$&"), "g"), value);
  }

  // For Breach Watch template - populate timeline if we have it
  if (templateId === "breach-watch" && extractedData.timeline) {
    const timelineHtml = extractedData.timeline
      .map((event) => `<li><strong>${event.date}</strong> - ${event.event}</li>`)
      .join("\n");
    content = content.replace(
      /<li><strong>\[DATE\]<\/strong>\s*-\s*\[Event[^\]]*\]<\/li>/gi,
      timelineHtml
    );
  }

  // Populate data exposed list
  if (templateId === "breach-watch" && extractedData.dataExposed && extractedData.dataExposed.length > 0) {
    const dataExposedHtml = extractedData.dataExposed
      .map((item) => `<li>${item}</li>`)
      .join("\n");
    content = content.replace(
      /<li>\[Type\s+\d+[^\]]*\]<\/li>/gi,
      dataExposedHtml
    );
  }

  // Replace "What Happened" section with extracted summary
  // Try to find main content paragraphs
  const paragraphs = rawContent.match(/<p>([^<]+)<\/p>/gi);
  if (paragraphs && paragraphs.length > 0) {
    // Get first few substantial paragraphs
    const summary = paragraphs
      .slice(0, 3)
      .map((p) => p.replace(/<\/?p>/gi, "").trim())
      .filter((p) => p.length > 50) // Only substantial paragraphs
      .join(" ");
    
    if (summary) {
      content = content.replace(
        /<p>\[Describe the incident[^\]]+\]<\/p>/i,
        `<p>${summary.substring(0, 1500)}</p>`
      );
    }
  }
  
  // For compliance articles, update "What Happened" to describe the new requirements
  if (templateId === "compliance-update" || templateId === "breach-watch") {
    const takeawaysMatch = rawContent.match(/<h3>Takeaways<\/h3>[\s\S]*?(?=<h2|$)/i);
    if (takeawaysMatch) {
      const takeawaysContent = takeawaysMatch[0].replace(/<h3>Takeaways<\/h3>/i, "").trim();
      if (takeawaysContent.length > 0) {
        content = content.replace(
          /<p>\[Describe the incident[^\]]+\]<\/p>/i,
          takeawaysContent.substring(0, 1500)
        );
      }
    }
  }

  // For Compliance Update template - populate requirements
  // Extract requirements from text (look for list items or numbered requirements)
  if (templateId === "compliance-update" || templateId === "breach-watch") {
    // Try to extract requirements from HTML lists
    const requirementItems = rawContent.match(/<li>([^<]+(?:days?|deadline|notification|requirements?)[^<]*)<\/li>/gi);
    if (requirementItems && requirementItems.length > 0) {
      const requirementsHtml = requirementItems
        .slice(0, 10)
        .map((item) => item.replace(/<\/?li>/gi, "").trim())
        .filter((item) => item.length > 20)
        .map((item) => `<li>${item}</li>`)
        .join("\n");
      
      if (requirementsHtml) {
        content = content.replace(/<li>\[Requirement[^\]]*\]<\/li>/gi, requirementsHtml);
      }
    }
    
    // Extract key requirements from text (deadlines, thresholds, etc.)
    const keyRequirements: string[] = [];
    
    // Deadline requirements
    const deadlineMatch = text.match(/(?:within|within\s+)(\d+\s+(?:calendar\s+)?days?)/gi);
    if (deadlineMatch) {
      keyRequirements.push(`Notification required ${deadlineMatch[0]}`);
    }
    
    // Threshold requirements
    const thresholdMatch = text.match(/(?:more\s+than|over)\s+(\d{1,3}(?:,\d{3})*)\s+(?:California\s+)?residents/gi);
    if (thresholdMatch) {
      keyRequirements.push(`Special requirements when ${thresholdMatch[0]} are affected`);
    }
    
    if (keyRequirements.length > 0 && !extractedData.requirements) {
      extractedData.requirements = keyRequirements;
    }
    
    if (extractedData.requirements) {
      const requirementsHtml = extractedData.requirements
        .map((req) => `<li>${req}</li>`)
        .join("\n");
      content = content.replace(/<li>\[Requirement[^\]]*\]<\/li>/gi, requirementsHtml);
    }
  }

  // Clean up any remaining placeholders with generic text
  content = content.replace(/\[[^\]]+\]/g, "[To be filled]");

  return content;
}

