# Notifications System - Quick Start Guide

## ✅ What's Implemented

Every user action now automatically creates:

1. **Audit Log** (for compliance tracking)
2. **Notifications** (for affected users)

## 🔔 Current Notification Events

### When Platform Admin Updates Organization

- ✅ All organization members get notified (except the admin)
- ✅ Shows what changed (name, industry, subscription, etc.)
- ✅ Links to organization details page

### When Platform Admin Updates User Profile

- ✅ User gets notified about profile changes
- ✅ Shows which fields changed
- ✅ Shows who made the change
- ✅ Links to profile page

### When User Role Changes

- ✅ User gets TWO notifications:
  1. General profile update
  2. Specific role change notification
- ✅ Shows old role → new role
- ✅ Shows who made the change

### When User Completes Registration

- ✅ Welcome notification created
- ✅ Guides user to dashboard

## 📊 Collections

### `auditLogs` Collection

```javascript
// Complete audit trail
{
  organizationId: "org_123",
  userId: "user_456", // Who performed action
  action: "updated",
  category: "organization",
  description: "Organization updated",
  changes: [{field: "name", oldValue: "...", newValue: "..."}],
  timestamp: Date,
  ...
}
```

### `notifications` Collection

```javascript
// User-facing notifications
{
  userId: "user_789", // Who receives notification
  organizationId: "org_123",
  type: "organization_updated",
  title: "Organization Updated",
  message: "Details were updated by Admin...",
  status: "unread",
  priority: "medium",
  actionUrl: "/admin/organization/org_123",
  createdAt: Date,
  ...
}
```

## 🚀 How to View Notifications

### Via API

```javascript
// Get notifications
const response = await fetch("/api/notifications");
const { notifications, unreadCount } = await response.json();

// Get only unread
const unread = await fetch("/api/notifications?status=unread");

// Mark as read
await fetch("/api/notifications", {
  method: "PATCH",
  body: JSON.stringify({
    notificationId: "notif_123",
    action: "mark_read",
  }),
});

// Mark all as read
await fetch("/api/notifications", {
  method: "PATCH",
  body: JSON.stringify({ action: "mark_all_read" }),
});
```

### Via Firestore Console

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Open `notifications` collection
4. Filter by `userId` to see user's notifications

## 🎯 Test the System

### Test 1: Organization Update

```
1. Login as platform admin (rshetty99@gmail.com)
2. Go to /admin/organization
3. Click on "Atraiva.ai"
4. Click "Edit" button
5. Change the name to "Atraiva.ai Updated"
6. Save
7. Check Firestore notifications collection
8. Should see notification for paritosh@atraiva.ai and rajesh@atraiva.ai
9. Login as paritosh@atraiva.ai
10. Call GET /api/notifications
11. Should see notification about organization update!
```

### Test 2: User Profile Update

```
1. Login as platform admin
2. Go to /admin/members
3. Click on any member
4. Click "Edit"
5. Change job title
6. Save
7. Check Firestore notifications collection
8. Should see notification for that user
9. Login as that user
10. Call GET /api/notifications
11. Should see notification about profile update!
```

### Test 3: Role Change

```
1. Login as platform admin
2. Go to /admin/members
3. Edit a member
4. Change role from org_viewer to org_admin
5. Save
6. Check Firestore notifications collection
7. Should see TWO notifications for that user
8. Login as that user
9. Call GET /api/notifications
10. Should see both notifications!
```

## 🔍 Monitoring

### Check Notification Creation

```javascript
// In browser console after an action
const response = await fetch("/api/notifications");
const data = await response.json();
console.log("Unread count:", data.unreadCount);
console.log("Latest notification:", data.notifications[0]);
```

### Check in Firestore Console

```
1. Go to Firebase Console > Firestore
2. Navigate to 'notifications' collection
3. Filter documents where status == "unread"
4. Sort by createdAt (descending)
5. See latest notifications
```

## 📱 Next: Build the UI

To display notifications to users, you need to create:

1. **Notification Bell Component** - In header/sidebar

   - Shows unread count badge
   - Dropdown with recent notifications
   - Click to mark as read
   - Click notification to navigate to actionUrl

2. **Notification Center Page** - `/notifications`

   - Full list of all notifications
   - Filter by category, status, priority
   - Mark all as read button
   - Archive functionality

3. **Real-time Updates** - Use Firebase listeners
   - Listen for new notifications
   - Show toast on new notification
   - Update unread count in real-time

## 🎨 UI Component Suggestions

### Notification Item

- Icon based on category/type
- Title in bold
- Message text
- Timestamp (e.g., "5 minutes ago")
- Unread indicator (dot or background color)
- Click to mark as read + navigate

### Notification Bell Badge

- Red dot for unread
- Number badge if > 0
- Pulse animation on new notification

## ⚡ Performance

- ✅ Indexed queries for fast fetching
- ✅ Limit to 50 notifications per request
- ✅ Status filter for unread-only queries
- ✅ Efficient batch updates (mark all as read)

---

**Status**: ✅ Backend Complete - Ready for UI Implementation  
**Last Updated**: January 11, 2025

