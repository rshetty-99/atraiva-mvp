# Member Invitation System - Complete Documentation

## 📋 Overview

This document describes the complete member invitation system that allows Organization Admins and Platform Admins to invite new members to existing organizations. The system follows the same secure pattern as organization registration links.

## 🏗️ System Flow

```
1. Admin clicks "Add Member" button
   ↓
2. Fills member details (name, email, role)
   ↓
3. System creates invitation in Firestore
   ↓
4. Email with invitation link sent to member
   ↓
5. Member clicks link → validates token
   ↓
6. Member creates password (no other info needed)
   ↓
7. User created in Clerk + added to organization
   ↓
8. User synced to Firestore
   ↓
9. Invitation marked as "accepted" and expires
   ↓
10. Member can now log in!
```

## 🔐 Permissions

**Who can invite members:**

- ✅ **Platform Admin** - Can invite to any organization
- ✅ **Super Admin** - Can invite to any organization
- ✅ **Org Admin** - Can only invite to their own organization
- ❌ **Org Manager** - Cannot invite
- ❌ **Org Viewer** - Cannot invite

## 📁 File Structure

### Core Services

**1. `src/lib/firestore/types.ts`**

- Added `MemberInvitation` interface

**2. `src/lib/member-invitation-service.ts`**

- `createInvitation()` - Create new invitation
- `validateInvitationToken()` - Validate invitation link
- `markInvitationSent()` - Track email delivery
- `markInvitationAccepted()` - Mark as used after signup
- `cancelInvitation()` - Cancel pending invitation
- `getOrganizationInvitations()` - List all invitations for org

### API Routes

**3. `src/app/api/invitations/send/route.ts`**

- POST endpoint to create and send member invitations
- Checks permissions (org_admin or platform_admin)
- Generates secure token
- Sends invitation email
- Creates audit log

**4. `src/app/api/invitations/validate/route.ts`**

- POST endpoint to validate invitation tokens
- Checks expiration
- Checks if already used
- Returns invitation details

**5. `src/app/api/invitations/complete/route.ts`**

- POST endpoint to complete member signup
- Creates user in Clerk with password
- Adds user to organization in Clerk
- Creates user in Firestore
- Updates organization members
- Marks invitation as accepted
- Creates activity log
- Sends welcome notification

### UI Components

**6. `src/app/invite/[token]/page.tsx`**

- Member invitation signup page
- Validates token on load
- Shows organization and member info
- Password creation form
- Handles signup completion

**7. `src/components/InviteMemberDialog.tsx`**

- Dialog component for inviting members
- Form with validation
- Role selection
- Email sending

**8. `src/app/(dashboard)/admin/organization/[id]/page.tsx`**

- Integrated "Add Member" button with dialog
- Refreshes member list after invitation sent

### Database

**9. `firestore.indexes.json`**

- `memberData.email + organizationId + status` - Check duplicates
- `organizationId + status + createdAt` - List org invitations

**10. `firestore.rules`**

- Public read for token validation
- Authenticated create only
- Platform admin can delete

## 📊 Member Invitation Data Structure

```typescript
{
  id: "inv_1736612345678_abc123def456",
  token: "64-char-hex-string...",

  organizationId: "org_123",
  organizationName: "Atraiva.ai",

  memberData: {
    email: "newmember@example.com",
    firstName: "Jane",
    lastName: "Doe",
    role: "org_admin",
    jobTitle: "Compliance Officer",
    phoneNumber: "+1-555-123-4567"
  },

  status: "sent",

  invitedBy: "user_456",
  invitedByName: "Rajesh Shetty",
  invitedByEmail: "rajesh@atraiva.ai",
  invitedByRole: "platform_admin",

  createdAt: Date,
  expiresAt: Date, // 7 days from creation

  emailSent: true,
  emailSentAt: Date,
  emailResendCount: 0,
  lastEmailSentAt: Date
}
```

## 🔄 Complete Invitation Flow

### Step 1: Admin Invites Member

**Location:** Organization Details Page → Users Tab → "Add Member" Button

**What Happens:**

1. Admin fills out invitation form
2. API validates admin permissions
3. Checks for duplicate invitations
4. Generates secure token
5. Creates invitation in Firestore
6. Sends email with invitation link
7. Returns success

**API Call:**

```javascript
POST /api/invitations/send
{
  "organizationId": "org_123",
  "memberData": {
    "email": "newmember@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "role": "org_admin",
    "jobTitle": "Compliance Officer"
  }
}
```

### Step 2: Member Receives Email

**Email Contains:**

- Invitation from [Inviter Name]
- Organization name
- Assigned role
- Call-to-action button with invitation link
- Expiration date (7 days)

**Email Link:**

```
https://yourdomain.com/invite/[64-char-token]
```

### Step 3: Member Clicks Link

**What Happens:**

1. Redirected to `/invite/[token]` page
2. Token validated via API
3. If valid: Shows invitation details + password form
4. If invalid/expired: Shows error message

**API Call:**

```javascript
POST /api/invitations/validate
{
  "token": "abc123..."
}
```

### Step 4: Member Creates Password

**What Happens:**

