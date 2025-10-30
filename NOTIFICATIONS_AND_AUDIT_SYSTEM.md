# Notifications & Audit Log System - Complete Documentation

## 📋 Overview

This document describes the complete implementation of the integrated Notifications and Audit Log system for the Atraiva platform. Every user action now automatically:

1. ✅ **Creates an Audit Log** - For compliance and tracking
2. ✅ **Sends Notifications** - To affected users when changes are made

## 🏗️ System Architecture

### Dual-Collection Strategy

**1. `auditLogs` Collection**

- Complete audit trail for compliance
- Viewable only by platform admins
- Immutable records
- Detailed change tracking

**2. `notifications` Collection**

- User-facing notifications
- Each user sees only their own notifications
- Interactive (can mark as read/unread)
- Actionable with deep links

## 📊 What Triggers Notifications + Audit Logs

### **Organization Events**

| Action                                  | Audit Log | Notifications Sent To                   | Notification Type              |
| --------------------------------------- | --------- | --------------------------------------- | ------------------------------ |
| Organization created (via registration) | ✅        | Organization owner                      | "Welcome to [Org Name]!"       |
| Organization updated by admin           | ✅        | All organization members (except admin) | "Organization details updated" |
| Subscription changed                    | ✅        | All organization members                | "Subscription changed"         |
| Settings updated                        | ✅        | All organization members                | "Settings updated"             |

### **Member/User Events**

| Action                                 | Audit Log | Notifications Sent To | Notification Type          |
| -------------------------------------- | --------- | --------------------- | -------------------------- |
| User profile updated by platform admin | ✅        | The affected user     | "Your profile was updated" |
| User role changed                      | ✅        | The affected user     | "Your role has changed"    |
| Member added to organization           | ✅        | The new member        | "Welcome to [Org]!"        |
| Member removed from organization       | ✅        | The removed member    | "Access removed"           |
| Account created                        | ✅        | The new user          | "Account created"          |

## 📁 File Structure

### Core Services

**1. `src/lib/firestore/types.ts`**

- `AuditLog` interface - Complete audit trail structure
- `Notification` interface - User notification structure

**2. `src/lib/activity-log-service.ts`**

- Handles audit logging
- Automatically triggers notifications when appropriate
- Helper methods:
  - `logOrganizationCreated()`
  - `logOrganizationUpdated()` - Now includes `memberIds` to notify
  - `logMemberAdded()`
  - `logMemberRemoved()`
  - `logMemberRoleChanged()`
  - `logUserProfileUpdated()`
  - `logSecurityEvent()`
  - `logSubscriptionChanged()`

**3. `src/lib/notification-service.ts`**

- Creates and manages user notifications
- Methods:
  - `createNotification()` - Core notification creator
  - `notifyOrganizationMembers()` - Notify all org members
  - `notifyUserProfileUpdate()` - Notify user of profile changes
  - `notifyRoleChange()` - Notify user of role changes
  - `notifyMemberAdded()` - Welcome notification
  - `notifyMemberRemoved()` - Removal notification
  - `getUserNotifications()` - Fetch user's notifications
  - `markAsRead()` - Mark single notification as read
  - `markAllAsRead()` - Mark all as read
  - `getUnreadCount()` - Get unread count

### API Routes

**4. `src/app/api/notifications/route.ts`**

- `GET` - Fetch user notifications (with filters)
- `PATCH` - Mark notifications as read

**5. `src/app/api/admin/organizations/[id]/route.ts`** (Updated)

- Organization updates now notify all members
- Fetches member list before updating
- Excludes the admin who made the change

**6. `src/app/api/admin/members/[id]/route.ts`** (Updated)

- Member updates notify the affected user
- Special notification for role changes
- Includes change details

**7. `src/app/api/registration/complete/route.ts`** (Updated)

- Sends welcome notification on registration
- Logs organization creation

### Database

**8. `firestore.indexes.json`**

- **Notifications indexes**:
  - `userId + createdAt` - User's notifications timeline
  - `userId + status + createdAt` - Filtered by read/unread
  - `organizationId + createdAt` - Organization notifications
  - `userId + priority + createdAt` - Priority sorting

**9. `firestore.rules`**

- Notifications are user-scoped (can only see own)
- Can mark as read
- Cannot delete
- Server-side creation only

## 🔔 Notification Types

### Organization Notifications

**Organization Updated**

