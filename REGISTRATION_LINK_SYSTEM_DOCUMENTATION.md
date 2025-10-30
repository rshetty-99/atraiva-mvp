# Registration Link System - Implementation Documentation

## Overview

Complete implementation of the organization registration link system for Atraiva Compliance Platform.

## System Flow

### 1. Payment & Link Creation Flow (Admin Side)

```
Admin collects payment (offline)
  ↓
Admin collects org + primary user information
  ↓
Admin creates registration link via admin dashboard
  ↓
System generates secure token & stores in Firestore
  ↓
System sends email to primary user with link
  ↓
Link expires after 3 days OR first use
```

### 2. User Registration Flow

```
User receives email with registration link
  ↓
User clicks link: https://yoursite.com/register?token=abc123xyz
  ↓
System validates token (not expired, not used, not cancelled)
  ↓
User sees pre-filled org/user data
  ↓
User verifies email & sets password
  ↓
User reviews/confirms pre-filled data
  ↓
User optionally adds more team members
  ↓
System creates Clerk user & org
  ↓
System syncs to Firestore
  ↓
User auto-logged in & redirected to dashboard
```

## Components Implemented

### 1. Data Models (`src/lib/firestore/types.ts`)

- **RegistrationLink** interface

  - Organization data (name, type, industry, team size, etc.)
  - Primary user data (name, email, role, etc.)
  - Payment tracking (status, reference)
  - Status tracking (pending, sent, used, expired, cancelled)
  - Email tracking
  - Audit trail

- **RegistrationEmail** interface
  - Email template data
  - Delivery tracking
  - Firebase Extension compatibility

### 2. Firestore Collections (`src/lib/firestore/collections.ts`)

- **registrationLinks** collection
- **registrationEmails** collection
- Specialized query functions:
  - `getByToken()` - Find link by token
  - `getByEmail()` - Find links by user email
  - `getByStatus()` - Filter by status
  - `getActiveLinks()` - Get all active links
  - `getExpiredLinks()` - Get expired links
  - `hasActiveLink()` - Check if email has active link

### 3. Service Layer (`src/lib/registration-link-service.ts`)

- `generateSecureToken()` - Cryptographically secure token generation
- `calculateExpirationDate()` - 3-day expiration
- `createRegistrationLink()` - Create new link with validation
- `sendRegistrationEmail()` - Send/trigger email via Firebase
- `resendRegistrationEmail()` - Resend with validation
- `validateRegistrationToken()` - Token validation logic
- `markRegistrationLinkUsed()` - Mark as used after registration
- `cancelRegistrationLink()` - Cancel active links
- Email templates (HTML & plain text)

### 4. API Routes

#### `/api/registration-links/create` (POST)

- **Permission**: super_admin, platform_admin only
- **Body**: organizationData, primaryUserData, paymentReference, notes, sendEmail
- **Returns**: linkId, token, emailSent status
- **Features**:
  - Validates all required fields
  - Checks for existing active links
  - Generates secure token
  - Creates audit log

#### `/api/registration-links` (GET)

- **Permission**: super_admin, platform_admin only
- **Query params**: status, email, createdBy
- **Returns**: Array of registration links
- **Features**: Filtering and search

#### `/api/registration-links/[id]` (GET, DELETE)

- **Permission**: super_admin, platform_admin only
- **GET**: Fetch single link
- **DELETE**: Soft delete (mark as cancelled)

#### `/api/registration-links/[id]/resend` (POST)

- **Permission**: super_admin, platform_admin only
- **Features**:
  - Validates link not expired/used
  - Resends email
  - Updates resend count

#### `/api/registration-links/[id]/cancel` (POST)

- **Permission**: super_admin, platform_admin only
- **Body**: reason (optional)
- **Features**: Cancel active link

#### `/api/registration-links/validate` (POST)

- **Permission**: PUBLIC
- **Body**: token
- **Returns**: Validation result + sanitized link data

### 5. Admin UI

#### `/admin/registration-management` (List View)

**Features**:

- View all registration links
- Filter by status (all, pending, sent, used, expired)
- Search by organization name or email
- Actions per link:
  - Copy registration link
  - Resend email
  - Cancel link
  - Delete link
- Status badges with icons
- Expiration date highlighting
- Responsive table design

#### `/admin/registration-management/create` (Create Form)

**Fields**:

**Organization Information (Required)**:

- Organization Name \*
- Organization Type \* (law_firm, enterprise, channel_partner, government, nonprofit)
- Industry \*
- Team Size \* (1-10, 11-50, 51-200, 201-1000, 1000+)
- Subscription Plan (free, basic, pro, enterprise) - optional
- Website - optional
- Phone - optional

**Address (Optional)**:

- Street
- City
- State/Province
- ZIP/Postal Code
- Country

**Primary User Information (Required)**:

- First Name \*
- Last Name \*
- Email \* (registration link sent here)
- Phone Number - optional
- Job Title - optional
- Initial Role \* (org_admin, org_manager, org_analyst, org_viewer)

**Additional Information**:

- Payment Reference - optional
- Admin Notes - optional
- Send Registration Email - checkbox (default: true)

**Features**:

- Form validation with Zod
- Real-time error messages
- Success/error toasts
- Automatic redirect after creation

### 6. RBAC Integration (`src/lib/rbac/menu-config.ts`)

- Added "Registration Management" menu item
- Visible to: super_admin, platform_admin
- Icon: Link2
- Route: /admin/registration-management
- Order: 4 (after Users, before Compliance)

## Security Features

### 1. Token Generation

- Cryptographically secure random tokens (32 bytes)
- Base64URL encoding for URL safety
- Unique per link

### 2. Permissions

- Admin routes require super_admin or platform_admin role
- Clerk authentication check
- API route protection

### 3. Validation

- Token validation before allowing registration
- Expiration check (3 days)
- One-time use enforcement
- Status checks (not cancelled, not already used)
- Email format validation
- Prevent duplicate active links for same email

### 4. Audit Trail

- Track who created each link
- Track creation/usage timestamps
- Track cancellation with reason
- Track email resend attempts

## Email System Integration

### Firebase Extension Setup

The system uses Firestore-triggered emails. Set up Firebase Extension:

1. **Extension**: "Trigger Email from Firestore"
2. **Collection**: `registrationEmails`
3. **Email Template Fields**:
   - to: recipient email
   - subject: email subject
   - html: HTML email body
   - text: plain text email body

### Email Content

- Professional branded design
- Registration link button
- Expiration date/time
- Instructions for completing registration
- Support contact information
- Responsive HTML design

## Database Schema

### registrationLinks Collection

```typescript
{
  id: string
  token: string
  organizationData: {...}
  primaryUserData: {...}
  paymentStatus: "completed"
  paymentReference?: string
  status: "pending" | "sent" | "used" | "expired" | "cancelled"
  createdBy: string
  createdByEmail: string
  createdAt: Date
  expiresAt: Date
  usedAt?: Date
  clerkUserId?: string
  clerkOrgId?: string
  firestoreUserId?: string
  firestoreOrgId?: string
  emailSent: boolean
  emailSentAt?: Date
  emailResendCount: number
  lastEmailSentAt?: Date
  cancelledAt?: Date
  cancelledBy?: string
  cancellationReason?: string
  notes?: string
}
```

### registrationEmails Collection

```typescript
{
  to: string[]
  subject: string
  html: string
  text: string
  template: {...}
  createdAt: Date
  delivery: {
    state: "PENDING" | "PROCESSING" | "SUCCESS" | "ERROR"
    attempts: number
    error?: string
  }
}
```

## Remaining Tasks

### 1. User Registration Page (`/register`)

- Token validation UI
- Email verification step
- Password setup
- Review pre-filled data
- Add team members (optional)
- Complete registration button

### 2. Registration Completion API

- Validate token one final time
- Create Clerk user
- Create Clerk organization
- Add user to organization
- Sync to Firestore
- Mark link as used
- Auto-login user
- Send welcome email

### 3. Scheduled Function

- Auto-expire links after 3 days
- Run daily
- Mark status as "expired"
- Cleanup/archival (optional)

### 4. Firestore Security Rules

```javascript
match /registrationLinks/{linkId} {
  // Platform admins can read/write
  allow read, write: if isAdmin();

  // Allow public read for validation (with token)
  allow read: if true;
}

match /registrationEmails/{emailId} {
  // Only admins and system can write
  allow write: if isAdmin();

  // Firebase Extension needs write access
  allow create: if true;
}
```

## Testing Checklist

### Admin Flow

- [ ] Create registration link with all fields
- [ ] Create registration link with minimal fields
- [ ] View list of all links
- [ ] Filter links by status
- [ ] Search links by org name/email
- [ ] Copy registration link
- [ ] Resend email
- [ ] Cancel active link
- [ ] Delete link
- [ ] Verify email sent correctly
- [ ] Check duplicate email prevention

### User Flow

- [ ] Click registration link from email
- [ ] Validate token
- [ ] See pre-filled data
- [ ] Set password
- [ ] Complete registration
- [ ] Auto-login after registration
- [ ] Redirect to dashboard
- [ ] Add team members
- [ ] Verify Clerk user created
- [ ] Verify Clerk org created
- [ ] Verify Firestore sync

### Security

- [ ] Expired link shows error
- [ ] Used link shows error
- [ ] Cancelled link shows error
- [ ] Invalid token shows error
- [ ] Non-admin cannot access admin routes
- [ ] Duplicate active link prevented

### Edge Cases

- [ ] Link expires after 3 days
- [ ] Link expires on first use
- [ ] Email delivery failure handling
- [ ] Network error handling
- [ ] Concurrent registration attempts

## Environment Variables Required

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@atraiva.com
```

## Next Steps

1. **Create User Registration Page** (`/register`)

   - Token validation
   - Multi-step form
   - Email verification
   - Password setup
   - Team member invitation

2. **Implement Registration Completion API** (`/api/registration/complete`)

   - Clerk user creation
   - Clerk org creation
   - Firestore sync
   - Mark link as used
   - Auto-login

3. **Create Scheduled Function** (Firebase Functions or Vercel Cron)

   - Auto-expire links
   - Send expiration warnings

4. **Update Firestore Rules**

   - Add security rules for new collections

5. **Testing & QA**
   - End-to-end testing
   - Security testing
   - Email delivery testing

## Support & Maintenance

### Monitoring

- Track link creation rate
- Track email delivery success rate
- Track registration completion rate
- Track link expiration rate

### Common Issues

- **Email not received**: Check Firebase Extension logs, verify email service
- **Link expired**: Admin can resend or create new link
- **Duplicate active link**: System prevents, admin must cancel first

### Future Enhancements

- Custom expiration periods
- Bulk link creation
- Link templates
- Custom email templates
- SMS notifications
- Link analytics dashboard
- Registration progress tracking
