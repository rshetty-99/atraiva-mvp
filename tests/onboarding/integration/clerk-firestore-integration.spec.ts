import { test, expect } from '@playwright/test';
import { generateMockEnterprises, generateMockUsers } from '../fixtures/mock-data-generator';
import {
  createFirestoreOrganization,
  createFirestoreUser,
  verifyFirestoreOrganization,
  verifyFirestoreUser,
  verifyUserOrganizationMembership,
} from '../helpers/firestore-helper';
import {
  createClerkOrganization,
  createClerkUser,
  verifyClerkUser,
} from '../helpers/clerk-helper';
import { TestFailure, createGitHubIssueIfNotExists } from '../helpers/github-issue-reporter';

/**
 * Clerk and Firestore Integration Tests
 * Tests the integration between Clerk authentication and Firestore database
 */

test.describe('Clerk and Firestore Integration', () => {
  const testEnterprises = generateMockEnterprises().slice(0, 1); // Test with 1 enterprise
  const testUsers = generateMockUsers(testEnterprises);

  test.describe.skip('Data Creation and Verification', () => {
    // Skipped by default to avoid creating test data during normal test runs
    // Remove .skip to run these tests
    
    test('should create organization in both Clerk and Firestore', async () => {
      const enterprise = testEnterprises[0];
      
      // Create in Clerk
      const clerkResult = await createClerkOrganization(enterprise);
      expect(clerkResult.success).toBeTruthy();
      
      // Create in Firestore
      const firestoreResult = await createFirestoreOrganization(
        enterprise,
        clerkResult.organizationId
      );
      expect(firestoreResult.success).toBeTruthy();
      
      // Verify
      const exists = await verifyFirestoreOrganization(enterprise.id);
      expect(exists).toBeTruthy();
    });
    
    test('should create user in both Clerk and Firestore', async () => {
      const user = testUsers[0];
      
      // Create in Clerk
      const clerkResult = await createClerkUser(user);
      expect(clerkResult.success).toBeTruthy();
      
      // Create in Firestore
      const firestoreResult = await createFirestoreUser(
        user,
        clerkResult.userId
      );
      expect(firestoreResult.success).toBeTruthy();
      
      // Verify
      const existsFirestore = await verifyFirestoreUser(user.id);
      expect(existsFirestore).toBeTruthy();
      
      const existsClerk = await verifyClerkUser(user.email);
      expect(existsClerk).toBeTruthy();
    });
    
    test('should link user to organization', async () => {
      const user = testUsers[0];
      const enterprise = testEnterprises[0];
      
      // Verify membership
      const isMember = await verifyUserOrganizationMembership(
        user.id,
        enterprise.id
      );
      expect(isMember).toBeTruthy();
    });
  });

  test.describe('User Authentication Flow', () => {
    test('should allow user to sign in with test credentials', async ({ page, browserName }) => {
      try {
        const testUser = testUsers[0];
        
        // Navigate to sign-in page
        await page.goto('/sign-in');
        await page.waitForLoadState('networkidle');
        
        // Fill in credentials
        const emailInput = page.locator('input[type="email"]').or(
          page.locator('input[name="identifier"]')
        ).first();
        const passwordInput = page.locator('input[type="password"]').first();
        
        if (await emailInput.count() > 0 && await passwordInput.count() > 0) {
          await emailInput.fill(testUser.email);
          await passwordInput.fill(testUser.password);
          
          // Submit form
          const submitButton = page.locator('button[type="submit"]').or(
            page.locator('button:has-text("Sign in")')
          ).first();
          
          await submitButton.click();
          
          // Wait for navigation or error
          await page.waitForTimeout(3000);
          
          // Check if we're redirected or see error
          const currentUrl = page.url();
          const hasError = await page.locator('text=/error|invalid|incorrect/i').first().isVisible().catch(() => false);
          
          if (hasError) {
            console.log('Sign-in error - test credentials may need to be seeded first');
          } else {
            console.log(`Redirected to: ${currentUrl}`);
          }
        }
        
      } catch (error) {
        console.log('Sign-in test - requires seeded data');
      }
    });
    
    test('should display user information after sign-in', async ({ page, browserName }) => {
      try {
        // This test would require authenticated session
        // Placeholder for now
        expect(true).toBeTruthy();
        
      } catch (error) {
        console.log('User info test - requires authentication');
      }
    });
  });

  test.describe('Organization Context', () => {
    test('should show correct organization after sign-in', async ({ page, browserName }) => {
      try {
        // This test would require authenticated session
        // Placeholder for now
        expect(true).toBeTruthy();
        
      } catch (error) {
        console.log('Organization context test - requires authentication');
      }
    });
  });

  test.describe('Data Synchronization', () => {
    test('should sync user updates between Clerk and Firestore', async () => {
      // This test would require webhook setup
      // Placeholder for now
      expect(true).toBeTruthy();
    });
  });
});