```
Title: "Atraiva.ai Updated"
Message: "Organization details were updated by Rajesh Shetty. Changes: name, industry, subscription_plan"
Priority: Medium
Category: Organization
Action URL: /admin/organization/org_123
```

**Subscription Changed**

```
Title: "Subscription Plan Changed"
Message: "Your subscription was changed from Free to Pro"
Priority: High
Category: Organization
```

### User/Member Notifications

**Profile Updated by Admin**

```
Title: "Your Profile Was Updated"
Message: "A platform administrator (Rajesh Shetty) updated your profile. Changed fields: first name, job title"
Priority: High
Category: User
Action URL: /org/profile
```

**Role Changed**

```
Title: "Your Role Has Changed"
Message: "Your role in Atraiva.ai was changed from org_viewer to org_admin by Rajesh Shetty"
Priority: High
Category: User
Action URL: /org/profile
```

**Member Added**

```
Title: "Welcome to Atraiva.ai!"
Message: "You've been added to Atraiva.ai as org_admin by Rajesh Shetty"
Priority: High
Category: Organization
Action URL: /dashboard
```

**Member Removed**

```
Title: "Organization Access Removed"
Message: "You've been removed from Atraiva.ai by Rajesh Shetty"
Priority: Urgent
Category: Organization
```

## 🎯 Notification Data Structure

```typescript
{
  id: "notif_123",
  userId: "user_456", // Who receives this notification
  organizationId: "org_789",

  type: "organization_updated",
  category: "organization",
  priority: "medium",

  title: "Atraiva.ai Updated",
  message: "Organization details were updated...",

  actionBy: "user_admin",
  actionByName: "Platform Admin",
  actionByEmail: "admin@atraiva.ai",

  resourceType: "organization",
  resourceId: "org_789",
  resourceName: "Atraiva.ai",

  changes: [
    { field: "name", oldValue: "Atraiva Inc", newValue: "Atraiva.ai" }
  ],

  status: "unread",
  actionUrl: "/admin/organization/org_789",

  createdAt: "2025-01-11T...",
  metadata: { ... }
}
```

## 🔄 Complete Flow Examples

### Example 1: Platform Admin Updates Organization

```
1. Admin edits Atraiva.ai organization
   ↓
2. Changes: name, industry, subscription plan
   ↓
3. API fetches all organization members (3 members)
   ↓
4. ActivityLogService.logOrganizationUpdated() is called
   ↓
5. Audit log created in auditLogs collection ✅
   ↓
6. For each member (except the admin):
   - Notification created in notifications collection ✅
   - Title: "Atraiva.ai Updated"
   - Message: "Organization details were updated by Admin Name. Changes: name, industry, subscription_plan"
   ↓
7. Users see notification next time they login 🔔
```

### Example 2: Platform Admin Updates User Profile

```
1. Admin edits Rajesh Shetty's profile
   ↓
2. Changes: job title, first name
   ↓
3. ActivityLogService.logUserProfileUpdated() is called
   ↓
4. Audit log created in auditLogs collection ✅
   ↓
5. NotificationService.notifyUserProfileUpdate() is called
   ↓
6. Notification created for Rajesh ✅
   - Title: "Your Profile Was Updated"
   - Message: "A platform administrator updated your profile. Changed fields: job title, first name"
   ↓
7. Rajesh sees notification next time he logs in 🔔
```

### Example 3: Role Change

```
1. Admin changes user role from org_viewer to org_admin
   ↓
2. ActivityLogService.logUserProfileUpdated() is called
   ↓
3. Audit log created ✅
   ↓
4. NotificationService.notifyUserProfileUpdate() is called
   ↓
5. General profile update notification created ✅
   ↓
6. Role change detected in changes array
   ↓
7. NotificationService.notifyRoleChange() is also called
   ↓
8. Special role change notification created ✅
   - Title: "Your Role Has Changed"
   - Message: "Your role in Atraiva.ai was changed from org_viewer to org_admin"
   ↓
9. User receives 2 notifications (profile update + role change) 🔔🔔
```

## 📡 API Endpoints

### GET /api/notifications

Fetch current user's notifications

**Query Parameters:**

- `limit` - Number of notifications (default: 50)
- `status` - Filter by status (unread, read, archived)

**Response:**

```json
{
  "notifications": [...],
  "unreadCount": 5,
  "count": 50
}
```

### PATCH /api/notifications

