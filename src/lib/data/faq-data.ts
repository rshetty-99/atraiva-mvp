import { FAQItem } from "@/components/website/FAQ";

export const allFAQs: FAQItem[] = [
  {
    question: "Does Atraiva ingest or store any PII, PHI, or sensitive customer data?",
    answer: [
      "No.",
      "Atraiva does not ingest names, SSNs, medical data, financial data, or any regulated personal records.",
      "The platform uses metadata only:\n• classification labels\n• NBTC data categories\n• encryption indicators\n• residency counts\n• contract clauses\n• incident-level metadata",
      "This drastically reduces risk and simplifies compliance.",
    ],
  },
  {
    question: "Can Atraiva function without transferring any raw business or customer data?",
    answer: [
      "Yes.",
      "Atraiva evaluates categories, not content.",
      "All analysis is performed on labels, classifications, metadata, and rules.",
      "Raw data never leaves the customer environment.",
    ],
  },
  {
    question: "How does Atraiva determine whether a cybersecurity incident constitutes a breach?",
    answer: [
      "Atraiva's Reflex Determination Engine evaluates:\n• statutory triggers (50+DC + federal)\n• safe-harbor encryption rules\n• contract obligations\n• data category involvement\n• access vs acquisition rules\n• harm thresholds in applicable states",
      "The system produces a deterministic, evidence-backed breach determination that is legally defensible.",
    ],
  },
  {
    question: "Does Atraiva replace legal counsel?",
    answer: [
      "No.",
      "Atraiva supports counsel with:\n• standardized statutory logic\n• a comprehensive determination bundle\n• evidence-labeled decision trees\n• jurisdictional matrices\n• notice deadlines and T0 computation",
      "Counsel remains the decision-maker.",
    ],
  },
  {
    question: "Does Atraiva integrate with Microsoft Purview?",
    answer: [
      "Yes.",
      "Atraiva ingests Purview labels and metadata to understand:\n• what categories of data were involved\n• whether protected elements were present\n• residency counts (numerical only)\n• encryption state\n• data movement patterns",
      "Purview provides the label; Atraiva provides the legal logic.",
    ],
  },
  {
    question: "Can Atraiva ingest evidence from SIEM/XDR tools?",
    answer: [
      "Yes — and only the metadata:\n• alert type\n• asset identity\n• access vectors\n• timestamp information\n• confidence categories",
      "Atraiva does not ingest logs containing personal information.",
    ],
  },
  {
    question: "Can Atraiva support downstream or upstream vendor exposure (supply chain or \"supply web\")?",
    answer: [
      "Yes — this is a major differentiator.",
      "The Supply-Web Engine maps:\n• upstream vendor exposures\n• downstream partner obligations\n• inherited contractual triggers\n• regulator-required notices\n• cross-jurisdiction propagation",
      "It models the entire regulatory impact of multi-party incidents.",
    ],
  },
  {
    question: "How does Atraiva handle encrypted data?",
    answer: [
      "Atraiva's Safe Harbor Matrix evaluates:\n• encryption strength\n• key exposure\n• credential compromise\n• partial encryption\n• outdated ciphers\n• cloud shared-responsibility gaps",
      "If encryption is strong and keys are uncompromised, safe harbor may apply.",
      "If not, statutory triggers may still fire.",
    ],
  },
  {
    question: "Can Atraiva calculate notification deadlines across states and sectors?",
    answer: [
      "Yes.",
      "The system maps:\n• consumer notice deadlines\n• regulator notice deadlines\n• sectoral frameworks (HIPAA/GLBA/SEC/FTC)\n• contractual time windows (24h, 48h, \"immediate,\" etc.)",
      "Outputs include a complete notification matrix.",
    ],
  },
  {
    question: "Does Atraiva provide draft notice templates?",
    answer: [
      "Yes — for:\n• regulators\n• consumers\n• business partners\n• upstream/downstream vendors",
      "Drafts are derived from metadata, jurisdiction rules, and contract obligations.",
    ],
  },
  {
    question: "Does Atraiva help demonstrate compliance during regulatory investigations?",
    answer: [
      "Yes.",
      "Atraiva produces a Regulator Audit Bundle containing:\n• statutory trigger analysis\n• safe-harbor evaluation\n• timeline reconstruction\n• T0 determination\n• residency count calculations\n• contracts impacting notice timelines\n• evidence ledger",
      "This package is designed for DFS, AG offices, OCR, FTC, SEC, and EU regulators.",
    ],
  },
  {
    question: "Does Atraiva work with hybrid cloud or on-prem environments?",
    answer: [
      "Yes.",
      "Atraiva is cloud-native but compatible with:\n• hybrid environments\n• multi-cloud deployments\n• private cloud\n• on-prem data classification tools",
      "Because it uses metadata, it is environment-agnostic.",
    ],
  },
  {
    question: "How long does deployment typically take?",
    answer: [
      "Most enterprises onboard Atraiva in:\n• 2–7 days with Purview\n• 5–14 days with SIEM/XDR\n• <24 hours for contract intelligence",
      "No sensitive data pipelines are required, so integration is light.",
    ],
  },
  {
    question: "Can Atraiva help with vendor-risk assessments?",
    answer: [
      "Yes.",
      "Atraiva automates:\n• third-party breach evaluation\n• supply-web exposure mapping\n• contract notice requirements\n• encryption sufficiency\n• data classification alignment\n• regulatory conflict resolution",
      "Enterprises use Atraiva as a \"third-party cyber governance engine.\"",
    ],
  },
  {
    question: "How accurate is Atraiva compared to manual breach analysis?",
    answer: [
      "Manual breach analysis is extremely inconsistent across:\n• counsel\n• internal teams\n• outside IR firms",
      "Atraiva applies standardized statutory logic to the same facts every time.",
      "This yields greater:\n• accuracy\n• speed\n• regulatory consistency\n• audit defensibility",
    ],
  },
  {
    question: "How is Atraiva different from a GRC platform?",
    answer: [
      "GRC tools track policies and compliance programs.",
      "Atraiva performs real-time statutory and contractual determinations during an incident.",
      "It fills a gap no GRC platform currently addresses.",
    ],
  },
  {
    question: "How is Atraiva different from privacy compliance tools (OneTrust, TrustArc)?",
    answer: [
      "Privacy tools manage:\n• consent\n• DSARs\n• processing maps\n• retention policies",
      "They do not:\n• evaluate breach triggers\n• calculate notice deadlines\n• analyze encryption safe harbor\n• manage multi-party propagation\n• generate determination bundles\n• support IR counsel workflows",
      "Atraiva sits in a different category entirely.",
    ],
  },
  {
    question: "How does Atraiva keep determination logic current with changing laws?",
    answer: [
      "Atraiva maintains:\n• continuous updates of 50+DC statutes\n• sectoral law updates (HIPAA, GLBA, FTC, SEC)\n• international frameworks\n• contract-override trees\n• safe-harbor definitions",
      "Logic updates occur automatically, ensuring determinations remain current.",
    ],
  },
  {
    question: "Is Atraiva suitable for regulated industries?",
    answer: [
      "Yes.",
      "Atraiva is explicitly built for:\n• healthcare\n• finance\n• insurance\n• education\n• public companies\n• critical infrastructure\n• SaaS/technology\n• legal services",
      "The metadata-only architecture aligns with stringent regulatory expectations.",
    ],
  },
  {
    question: "How can Atraiva reduce overall incident-response costs?",
    answer: [
      "By eliminating the time, uncertainty, and manual interpretation tied to breach-notification analysis, Atraiva reduces:\n• outside counsel hours\n• forensic analysis hours\n• internal legal bottlenecks\n• multi-jurisdiction review cycles\n• late-notice penalties\n• downstream regulatory and civil liability risk",
      "Clients typically see:\n• 70–90% faster determination cycles\n• 30–60% reduction in legal-review hours\n• 20–50% reduction in IR expenses",
    ],
  },
];

// Homepage FAQ - Top 5 most important questions
export const homepageFAQs: FAQItem[] = [
  allFAQs[0], // Does Atraiva ingest or store any PII?
  allFAQs[2], // How does Atraiva determine breach?
  allFAQs[3], // Does Atraiva replace legal counsel?
  allFAQs[4], // Microsoft Purview integration
  allFAQs[14], // Accuracy compared to manual analysis
];

