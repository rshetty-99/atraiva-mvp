# Teams Page Stats Cards Update

## Changes Made

Updated the statistics cards on the Teams page (`/admin/team`) to show more relevant metrics for platform administrators.

### Previous Stats Cards

1. ✅ Total Organizations
2. ✅ Active (subscription status = active)
3. ❌ Trial (subscription status = trialing) - **REMOVED**
4. ❌ Enterprise (subscription plan = enterprise) - **REMOVED**

### New Stats Cards

1. ✅ **Total Organizations** - Total count of all organizations
2. ✅ **Active** - Organizations with active subscriptions
3. 🆕 **Onboarding** - Organizations in onboarding process
4. 🆕 **Subscription Expired** - Organizations with expired/canceled subscriptions

## Detailed Metrics

### 1. Total Organizations

- **Source**: Count of all documents in `organizations` collection
- **Color**: Blue
- **Icon**: Building2

### 2. Active

- **Source**: Organizations collection
- **Filter**: `subscriptionStatus === "active"`
- **Color**: Green
- **Icon**: Users
- **Purpose**: Shows organizations with currently active subscriptions

### 3. Onboarding (NEW)

- **Source**: `registrationLinks` collection
- **Filter**:
  - `status === "pending"` AND
  - `paymentStatus === "completed"`
- **Color**: Orange
- **Icon**: Users
- **Purpose**: Shows organizations that have completed payment but are still in the onboarding/setup phase

### 4. Subscription Expired (NEW)

- **Source**: Organizations collection
- **Filter**:
  - `subscriptionStatus === "canceled"` OR
  - `subscriptionStatus === "past_due"`
- **Color**: Red
- **Icon**: Building2
- **Purpose**: Shows organizations with expired, canceled, or overdue subscriptions requiring attention

## Implementation Details

### API Changes (`src/app/api/admin/organizations/route.ts`)

#### Added Registration Links Query

```typescript
// Get registration links for onboarding count
const registrationLinksRef = collection(db, "registrationLinks");
const onboardingQuery = query(
  registrationLinksRef,
  where("status", "==", "pending"),
  where("paymentStatus", "==", "completed")
);
const onboardingSnapshot = await getDocs(onboardingQuery);
const onboardingCount = onboardingSnapshot.size;
```

#### New Stats Object

```typescript
const stats = {
  total: enrichedOrgs.length,
  active: enrichedOrgs.filter((org) => org.subscriptionStatus === "active")
    .length,
  onboarding: onboardingCount,
  expired: enrichedOrgs.filter(
    (org) =>
      org.subscriptionStatus === "canceled" ||
      org.subscriptionStatus === "past_due"
  ).length,
};
```

#### Updated Response

```typescript
return NextResponse.json({
  organizations: enrichedOrgs,
  stats, // NEW: Stats object included in response
  total: enrichedOrgs.length,
});
```

### Frontend Changes (`src/app/(dashboard)/admin/team/page.tsx`)

#### Added Stats State

```typescript
interface OrganizationStats {
  total: number;
  active: number;
  onboarding: number;
  expired: number;
}

const [stats, setStats] = useState<OrganizationStats>({
  total: 0,
  active: 0,
  onboarding: 0,
  expired: 0,
});
```

#### Updated Data Fetching

```typescript
const data = await response.json();
setOrganizations(data.organizations);
setFilteredOrgs(data.organizations);
setStats(
  data.stats || {
    total: data.organizations.length,
    active: 0,
    onboarding: 0,
    expired: 0,
  }
);
```

#### Updated Cards UI

- Replaced "Trial" card with "Onboarding" (orange theme)
- Replaced "Enterprise" card with "Subscription Expired" (red theme)
- All cards now use the `stats` state object

## Database Dependencies

### Firestore Collections Used

#### 1. `organizations` Collection

```typescript
{
  id: string;
  name: string;
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled";
  subscriptionPlan: "free" | "basic" | "pro" | "enterprise";
  // ... other fields
}
```

#### 2. `registrationLinks` Collection (NEW)

```typescript
{
  id: string;
  status: "pending" | "used" | "expired" | "canceled";
  paymentStatus: "pending" | "completed" | "failed" | "refunded";
  // ... other fields
}
```

## Visual Design

### Color Scheme

- **Blue** (#3B82F6): Total Organizations - Neutral, informative
- **Green** (#10B981): Active - Positive, healthy status
- **Orange** (#F97316): Onboarding - In-progress, attention needed (neutral)
- **Red** (#EF4444): Subscription Expired - Alert, action required

### Card Layout

Each card shows:

- Descriptive label (top)
- Large number metric (middle)
- Icon with matching color background (right)

## Benefits

### 1. Better Business Insights

- **Onboarding Metric**: Helps track organizations that have paid but need setup assistance
- **Expired Subscriptions**: Immediate visibility into revenue at risk

### 2. Actionable Data

- Onboarding count helps prioritize customer success efforts
- Expired count helps identify churn risk and recovery opportunities

### 3. More Relevant Metrics

- Removed "Trial" (less actionable for platform admins)
- Removed "Enterprise" (plan type less important than subscription health)

## Use Cases

### For Platform Admins

1. **Monitor Onboarding**

   - See how many organizations are waiting for setup
   - Prioritize onboarding support resources

2. **Track Churn Risk**

   - Quickly identify expired/canceled subscriptions
   - Take action to recover or prevent churn

3. **Overall Health**
   - Total: Overall growth
   - Active: Healthy revenue base
   - Onboarding: Growth pipeline
   - Expired: Risk/recovery opportunities

## API Response Example

```json
{
  "organizations": [...],
  "stats": {
    "total": 150,
    "active": 120,
    "onboarding": 15,
    "expired": 15
  },
  "total": 150
}
```

## Testing Checklist

- [x] API returns correct stats object
- [x] Stats cards display correct numbers
- [x] Onboarding count queries registrationLinks correctly
- [x] Expired count includes both canceled and past_due
- [x] Cards show correct colors and icons
- [x] Stats update when organizations data changes
- [x] No linter errors

## Files Modified

1. ✅ `src/app/api/admin/organizations/route.ts` - Added onboarding query and stats calculation
2. ✅ `src/app/(dashboard)/admin/team/page.tsx` - Updated stats state and cards UI
3. ✅ `TEAMS_PAGE_DOCUMENTATION.md` - Updated documentation with new stats info

## Future Enhancements

Potential improvements:

1. Add trend indicators (↑↓) showing change from previous period
2. Add drill-down to see detailed list when clicking a stat card
3. Add more granular onboarding statuses
4. Add retention rate calculation
5. Add monthly recurring revenue (MRR) card
6. Add charts showing trends over time
