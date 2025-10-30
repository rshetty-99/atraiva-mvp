# Dashboard Architecture - Role-Based Routing

## Overview

The dashboard system uses a **hybrid role-based routing architecture** that separates concerns by role groups while maintaining a unified entry point. This approach provides clean code organization, improved maintainability, and role-specific features.

## Architecture Pattern

```
User Access Flow:
┌─────────────────────────────────────────────────────────────┐
│ User clicks "Dashboard" in menu                             │
│ → All menu items point to /dashboard                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Smart Router (/dashboard)                                   │
│ → Detects user role                                         │
│ → Redirects to role-specific dashboard                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
         ┌──────────────────┴──────────────────┐
         ↓                  ↓                   ↓
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  Admin   │      │   Org    │      │ Partner  │
   │Dashboard │      │Dashboard │      │Dashboard │
   └──────────┘      └──────────┘      └──────────┘
```

## Directory Structure

```
src/app/(dashboard)/
├── dashboard/
│   └── page.tsx                    # Smart Router (redirects based on role)
│
├── admin/
│   ├── dashboard/
│   │   └── page.tsx                # For super_admin, platform_admin
│   ├── incidents/
│   ├── compliance/
│   ├── regulations/
│   ├── exposure-analysis/
│   ├── analytics/
│   ├── audits-reports/
│   ├── integrations-licenses/
│   └── registration-management/
│
├── org/
│   └── dashboard/
│       └── page.tsx                # For org_admin, org_manager, org_analyst,
│                                   # org_user, org_viewer, auditor
│
└── partner/
    └── dashboard/
        └── page.tsx                # For channel_partner
```

## Role-to-Dashboard Mapping

| Role Group       | Roles                                                                          | Dashboard Route      |
| ---------------- | ------------------------------------------------------------------------------ | -------------------- |
| **Admin**        | `super_admin`, `platform_admin`                                                | `/admin/dashboard`   |
| **Organization** | `org_admin`, `org_manager`, `org_analyst`, `org_user`, `org_viewer`, `auditor` | `/org/dashboard`     |
| **Partner**      | `channel_partner`                                                              | `/partner/dashboard` |

## How It Works

### 1. Smart Router (`/dashboard`)

The main dashboard route acts as a **smart router** that:

- Detects the authenticated user's role
- Redirects to the appropriate role-specific dashboard
- Handles loading states and authentication checks

```typescript
// src/app/(dashboard)/dashboard/page.tsx
switch (currentRole) {
  case "super_admin":
  case "platform_admin":
    router.push("/admin/dashboard");
    break;
  case "channel_partner":
    router.push("/partner/dashboard");
    break;
  default:
    router.push("/org/dashboard");
    break;
}
```

### 2. Role-Specific Dashboards

Each dashboard is tailored to its role group:

#### **Admin Dashboard** (`/admin/dashboard`)

- **Target Roles**: `super_admin`, `platform_admin`
- **Features**:
  - Platform-wide analytics and monitoring
  - Organization management
  - System health metrics
  - Security alerts
  - Organization distribution charts
  - Recent organizations table
- **Quick Actions**:
  - Create Organization
  - View Audit Log
  - System Settings

#### **Organization Dashboard** (`/org/dashboard`)

- **Target Roles**: `org_admin`, `org_manager`, `org_analyst`, `org_user`, `org_viewer`, `auditor`
- **Features**:
  - Compliance score tracking
  - Active breach incidents
  - PII location discovery
  - Pending actions
  - Client portfolio summary
  - Team activity
  - Revenue analytics (for org_admin)
- **Quick Actions** (role-dependent):
  - Run PII Scan
  - Create Breach Report
  - Compliance Check
  - Invite User
  - Start Analysis (for org_analyst)
  - Export Data (for org_analyst)

#### **Partner Dashboard** (`/partner/dashboard`)

- **Target Roles**: `channel_partner`
- **Features**:
  - Client context switcher
  - Partner performance metrics
  - Client health scores across portfolio
  - Commission tracking
  - Multi-client management table
- **Quick Actions**:
  - Switch Client
  - Add Client
  - Commission Report

### 3. Widget System Integration

Each dashboard leverages the existing role-based widget configuration:

```typescript
// src/lib/rbac/dashboard-widgets.ts
const dashboardConfig = getDashboardForRole(currentRole);
const quickActions = getQuickActionsForRole(currentRole, currentPermissions);
```

This ensures:

- Consistent data structures across dashboards
- Easy widget customization per role
- Reusable components
- Permission-based filtering

## Benefits of This Approach

### 1. **Clean Separation of Concerns**

- Each role group has its own dedicated dashboard
- No complex conditional rendering in a single file
- Easier to understand and modify

### 2. **Maintainability**