1. Member enters password (min 8 characters)
2. Confirms password
3. Clicks "Create Account & Join"
4. API creates user in Clerk
5. User added to organization
6. User synced to Firestore
7. Invitation marked as accepted
8. Session metadata updated
9. Activity logged
10. Welcome notification created
11. Member redirected to sign-in

**API Call:**

```javascript
POST /api/invitations/complete
{
  "token": "abc123...",
  "password": "securepassword123"
}
```

### Step 5: Member Logs In

**What Happens:**

1. Member uses email + password to sign in
2. Clerk authenticates
3. Session established with organization data
4. Redirected to dashboard
5. Sees welcome notification

## 🎯 What Gets Created

### In Clerk

1. ✅ **User Account** - With email and password
2. ✅ **Organization Membership** - User added to organization
3. ✅ **Public Metadata** - Organization and role info
4. ✅ **Private Metadata** - Organization ID and onboarding status

### In Firestore

1. ✅ **User Document** (`/users/{userId}`)

   - Profile, preferences, security settings
   - Organization reference
   - Role assignment

2. ✅ **Organization Update** (`/organizations/{orgId}`)

   - Member added to `members` array

3. ✅ **Invitation Update** (`/memberInvitations/{invId}`)

   - Status changed to "accepted"
   - Clerk and Firestore IDs recorded

4. ✅ **Activity Log** (`/auditLogs/{logId}`)

   - Member joining activity logged

5. ✅ **Notification** (`/notifications/{notifId}`)
   - Welcome notification for new member

## 📧 Invitation Email Templates

### HTML Email

- Professional design with gradient header
- Organization name and inviter info
- Clear call-to-action button
- Step-by-step instructions
- Expiration notice
- Footer with terms

### Text Email

- Plain text alternative
- All same information
- Direct link to invitation

## 🔒 Security Features

### Token Security

- ✅ **Cryptographically secure** - 64-character hex tokens
- ✅ **One-time use** - Expires after acceptance
- ✅ **Time-limited** - 7-day expiration
- ✅ **Validation checks** - Expired, used, cancelled

### Permission Checks

- ✅ **Role-based** - Only org_admin and platform_admin
- ✅ **Organization scoped** - Org admins can only invite to their org
- ✅ **Duplicate prevention** - Can't send multiple invites to same email

### Data Protection

- ✅ **User-scoped** - Members can't see other invitations
- ✅ **Immutable** - Can't edit accepted invitations
- ✅ **Audit trail** - All actions logged

## 📊 Invitation States

| Status        | Meaning                     | Can Accept? | Can Cancel? |
| ------------- | --------------------------- | ----------- | ----------- |
| **pending**   | Created, email not sent yet | ✅          | ✅          |
| **sent**      | Email sent to member        | ✅          | ✅          |
| **accepted**  | Member signed up            | ❌          | ❌          |
| **expired**   | Past expiration date        | ❌          | ❌          |
| **cancelled** | Cancelled by admin          | ❌          | ❌          |

## 🚀 Usage Examples

### Invite a Member (As Org Admin)

```typescript
// From organization details page
<InviteMemberDialog
  organizationId="org_123"
  organizationName="Atraiva.ai"
  onInviteSent={() => refreshMembers()}
/>
```

### Invite a Member (Programmatically)

```typescript
const response = await fetch("/api/invitations/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    organizationId: "org_123",
    memberData: {
      email: "jane@example.com",
      firstName: "Jane",
      lastName: "Doe",
      role: "org_admin",
      jobTitle: "Compliance Officer",
    },
  }),
});
```

### Check Invitation Status

```typescript
const invitations = await MemberInvitationService.getOrganizationInvitations(
  "org_123"
);

const pending = invitations.filter((i) => i.status === "sent");
const accepted = invitations.filter((i) => i.status === "accepted");
```

### Cancel an Invitation

```typescript
await MemberInvitationService.cancelInvitation(
  "inv_123",
  "user_456",
  "Member no longer needed"
);
```

## 🧪 Testing

### Test Complete Flow

**1. Send Invitation:**

```
1. Login as org admin (rajesh@atraiva.ai)
2. Go to /admin/organization/org_xxx
3. Click "Users" tab
4. Click "Add Member"
5. Fill form:
   - Email: test@example.com
   - First Name: Test
   - Last Name: User
   - Role: Org Viewer
6. Click "Send Invitation"
7. Check Firestore memberInvitations collection
8. Verify email sent (check registrationEmails collection)
```

**2. Accept Invitation:**

```
1. Copy invitation link from email or Firestore
2. Open in incognito/new browser
3. Should see invitation page with member info
4. Create password (min 8 chars)
5. Confirm password
6. Click "Create Account & Join"
7. Should redirect to sign-in
8. Login with email + password
9. Should see dashboard with organization data
10. Check Firestore:
    - User created in /users
    - Member added to /organizations/{id}/members
    - Invitation status = "accepted"
    - Activity log created
    - Welcome notification created
```

**3. Verify Expiration:**

```
1. Create invitation
2. In Firestore, manually change expiresAt to past date
3. Try to access invitation link
4. Should see "expired" error
5. Invitation status updated to "expired"
```