Update notification status

**Body:**

```json
{
  "notificationId": "notif_123",
  "action": "mark_read"
}
```

or

```json
{
  "action": "mark_all_read"
}
```

## 🎨 Notification Priority Levels

| Priority   | Use Case                        | Visual Treatment |
| ---------- | ------------------------------- | ---------------- |
| **Low**    | Informational updates           | Gray/muted       |
| **Medium** | Organization changes            | Blue/primary     |
| **High**   | Profile/role changes            | Orange/warning   |
| **Urgent** | Security alerts, access removed | Red/critical     |

## 🔒 Security & Privacy

### Audit Logs

- ✅ Only platform_admin and super_admin can view
- ✅ Immutable (cannot be edited or deleted)
- ✅ Complete change history
- ✅ User attribution for all actions

### Notifications

- ✅ Users can only see their own notifications
- ✅ Users can only update their own notifications (mark as read)
- ✅ Cannot delete notifications
- ✅ Server-side creation only

## 🚀 Usage Examples

### Creating a Notification Manually

```typescript
import { NotificationService } from "@/lib/notification-service";

await NotificationService.createNotification({
  userId: "user_123",
  organizationId: "org_456",
  type: "system_announcement",
  category: "system",
  priority: "medium",
  title: "System Maintenance Scheduled",
  message: "We'll be performing maintenance on Jan 15th from 2-4 AM EST",
  actionUrl: "/announcements",
});
```

### Fetching User Notifications

```typescript
// Get all notifications
const notifications = await NotificationService.getUserNotifications(
  "user_123",
  50
);

// Get only unread
const unread = await NotificationService.getUserNotifications(
  "user_123",
  50,
  "unread"
);

// Get unread count
const count = await NotificationService.getUnreadCount("user_123");
```

### Marking as Read

```typescript
// Mark single notification
await NotificationService.markAsRead("notif_123");

// Mark all user's notifications
await NotificationService.markAllAsRead("user_123");
```

## 📈 Testing

### Test Organization Update Notifications

1. Login as platform admin
2. Update organization details (name, industry, etc.)
3. Check Firestore `notifications` collection
4. Verify notifications created for all members
5. Login as org member
6. Fetch notifications via API: `GET /api/notifications`
7. Verify notification appears with correct details

### Test User Profile Update Notifications

1. Login as platform admin
2. Update a member's profile
3. Check Firestore `notifications` collection
4. Verify notification created for that user
5. Login as that user
6. Fetch notifications via API
7. Verify notification shows admin who made change + what changed

### Test Role Change Notifications

1. Login as platform admin
2. Change a member's role
3. Check Firestore `notifications` collection
4. Verify TWO notifications created:
   - General profile update
   - Specific role change notification
5. Login as that user
6. Verify both notifications received

## 🔍 Database Queries

### Get User's Unread Notifications

```javascript
const q = query(
  collection(db, "notifications"),
  where("userId", "==", userId),
  where("status", "==", "unread"),
  orderBy("createdAt", "desc"),
  limit(50)
);
```

### Get Organization Notifications

```javascript
const q = query(
  collection(db, "notifications"),
  where("organizationId", "==", orgId),
  orderBy("createdAt", "desc"),
  limit(50)
);
```

### Get High Priority Notifications

```javascript
const q = query(
  collection(db, "notifications"),
  where("userId", "==", userId),
  where("priority", "in", ["high", "urgent"]),
  orderBy("createdAt", "desc")
);
```

## 📊 Notification Statistics

For each action, here's what gets created:

| Action                              | Audit Logs           | Notifications            |
| ----------------------------------- | -------------------- | ------------------------ |
| Organization updated                | 1                    | N (N = member count - 1) |
| User profile updated                | 1                    | 1                        |
| Role changed                        | 1                    | 2 (profile + role)       |
| Organization created (registration) | 2 (org + onboarding) | 1                        |
| Member invited                      | 1 per invitation     | 0 (email sent instead)   |

## 🎨 Future UI Integration

### Notification Bell Component (To Be Built)

```typescript
// Example notification bell in header
import { useNotifications } from "@/hooks/useNotifications";

function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1">{unreadCount}</Badge>
        )}
      </PopoverTrigger>
      <PopoverContent>
        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onRead={() => markAsRead(notif.id)}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
```

### Notification Center Page (To Be Built)

