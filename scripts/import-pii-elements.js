const XLSX = require("xlsx");
const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  writeBatch,
  doc,
  serverTimestamp,
} = require("firebase/firestore");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

// Initialize Firebase with environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Risk level mapping based on category
const RISK_LEVELS = {
  "Core Identifiers": "high",
  "Government-Issued Numbers": "high",
  "Financial & Payment": "high",
  "Health & Genetic": "high",
  "Biometric Identifiers": "high",
  "Digital & Device IDs": "medium",
  "Login & Security Credentials": "high",
  "Location & Vehicle": "medium",
  "Personal Characteristics & Demographics": "medium",
  "Civic, Political & Legal": "medium",
  "Education & Employment": "medium",
  "Media & Communications": "medium",
  "Household & Utility": "medium",
  "Miscellaneous Unique Identifiers": "high",
};

// Regulation mapping based on category
const REGULATION_MAPPING = {
  "Core Identifiers": ["GDPR", "CCPA", "State Laws"],
  "Government-Issued Numbers": ["HIPAA", "GLBA", "State Laws"],
  "Financial & Payment": ["GLBA", "PCI-DSS", "State Laws"],
  "Health & Genetic": ["HIPAA", "GINA", "State Laws"],
  "Biometric Identifiers": ["BIPA", "GDPR", "CCPA", "State Laws"],
  "Digital & Device IDs": ["GDPR", "CCPA"],
  "Login & Security Credentials": ["GDPR", "CCPA", "State Laws"],
  "Location & Vehicle": ["GDPR", "CCPA", "State Laws"],
  "Personal Characteristics & Demographics": ["GDPR", "CCPA", "State Laws"],
  "Civic, Political & Legal": ["GDPR", "State Laws"],
  "Education & Employment": ["FERPA", "GDPR", "State Laws"],
  "Media & Communications": ["GDPR", "CCPA", "TCPA", "State Laws"],
  "Household & Utility": ["GDPR", "State Laws"],
  "Miscellaneous Unique Identifiers": ["GDPR", "State Laws"],
};

// Helper function to create slug from category name
function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helper function to determine if element is regulated
function isRegulated(category) {
  const regulatedCategories = [
    "Government-Issued Numbers",
    "Financial & Payment",
    "Health & Genetic",
    "Biometric Identifiers",
  ];
  return regulatedCategories.includes(category);
}

async function importPIIElements(dryRun = true) {
  const filePath = "C:/Users/rshet/Downloads/PII_elements.xlsx";

  try {
    console.log("📖 Reading Excel file...\n");
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const piiElements = [];
    const categories = Object.keys(data[0]).filter(
      (col) => col !== "CATEGORIES"
    );

    console.log(`Found ${categories.length} categories:\n`);
    categories.forEach((cat, idx) => {
      console.log(`${idx + 1}. ${cat}`);
    });
    console.log("");

    // Process each category and its elements
    categories.forEach((category) => {
      data.forEach((row, index) => {
        const element = row[category];
        if (element && element.trim()) {
          const piiElement = {
            element: element.trim(),
            category: category,
            categorySlug: createSlug(category),
            riskLevel: RISK_LEVELS[category] || "medium",
            isRegulated: isRegulated(category),
            applicableRegulations: REGULATION_MAPPING[category] || [
              "State Laws",
            ],
            detectionPatterns: [], // To be added later
            examples: [], // To be added later
            metadata: {
              source: "PII_elements.xlsx",
              importDate: new Date().toISOString(),
            },
          };
          piiElements.push(piiElement);
        }
      });
    });

    console.log(`\n📊 Total PII Elements to import: ${piiElements.length}\n`);

    // Show sample
    console.log("=== SAMPLE ELEMENTS (First 5) ===\n");
    piiElements.slice(0, 5).forEach((element, idx) => {
      console.log(`${idx + 1}. ${element.element}`);
      console.log(`   Category: ${element.category}`);
      console.log(`   Risk Level: ${element.riskLevel}`);
      console.log(`   Regulated: ${element.isRegulated}`);
      console.log(
        `   Regulations: ${element.applicableRegulations.join(", ")}`
      );
      console.log("");
    });

    // Statistics
    const stats = {
      byCategory: {},
      byRiskLevel: {},
      regulated: 0,
    };

    piiElements.forEach((element) => {
      stats.byCategory[element.category] =
        (stats.byCategory[element.category] || 0) + 1;
      stats.byRiskLevel[element.riskLevel] =
        (stats.byRiskLevel[element.riskLevel] || 0) + 1;
      if (element.isRegulated) stats.regulated++;
    });

    console.log("=== STATISTICS ===\n");
    console.log("By Category:");
    Object.entries(stats.byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });
    console.log("\nBy Risk Level:");
    Object.entries(stats.byRiskLevel).forEach(([level, count]) => {
      console.log(`  ${level}: ${count}`);
    });
    console.log(`\nRegulated Elements: ${stats.regulated}`);
    console.log(
      `Non-Regulated Elements: ${piiElements.length - stats.regulated}\n`
    );

    if (dryRun) {
      console.log("🔍 DRY RUN MODE - No data written to Firestore");
      console.log("\nTo actually import the data, run:");
      console.log("  node scripts/import-pii-elements.js --import");

      // Save to JSON for review
      const jsonPath = "scripts/pii-elements-preview.json";
      fs.writeFileSync(jsonPath, JSON.stringify(piiElements, null, 2));
      console.log(`\n💾 Preview saved to: ${jsonPath}`);
    } else {
      console.log("📤 Importing to Firestore...\n");

      const collectionRef = collection(db, "ref_pii_elements");
      let totalCount = 0;
      let batchCount = 0;
      let batch = writeBatch(db);

      for (const element of piiElements) {
        const docRef = doc(collectionRef);
        batch.set(docRef, {
          ...element,
          id: docRef.id,
          metadata: {
            ...element.metadata,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
        });

        batchCount++;
        totalCount++;

        // Firestore batch limit is 500
        if (batchCount === 500) {
          await batch.commit();
          console.log(
            `✅ Committed batch of ${batchCount} documents (Total: ${totalCount})`
          );
          batchCount = 0;
          batch = writeBatch(db); // Create new batch
        }
      }

      // Commit remaining
      if (batchCount > 0) {
        await batch.commit();
        console.log(
          `✅ Committed final batch of ${batchCount} documents (Total: ${totalCount})`
        );
      }

      console.log(
        `\n🎉 Successfully imported ${totalCount} PII elements to Firestore!`
      );
      console.log("\nCollection: ref_pii_elements");
      console.log("Next steps:");
      console.log("  1. Verify data in Firebase Console");
      console.log("  2. Add detection patterns for each element");
      console.log("  3. Add examples for each element");
      console.log("  4. Update descriptions as needed");

      // Exit the process after successful import
      process.exit(0);
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Check command line arguments
const args = process.argv.slice(2);
const shouldImport = args.includes("--import");

console.log("=".repeat(60));
console.log("PII ELEMENTS IMPORT SCRIPT");
console.log("=".repeat(60));
console.log("");

importPIIElements(!shouldImport);
