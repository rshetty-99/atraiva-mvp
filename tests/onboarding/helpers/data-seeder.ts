/**
 * Data Seeder for Test Automation
 * Seeds test data into both Clerk and Firestore
 */

import { generateAllMockData, MockEnterprise, MockUser } from '../fixtures/mock-data-generator';
import {
  createClerkOrganization,
  createClerkUser,
  ClerkOrganizationCreationResult,
  ClerkUserCreationResult,
} from './clerk-helper';
import {
  createFirestoreOrganization,
  createFirestoreUser,
  FirestoreCreationResult,
} from './firestore-helper';

export interface SeedResult {
  success: boolean;
  totalEnterprises: number;
  successfulEnterprises: number;
  failedEnterprises: number;
  totalUsers: number;
  successfulUsers: number;
  failedUsers: number;
  enterpriseResults: EnterpriseCreationResult[];
  userResults: UserCreationResult[];
  duration: number;
  errors: string[];
}

export interface EnterpriseCreationResult {
  enterprise: MockEnterprise;
  clerkResult: ClerkOrganizationCreationResult;
  firestoreResult: FirestoreCreationResult;
}

export interface UserCreationResult {
  user: MockUser;
  clerkResult: ClerkUserCreationResult;
  firestoreResult: FirestoreCreationResult;
}

/**
 * Seed all test data
 */
export async function seedAllTestData(): Promise<SeedResult> {
  const startTime = Date.now();
  const mockData = generateAllMockData();
  const errors: string[] = [];

  console.log('🌱 Starting data seeding...');
  console.log(`📊 Enterprises to create: ${mockData.enterprises.length}`);
  console.log(`👥 Users to create: ${mockData.users.length}`);
  console.log('');

  // Seed enterprises first
  console.log('🏢 Seeding enterprises...');
  const enterpriseResults = await seedEnterprises(mockData.enterprises);
  const successfulEnterprises = enterpriseResults.filter(
    r => r.clerkResult.success && r.firestoreResult.success
  );

  console.log(`✅ Successfully created: ${successfulEnterprises.length} enterprises`);
  console.log(`❌ Failed: ${enterpriseResults.length - successfulEnterprises.length} enterprises`);
  console.log('');

  // Collect errors
  enterpriseResults.forEach(result => {
    if (!result.clerkResult.success) {
      errors.push(`Clerk Error (${result.enterprise.name}): ${result.clerkResult.error}`);
    }
    if (!result.firestoreResult.success) {
      errors.push(`Firestore Error (${result.enterprise.name}): ${result.firestoreResult.error}`);
    }
  });

  // Seed users
  console.log('👥 Seeding users...');
  const userResults = await seedUsers(mockData.users);
  const successfulUsers = userResults.filter(
    r => r.clerkResult.success && r.firestoreResult.success
  );

  console.log(`✅ Successfully created: ${successfulUsers.length} users`);
  console.log(`❌ Failed: ${userResults.length - successfulUsers.length} users`);
  console.log('');

  // Collect user errors
  userResults.forEach(result => {
    if (!result.clerkResult.success) {
      errors.push(`Clerk Error (${result.user.email}): ${result.clerkResult.error}`);
    }
    if (!result.firestoreResult.success) {
      errors.push(`Firestore Error (${result.user.email}): ${result.firestoreResult.error}`);
    }
  });

  const duration = Date.now() - startTime;

  const summary: SeedResult = {
    success: errors.length === 0,
    totalEnterprises: mockData.enterprises.length,
    successfulEnterprises: successfulEnterprises.length,
    failedEnterprises: enterpriseResults.length - successfulEnterprises.length,
    totalUsers: mockData.users.length,
    successfulUsers: successfulUsers.length,
    failedUsers: userResults.length - successfulUsers.length,
    enterpriseResults,
    userResults,
    duration,
    errors,
  };

  console.log('📈 Seeding Summary:');
  console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
  console.log(`🏢 Enterprises: ${summary.successfulEnterprises}/${summary.totalEnterprises}`);
  console.log(`👥 Users: ${summary.successfulUsers}/${summary.totalUsers}`);
  console.log(`❌ Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\n⚠️  Errors encountered:');
    errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
  }

  return summary;
}

/**
 * Seed enterprises/organizations
 */
async function seedEnterprises(
  enterprises: MockEnterprise[]
): Promise<EnterpriseCreationResult[]> {
  const results: EnterpriseCreationResult[] = [];

  for (let i = 0; i < enterprises.length; i++) {
    const enterprise = enterprises[i];
    console.log(`  [${i + 1}/${enterprises.length}] Creating ${enterprise.name}...`);

    // Create in Clerk
    const clerkResult = await createClerkOrganization(enterprise);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create in Firestore
    const firestoreResult = await createFirestoreOrganization(
      enterprise,
      clerkResult.organizationId
    );

    results.push({
      enterprise,
      clerkResult,
      firestoreResult,
    });

    if (clerkResult.success && firestoreResult.success) {
      console.log(`  ✅ ${enterprise.name}`);
    } else {
      console.log(`  ❌ ${enterprise.name}`);
    }
  }

  return results;
}

/**
 * Seed users
 */
async function seedUsers(users: MockUser[]): Promise<UserCreationResult[]> {
  const results: UserCreationResult[] = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`  [${i + 1}/${users.length}] Creating ${user.email}...`);

    // Create in Clerk
    const clerkResult = await createClerkUser(user);
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create in Firestore
    const firestoreResult = await createFirestoreUser(
      user,
      clerkResult.userId
    );

    results.push({
      user,
      clerkResult,
      firestoreResult,
    });

    if (clerkResult.success && firestoreResult.success) {
      console.log(`  ✅ ${user.email}`);
    } else {
      console.log(`  ❌ ${user.email}`);
    }
  }

  return results;
}

/**
 * Export seeding results to JSON
 */
export function exportSeedResultsToJSON(result: SeedResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Main seeding function (can be run directly)
 */
if (require.main === module) {
  seedAllTestData()
    .then(result => {
      console.log('\n✨ Seeding complete!');
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

