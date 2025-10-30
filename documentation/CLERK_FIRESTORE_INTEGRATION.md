# Clerk-Firestore Integration Guide

This document provides a comprehensive guide for integrating Clerk authentication with Firestore database in the Atraiva application.

## Overview

The Clerk-Firestore integration provides:

- Automatic user synchronization between Clerk and Firestore
- Organization management with role-based access control
- Real-time webhook handling for data consistency
- Session management with cached metadata
- Comprehensive API for manual synchronization

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Clerk Auth    │◄──►│  Webhook Handler │◄──►│   Firestore     │
│                 │    │                  │    │                 │
│ • Users         │    │ • User Events    │    │ • users/        │
│ • Organizations │    │ • Org Events     │    │ • organizations/│
│ • Memberships   │    │ • Membership     │    │ • audit_logs/   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐
│ Session Service │    │ Integration API  │
│                 │    │                  │
│ • Cached Data   │    │ • Manual Sync    │
│ • Metadata      │    │ • Cleanup        │
│ • Permissions   │    │ • Health Check   │
└─────────────────┘    └──────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Ensure your `.env.local` file contains all required variables:

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

### 2. Webhook Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to Webhooks section
3. Create a new webhook with URL: `https://yourdomain.com/api/webhooks/clerk`
4. Select the following events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organizationMembership.created`
   - `organizationMembership.updated`
   - `organizationMembership.deleted`
   - `session.created`
   - `session.ended`

### 3. Firestore Security Rules

Deploy the security rules to your Firestore database:

```bash
firebase deploy --only firestore:rules
```

### 4. Initial Data Sync

Run the setup script to sync existing data:

```bash
node scripts/setup-clerk-firestore.js
```

## API Reference

### Webhook Endpoints

#### `POST /api/webhooks/clerk`

Handles Clerk webhook events and syncs data to Firestore.

**Supported Events:**

- User lifecycle events (created, updated, deleted)
- Organization lifecycle events
- Membership changes
- Session events

### Sync API

#### `POST /api/sync/clerk-firestore`

Manual synchronization endpoints.

**Actions:**

- `sync-user`: Sync specific user
- `sync-organization`: Sync specific organization
- `sync-membership`: Sync organization membership
- `sync-all`: Sync all data
- `cleanup`: Remove deleted data

**Example:**

```javascript
// Sync all data
fetch("/api/sync/clerk-firestore", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ action: "sync-all" }),
});

// Sync specific user
fetch("/api/sync/clerk-firestore", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "sync-user",
    userId: "user_123",
  }),
});
```

#### `GET /api/sync/clerk-firestore`

Retrieve user data with organizations.

**Query Parameters:**

- `action=user`: Get user data
- `userId`: Specific user ID (defaults to current user)

## Data Models

### User Document Structure

```typescript
interface User {
  id: string; // Clerk user ID
  auth: {
    email: string;
    clerkId: string;
    lastSignIn: Date;
    isActive: boolean;
  };
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    imageUrl: string;
    timezone: string;
    locale: string;
  };
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: "public" | "organization" | "private";
      dataSharing: boolean;
    };
  };
  security: {
    mfaEnabled: boolean;
    lastPasswordChange: Date;
    loginAttempts: number;
    accountLocked: boolean;
  };
  organizations: Array<{
    orgId: string;
    role: string;
    permissions: string[];
    isPrimary: boolean;
    joinedAt: Date;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}
