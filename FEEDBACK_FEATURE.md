# Feedback Feature Documentation

## Overview

The Feedback feature allows all users to submit feedback, bug reports, feature requests, and general suggestions. Platform administrators (super_admin and platform_admin) have access to a comprehensive management dashboard to review, filter, and export all feedback.

## Features

### For All Users

- **Feedback Submission Form** (`/feedback`)
  - Submit bug reports
  - Request new features
  - Suggest improvements
  - Provide general feedback
  - Automatic user context capture (name, email, organization)
  - Page context capture (current page, browser info, screen resolution)
  - Toast notifications on success
  - Form reset after submission
  - Loading spinner during submission

### For Platform Administrators

- **Feedback Management Dashboard** (`/admin/feedback`)
  - View all feedback in a tabular format
  - **Submit Feedback Button**: Quick access to submit feedback on behalf of customers or based on customer conversations
  - Real-time statistics:
    - Total feedback count
    - New feedback count
    - In-progress count
    - Resolved count
  - Advanced filtering:
    - Search by title, description, user, email, or category
    - Filter by feedback type (Bug, Feature, Improvement, General)
    - Filter by status (New, In Progress, Resolved, Closed)
  - Export to CSV (includes Source column to distinguish User vs Support-initiated)
  - Visual indicators with badges for type, status, and source (User vs Support-initiated)
  - Automatic tagging of support-initiated feedback
  - Automatic redirect back to dashboard after platform admins submit feedback

## File Structure

```
src/
├── types/
│   └── feedback.ts                           # TypeScript types and interfaces
├── app/
│   ├── (dashboard)/
│   │   ├── feedback/
│   │   │   ├── page.tsx                      # User feedback submission form
│   │   │   └── loading.tsx                   # Loading state
│   │   └── admin/
│   │       └── feedback/
│   │           ├── page.tsx                  # Admin feedback management
│   │           └── loading.tsx               # Loading state
│   └── api/
│       └── feedback/
│           └── submit/
│               └── route.ts                  # API endpoint for submitting feedback
└── components/
    └── app-sidebar.tsx                       # Updated for role-based routing
```

## Data Model

### Feedback Interface

```typescript
interface Feedback {
  // Core identification
  id?: string;

  // User information
  userId: string;
  userEmail: string;
  userName: string;
  organizationId?: string;
  organizationName?: string;
  userRole?: string;

  // Feedback details
  type: "bug" | "feature" | "improvement" | "general";
  title: string;
  description: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "critical";

  // Additional context
  page?: string;
  userAgent?: string;
  screenResolution?: string;
  attachments?: string[];

  // Status tracking
  status: "new" | "in_progress" | "resolved" | "closed";
  assignedTo?: string;
  notes?: string;
  supportInitiated?: boolean; // True if submitted by platform admin/support

  // Metadata
  createdAt: string;
  updatedAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}
```

## Firestore Collection

**Collection Name**: `feedback`

**Document Structure**:
```json
{
  "userId": "user_xxx",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "organizationId": "org_xxx",
  "organizationName": "Acme Corp",
  "userRole": "org_admin",
  "type": "bug",
  "title": "Login button not working",
  "description": "When I click the login button, nothing happens...",
  "category": "Authentication",
  "priority": "medium",
  "page": "/sign-in",
  "userAgent": "Mozilla/5.0...",
  "screenResolution": "1920x1080",
  "status": "new",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

## Role-Based Access

### Navigation Routing

The sidebar "Feedback" menu item automatically routes based on user role:

- **Platform Administrators** (`super_admin`, `platform_admin`): → `/admin/feedback` (Management Dashboard)
- **All Other Users**: → `/feedback` (Submission Form)

This is handled in `src/components/app-sidebar.tsx`:

```typescript
const feedbackUrl =
  userRole === "super_admin" || userRole === "platform_admin"
    ? "/admin/feedback"
    : "/feedback";
