# Registration Link Security & Onboarding Status

## Summary

✅ **Your concern is already handled correctly!** The registration link system properly prevents reuse after onboarding completion.

## How It Works

### 1. **Registration Links Are Marked as "used" After Completion**

When a user completes registration:

```typescript
// src/app/api/registration/complete/route.ts (Line 180-187)
await markRegistrationLinkUsed(
  registrationLink.id,
  clerkUser.id,
  clerkUser.id,
  clerkOrg.id,
  firestoreUser.id,
  firestoreOrgId
);
```

This updates the registration link:

```typescript
// src/lib/registration-link-service.ts (Line 323-331)
{
  status: "used",              // ← Marked as used
  usedAt: new Date(),          // ← Timestamp
  usedBy: userId,              // ← User who completed it
  clerkUserId,                 // ← Created Clerk user
  clerkOrgId,                  // ← Created Clerk organization
  firestoreUserId,             // ← Created Firestore user
  firestoreOrgId,              // ← Created Firestore organization
}
```

### 2. **Validation Blocks Reuse**

When someone tries to use a link again:

```typescript
// src/lib/registration-link-service.ts (Line 288-294)
if (link.status === "used") {
  return {
    valid: false,
    error: "This registration link has already been used.",
  };
}
```

The user sees: **"This registration link has already been used."**

### 3. **Status Flow**

```
┌─────────┐
│ pending │ (Link created)
└────┬────┘
     │
     ▼
┌─────────┐
│  sent   │ (Email sent to user)
└────┬────┘
     │
     ▼
┌─────────┐
│  used   │ ◄─── ONBOARDING COMPLETE
└─────────┘      ⛔ CANNOT BE REUSED

Other possible statuses:
- expired (after 3 days)
- cancelled (admin cancelled)
```

## Fix Applied

### Issue

The Teams page onboarding count was only querying `status === "pending"`, which missed links that had already been sent.

### Before (Incorrect)

```typescript
where("status", "==", "pending"); // Only counts unsent links
```

### After (Correct) ✅

```typescript
where("status", "in", ["pending", "sent"]); // Counts both pending and sent (in onboarding)
```

Now the onboarding count correctly includes:

- ✅ Links created but not sent (`pending`)
- ✅ Links sent but not completed (`sent`)
- ❌ Links completed (`used`) - **Excluded**
- ❌ Links expired (`expired`) - **Excluded**
- ❌ Links cancelled (`cancelled`) - **Excluded**

## Security Features Already in Place

### 1. **Secure Token Generation**

- Uses `crypto.randomBytes(32)` - 256 bits of entropy
- Base64URL encoded (URL-safe)
- Cryptographically secure random tokens

### 2. **Automatic Expiration**

- Links expire after 3 days
- Automatically marked as `expired` when accessed after expiration

### 3. **One Link Per Email**

- System prevents creating multiple active links for the same email
- Ensures no duplicate registrations

### 4. **Complete Audit Trail**

Every link tracks:

- Who created it (admin ID + email)
- When it was created
- When email was sent
- How many times email was resent
- When it was used
- Who used it
- Which Clerk user/org was created
- Which Firestore user/org was created
- If cancelled: when, by whom, and why

## Validation Checks

Every time a registration link is accessed, the system checks:

1. ✅ **Does the link exist?** → If not: "Invalid registration link"
2. ✅ **Is it expired?** → If yes: "This registration link has expired"
3. ✅ **Is it already used?** → If yes: **"This registration link has already been used"**
4. ✅ **Is it cancelled?** → If yes: "This registration link has been cancelled"

## Files Involved

1. **`src/lib/registration-link-service.ts`**

   - Token generation
   - Link validation
   - Marking as used
   - Security checks

2. **`src/app/api/registration/complete/route.ts`**

   - Registration completion flow
   - Calls `markRegistrationLinkUsed()` after success

3. **`src/app/api/admin/organizations/route.ts`** (Updated)

   - Onboarding count query
   - Now includes both "pending" and "sent" statuses

4. **`src/lib/firestore/types.ts`**
   - RegistrationLink type definition
   - Status type: `"pending" | "sent" | "used" | "expired" | "cancelled"`

## Testing

To verify this works:

### 1. Create a Registration Link

```bash
# As platform admin, create a registration link
POST /api/registration-links/create
```

### 2. Complete Registration

```bash
# User completes registration
POST /api/registration/complete
```

### 3. Try to Reuse the Link

```bash
# Try to use the same token again
GET /register?token=<same_token>
```

**Expected Result:** ❌ Error message: "This registration link has already been used."

### 4. Check Firestore

```
registrationLinks/{linkId}
{
  status: "used",
  usedAt: "2024-01-15T10:30:00Z",
  usedBy: "user_abc123",
  clerkUserId: "user_abc123",
  clerkOrgId: "org_xyz789",
  // ... full audit trail
}
```

## Conclusion

✅ **Already Secure**: Registration links are properly marked as "used" and cannot be reused
✅ **Fixed**: Onboarding count now includes both "pending" and "sent" links
✅ **Validated**: Multiple security checks prevent any misuse
✅ **Auditable**: Full trail of who created, used, and when

Your registration system is secure and working as intended!