```
/notifications
- Tabs: All, Unread, Organization, User, Security
- Mark all as read button
- Filter by priority
- Search notifications
- Click to navigate to related resource
```

## 🔔 Notification Delivery Channels (Current)

### Current Implementation

- ✅ **In-App Notifications** - Stored in Firestore
- ✅ **API Accessible** - Via `/api/notifications`

### Future Enhancements

- [ ] **Email Notifications** - Send email for urgent notifications
- [ ] **Push Notifications** - Browser/mobile push
- [ ] **SMS Notifications** - For critical alerts
- [ ] **Slack Integration** - Organization-wide alerts
- [ ] **Webhook Support** - External system integration

## 📝 Notification Preferences (Future)

Users should be able to configure:

- Which events trigger notifications
- Delivery channels (email, push, SMS)
- Quiet hours
- Digest frequency (immediate, hourly, daily)

## 🆘 Troubleshooting

### Notifications Not Appearing

**Check:**

1. Firestore indexes deployed?
2. User ID correct in notification?
3. Firestore rules allow user to read?
4. API endpoint accessible?
5. Check browser console for errors

**Debug:**

```typescript
// In browser console
const response = await fetch("/api/notifications");
const data = await response.json();
console.log("Notifications:", data);
```

### Notifications Not Being Created

**Check:**

1. ActivityLogService properly imported?
2. Member IDs being passed?
3. Check server console for errors
4. Verify Firestore connection

**Debug in API route:**

```typescript
console.log('Creating notification for user:', userId);
const result = await NotificationService.createNotification({...});
console.log('Notification created:', result);
```

## 📚 Related Files

### Modified Files

1. ✅ `src/lib/firestore/types.ts` - Added Notification interface
2. ✅ `src/lib/notification-service.ts` - Created (new)
3. ✅ `src/lib/activity-log-service.ts` - Enhanced with notification triggers
4. ✅ `src/app/api/notifications/route.ts` - Created (new)
5. ✅ `src/app/api/admin/organizations/[id]/route.ts` - Added member notifications
6. ✅ `src/app/api/admin/members/[id]/route.ts` - Added user notifications
7. ✅ `src/app/api/registration/complete/route.ts` - Added welcome notification
8. ✅ `firestore.indexes.json` - Added notification indexes
9. ✅ `firestore.rules` - Added notification security rules

## ✅ Implementation Checklist

- [x] Created Notification type definition
- [x] Created NotificationService with all helper methods
- [x] Created notifications API endpoint (GET, PATCH)
- [x] Added notifications to organization updates
- [x] Added notifications to user profile updates
- [x] Added notifications to role changes
- [x] Added welcome notification on registration
- [x] Created Firestore indexes for notifications
- [x] Added Firestore security rules for notifications
- [x] Deployed indexes to tipcyber-dev
- [x] Deployed rules to tipcyber-dev
- [x] Comprehensive documentation

## 🎯 Next Steps for Full Notification UI

### 1. Create Notification Hook

**File:** `src/hooks/useNotifications.ts`

```typescript
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await fetch("/api/notifications");
    const data = await response.json();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  };

  const markAsRead = async (id) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      body: JSON.stringify({ notificationId: id, action: "mark_read" }),
    });
    fetchNotifications();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    refresh: fetchNotifications,
  };
}
```

### 2. Add Notification Bell to Header

**File:** `src/components/site-header.tsx` or sidebar

### 3. Create Notification Center Page

**File:** `src/app/(dashboard)/notifications/page.tsx`

### 4. Add Real-time Updates (Optional)

Use Firebase real-time listeners for instant notifications

## 📊 Analytics & Monitoring

### Metrics to Track

- Notification delivery rate
- Average time to read
- Click-through rate (actionUrl clicks)
- Notification volume by type
- User engagement with notifications

### Dashboard Queries

```sql
-- Most common notification types
SELECT type, COUNT(*) as count
FROM notifications
GROUP BY type
ORDER BY count DESC;

-- Average time to read
SELECT AVG(readAt - createdAt) as avg_read_time
FROM notifications
WHERE status = 'read';

-- Unread notifications by priority
SELECT priority, COUNT(*) as count
FROM notifications
WHERE status = 'unread'
GROUP BY priority;
```

---

**Status**: ✅ Complete  
**Last Updated**: January 11, 2025  
**Version**: 1.0.0

**All user actions now automatically create audit logs AND send notifications!** 🎉