```

## API Endpoints

### POST `/api/feedback/submit`

Submit new feedback.

**Authentication**: Required (Clerk)

**Request Body**:
```json
{
  "type": "bug",
  "title": "Issue title",
  "description": "Detailed description",
  "category": "Category name",
  "page": "/current/page",
  "userAgent": "Mozilla/5.0...",
  "screenResolution": "1920x1080"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "id": "doc_id",
  "message": "Feedback submitted successfully",
  "feedback": { /* full feedback object */ }
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

## UI Components

### User Feedback Form

**Location**: `/feedback`

**Features**:
- Auto-populated user information (read-only)
- Feedback type selector (Bug, Feature, Improvement, General)
- Category input (optional)
- Title input (required)
- Description textarea (required)
- Clear button to reset form
- Submit button with loading state
- Info cards explaining feedback types
- Toast notifications for success/error

### Admin Feedback Dashboard

**Location**: `/admin/feedback`

**Features**:
- Statistics cards showing counts by status
- Search input for keyword filtering
- Type filter dropdown
- Status filter dropdown
- Clear filters button
- Export to CSV button
- Sortable table with columns:
  - Type (with colored badges)
  - Status (with colored badges)
  - Title
  - User (name + email)
  - Category
  - Created date
  - Actions (view button)
- Responsive design
- Empty state message

## Future Enhancements

### Phase 2 (Recommended)

1. **Detail View Modal**
   - View full feedback details
   - Update status
   - Assign to team members
   - Add internal notes
   - View full description and context

2. **Status Management**
   - Bulk status updates
   - Status change history
   - Email notifications on status change

3. **Priority Management**
   - Auto-assign priority based on type
   - Manual priority override
   - Priority-based sorting

4. **Attachments**
   - File upload support
   - Screenshot attachment
   - Video recording

5. **Analytics**
   - Feedback trends over time
   - Most common categories
   - Resolution time metrics
   - User engagement metrics

6. **Integration**
   - Email notifications to admins on new feedback
   - Integration with project management tools (Jira, Linear)
   - Slack/Teams notifications

## Usage Examples

### Submitting Feedback (User)

1. Click "Feedback" in sidebar
2. Select feedback type
3. Enter title and description
4. (Optional) Add category
5. Click "Submit Feedback"
6. See success toast
7. Form resets automatically

### Reviewing Feedback (Admin)

1. Click "Feedback" in sidebar (goes to `/admin/feedback`)
2. View statistics dashboard
3. Use filters to narrow down feedback
4. Search for specific feedback
5. Click eye icon to view details (coming soon)
6. Export to CSV for reporting

### Submitting Feedback as Support (Admin)

1. From `/admin/feedback` dashboard, click "Submit Feedback" button
2. Redirects to `/feedback` form
3. Form shows banner: "Submitting as Customer Support"
4. Fill out feedback based on customer conversation
5. Submit - feedback is automatically tagged as `supportInitiated: true`
6. Success toast is displayed
7. Automatically redirects back to `/admin/feedback` dashboard after 1.5 seconds

## Best Practices

1. **For Users**:
   - Be specific in bug reports
   - Include steps to reproduce
   - Provide context about what you expected vs. what happened
   - Use categories to help organize feedback

2. **For Administrators**:
   - Review new feedback regularly
   - Update status as feedback is addressed
   - Use categories for better organization
   - Export data periodically for reporting
   - Use "Submit Feedback" button to capture insights from customer conversations
   - Support-initiated feedback is automatically tagged for better tracking

## Testing

### User Flow
1. Navigate to `/feedback`
2. Fill out form with all required fields
3. Submit and verify toast message
4. Check Firestore console for new document

### Admin Flow
1. Navigate to `/admin/feedback`
2. Verify all feedback is displayed
3. Test search functionality
4. Test type and status filters
5. Verify export to CSV works
6. Check stats cards update correctly

## Troubleshooting

### Common Issues

1. **Feedback not saving**
   - Check Firebase configuration
   - Verify Firestore rules allow write access
   - Check browser console for errors

2. **Page not loading**
   - Verify user authentication
   - Check role permissions
   - Ensure Firebase is initialized

3. **Filters not working**
   - Check console for JavaScript errors
   - Verify filter state is updating
   - Ensure data format matches filter logic

4. **Date formatting errors (Invalid time value)**
   - Firestore may return Timestamp objects instead of ISO strings
   - The `formatDate` helper safely handles multiple date formats
   - Check console for specific date formatting errors

## Security Considerations

- All feedback submissions require authentication
- User context is automatically captured from Clerk session
- Admin pages should be protected by middleware (recommended)
- Firestore security rules should restrict access appropriately

## Maintenance

### Adding New Feedback Types

1. Update `FeedbackType` in `src/types/feedback.ts`
2. Add new option in feedback form select
3. Update admin dashboard badge colors
4. Update filter dropdown

### Adding New Status Options

1. Update `FeedbackStatus` in `src/types/feedback.ts`
2. Add new option in admin filter
3. Update status badge colors
4. Implement status change logic

---

**Created**: 2025-11-23  
**Last Updated**: 2025-11-23  
**Version**: 1.0

