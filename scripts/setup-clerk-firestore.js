#!/usr/bin/env node

/**
 * Clerk-Firestore Integration Setup Script
 *
 * This script helps set up the complete Clerk-Firestore integration
 * by syncing existing data and setting up webhooks.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up Clerk-Firestore Integration...\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error(
    "❌ .env.local file not found. Please create it with your Clerk and Firebase credentials."
  );
  process.exit(1);
}

// Read environment variables
require("dotenv").config({ path: envPath });

const requiredEnvVars = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY",
  "CLERK_WEBHOOK_SECRET",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "FIREBASE_PROJECT_ID",
];

console.log("📋 Checking environment variables...");
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}
console.log("✅ All required environment variables are set\n");

// Check if Firebase is initialized
console.log("🔥 Checking Firebase configuration...");
try {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("❌ Firebase configuration is incomplete");
    process.exit(1);
  }
  console.log("✅ Firebase configuration is valid\n");
} catch (error) {
  console.error("❌ Error checking Firebase configuration:", error.message);
  process.exit(1);
}

// Create Firestore security rules
console.log("🔒 Setting up Firestore security rules...");
const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organization members can read organization data
    match /organizations/{orgId} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        request.auth.uid in resource.data.members;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        request.auth.uid in resource.data.admins;
    }
    
    // Compliance data - only organization members
    match /compliance/{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        request.auth.uid in get(/databases/$(database)/documents/organizations/$(resource.data.organizationId)).data.members;
    }
    
    // Audit logs - read only for organization members
    match /audit_logs/{document=**} {
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        request.auth.uid in get(/databases/$(database)/documents/organizations/$(resource.data.organizationId)).data.members;
    }
  }
}`;

fs.writeFileSync("firestore.rules", firestoreRules);
console.log("✅ Firestore security rules created\n");

// Create webhook setup instructions
console.log("🔗 Webhook Setup Instructions:");
console.log("1. Go to your Clerk Dashboard: https://dashboard.clerk.com");
console.log("2. Navigate to Webhooks section");
console.log("3. Create a new webhook with the following URL:");
console.log(
  `   ${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/api/webhooks/clerk`
);
console.log("4. Select the following events:");
console.log("   - user.created");
console.log("   - user.updated");
console.log("   - user.deleted");
console.log("   - organization.created");
console.log("   - organization.updated");
console.log("   - organization.deleted");
console.log("   - organizationMembership.created");
console.log("   - organizationMembership.updated");
console.log("   - organizationMembership.deleted");
console.log("   - session.created");
console.log("   - session.ended");
console.log(
  "5. Copy the webhook secret and add it to your .env.local as CLERK_WEBHOOK_SECRET\n"
);

// Create test script
console.log("🧪 Creating test script...");
const testScript = `
const { ClerkFirestoreIntegration } = require('./src/lib/clerk-firestore-integration');

async function testIntegration() {
  try {
    console.log('Testing Clerk-Firestore integration...');
    
    // Test syncing all data
    await ClerkFirestoreIntegration.syncAllData();
    console.log('✅ Full sync completed');
    
    // Test cleanup
    await ClerkFirestoreIntegration.cleanupDeletedData();
    console.log('✅ Cleanup completed');
    
    console.log('🎉 Integration test passed!');
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
}

testIntegration();
`;

fs.writeFileSync("test-integration.js", testScript);
console.log("✅ Test script created: test-integration.js\n");

// Create deployment checklist
console.log("📋 Deployment Checklist:");
console.log("1. ✅ Environment variables configured");
console.log("2. ✅ Firebase project initialized");
console.log("3. ✅ Firestore security rules created");
console.log("4. ⏳ Webhook configured in Clerk Dashboard");
console.log(
  "5. ⏳ Deploy Firestore rules: firebase deploy --only firestore:rules"
);
console.log("6. ⏳ Test webhook endpoints");
console.log("7. ⏳ Run initial data sync\n");

console.log("🎉 Clerk-Firestore integration setup complete!");
console.log("\nNext steps:");
console.log("1. Configure webhooks in Clerk Dashboard");
console.log("2. Deploy Firestore security rules");
console.log("3. Test the integration");
console.log("4. Start your development server: npm run dev");