```

### Organization Document Structure

```typescript
interface Organization {
  orgId: string; // Clerk organization ID
  profile: {
    name: string;
    slug: string;
    type: string;
    industry: string;
    size: "startup" | "small" | "medium" | "large" | "enterprise";
    description: string;
    website: string;
    logoUrl: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  subscription: {
    plan: "free" | "basic" | "pro" | "enterprise";
    status: "active" | "past_due" | "canceled" | "trialing";
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    trialEndsAt?: Date;
  };
  settings: {
    allowInvitations: boolean;
    requireEmailVerification: boolean;
    allowSelfRegistration: boolean;
    defaultRole: string;
    dataRetentionDays: number;
  };
  compliance: {
    regulations: string[];
    dataClassification: string;
    retentionPolicy: string;
    auditLogging: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

## Usage Examples

### 1. Getting User Session Data

```typescript
import { useSession } from "@/hooks/useSession";

function MyComponent() {
  const { session, loading, error } = useSession();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!session) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>Welcome, {session.user.displayName}!</h1>
      <p>Organization: {session.currentOrganization?.name}</p>
      <p>Role: {session.currentOrganization?.role}</p>
    </div>
  );
}
```

### 2. Checking Permissions

```typescript
import { usePermissions } from "@/hooks/useSession";

function AdminPanel() {
  const { hasAllPermissions, hasAnyPermission } = usePermissions([
    "manage_users",
    "manage_organizations",
    "view_audit_logs",
  ]);

  if (!hasAllPermissions) {
    return <div>Access denied</div>;
  }

  return <div>Admin panel content</div>;
}
```

### 3. Manual Data Sync

```typescript
import { ClerkFirestoreIntegration } from "@/lib/clerk-firestore-integration";

// Sync specific user
const user = await ClerkFirestoreIntegration.syncUserToFirestore("user_123");

// Sync specific organization
const org = await ClerkFirestoreIntegration.syncOrganizationToFirestore(
  "org_456"
);

// Sync membership
await ClerkFirestoreIntegration.syncMembershipToFirestore(
  "user_123",
  "org_456",
  "admin",
  ["manage_users", "manage_organizations"]
);

// Get user with organizations
const userWithOrgs = await ClerkFirestoreIntegration.getUserWithOrganizations(
  "user_123"
);
```

## Error Handling

The integration includes comprehensive error handling:

1. **Webhook Failures**: Logged and returned as 500 errors
2. **Sync Failures**: Retry logic with exponential backoff
3. **Data Validation**: Type checking and schema validation
4. **Network Issues**: Graceful degradation and fallback mechanisms

## Monitoring and Debugging

### Logs

All integration activities are logged with appropriate levels:

- `INFO`: Successful operations
- `WARN`: Non-critical issues
- `ERROR`: Critical failures

### Health Checks

Use the sync API to check integration health:

```bash
# Check if user exists and is synced
curl -X GET "http://localhost:3000/api/sync/clerk-firestore?action=user&userId=user_123"

# Test full sync
curl -X POST "http://localhost:3000/api/sync/clerk-firestore" \
  -H "Content-Type: application/json" \
  -d '{"action": "sync-all"}'
```

### Common Issues

1. **User not found in Firestore**: Run manual sync
2. **Webhook not receiving events**: Check webhook URL and secret
3. **Permission denied**: Verify Firestore security rules
4. **Data inconsistency**: Run cleanup and full sync

## Security Considerations

1. **Webhook Security**: Always verify webhook signatures
2. **Data Validation**: Validate all incoming data
3. **Access Control**: Use Firestore security rules
4. **Audit Logging**: Log all sensitive operations
5. **Rate Limiting**: Implement rate limiting for sync operations

## Performance Optimization

1. **Caching**: Session data is cached in Clerk metadata
2. **Batch Operations**: Use batch writes for multiple operations
3. **Indexing**: Create appropriate Firestore indexes
4. **Pagination**: Implement pagination for large datasets

## Troubleshooting

### Webhook Not Working

1. Check webhook URL is accessible
2. Verify webhook secret matches
3. Check Clerk dashboard for webhook status
4. Review server logs for errors

### Data Not Syncing

1. Check Firestore security rules
2. Verify Firebase credentials
3. Check network connectivity
4. Review error logs

### Session Issues

1. Clear browser cache and cookies
2. Check Clerk configuration
3. Verify session service is working
4. Check for JavaScript errors

## Support

For additional support:

1. Check the logs for specific error messages
2. Review this documentation
3. Test with the provided examples
4. Contact the development team

## Changelog

### v1.0.0

- Initial Clerk-Firestore integration
- Webhook handling for all user/org events
- Session management with caching
- Manual sync API
- Comprehensive documentation
