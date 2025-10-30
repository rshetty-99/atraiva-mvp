# Teams Page 403 Error Fix

## Problem

Users were getting a **403 Forbidden** error when trying to access the Teams page (`/admin/team`) even though they had the correct role (`platform_admin` or `super_admin`).

### Error Messages

**Frontend**:

```
Failed to load organizations
Error fetching organizations: Error: Failed to fetch organizations
```

**Backend**:

```
GET /api/admin/organizations 403 in 12900ms
GET /api/admin/organizations 403 in 5121ms
```

## Root Cause

The API was checking the user's role in the **wrong location** of Clerk's metadata structure.

### ❌ Incorrect Implementation

```typescript
// API was checking here (WRONG)
const userRole = user.publicMetadata?.role as string;
```

### ✅ Correct Implementation

```typescript
// Should check here (CORRECT)
const metadata = user.publicMetadata?.atraiva as any;
const userRole = metadata?.primaryOrganization?.role as string;
```

## Why This Happened

The application stores user session data in Clerk's `publicMetadata` under a nested structure:

```typescript
{
  publicMetadata: {
    atraiva: {
      user: { ... },
      primaryOrganization: {
        id: "org_xxx",
        name: "Organization Name",
        role: "platform_admin",  // ← Role is stored HERE
        permissions: [...]
      },
      organizations: [...],
      capabilities: { ... }
    }
  }
}
```

The frontend `useRole()` hook correctly reads from `session?.currentOrganization?.role`, which maps to `publicMetadata.atraiva.primaryOrganization.role`.

However, the API route was incorrectly checking `publicMetadata.role` (which doesn't exist), causing the role check to fail and return 403.

## Changes Made

### 1. Fixed API Route (`src/app/api/admin/organizations/route.ts`)

#### GET Endpoint

```typescript
// Before
const userRole = user.publicMetadata?.role as string;

// After
const metadata = user.publicMetadata?.atraiva as any;
const userRole = metadata?.primaryOrganization?.role as string;
```

#### POST Endpoint

```typescript
// Before
const userRole = user.publicMetadata?.role as string;

// After
const metadata = user.publicMetadata?.atraiva as any;
const userRole = metadata?.primaryOrganization?.role as string;
```

### 2. Improved Error Messages

Added detailed error responses to help diagnose role issues:

```typescript
if (userRole !== "platform_admin" && userRole !== "super_admin") {
  return NextResponse.json(
    {
      error: "Forbidden",
      details: `Access denied. Your role: ${
        userRole || "unknown"
      }. Required: platform_admin or super_admin`,
    },
    { status: 403 }
  );
}
```

### 3. Enhanced Frontend Error Handling (`src/app/(dashboard)/admin/team/page.tsx`)

```typescript
if (!response.ok) {
  const errorData = await response.json();
  console.error("API Error:", errorData);
  throw new Error(
    errorData.details || errorData.error || "Failed to fetch organizations"
  );
}
```

Now users will see the specific error message including their current role.

## Testing

### 1. Verify Your Role

Check your role in Clerk metadata by adding this temporary code to the Teams page:

```typescript
import { useUser } from "@clerk/nextjs";

const { user } = useUser();
console.log("User metadata:", user?.publicMetadata);
```

### 2. Expected Metadata Structure

Your Clerk user should have this structure:

```json
{
  "publicMetadata": {
    "atraiva": {
      "primaryOrganization": {
        "role": "platform_admin" // or "super_admin"
      }
    }
  }
}
```

### 3. If Role is Missing or Incorrect

If your user doesn't have the correct role in the metadata, you need to update it using Clerk's dashboard or API:

**Option A: Clerk Dashboard**

1. Go to Clerk Dashboard → Users
2. Select your user
3. Go to "Metadata" tab
4. Edit `publicMetadata` and add:

```json
{
  "atraiva": {
    "primaryOrganization": {
      "id": "org_xxx",
      "name": "Your Org Name",
      "role": "platform_admin",
      "permissions": ["*"]
    },
    "organizations": [
      {
        "id": "org_xxx",
        "name": "Your Org Name",
        "role": "platform_admin",
        "permissions": ["*"]
      }
    ]
  }
}
```

**Option B: Use Session Refresh API**

```bash
curl -X POST http://localhost:3000/api/session/refresh \
  -H "Content-Type: application/json" \
  -d '{"clerkId": "user_xxx"}'
```

## How to Verify the Fix

### 1. Check Browser Console

After the fix, you should see:

- ✅ No 403 errors in Network tab
- ✅ Response from `/api/admin/organizations` with status 200
- ✅ Organizations array populated with data

### 2. If Still Getting 403

The console will now show your actual role:

```
API Error: {
  error: "Forbidden",
  details: "Access denied. Your role: org_admin. Required: platform_admin or super_admin"
}
```

This tells you exactly what role you have vs. what's required.

## Role Access Matrix

| Role             | Can Access Teams Page? |
| ---------------- | ---------------------- |
| `super_admin`    | ✅ Yes                 |
| `platform_admin` | ✅ Yes                 |
| `org_admin`      | ❌ No (403)            |
| `org_manager`    | ❌ No (403)            |
| `org_user`       | ❌ No (403)            |
| `org_viewer`     | ❌ No (403)            |

## Related Files

- ✅ `src/app/api/admin/organizations/route.ts` - Fixed role checking
- ✅ `src/app/(dashboard)/admin/team/page.tsx` - Enhanced error display
- 📖 `src/hooks/useSession.ts` - Shows correct metadata structure
- 📖 `src/types/session.ts` - TypeScript types for session data

## Future Prevention

To prevent similar issues in the future:

### 1. Create a Shared Role Check Utility

```typescript
// src/lib/auth-helpers.ts
export function getUserRole(user: User): string | null {
  const metadata = user.publicMetadata?.atraiva as any;
  return metadata?.primaryOrganization?.role || null;
}
```

### 2. Use in All API Routes

```typescript
import { getUserRole } from "@/lib/auth-helpers";

const userRole = getUserRole(user);
if (userRole !== "platform_admin" && userRole !== "super_admin") {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

### 3. Add TypeScript Types

```typescript
interface ClerkMetadata {
  atraiva?: {
    primaryOrganization?: {
      role: string;
      id: string;
      name: string;
      permissions: string[];
    };
    organizations: Array<{
      role: string;
      id: string;
      name: string;
      permissions: string[];
    }>;
  };
}
```

## Summary

✅ **Fixed**: Role checking now reads from correct metadata location
✅ **Enhanced**: Error messages now show user's actual role vs. required role
✅ **Improved**: Frontend displays specific error details
✅ **Documented**: Clear guide for troubleshooting role issues

The Teams page should now work correctly for users with `platform_admin` or `super_admin` roles!
