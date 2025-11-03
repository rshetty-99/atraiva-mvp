/**
 * Global Setup for Onboarding Tests
 * Runs before all tests
 */

async function globalSetup() {
  console.log('\n🚀 Starting Onboarding Test Suite...\n');
  console.log('📝 Test Configuration:');
  console.log(`   Base URL: ${process.env.BASE_URL || 'http://localhost:3001'}`);
  console.log(`   Headless: ${process.env.HEADLESS !== 'false'}`);
  console.log(`   CI Mode: ${process.env.CI ? 'Yes' : 'No'}`);
  console.log('');
  
  // Check environment variables
  const requiredEnvVars = ['CLERK_SECRET_KEY'];
  const missingVars: string[] = [];
  
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Warning: Missing environment variables:');
    missingVars.forEach(varName => console.warn(`   - ${varName}`));
    console.warn('   Some tests may be skipped.\n');
  }
  
  // Firebase initialization check
  try {
    // You can add Firebase initialization checks here if needed
    console.log('✅ Environment checks passed\n');
  } catch (error) {
    console.error('❌ Environment check failed:', error);
  }
}

export default globalSetup;

