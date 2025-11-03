/**
 * Clerk Helper for Test Automation
 * Handles Clerk API interactions for creating and managing test users
 */

import { MockUser, MockEnterprise } from '../fixtures/mock-data-generator';

export interface ClerkUserCreationResult {
  success: boolean;
  userId?: string;
  email: string;
  error?: string;
}

export interface ClerkOrganizationCreationResult {
  success: boolean;
  organizationId?: string;
  name: string;
  error?: string;
}

/**
 * Create a user in Clerk via API
 */
export async function createClerkUser(user: MockUser): Promise<ClerkUserCreationResult> {
  try {
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkApiKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    const response = await fetch('https://api.clerk.com/v1/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: [user.email],
        password: user.password,
        first_name: user.firstName,
        last_name: user.lastName,
        username: user.email.split('@')[0],
        public_metadata: {
          role: user.role,
          department: user.department,
          title: user.title,
          phone: user.phone,
        },
        private_metadata: {
          enterpriseId: user.enterpriseId,
          enterpriseName: user.enterpriseName,
          testUser: true, // Mark as test user for easy cleanup
        },
        skip_password_checks: true,
        skip_password_requirement: false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        email: user.email,
        error: JSON.stringify(errorData),
      };
    }

    const data = await response.json();
    return {
      success: true,
      userId: data.id,
      email: user.email,
    };
  } catch (error) {
    return {
      success: false,
      email: user.email,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create an organization in Clerk via API
 */
export async function createClerkOrganization(
  enterprise: MockEnterprise
): Promise<ClerkOrganizationCreationResult> {
  try {
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkApiKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    const response = await fetch('https://api.clerk.com/v1/organizations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${clerkApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: enterprise.name,
        slug: enterprise.id,
        public_metadata: {
          category: enterprise.category,
          industry: enterprise.industry,
          size: enterprise.size,
          domain: enterprise.domain,
          website: enterprise.website,
        },
        private_metadata: {
          enterpriseId: enterprise.id,
          testOrganization: true, // Mark as test org for easy cleanup
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        name: enterprise.name,
        error: JSON.stringify(errorData),
      };
    }

    const data = await response.json();
    return {
      success: true,
      organizationId: data.id,
      name: enterprise.name,
    };
  } catch (error) {
    return {
      success: false,
      name: enterprise.name,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Delete a user from Clerk (cleanup)
 */
export async function deleteClerkUser(userId: string): Promise<boolean> {
  try {
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkApiKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${clerkApiKey}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting Clerk user:', error);
    return false;
  }
}

/**
 * Delete an organization from Clerk (cleanup)
 */
export async function deleteClerkOrganization(organizationId: string): Promise<boolean> {
  try {
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkApiKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    const response = await fetch(`https://api.clerk.com/v1/organizations/${organizationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${clerkApiKey}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error deleting Clerk organization:', error);
    return false;
  }
}

/**
 * Get all test users (marked with testUser: true)
 */
export async function getTestClerkUsers(): Promise<string[]> {
  try {
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkApiKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    const response = await fetch('https://api.clerk.com/v1/users?limit=500', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clerkApiKey}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data
      .filter((user: any) => user.private_metadata?.testUser === true)
      .map((user: any) => user.id);
  } catch (error) {
    console.error('Error getting test Clerk users:', error);
    return [];
  }
}

/**
 * Cleanup all test users and organizations
 */
export async function cleanupTestClerkData(): Promise<{
  deletedUsers: number;
  deletedOrganizations: number;
}> {
  const userIds = await getTestClerkUsers();
  let deletedUsers = 0;
  let deletedOrganizations = 0;

  // Delete users
  for (const userId of userIds) {
    const deleted = await deleteClerkUser(userId);
    if (deleted) deletedUsers++;
  }

  // Note: Organizations cleanup would require similar logic
  // This is a simplified version

  return { deletedUsers, deletedOrganizations };
}

/**
 * Verify user exists in Clerk
 */
export async function verifyClerkUser(email: string): Promise<boolean> {
  try {
    const clerkApiKey = process.env.CLERK_SECRET_KEY;
    
    if (!clerkApiKey) {
      throw new Error('CLERK_SECRET_KEY not found in environment variables');
    }

    const response = await fetch(
      `https://api.clerk.com/v1/users?email_address[]=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${clerkApiKey}`,
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.length > 0;
  } catch (error) {
    console.error('Error verifying Clerk user:', error);
    return false;
  }
}

