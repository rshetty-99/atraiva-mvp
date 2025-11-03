# User Data Structure Standardization

## Issue Identified

When comparing two user documents in Firestore, a critical structural inconsistency was discovered:

### User 1 (rshetty@techsamur.ai) - Correct Structure:

```json
{
  "userType": "enterprise",
  "organizations": [
    {
      "orgId": "org_33uxKqUuJzPklNxZ20Uh9GfzJf2",
      "role": "org:admin",
      "permissions": ["org:sys_memberships:manage", ...],
      "isPrimary": false,
      "joinedAt": "...",
      "updatedAt": "..."
    }
  ],
  "role": "org_admin"
}
```

### User 2 (deepti@techsamur.ai) - Incorrect Structure:

```json
{
  "organizations": ["org_33uxKqUuJzPklNxZ20Uh9GfzJf2"], // ❌ String array instead of objects
  "role": "org_manager"
  // Missing userType field
}
```

## Root Cause

The member invitation completion API was creating users with a simplified `organizations` structure (just string array) instead of the proper `UserOrganizationMembership` object structure.

## Changes Made

### 1. Updated Type Definition (`src/lib/firestore/types.ts`)

**Added new interface:**

```typescript
export interface UserOrganizationMembership {
  orgId: string;
  role: string; // Clerk role like "org:admin" or "org:member"
  permissions: string[];
  isPrimary: boolean;
  joinedAt: Date;
  updatedAt: Date;
}
```

**Updated User interface:**

```typescript
export interface User {
  // ...
  organizations: UserOrganizationMembership[]; // Changed from string[]
  userType?: "law_firm" | "enterprise" | "channel_partner" | "platform_admin";
  // ...
}
```

### 2. Fixed Member Invitation API (`src/app/api/invitations/complete/route.ts`)

**Key Updates:**

- Now fetches organization details to determine `userType` from `organizationType`
- Creates proper `UserOrganizationMembership` objects in the `organizations` array
- Captures Clerk membership details including role and permissions
- Sets `isPrimary: true` for the member's first organization
- Uses the `username` from the form instead of deriving from email

**Structure created:**

```typescript
{
  userType: "enterprise", // From organization.organizationType
  organizations: [
    {
      orgId: invitation.organizationId,
      role: "org:admin" or "org:member", // From Clerk membership
      permissions: [...], // From Clerk membership
      isPrimary: true,
      joinedAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  role: invitation.memberData.role,
  // ... other fields
}
```

### 3. Fixed Registration Completion API (`src/app/api/registration/complete/route.ts`)

Updated to create proper organization membership structure for primary users during registration:

```typescript
{
  organizations: [
    {
      orgId: clerkOrg.id,
      role: "org:admin", // Primary user is always org admin
      permissions: ["*"], // Full permissions for primary user
      isPrimary: true,
      joinedAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  userType: orgData.organizationType,
  // ...
}
```

### 4. Fixed Onboarding Service (`src/lib/onboarding-service.ts`)

**Updated `updateUserWithOnboardingData`:**

```typescript
{
  organizations: [
    {
      orgId: organizationId,
      role: "org:admin", // Primary user from onboarding is always org admin
      permissions: ["*"], // Full permissions for primary user
      isPrimary: true,
      joinedAt: new Date(),
      updatedAt: new Date(),
    }
  ],
  userType: onboardingData.userType,
  // ...
}
```

**Updated `addMemberToOrganization`:**

- Checks if organization already exists using `org.orgId === organizationId`
- Adds new organization membership with proper structure
- Sets `isPrimary` based on whether it's the user's first organization

## Data Consistency

All user creation and update flows now ensure:

1. ✅ **userType** is always set based on organization type
2. ✅ **organizations** is always an array of `UserOrganizationMembership` objects
3. ✅ Each organization membership includes:
   - `orgId`: Organization ID
   - `role`: Clerk role (e.g., "org:admin", "org:member")
   - `permissions`: Array of permission strings
   - `isPrimary`: Boolean indicating primary organization
   - `joinedAt`: Timestamp when user joined
   - `updatedAt`: Last update timestamp
4. ✅ **role** field maintains the user's application-level role

## Testing Checklist

- [ ] New member invitation creates proper organization structure
- [ ] Primary user registration creates proper organization structure
- [ ] Onboarding flow creates proper organization structure
- [ ] Multi-organization users have proper membership objects
- [ ] All users have `userType` set correctly
- [ ] Existing users with old structure are migrated (if needed)

## Migration Considerations

If there are existing users with the old string array structure, a migration script should be created to:

1. Fetch all users with `organizations` as string array
2. For each organization ID, create a proper `UserOrganizationMembership` object
3. Fetch role and permissions from Clerk
4. Set first organization as `isPrimary: true`
5. Update the user document

## Files Modified

1. `src/lib/firestore/types.ts` - Type definitions
2. `src/app/api/invitations/complete/route.ts` - Member invitation completion
3. `src/app/api/registration/complete/route.ts` - Registration completion
4. `src/lib/onboarding-service.ts` - Onboarding service








