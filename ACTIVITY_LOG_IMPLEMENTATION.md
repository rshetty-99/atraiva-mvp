# Activity Log Implementation - Complete Documentation

## 📋 Overview

This document describes the complete implementation of the Activity Log system for both Organizations and Members in the Atraiva platform. The system provides comprehensive audit trails for all significant actions performed within the application.

## 🏗️ Architecture

### Storage Strategy

**Decision: Single Unified Collection** ✅

We use **one `auditLogs` collection** in Firestore with the following advantages:

- Centralized audit trail for compliance
- Easier cross-organizational reporting
- Simpler querying across all activities
- Better for regulatory compliance (single immutable log)
- Efficient indexing and searching

### Data Structure

```typescript
interface AuditLog {
  id: string;
  organizationId: string;
  userId: string; // Actor who performed the action
  userName?: string;
  userEmail?: string;

  // Event categorization
  action: string;
  category:
    | "organization"
    | "user"
    | "security"
    | "compliance"
    | "breach"
    | "document"
    | "settings"
    | "integration"
    | "billing"
    | "notification";

  resourceType: string;
  resourceId: string;
  resourceName?: string;

  // Change tracking
  changes?: {
    field: string;
    oldValue?: any;
    newValue?: any;
  }[];

  // Event details
  description: string;
  severity?: "info" | "warning" | "error" | "critical";

  // Context
  ipAddress?: string;
  userAgent?: string;
  location?: string;

  // Status
  timestamp: Date;
  success: boolean;
  errorMessage?: string;

  // Additional metadata
  metadata?: Record<string, any>;
}
```

## 📁 File Structure

### Core Services

1. **`src/lib/firestore/types.ts`**

   - Enhanced `AuditLog` interface with comprehensive fields
   - Supports all activity types and categories

2. **`src/lib/activity-log-service.ts`**
   - Core service for logging and retrieving activity logs
   - Helper methods for common operations:
     - `logOrganizationCreated()`
     - `logOrganizationUpdated()`
     - `logMemberAdded()`
     - `logMemberRemoved()`
     - `logMemberRoleChanged()`
     - `logUserProfileUpdated()`
     - `logSecurityEvent()`
     - `logSubscriptionChanged()`
     - `logSettingsUpdated()`

### API Routes

3. **`src/app/api/admin/organizations/[id]/activity/route.ts`**

   - GET endpoint for organization activity logs
   - Supports filtering by category
   - Configurable limit (default 50)

4. **`src/app/api/admin/members/[id]/activity/route.ts`**
   - GET endpoint for member activity logs
   - Supports filtering by organization
   - Configurable limit (default 50)

### UI Components

5. **`src/components/activity-log/ActivityLogTimeline.tsx`**
   - Reusable timeline component for displaying activity logs
   - Features:
     - Date grouping
     - Category filtering
     - Expandable change details
     - Color-coded severity badges
     - Category-specific icons
     - Loading and error states

### Integration

6. **Organization Details Page** (`src/app/(dashboard)/admin/organization/[id]/page.tsx`)

   - Activity Log tab integrated
   - Lazy loading (fetches when tab is selected)
   - Auto-refresh capability

7. **Member Details Page** (`src/app/(dashboard)/admin/members/[id]/page.tsx`)

   - Activity Log tab integrated
   - Lazy loading (fetches when tab is selected)
   - Auto-refresh capability

8. **Organization Update API** (`src/app/api/admin/organizations/[id]/route.ts`)

   - Tracks all field changes
   - Logs comprehensive update activity

9. **Member Update API** (`src/app/api/admin/members/[id]/route.ts`)
   - Tracks all field changes
   - Logs comprehensive update activity

## 🔍 Firestore Indexes

**File: `firestore.indexes.json`**

Composite indexes for optimal query performance:

1. **organizationId + timestamp** - Organization activity logs
2. **userId + timestamp** - User activity logs
3. **organizationId + category + timestamp** - Filtered organization logs
4. **userId + organizationId + timestamp** - User logs within organization
5. **resourceType + resourceId + timestamp** - Resource-specific logs
6. **category + timestamp** - Category-based queries
7. **severity + timestamp** - Severity-based queries

### Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

## 📊 Activity Categories

### 1. Organization Events

- Organization created
- Organization updated (profile, settings, etc.)
- Subscription changes
- Settings updates

### 2. User/Member Events

- Member added to organization
- Member removed from organization
- Member role changed
- User profile updated
- Account status changed

### 3. Security Events

- Password changes
- MFA enabled/disabled
- Login attempts
- Access denied events
- Security policy updates

### 4. Compliance Events

- Compliance checks executed
- Regulation updates
- Policy changes
- Data retention events

### 5. Breach/Incident Events

- Breach simulations created
- Incidents reported
- Response actions taken

### 6. Document Events

- Documents uploaded
- Documents deleted
- Document access logs

### 7. Settings Events

- Notification preferences updated
- Privacy settings changed
- Integration configurations

### 8. Billing Events

- Subscription plan changes
- Payment status updates
- Invoice generation

### 9. Notification Events

- Email notifications sent
- SMS alerts triggered
- System announcements

### 10. Integration Events

- API connections established
- Webhook events
- Third-party integrations

## 🎨 UI Features

### Activity Timeline

