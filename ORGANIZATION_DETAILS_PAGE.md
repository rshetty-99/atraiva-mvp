# Organization Details Page - Platform Admin

## Overview

Platform admins can now click on any organization in the Teams table to view detailed information including members, subscription details, and activity logs.

## Files Created

### 1. **Organization Details Page**

- **Path**: `src/app/(dashboard)/admin/organization/[id]/page.tsx`
- **Route**: `/admin/organization/{organizationId}`
- **Purpose**: Display comprehensive organization information with tabbed interface

### 2. **API Route**

- **Path**: `src/app/api/admin/organizations/[id]/route.ts`
- **Purpose**: Fetch organization details with member data from Clerk and Firestore

## Features

### Navigation

- **From Teams Table**: Click any organization row to navigate to details page
- **Back Button**: Return to Teams list from details page

### Organization Header

Displays:

- Organization logo/icon
- Organization name
- Account owner (first admin member)
- Total members count
- Subscription plan badge
- Subscription status badge

### Tabs

#### 1. **Overview Tab**

- **Organization Information**:
  - Industry
  - Company size
  - Location (state, country)
  - Created date
- **Subscription Details**:
  - Current plan (Free, Basic, Pro, Enterprise)
  - Subscription status (Active, Trialing, Past Due, Canceled)
  - Sign-up date

#### 2. **Users Tab**

- **Members Table** with columns:
  - User (avatar, name, email)
  - Role (Admin, Member)
  - Joined date
  - Last sign-in date
  - Actions menu (View, Edit Role, Remove)
- **Features**:
  - Add Member button
  - Role-based color coding
  - Avatar display with initials fallback
  - Action dropdown menu per member

#### 3. **Incidents Tab**

- Placeholder for future incident tracking
- Shows "No incidents reported" message

#### 4. **Activity Log Tab**

- Placeholder for future activity logging
- Shows "No activity logs available" message

## Data Sources

### Clerk API

- Organization basic info (name, slug, logo)
- Organization members list
- Member details (name, email, avatar, role)
- Member activity (created date, last sign-in)
- Members count

### Firestore

- Organization extended data:
  - Industry
  - Company size
  - Location (country, state)
  - Subscription plan
  - Subscription status
  - Created/updated timestamps

## UI Components

### Shadcn/ui Components Used

- **Tabs**: `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`
- **Table**: `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>`
- **Badge**: Status and role indicators
- **Button**: Actions and navigation
- **DropdownMenu**: Member action menu
- **Card**: Via `bg-card` classes

### Design Features

- ✅ 140px top offset (consistent with other pages)
- ✅ Framer Motion animations
- ✅ Dark mode support
- ✅ Responsive layout (mobile-friendly)
- ✅ Color-coded badges for plans and statuses
- ✅ Empty states for tabs with no data
- ✅ Loading state with spinner
- ✅ Error handling with toast notifications

## Badge Color Schemes

### Subscription Plans

- **Free**: Gray (`bg-gray-500/10 text-gray-500`)
- **Basic**: Green (`bg-green-500/10 text-green-500`)
- **Pro**: Blue (`bg-blue-500/10 text-blue-500`)
- **Enterprise**: Purple (`bg-purple-500/10 text-purple-500`)

### Subscription Status

- **Active**: Green (`bg-green-500/10 text-green-500`)
- **Trialing**: Blue (`bg-blue-500/10 text-blue-500`)
- **Past Due**: Yellow (`bg-yellow-500/10 text-yellow-500`)
- **Canceled**: Red (`bg-red-500/10 text-red-500`)

### User Roles

- **Admin**: Red (`bg-red-500/10 text-red-500`)
- **Member**: Blue (`bg-blue-500/10 text-blue-500`)

## API Endpoints

### GET `/api/admin/organizations/[id]`

**Authorization**: Requires `platform_admin` or `super_admin` role

**Path Parameters**:

- `id`: Organization ID (Clerk organization ID)

**Response**:

