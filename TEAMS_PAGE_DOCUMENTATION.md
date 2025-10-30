# Organization Management Page - Platform Admin

## Overview

This feature provides Platform Admins with a comprehensive view and management interface for all client organizations in the system. The page displays organization data from both Firestore and Clerk in a responsive, filterable table format.

## Files Created

### 1. **Page Component**

- **Path**: `src/app/(dashboard)/admin/organization/page.tsx`
- **Purpose**: Main UI component for the Teams/Organizations management page
- **Features**:
  - Responsive table display of organizations
  - Real-time search functionality
  - Filter by subscription plan (free, basic, pro, enterprise)
  - Filter by subscription status (active, trialing, past_due, canceled)
  - Stats cards showing key metrics
  - Export to CSV functionality
  - Action buttons for view, edit, and delete operations

### 2. **API Route**

- **Path**: `src/app/api/admin/organizations/route.ts`
- **Purpose**: Backend API for fetching and managing organization data
- **Endpoints**:
  - `GET`: Fetches all organizations with enriched data from Firestore and Clerk
  - `POST`: Creates new organizations in both Clerk and Firestore
- **Security**: Role-based access control (platform_admin and super_admin only)

## Data Schema

### Organization Data (from Firestore)

The page displays data from two Firestore collections:

#### Organizations Collection (`organizations`)

The following fields are displayed:

```typescript
{
  id: string;                    // Organization ID
  name: string;                  // Organization name
  industry: string;              // Industry/sector
  size: string;                  // Organization size (startup, small, medium, large, enterprise)
  country: string;               // Country location
  state?: string;                // State/province (optional)
  applicableRegulations: string[]; // Compliance regulations
  subscriptionPlan: string;      // Plan type (free, basic, pro, enterprise)
  subscriptionStatus: string;    // Status (active, trialing, past_due, canceled)
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

#### Registration Links Collection (`registrationLinks`)

Used for calculating onboarding statistics:

- Queries where `status IN ["pending", "sent"]` AND `paymentStatus === "completed"`
- Count represents organizations in the onboarding process (payment completed but registration not finished)
- **Note**: Links are marked as `"used"` after registration completion and **cannot be reused**

**Status Flow:**

- `pending` → Link created, email not sent
- `sent` → Email sent to user
- `used` → **Registration completed (excluded from onboarding count)**
- `expired` → Link expired (excluded)
- `cancelled` → Link cancelled by admin (excluded)

### Enriched Data (from Clerk)

Additional data merged from Clerk:

- `clerkName`: Official name in Clerk
- `clerkSlug`: Organization slug/identifier
- `membersCount`: Number of organization members
- `imageUrl`: Organization logo/image

## Features

### 1. **Statistics Dashboard**

Four summary cards at the top showing:

- **Total Organizations**: Total count of all organizations in the system
- **Active**: Organizations with `subscriptionStatus === "active"`
- **Onboarding**: Count of registration links with `status === "pending"` and `paymentStatus === "completed"` from `registrationLinks` collection
- **Subscription Expired**: Organizations with `subscriptionStatus === "canceled"` or `subscriptionStatus === "past_due"`

### 2. **Search & Filters**

- **Search**: Real-time search across organization name, industry, and country
- **Plan Filter**: Filter by subscription plan type
- **Status Filter**: Filter by subscription status

### 3. **Table Columns**

1. **Organization**: Name and slug with icon
2. **Industry**: Business sector
3. **Size**: Company size category
4. **Location**: Country and state
5. **Plan**: Subscription plan with color-coded badge
6. **Status**: Subscription status with color-coded badge
7. **Members**: Number of organization members
8. **Created**: Organization creation date
9. **Actions**: View, Edit, and Delete buttons

### 4. **Export Functionality**

Export filtered results to CSV format with all relevant fields.

### 5. **Responsive Design**

- Mobile-friendly layout
- Horizontal scroll for table on smaller screens
- Responsive filter controls

## Styling

### Badge Colors

**Subscription Plans:**

- Free: Gray
- Basic: Green
- Pro: Blue
- Enterprise: Purple

**Subscription Status:**

- Active: Green
- Trialing: Blue
- Past Due: Yellow
- Canceled: Red

### Layout

- **Top Offset**: 140px margin-top for consistency with other dashboard pages
- **Animations**: Framer Motion animations for smooth page transitions
- **Dark Mode**: Full support for dark mode with appropriate color schemes

## Access Control

**Authorized Roles:**

- `platform_admin`
- `super_admin`

**Unauthorized Access:**

- Returns 401 (Unauthorized) if user is not logged in
- Returns 403 (Forbidden) if user role is not authorized

## Integration Points

### Firestore

- Collection: `organizations`
- Service: `organizationService` from `@/lib/firestore/collections`

### Clerk

- Organizations API for member counts and metadata
- Role-based access control via `publicMetadata.role`

## Future Enhancements

Potential improvements for future iterations:

1. Pagination for large datasets
2. Bulk actions (bulk delete, bulk status change)
3. Advanced filtering (by regulation, by member count range)
4. Sorting by column headers
5. Detailed organization view modal
6. Edit organization modal/page
7. Add organization modal with form
8. Organization activity logs
9. Revenue analytics per organization
10. Organization health scores

## Usage

### For Platform Admins:

1. Navigate to the sidebar menu
2. Click on "Organization" under the Management section
3. View all organizations in the table
4. Use search and filters to find specific organizations
5. Click action buttons to view, edit, or delete organizations
6. Export data using the Export button

### API Usage:

```typescript
// Fetch all organizations with stats
const response = await fetch("/api/admin/organizations");
const { organizations, stats, total } = await response.json();

// Stats object structure:
// {
//   total: number,        // Total organizations
//   active: number,       // Active subscriptions
//   onboarding: number,   // Pending registrations with completed payment
//   expired: number       // Canceled or past due subscriptions
// }

// Create new organization
const response = await fetch("/api/admin/organizations", {
  method: "POST",
  body: JSON.stringify({
    name: "Acme Corp",
    slug: "acme-corp",
    industry: "Technology",
    size: "medium",
    country: "USA",
    subscriptionPlan: "pro",
    subscriptionStatus: "active",
  }),
});
```

## Dependencies

- `@clerk/nextjs`: Authentication and organization management
- `firebase/firestore`: Database operations
- `framer-motion`: Animations
- `date-fns`: Date formatting
- `sonner`: Toast notifications
- `lucide-react`: Icons
- Shadcn/ui components: Table, Badge, Button, Input, Select

## Notes

- The route is `/admin/organization` as defined in the menu configuration
- Data is fetched client-side on component mount
- All organization data is synced between Clerk and Firestore
- The page maintains consistent styling with other dashboard pages
- Error handling includes user-friendly toast notifications
