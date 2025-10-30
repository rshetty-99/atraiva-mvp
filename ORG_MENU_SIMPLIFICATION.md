# Organization Menu Simplification

## Overview

Updated all organization role menu configurations to match the simplified sidebar design shown in the reference image. The new structure focuses on essential features with a cleaner, more intuitive navigation experience.

## Updated Roles

### 1. **org_admin** (Organization Admin)

Full organization control with all management features.

**Menu Items:**

- 🏠 **Dashboard** - Organization dashboard and analytics
- 👤 **Profile** - Organization profile and settings
- 📊 **Reports** - Compliance and data reports
- 🚨 **Incidents** - Breach incidents and management
- 👥 **Users** - User management and roles
- 💳 **Payment** - Billing and subscription

**Routes:**

- `/dashboard`
- `/org/profile`
- `/org/reports`
- `/org/incidents`
- `/org/users`
- `/org/payment`

### 2. **org_manager** (Organization Manager)

Operational management without billing access.

**Menu Items:**

- 🏠 **Dashboard** - Operations dashboard and analytics
- 👤 **Profile** - Your profile and settings
- 📊 **Reports** - View and generate reports
- 🚨 **Incidents** - Manage incidents and responses
- 👥 **Users** - View and manage team

**Routes:**

- `/dashboard`
- `/org/profile`
- `/org/reports`
- `/org/incidents`
- `/org/users`

### 3. **org_analyst** (Organization Analyst)

Data analysis and reporting focus.

**Menu Items:**

- 🏠 **Dashboard** - Analytics dashboard
- 👤 **Profile** - Your profile and settings
- 📊 **Reports** - View and analyze reports
- 🚨 **Incidents** - View incidents

**Routes:**

- `/dashboard`
- `/org/profile`
- `/org/reports`
- `/org/incidents`

### 4. **org_viewer** (Organization Viewer)

Read-only access to essential information.

**Menu Items:**

- 🏠 **Dashboard** - View dashboard
- 👤 **Profile** - Your profile
- 📊 **Reports** - View reports

**Routes:**

- `/dashboard`
- `/org/profile`
- `/org/reports`

### 5. **auditor** (Auditor)

Time-limited audit access with incident visibility.

**Menu Items:**

- 🏠 **Dashboard** - Audit dashboard
- 👤 **Profile** - Your profile
- 📊 **Reports** - Audit reports
- 🚨 **Incidents** - View incidents

**Routes:**

- `/dashboard`
- `/org/profile`
- `/org/reports`
- `/org/incidents`

## Key Changes

### Before

- Complex nested submenu structures
- Multiple parent items with children arrays
- Inconsistent routing patterns
- Project sections with specific items

### After

- ✅ Flat menu structure (no nested children)
- ✅ Consistent routing pattern (`/org/*`)
- ✅ All items in `category: "main"`
- ✅ Empty `projects: []` arrays
- ✅ Simplified icon usage
- ✅ Clear, descriptive labels

## Icon Mapping

| Menu Item | Icon Component    | Visual                    |
| --------- | ----------------- | ------------------------- |
| Dashboard | `LayoutDashboard` | Grid layout icon          |
| Profile   | `User`            | Person silhouette         |
| Reports   | `BarChart3`       | Bar chart                 |
| Incidents | `AlertOctagon`    | Alert triangle in octagon |
| Users     | `Users`           | Multiple people           |
| Payment   | `CreditCard`      | Credit card               |

## Role-Based Feature Access

| Feature   | org_admin | org_manager | org_analyst | org_viewer | auditor |
| --------- | --------- | ----------- | ----------- | ---------- | ------- |
| Dashboard | ✅        | ✅          | ✅          | ✅         | ✅      |
| Profile   | ✅        | ✅          | ✅          | ✅         | ✅      |
| Reports   | ✅        | ✅          | ✅          | ✅         | ✅      |
| Incidents | ✅        | ✅          | ✅          | ❌         | ✅      |
| Users     | ✅        | ✅          | ❌          | ❌         | ❌      |
| Payment   | ✅        | ❌          | ❌          | ❌         | ❌      |