```json
{
  "organization": {
    "id": "org_abc123",
    "name": "Acme Corporation",
    "slug": "acme-corp",
    "imageUrl": "https://...",
    "membersCount": 5,
    "subscriptionPlan": "pro",
    "subscriptionStatus": "active",
    "industry": "Technology",
    "size": "medium",
    "country": "USA",
    "state": "California",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "accountOwner": {
      "name": "John Doe",
      "email": "john@acme.com"
    }
  },
  "members": [
    {
      "id": "user_xyz789",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@acme.com",
      "imageUrl": "https://...",
      "role": "org:admin",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastSignInAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Responses**:

- `401`: Unauthorized (not logged in)
- `403`: Forbidden (insufficient permissions)
- `500`: Internal server error

## User Interactions

### Viewing Organization Details

1. Navigate to Organization page (`/admin/organization`)
2. Click on any organization row in the table
3. View organization details page with tabs

### Navigating Tabs

1. Click on tab triggers to switch between:
   - Overview
   - Users
   - Incidents
   - Activity Log
2. Tab content updates without page reload

### Member Actions (Future Enhancement)

- View member details
- Edit member role
- Remove member from organization
- Add new members

### Going Back

1. Click "Back to Organizations" button at top
2. Returns to Organization list page
3. Maintains scroll position and filters (future enhancement)

## Layout Specifications

### Page Structure

```
┌─────────────────────────────────────┐
│  Back Button                        │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Organization Header          │ │
│  │  [Logo] Name                  │ │
│  │  Account Owner | Stats        │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Tabs: Overview | Users | ... │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Tab Content                  │ │
│  │                               │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Spacing

- **Top Offset**: 140px (header height)
- **Padding**: 32px (p-8)
- **Gap between sections**: 24px (gap-6)
- **Card padding**: 24px (p-6)

## Security & Access Control

### Role-Based Access

- Only `platform_admin` and `super_admin` can view
- Access check performed at API level
- Client-side route protection via middleware

### Data Privacy

- Organization data requires admin permissions
- Member data includes only public information
- Sensitive data excluded from response

## Future Enhancements

### Planned Features

1. **Incidents Tab**:

   - List of incidents for this organization
   - Filter by status, severity
   - Quick actions to resolve

2. **Activity Log Tab**:

   - Audit trail of organization activities
   - User actions, changes, events
   - Timeline view with timestamps

3. **Member Management**:

   - Functional "Add Member" button
   - Invite new members via email
   - Change member roles
   - Remove members with confirmation

4. **Organization Editing**:

   - Edit organization details
   - Update subscription plan
   - Change status
   - Add notes/tags

5. **Analytics**:

   - Usage metrics
   - Activity trends
   - Health score calculation
   - Compliance status

6. **Lifecycle Timeline**:
   - Visual timeline of organization journey
   - Key milestones and events
   - Status changes history

## Testing Checklist

- [x] Page loads correctly with organization ID
- [x] Organization header displays all info
- [x] Tabs switch correctly
- [x] Members table displays all members
- [x] Badges show correct colors
- [x] Back button navigates to Teams page
- [x] Loading state shows while fetching
- [x] Error state shows if org not found
- [x] 140px top offset applied
- [x] Responsive on mobile
- [x] Dark mode works correctly
- [x] API returns correct data
- [x] Access control enforced

## Related Files

- ✅ `src/app/(dashboard)/admin/organization/page.tsx` - Organization list (updated to make rows clickable)
- ✅ `src/app/(dashboard)/admin/organization/[id]/page.tsx` - Organization details page
- ✅ `src/app/api/admin/organizations/[id]/route.ts` - Details API endpoint
- 📖 `src/app/api/admin/organizations/route.ts` - List API endpoint
- 📖 `src/lib/rbac/menu-config.ts` - Menu configuration

## Usage Example

### Navigating to Organization Details

```tsx
// From Organization table
<TableRow
  onClick={() => router.push(`/admin/organization/${org.id}`)}
  className="cursor-pointer"
>
  {/* Organization data */}
</TableRow>
```

### Fetching Organization Data

```typescript
// In organization details page
const response = await fetch(`/api/admin/organizations/${organizationId}`);
const { organization, members } = await response.json();
```

### Displaying Members

```tsx
// Members table
{
  members.map((member) => (
    <TableRow key={member.id}>
      <TableCell>
        {member.firstName} {member.lastName}
      </TableCell>
      <TableCell>
        <Badge className={getRoleBadgeColor(member.role)}>{member.role}</Badge>
      </TableCell>
    </TableRow>
  ));
}
```

## Summary

✅ **Created**: Organization details page with tabbed interface
✅ **Implemented**: Overview and Users tabs with real data
✅ **Designed**: Placeholders for Incidents and Activity Log tabs
✅ **Added**: Clickable rows in Teams table
✅ **Secured**: Role-based access control
✅ **Styled**: Consistent with design system and 140px offset

The organization details page provides a comprehensive view of each organization with member management capabilities, following the mockup design and using Shadcn components throughout.