**4. Test Duplicate Prevention:**

```
1. Send invitation to test@example.com
2. Try to send another invitation to same email
3. Should get error: "An active invitation already exists"
```

## ⚠️ Important Notes

### Invitation vs Registration Link

| Feature               | Organization Registration | Member Invitation      |
| --------------------- | ------------------------- | ---------------------- |
| **Purpose**           | Create new organization   | Add to existing org    |
| **Email Collection**  | From payment/admin        | From admin invitation  |
| **What's Pre-filled** | Org data + primary user   | Member data only       |
| **What User Enters**  | Org details + password    | Password only          |
| **Result**            | New org + owner           | Member in existing org |
| **Collection**        | `registrationLinks`       | `memberInvitations`    |

### Clerk Integration

**User Creation:**

- Email address (from invitation)
- First name, Last name (from invitation)
- Password (user creates)
- Role (from invitation)
- Organization membership (automatic)

**Organization Membership:**

- Role mapping:
  - `org_admin` → Clerk `org:admin`
  - `org_manager` → Clerk `org:member`
  - `org_viewer` → Clerk `org:member`

### Webhook Integration

The invitation system works with Clerk webhooks:

- `user.created` webhook can detect invitation-based signups
- Webhook verifies user was added to organization
- Additional Firestore syncing if needed

## 📈 Future Enhancements

- [ ] **Resend Invitation** - Allow resending expired invitations
- [ ] **Bulk Invitations** - CSV upload for multiple members
- [ ] **Custom Email Templates** - Branded invitation emails
- [ ] **Invitation Management Page** - View/manage all pending invitations
- [ ] **Automatic Reminders** - Email reminders before expiration
- [ ] **Social Login Options** - Google/Microsoft SSO for invitations
- [ ] **Custom Expiration** - Admin-configurable expiration periods

## 🔍 Monitoring & Management

### View Pending Invitations

```typescript
// Get all invitations for an organization
const invitations = await MemberInvitationService.getOrganizationInvitations(
  "org_123"
);

// Filter by status
const pending = invitations.filter(
  (i) => i.status === "sent" || i.status === "pending"
);
const accepted = invitations.filter((i) => i.status === "accepted");
const expired = invitations.filter((i) => i.status === "expired");
```

### Check Firestore Console

```
1. Go to Firebase Console > Firestore
2. Open memberInvitations collection
3. Filter by:
   - organizationId = "org_xxx"
   - status = "sent"
4. See all pending invitations
```

## 🆘 Troubleshooting

### Invitation Email Not Received

**Check:**

1. Email in `registrationEmails` collection?
2. Check email spam/junk folder
3. Verify SMTP/email service configured
4. Check `delivery.state` in email document

### Invitation Link Not Working

**Check:**

1. Token correct (64 characters)?
2. Invitation status in Firestore
3. Check expiration date
4. Browser console for errors
5. API response from /api/invitations/validate

### Account Creation Fails

**Check:**

1. Password meets requirements (8+ chars)?
2. Email already exists in Clerk?
3. Organization still exists?
4. Check server console for errors
5. Verify Clerk API keys

### Member Not Showing in Organization

**Check:**

1. Clerk organization membership created?
2. Firestore organization.members updated?
3. User document created in Firestore?
4. Session metadata updated?

## 📚 Related Documentation

- [Organization Registration System](./REGISTRATION_SYSTEM_COMPLETE.md)
- [Notifications System](./NOTIFICATIONS_AND_AUDIT_SYSTEM.md)
- [Activity Logs](./ACTIVITY_LOG_IMPLEMENTATION.md)
- [Clerk Integration](./documentation/CLERK_FIRESTORE_INTEGRATION.md)

## ✅ Implementation Checklist

- [x] Created MemberInvitation interface
- [x] Created MemberInvitationService
- [x] Created send invitation API endpoint
- [x] Created validate invitation API endpoint
- [x] Created complete invitation API endpoint
- [x] Created member signup page (/invite/[token])
- [x] Created InviteMemberDialog component
- [x] Integrated dialog into organization details page
- [x] Created Firestore indexes
- [x] Added Firestore security rules
- [x] Deployed to tipcyber-dev
- [x] Email templates (HTML + Text)
- [x] Activity logging integration
- [x] Notification integration
- [x] Comprehensive documentation

## 🎯 Quick Start

### To Invite a Member:

1. Navigate to organization details page
2. Click "Users" tab
3. Click "Add Member" button
4. Fill in member details:
   - Email address
   - First and last name
   - Role (Admin, Manager, or Viewer)
   - Optional: Job title, phone number
5. Click "Send Invitation"
6. Member receives email with link
7. They create password and join!

### To Accept an Invitation:

1. Check email for invitation
2. Click "Accept Invitation" button
3. Create a password (8+ characters)
4. Confirm password
5. Click "Create Account & Join"
6. Redirected to sign-in
7. Login and start using the platform!

---

**Status**: ✅ Complete and Deployed  
**Last Updated**: January 11, 2025  
**Version**: 1.0.0

**Organization admins can now easily invite members with secure email links!** 🎊