## Code Structure

### Menu Item Format

```typescript
{
  id: "dashboard",
  label: "Dashboard",
  icon: LayoutDashboard,
  route: "/dashboard",
  order: 1,
  description: "Organization dashboard and analytics",
  category: "main",
}
```

### Key Properties

- **id**: Unique identifier for the menu item
- **label**: Display name in the sidebar
- **icon**: Lucide React icon component
- **route**: Navigation path
- **order**: Display order (1-6)
- **description**: Tooltip/description text
- **category**: Always "main" for org roles (no nested categories)

## Navigation Component Compatibility

The simplified menu structure works seamlessly with:

- ✅ `NavMain` - Renders all main menu items
- ✅ `NavSecondary` - Support/Feedback/Help (unchanged)
- ✅ `NavProjects` - Now empty for org roles
- ✅ `NavUser` - User profile section (unchanged)

## Route Organization

All organization routes follow the pattern:

```
/dashboard              - Common dashboard (role-aware)
/org/profile           - Organization profile & settings
/org/reports           - Reports and analytics
/org/incidents         - Incident management
/org/users             - User management
/org/payment           - Billing (admin only)
```

## Benefits

### 1. **User Experience**

- Cleaner, less cluttered interface
- Easier navigation
- Faster access to key features
- Reduced cognitive load

### 2. **Consistency**

- Same layout across all org roles
- Predictable navigation patterns
- Uniform styling and spacing

### 3. **Maintenance**

- Simpler configuration
- Easier to add/modify features
- Less code to maintain
- Clear role-based permissions

### 4. **Performance**

- No nested menu rendering
- Faster sidebar rendering
- Reduced DOM complexity

## Responsive Behavior

The simplified menu maintains excellent responsive behavior:

### Mobile (< 768px)

- Single column, full-width items
- Touch-friendly 44px minimum height
- Clear icons and labels

### Tablet (768px - 1024px)

- Collapsed/expandable sidebar
- Icon + label display
- Smooth animations

### Desktop (> 1024px)

- Full sidebar with all items
- Hover effects
- Optimal spacing

## Migration Notes

### Removed Features

- Nested submenus (children arrays)
- Complex project hierarchies
- Role-specific project items

### Maintained Features

- Role-based access control
- Route permissions
- Icon customization
- Tooltip descriptions

### Future Considerations

- Individual pages can still have complex internal navigation
- Breadcrumbs can show page hierarchy
- Secondary navigation can be added within pages
- Modal/drawer navigation for advanced features

## Testing Checklist

- [x] org_admin sees all 6 menu items
- [x] org_manager sees 5 menu items (no Payment)
- [x] org_analyst sees 4 menu items
- [x] org_viewer sees 3 menu items (minimal access)
- [x] auditor sees 4 menu items (with Incidents)
- [x] All icons render correctly
- [x] All routes are properly formatted
- [x] No linter errors
- [x] Category is "main" for all items
- [x] Projects array is empty for all roles
- [x] Order values are sequential

## Files Modified

1. `src/lib/rbac/menu-config.ts` - Updated all org role configurations

## Related Components

- `src/components/app-sidebar.tsx` - Sidebar container
- `src/components/nav-main.tsx` - Main navigation renderer
- `src/components/nav-secondary.tsx` - Secondary navigation
- `src/components/nav-user.tsx` - User profile section
- `src/components/nav-projects.tsx` - Projects section (now empty)

## Summary

The organization role menus have been successfully simplified to match the reference design:

- ✅ **Cleaner UI** - Flat structure, no nested menus
- ✅ **Consistent Design** - Same layout across all roles
- ✅ **Role-Based Access** - Features shown based on permissions
- ✅ **Better UX** - Easier navigation, faster access
- ✅ **Maintainable** - Simpler code, easier updates

All organization users will now experience a streamlined, professional sidebar navigation that matches the admin interface's clean design aesthetic.