- **Date Grouping**: Activities grouped by date
- **Category Filtering**: Filter by activity category
- **Expandable Details**: View change history
- **Visual Indicators**:
  - Color-coded severity (info, warning, error, critical)
  - Category-specific icons
  - Timeline visualization
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Fully themed

### Severity Colors

- **Info** (Blue): Normal operations
- **Warning** (Yellow): Caution-worthy events
- **Error** (Orange): Errors encountered
- **Critical** (Red): Critical security/system events

## 🔐 Security & Permissions

- Only `platform_admin` and `super_admin` can view activity logs
- All logs are immutable (no delete functionality)
- Comprehensive audit trail for compliance
- IP address and user agent tracking (when available)

## 🚀 Usage Examples

### Logging an Organization Update

```typescript
import { ActivityLogService } from "@/lib/activity-log-service";

await ActivityLogService.logOrganizationUpdated({
  organizationId: "org_123",
  organizationName: "Acme Corp",
  userId: "user_456",
  userName: "John Doe",
  userEmail: "john@acme.com",
  changes: [
    { field: "name", oldValue: "Acme Inc", newValue: "Acme Corp" },
    { field: "industry", oldValue: "Tech", newValue: "Technology" },
  ],
});
```

### Logging a Member Role Change

```typescript
await ActivityLogService.logMemberRoleChanged({
  organizationId: "org_123",
  organizationName: "Acme Corp",
  userId: "user_789",
  userName: "Admin User",
  userEmail: "admin@acme.com",
  memberId: "user_456",
  memberName: "John Doe",
  memberEmail: "john@acme.com",
  oldRole: "org_viewer",
  newRole: "org_admin",
});
```

### Fetching Organization Activity

```typescript
const logs = await ActivityLogService.getOrganizationActivityLogs(
  "org_123",
  50 // limit
);
```

### Fetching User Activity

```typescript
const logs = await ActivityLogService.getUserActivityLogs(
  "user_456",
  "org_123", // optional organization filter
  50 // limit
);
```

## 📈 Future Enhancements

### Planned Features

1. **Export Functionality**: Export activity logs to CSV/PDF
2. **Advanced Filtering**: Multiple filters, date ranges
3. **Real-time Updates**: WebSocket integration for live logs
4. **Retention Policies**: Automatic archival of old logs
5. **Anomaly Detection**: AI-powered suspicious activity alerts
6. **Custom Dashboards**: Activity analytics and visualizations
7. **Scheduled Reports**: Automated activity summaries
8. **Compliance Reports**: Pre-built templates for regulations

### Performance Optimizations

1. **Pagination**: Implement cursor-based pagination
2. **Caching**: Redis cache for frequently accessed logs
3. **Aggregation**: Pre-calculated statistics
4. **Archival**: Move old logs to cold storage

## 🧪 Testing

### Manual Testing Checklist

**Organization Activity Log:**

- [ ] Update organization details and verify log appears
- [ ] Change subscription and verify log appears
- [ ] Update settings and verify log appears
- [ ] Verify changes are tracked correctly
- [ ] Test category filtering
- [ ] Test date grouping
- [ ] Test expandable change details

**Member Activity Log:**

- [ ] Update member profile and verify log appears
- [ ] Change member role and verify log appears
- [ ] Add/remove member and verify log appears
- [ ] Verify changes are tracked correctly
- [ ] Test organization filtering
- [ ] Test category filtering

**UI/UX:**

- [ ] Timeline displays correctly
- [ ] Icons match categories
- [ ] Colors match severity
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Loading states work
- [ ] Error states work

## 📝 Maintenance

### Database Cleanup

Regular cleanup of old activity logs (consider after 1-2 years):

```typescript
// Example cleanup script (implement with caution)
const oneYearAgo = new Date();
oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

const oldLogs = await getDocs(
  query(collection(db, "auditLogs"), where("timestamp", "<", oneYearAgo))
);

// Archive or delete old logs
```

### Monitoring

- Monitor Firestore read/write operations
- Track API endpoint performance
- Monitor storage usage for auditLogs collection
- Set up alerts for critical severity logs

## 🆘 Troubleshooting

### Common Issues

**Issue: Activity logs not appearing**

- Check Firestore indexes are deployed
- Verify user has correct permissions
- Check browser console for errors
- Verify API endpoints are accessible

**Issue: Slow query performance**

- Verify Firestore indexes are created
- Check if limits are set appropriately
- Consider implementing pagination

**Issue: Missing change details**

- Verify old data is fetched before update
- Check change tracking logic in API routes
- Ensure fields are compared correctly

## 📚 Related Documentation

- [Firestore Database Schema](./documentation/PRD/firestoredatabaseschema.md)
- [API Documentation](./documentation/API_DOCUMENTATION.md)
- [Organization Management](./ADMIN_DASHBOARD_IMPLEMENTATION.md)
- [Member Management](./documentation/MEMBER_MANAGEMENT.md)

## ✅ Implementation Checklist

- [x] Enhanced AuditLog type definition
- [x] Created ActivityLogService with helper methods
- [x] Created organization activity API endpoint
- [x] Created member activity API endpoint
- [x] Created ActivityLogTimeline UI component
- [x] Integrated activity log into Organization details
- [x] Integrated activity log into Member details
- [x] Added logging to organization update operations
- [x] Added logging to member update operations
- [x] Created Firestore composite indexes
- [x] Added comprehensive documentation

---

**Last Updated:** January 11, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete
