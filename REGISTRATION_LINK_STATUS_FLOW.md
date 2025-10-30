# Registration Link Status Flow

## Current Implementation ✅

The registration link system **already properly prevents reuse** after onboarding is complete. Here's how:

### Status Flow

```
pending → sent → used
   ↓        ↓
expired  expired
   ↓        ↓
cancelled cancelled
```

### Detailed Flow

#### 1. **Link Creation** (`status: "pending"`)

```typescript
// src/lib/registration-link-service.ts:89-95
const registrationLink: Omit<RegistrationLink, "id"> = {
  token,
  status: "pending",
  paymentStatus: "completed",
  // ... other fields
};
```

#### 2. **Email Sent** (`status: "sent"`)

```typescript
// src/lib/registration-link-service.ts:190-195
await registrationLinkService.update(linkId, {
  emailSent: true,
  emailSentAt: new Date(),
  lastEmailSentAt: new Date(),
  status: "sent", // ← Changes to "sent"
});
```

#### 3. **Onboarding Completed** (`status: "used"`) ✅

```typescript
// src/lib/registration-link-service.ts:314-341
export async function markRegistrationLinkUsed(
  linkId: string,
  userId: string,
  clerkUserId: string,
  clerkOrgId: string,
  firestoreUserId: string,
  firestoreOrgId: string
) {
  await registrationLinkService.update(linkId, {
    status: "used", // ← MARKED AS USED
    usedAt: new Date(), // ← Timestamp recorded
    usedBy: userId, // ← User who completed it
    clerkUserId, // ← Created Clerk user ID
    clerkOrgId, // ← Created Clerk org ID
    firestoreUserId, // ← Created Firestore user ID
    firestoreOrgId, // ← Created Firestore org ID
  });
}
```

#### 4. **Prevention of Reuse** ✅

```typescript
// src/lib/registration-link-service.ts:288-294
// In validateRegistrationToken()

if (link.status === "used") {
  return {
    valid: false,
    error: "This registration link has already been used.", // ← BLOCKS REUSE
  };
}
```

### Status Definitions

| Status      | Description                      | Can Be Used?        |
| ----------- | -------------------------------- | ------------------- |
| `pending`   | Link created, email not sent yet | ✅ Yes              |
| `sent`      | Email sent to user               | ✅ Yes              |
| `used`      | **Registration completed**       | ❌ **No - Blocked** |
| `expired`   | Link expired (3 days passed)     | ❌ No               |
| `cancelled` | Admin cancelled the link         | ❌ No               |

## Issue with Teams Page Stats ⚠️

### Current Query (INCORRECT)

```typescript
// src/app/api/admin/organizations/route.ts
const onboardingQuery = query(
  registrationLinksRef,
  where("status", "==", "pending"), // ← WRONG!
  where("paymentStatus", "==", "completed")
);
```

**Problem**: Status changes to `"sent"` after email is sent, so the query misses most onboarding links!

### Correct Query (FIXED)

```typescript
const onboardingQuery = query(
  registrationLinksRef,
  where("status", "in", ["pending", "sent"]), // ← Include BOTH statuses
  where("paymentStatus", "==", "completed")
);
```

**Or even better - exclude completed ones:**

```typescript
const onboardingQuery = query(
  registrationLinksRef,
  where("status", "!=", "used"), // ← NOT used
  where("paymentStatus", "==", "completed")
);
```

## What Happens After Registration

### Step-by-Step

1. **User clicks registration link** → Validation passes (status is "sent")
2. **User completes registration form** → Creates Clerk user & organization
3. **System calls `markRegistrationLinkUsed()`** → Status changes to "used"
4. **Link is now permanently blocked** → Cannot be used again

### Tracked Data When Marked as Used

```typescript
{
  status: "used",
  usedAt: "2024-01-15T10:30:00Z",
  usedBy: "user_abc123",
  clerkUserId: "user_abc123",
  clerkOrgId: "org_xyz789",
  firestoreUserId: "abc123",
  firestoreOrgId: "xyz789"
}
```

## Security Features ✅

### 1. **Cryptographically Secure Tokens**

```typescript
// src/lib/registration-link-service.ts:15-17
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("base64url");
}
```

- Uses Node.js `crypto.randomBytes()`
- 32-byte tokens = 256 bits of entropy
- Base64URL encoded (URL-safe)

### 2. **Expiration (3 Days)**

```typescript
// src/lib/registration-link-service.ts:22-26
export function calculateExpirationDate(): Date {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 3);
  return expirationDate;
}
```

### 3. **Validation Checks**

```typescript
// src/lib/registration-link-service.ts:257-309
export async function validateRegistrationToken(token: string) {
  // 1. Check if link exists
  if (!link) return { valid: false };

  // 2. Check if expired
  if (now > link.expiresAt) {
    await markAsExpired(link.id);
    return { valid: false };
  }

  // 3. Check if already used ✅
  if (link.status === "used") {
    return { valid: false, error: "Already used" };
  }

  // 4. Check if cancelled
  if (link.status === "cancelled") {
    return { valid: false, error: "Cancelled" };
  }

  return { valid: true, link };
}
```

### 4. **One Email = One Active Link**

```typescript
// src/lib/registration-link-service.ts:69-80
const hasActive = await registrationLinkQueries.hasActiveLink(
  data.primaryUserData.email
);

if (hasActive) {
  return {
    success: false,
    error: "An active registration link already exists for this email.",
  };
}
```

## Audit Trail

Every registration link tracks:

- ✅ **Created by** (admin user ID + email)
- ✅ **Created at** (timestamp)
- ✅ **Email sent** (timestamp)
- ✅ **Email resend count**
- ✅ **Used at** (timestamp)
- ✅ **Used by** (user ID)
- ✅ **Clerk IDs** (user + org)
- ✅ **Firestore IDs** (user + org)
- ✅ **Cancelled** (timestamp + by + reason)

## Recommendation: Fix Stats Query

The Teams page onboarding count needs to be updated to correctly query links in the onboarding process:

```typescript
// Include both "pending" and "sent" statuses
// Exclude "used", "expired", "cancelled"

const onboardingQuery = query(
  registrationLinksRef,
  where("status", "in", ["pending", "sent"]),
  where("paymentStatus", "==", "completed")
);
```

This will accurately count organizations that:

- ✅ Have completed payment
- ✅ Have a valid registration link
- ✅ Have NOT yet completed registration

## Summary

✅ **Already Implemented Correctly:**

- Registration links are marked as "used" after completion
- Used links cannot be reused (validation blocks them)
- Full audit trail is maintained
- Secure token generation
- Expiration after 3 days
- One active link per email

⚠️ **Needs Fix:**

- Teams page onboarding count query should include `status IN ["pending", "sent"]` instead of just `"pending"`
