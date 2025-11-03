// Script to create mock breach data for testing the breach map visualization
// Uses Firebase Admin SDK to write directly to Firestore
// Creates organizations in different states and breaches linked to them

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Initialize Firebase Admin
if (getApps().length === 0) {
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

// Helper to generate random date within last year
function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Mock organizations with different states
const mockOrganizations = [
  {
    name: "TechCorp Solutions",
    state: "CA",
    city: "San Francisco",
    industry: "Technology",
    organizationType: "enterprise" as const,
  },
  {
    name: "HealthCare Partners",
    state: "NY",
    city: "New York",
    industry: "Healthcare",
    organizationType: "enterprise" as const,
  },
  {
    name: "Financial Services Group",
    state: "TX",
    city: "Dallas",
    industry: "Financial Services",
    organizationType: "enterprise" as const,
  },
  {
    name: "RetailMax Corporation",
    state: "FL",
    city: "Miami",
    industry: "Retail",
    organizationType: "enterprise" as const,
  },
  {
    name: "DataSecure Inc",
    state: "CA",
    city: "Los Angeles",
    industry: "Technology",
    organizationType: "enterprise" as const,
  },
  {
    name: "MediTech Systems",
    state: "IL",
    city: "Chicago",
    industry: "Healthcare",
    organizationType: "enterprise" as const,
  },
  {
    name: "CloudFirst Solutions",
    state: "WA",
    city: "Seattle",
    industry: "Technology",
    organizationType: "enterprise" as const,
  },
  {
    name: "Banking Solutions LLC",
    state: "NY",
    city: "Buffalo",
    industry: "Financial Services",
    organizationType: "enterprise" as const,
  },
  {
    name: "Global Retail Network",
    state: "TX",
    city: "Houston",
    industry: "Retail",
    organizationType: "enterprise" as const,
  },
  {
    name: "SecureData Corp",
    state: "MA",
    city: "Boston",
    industry: "Technology",
    organizationType: "enterprise" as const,
  },
  {
    name: "Healthcare Systems Inc",
    state: "PA",
    city: "Philadelphia",
    industry: "Healthcare",
    organizationType: "enterprise" as const,
  },
  {
    name: "FinanceHub Technologies",
    state: "GA",
    city: "Atlanta",
    industry: "Financial Services",
    organizationType: "enterprise" as const,
  },
  {
    name: "TechStart Innovations",
    state: "CA",
    city: "San Diego",
    industry: "Technology",
    organizationType: "enterprise" as const,
  },
  {
    name: "Medical Data Systems",
    state: "NC",
    city: "Charlotte",
    industry: "Healthcare",
    organizationType: "enterprise" as const,
  },
  {
    name: "Retail Innovations Group",
    state: "AZ",
    city: "Phoenix",
    industry: "Retail",
    organizationType: "enterprise" as const,
  },
];

// Mock breaches data
const mockBreaches = [
  {
    title: "Unauthorized Access to Customer Database",
    description:
      "Malicious actor gained access to customer database through SQL injection vulnerability.",
    severity: "critical" as const,
    status: "investigating" as const,
    affectedRecords: 50000,
    piiTypes: [
      {
        type: "email" as const,
        description: "Email addresses",
        count: 50000,
        sensitivity: "medium" as const,
      },
      {
        type: "phone" as const,
        description: "Phone numbers",
        count: 45000,
        sensitivity: "medium" as const,
      },
    ],
  },
  {
    title: "Phishing Attack Compromised Employee Credentials",
    description:
      "Multiple employees fell victim to phishing attack, resulting in credential compromise.",
    severity: "high" as const,
    status: "contained" as const,
    affectedRecords: 12000,
    piiTypes: [
      {
        type: "ssn" as const,
        description: "Social Security Numbers",
        count: 12000,
        sensitivity: "critical" as const,
      },
    ],
  },
  {
    title: "Third-Party Vendor Data Exposure",
    description:
      "Third-party vendor misconfigured cloud storage, exposing customer data.",
    severity: "high" as const,
    status: "resolved" as const,
    affectedRecords: 25000,
    piiTypes: [
      {
        type: "financial" as const,
        description: "Credit card information",
        count: 25000,
        sensitivity: "critical" as const,
      },
    ],
  },
  {
    title: "Insider Threat - Unauthorized Data Access",
    description:
      "Former employee accessed sensitive customer data after termination.",
    severity: "medium" as const,
    status: "closed" as const,
    affectedRecords: 8000,
    piiTypes: [
      {
        type: "address" as const,
        description: "Physical addresses",
        count: 8000,
        sensitivity: "low" as const,
      },
    ],
  },
  {
    title: "Ransomware Attack on Patient Records",
    description:
      "Ransomware attack encrypted patient medical records, potentially exposing PII.",
    severity: "critical" as const,
    status: "investigating" as const,
    affectedRecords: 75000,
    piiTypes: [
      {
        type: "medical" as const,
        description: "Medical records",
        count: 75000,
        sensitivity: "critical" as const,
      },
      {
        type: "ssn" as const,
        description: "Social Security Numbers",
        count: 75000,
        sensitivity: "critical" as const,
      },
    ],
  },
  {
    title: "API Endpoint Exposure",
    description:
      "Misconfigured API endpoint exposed customer data without authentication.",
    severity: "medium" as const,
    status: "resolved" as const,
    affectedRecords: 15000,
    piiTypes: [
      {
        type: "email" as const,
        description: "Email addresses",
        count: 15000,
        sensitivity: "medium" as const,
      },
    ],
  },
  {
    title: "Data Breach via Compromised System",
    description:
      "Compromised system administrator account led to unauthorized data access.",
    severity: "high" as const,
    status: "contained" as const,
    affectedRecords: 30000,
    piiTypes: [
      {
        type: "financial" as const,
        description: "Bank account information",
        count: 30000,
        sensitivity: "critical" as const,
      },
    ],
  },
  {
    title: "Lost Storage Device with Customer Data",
    description:
      "Unencrypted storage device containing customer data was lost in transit.",
    severity: "low" as const,
    status: "closed" as const,
    affectedRecords: 5000,
    piiTypes: [
      {
        type: "address" as const,
        description: "Physical addresses",
        count: 5000,
        sensitivity: "low" as const,
      },
    ],
  },
];

async function createMockBreachData() {
  console.log("🚀 Starting mock breach data creation...\n");

  try {
    // Create organizations first
    console.log("📦 Creating organizations...");
    const organizationIds: string[] = [];
    const orgStateMap = new Map<string, string>(); // orgId -> state

    for (const org of mockOrganizations) {
      try {
        const orgData = {
          name: org.name,
          organizationType: org.organizationType,
          industry: org.industry,
          teamSize: "201-1000" as const,
          address: `123 Main St`,
          city: org.city,
          state: org.state,
          zipCode: "12345",
          country: "United States",
          settings: {
            applicableRegulations: ["HIPAA", "GDPR", "CCPA"],
            subscriptionPlan: "enterprise" as const,
            subscriptionStatus: "active" as const,
            timezone: "America/New_York",
            locale: "en-US",
          },
          members: [],
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };

        const docRef = await db.collection("organizations").add(orgData);
        organizationIds.push(docRef.id);
        orgStateMap.set(docRef.id, org.state);
        console.log(`  ✅ Created organization: ${org.name} (${org.state}) - ${docRef.id}`);
      } catch (error) {
        console.error(`  ❌ Failed to create organization ${org.name}:`, error);
      }
    }

    console.log(`\n📊 Created ${organizationIds.length} organizations\n`);

    // Create breaches
    console.log("🔐 Creating breaches...");
    let breachCount = 0;
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Distribute breaches across organizations
    for (let i = 0; i < mockBreaches.length * 3; i++) {
      const breach = mockBreaches[i % mockBreaches.length];
      const orgIndex = i % organizationIds.length;
      const orgId = organizationIds[orgIndex];

      try {
        const discoveryDate = randomDate(oneYearAgo, now);
        const reportedDate = new Date(
          discoveryDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000
        );

        let containmentDate: Date | undefined;
        let resolutionDate: Date | undefined;

        if (breach.status === "contained" || breach.status === "resolved" || breach.status === "closed") {
          containmentDate = new Date(
            reportedDate.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000
          );
        }

        if (breach.status === "resolved" || breach.status === "closed") {
          resolutionDate = new Date(
            (containmentDate || reportedDate).getTime() +
              Math.random() * 30 * 24 * 60 * 60 * 1000
          );
        }

        const breachData = {
          organizationId: orgId,
          title: breach.title,
          description: breach.description,
          status: breach.status,
          severity: breach.severity,
          affectedRecords: breach.affectedRecords,
          piiTypes: breach.piiTypes,
          discoveryDate: Timestamp.fromDate(discoveryDate),
          reportedDate: Timestamp.fromDate(reportedDate),
          containmentDate: containmentDate
            ? Timestamp.fromDate(containmentDate)
            : null,
          resolutionDate: resolutionDate
            ? Timestamp.fromDate(resolutionDate)
            : null,
          reportingOfficer: "security@example.com",
          notifications: [],
          documents: [],
          timeline: [
            {
              id: `timeline_${Date.now()}_${i}`,
              type: "discovery" as const,
              title: "Breach Discovered",
              description: breach.description,
              timestamp: Timestamp.fromDate(discoveryDate),
              performedBy: "Security Team",
            },
          ],
          createdAt: Timestamp.fromDate(discoveryDate),
          updatedAt: Timestamp.now(),
        };

        await db.collection("breaches").add(breachData);
        breachCount++;
        const state = orgStateMap.get(orgId);
        console.log(
          `  ✅ Created breach: ${breach.title.substring(0, 40)}... (${state})`
        );
      } catch (error) {
        console.error(
          `  ❌ Failed to create breach for org ${orgId}:`,
          error
        );
      }
    }

    console.log(`\n✅ Successfully created ${breachCount} breaches\n`);

    // Summary by state
    console.log("📊 Breach Summary by State:");
    const stateCounts = new Map<string, number>();
    for (const orgId of organizationIds) {
      const state = orgStateMap.get(orgId) || "Unknown";
      const count = stateCounts.get(state) || 0;
      stateCounts.set(state, count + 1);
    }

    for (const [state, count] of Array.from(stateCounts.entries()).sort()) {
      console.log(`  ${state}: ${count} organization(s) with breaches`);
    }

    console.log("\n✨ Mock breach data creation completed!");
  } catch (error) {
    console.error("❌ Error creating mock breach data:", error);
    process.exit(1);
  }
}

// Run the script
createMockBreachData()
  .then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });

