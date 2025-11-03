/**
 * Global Teardown for Onboarding Tests
 * Runs after all tests
 */

import { cleanupTestFirestoreData } from './firestore-helper';
import { cleanupTestClerkData } from './clerk-helper';

async function globalTeardown() {
  console.log('\n🧹 Cleaning up test data...\n');
  
  // Optional: Uncomment to auto-cleanup test data after tests
  /*
  try {
    if (process.env.AUTO_CLEANUP === 'true') {
      console.log('Cleaning up Firestore test data...');
      const firestoreResult = await cleanupTestFirestoreData();
      console.log(`   ✅ Deleted ${firestoreResult.deletedOrganizations} organizations`);
      console.log(`   ✅ Deleted ${firestoreResult.deletedUsers} users`);
      
      console.log('Cleaning up Clerk test data...');
      const clerkResult = await cleanupTestClerkData();
      console.log(`   ✅ Deleted ${clerkResult.deletedUsers} users`);
      console.log(`   ✅ Deleted ${clerkResult.deletedOrganizations} organizations`);
    } else {
      console.log('⏭️  Auto-cleanup disabled. Set AUTO_CLEANUP=true to enable.');
    }
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
  */
  
  console.log('\n✨ Test suite complete!\n');
}

export default globalTeardown;