- ~150 lines per dashboard vs. 500+ in a monolithic file
- Changes to one dashboard don't affect others
- Clear file organization

### 3. **Performance**

- Only loads components needed for that role
- Smaller bundle size per route
- Faster initial page load

### 4. **Scalability**

- Easy to add new role-specific features
- Can create sub-routes under each dashboard
- Flexible for future requirements

### 5. **Consistency with Existing Routes**

- Aligns with `/admin/*` route structure
- Logical grouping of functionality
- Intuitive navigation

### 6. **Security**

- Route-level protection per role group
- Clear access control boundaries
- Easier to implement middleware checks

### 7. **Developer Experience**

- Clear mental model of dashboard organization
- Easier onboarding for new developers
- Better IDE navigation and search

## Menu Configuration

All role configurations in `src/lib/rbac/menu-config.ts` point to `/dashboard`:

```typescript
{
  id: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  route: "/dashboard", // Smart router handles redirect
  order: 1,
  description: "...",
  category: "main",
}
```

This provides:

- **Single source of truth** for dashboard navigation
- **Automatic routing** to the correct dashboard
- **Simplified menu management**

## Implementation Details

### Loading States

All dashboards implement consistent loading states:

```typescript
if (!clerkLoaded || !role) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
      <p className="text-muted-foreground">Loading dashboard...</p>
    </div>
  );
}
```

### Access Control

Each dashboard verifies the user has the correct role:

```typescript
useEffect(() => {
  if (clerkLoaded && !clerkUser) {
    router.push("/sign-in");
  }
  if (clerkLoaded && role && role !== "expected_role") {
    router.push("/dashboard"); // Redirect to smart router
  }
}, [clerkUser, clerkLoaded, role, router]);
```

### Consistent Styling

All dashboards:

- Use `marginTop: "140px"` for consistent page offset
- Follow the same card/widget layout patterns
- Implement dark/light mode support
- Use Shadcn UI components

## Future Enhancements

### 1. Dashboard Customization

- Allow users to customize widget layouts
- Save user preferences to Firestore
- Drag-and-drop widget positioning

### 2. Real-time Data

- Integrate live data streams
- WebSocket connections for updates
- Real-time notifications

### 3. Advanced Analytics

- Interactive charts with drill-down
- Custom report generation
- Data export functionality

### 4. Multi-tenant Context

- Organization switcher for admins
- Client context persistence
- Cross-organization analytics

### 5. Mobile Optimization

- Responsive widget layouts
- Touch-optimized interactions
- Progressive Web App (PWA) support

## Migration Notes

If you had custom logic in the old monolithic dashboard:

1. **Identify the role** the logic applies to
2. **Locate the appropriate dashboard file**:
   - Admin logic → `/admin/dashboard/page.tsx`
   - Org logic → `/org/dashboard/page.tsx`
   - Partner logic → `/partner/dashboard/page.tsx`
3. **Move the logic** to the appropriate component
4. **Test thoroughly** with different roles

## Testing Checklist

- [ ] Test as `super_admin` - should redirect to `/admin/dashboard`
- [ ] Test as `platform_admin` - should redirect to `/admin/dashboard`
- [ ] Test as `org_admin` - should redirect to `/org/dashboard`
- [ ] Test as `org_manager` - should redirect to `/org/dashboard`
- [ ] Test as `org_analyst` - should redirect to `/org/dashboard`
- [ ] Test as `org_viewer` - should redirect to `/org/dashboard`
- [ ] Test as `auditor` - should redirect to `/org/dashboard`
- [ ] Test as `channel_partner` - should redirect to `/partner/dashboard`
- [ ] Verify loading states work correctly
- [ ] Verify error handling for invalid roles
- [ ] Test dark/light mode on all dashboards
- [ ] Verify responsive layouts on mobile/tablet
- [ ] Test quick actions navigation
- [ ] Verify widgets load correctly per role

## Troubleshooting

### Dashboard shows loading indefinitely

- Check Clerk authentication is working
- Verify role is being fetched from Firestore
- Check browser console for errors

### Wrong dashboard shown for role

- Verify role assignment in Firestore
- Check the smart router logic in `/dashboard`
- Clear browser cache and cookies

### Widgets not displaying

- Verify `dashboard-widgets.ts` has configuration for the role
- Check widget data is being fetched
- Look for console errors

## Summary

This architecture provides:

- ✅ **Clean separation** of role-specific functionality
- ✅ **Easy maintenance** with smaller, focused files
- ✅ **Scalability** for future role additions
- ✅ **Performance** optimization through code splitting
- ✅ **Security** with route-level access control
- ✅ **Consistency** with existing route patterns

The system is production-ready and follows Next.js best practices for authentication, routing, and component organization.


