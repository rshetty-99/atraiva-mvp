# PII Reference Data Page - Visual Guide

## 🎨 Page Layout Preview

```
┌──────────────────────────────────────────────────────────────────────┐
│  🛡️ PII Reference Data                           [Export CSV] Button │
│  Manage and monitor Personally Identifiable Information elements      │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ 📊 Total        │ ⚠️ High Risk    │ 📄 Regulated    │ 📈 Categories   │
│                 │                 │                 │                 │
│    161          │     80          │     53          │     14          │
│ Across 14       │ 81 medium risk  │ 108 non-        │ Distinct groups │
│ categories      │                 │ regulated       │                 │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ 🔍 Filters                                                            │
│ Filter and search through PII reference elements                     │
│                                                                       │
│ [Search...]  [Category ▼]  [Risk Level ▼]  [Regulated ▼]  [Reg ▼]  │
│                                                                       │
│ [Clear All Filters]                                                  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ PII Elements (161)                                                    │
│ Showing all elements                                                  │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Element ⬍     │ Category ⬍    │ Risk ⬍  │ Reg │ Regulations │ │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ Full legal    │ Core          │ [HIGH]  │[Yes]│ GDPR CCPA   │👁│ │
│ │ name          │ Identifiers   │         │     │ State Laws  │ │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ Social        │ Government-   │ [HIGH]  │[Yes]│ HIPAA GLBA  │👁│ │
│ │ Security      │ Issued        │         │     │ State Laws  │ │ │
│ │ number        │ Numbers       │         │     │             │ │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ Bank account  │ Financial &   │ [HIGH]  │[Yes]│ GLBA        │👁│ │
│ │ number        │ Payment       │         │     │ PCI-DSS     │ │ │
│ │               │               │         │     │ State Laws  │ │ │
│ ├──────────────────────────────────────────────────────────────────┤ │
│ │ IP address    │ Digital &     │ [MED]   │[No] │ GDPR CCPA   │👁│ │
│ │               │ Device IDs    │         │     │             │ │ │
│ └──────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

## 🎨 Color Scheme

### Risk Level Badges

```
┌─────────────────────────────────────────────────────────┐
│ [HIGH]     - Red background, red text, red border       │
│ [MEDIUM]   - Yellow background, yellow text, yellow bdr │
│ [LOW]      - Green background, green text, green border │
│ [CRITICAL] - Purple background, purple text, purple bdr │
└─────────────────────────────────────────────────────────┘
```

### Category Badges

```
┌─────────────────────────────────────────────────────────┐
│ High-Risk Categories (Red):                             │
│ • Core Identifiers                                      │
│ • Government-Issued Numbers                             │
│ • Financial & Payment                                   │
│ • Health & Genetic                                      │
│ • Biometric Identifiers                                 │
│ • Login & Security Credentials                          │
│ • Miscellaneous Unique Identifiers                      │
│                                                         │
│ Medium-Risk Categories (Yellow):                        │
│ • Digital & Device IDs                                  │
│ • Location & Vehicle                                    │
│ • Personal Characteristics & Demographics               │
│ • Civic, Political & Legal                              │
│ • Education & Employment                                │
│ • Media & Communications                                │
│ • Household & Utility                                   │
└─────────────────────────────────────────────────────────┘
```

### Regulated Status Badges

```
┌─────────────────────────────────────────────────────────┐
│ [Yes] - Blue background, white text (Regulated)         │
│ [No]  - Gray background, gray text (Non-regulated)      │
└─────────────────────────────────────────────────────────┘
```

## 🔍 Filter Examples

### Example 1: Find all HIPAA-related PII

```
Filters:
  Regulation: "HIPAA" ▼

Results (12 elements):
  ✓ Medical record number
  ✓ Health insurance number
  ✓ Health plan ID number
  ✓ Medical treatment records
  ✓ Prescription information
  ... (7 more)
```

### Example 2: Find high-risk financial PII

```
Filters:
  Category: "Financial & Payment" ▼
  Risk Level: "high" ▼

Results (19 elements):
  ✓ Bank account number
  ✓ Credit card number
  ✓ Debit card number
  ✓ Routing number
  ✓ IBAN
  ... (14 more)
```

### Example 3: Search for biometric data

```
Search: "biometric"

Results (10 elements):
  ✓ Fingerprint
  ✓ Facial recognition data
  ✓ Iris scan
  ✓ Retina scan
  ✓ Voice print
  ... (5 more)
```

### Example 4: Find non-regulated identifiers

```
Filters:
  Regulated: "Non-Regulated Only" ▼
  Risk Level: "medium" ▼

Results (60+ elements):
  ✓ Email address
  ✓ Phone number
  ✓ IP address
  ✓ Device ID
  ... (56 more)
```

## 📊 Statistics Cards

### Card 1: Total Elements

```
┌─────────────────────┐
│ 📊 Total Elements   │
│                     │
│       161           │
│ Across 14 categories│
└─────────────────────┘
```

### Card 2: High Risk

```
┌─────────────────────┐
│ ⚠️  High Risk       │
│                     │
│        80           │
│ 81 medium risk      │
└─────────────────────┘
```

### Card 3: Regulated

```
┌─────────────────────┐
│ 📄 Regulated        │
│                     │
│        53           │
│ 108 non-regulated   │
└─────────────────────┘
```

### Card 4: Categories

```
┌─────────────────────┐
│ 📈 Categories       │
│                     │
│        14           │
│ Distinct groups     │
└─────────────────────┘
```

## 🎬 Animations

### Page Load Animation

```
1. Header fades in from top (opacity: 0 → 1, y: -20 → 0)
   Duration: 300ms

2. Stats cards fade in (opacity: 0 → 1, y: 20 → 0)
   Duration: 300ms
   Delay: 100ms

3. Filters section fade in (opacity: 0 → 1, y: 20 → 0)
   Duration: 300ms
   Delay: 200ms

4. Table section fade in (opacity: 0 → 1, y: 20 → 0)
   Duration: 300ms
   Delay: 300ms
```

### Loading State

```
1. Skeleton placeholders appear
2. Spinner overlay with:
   - Rotating spinner icon
   - Pulsing text: "Loading PII reference data..."
   - Semi-transparent backdrop with blur
```

### Filter/Sort Interactions

```
- Filter dropdown: Smooth expand/collapse
- Badge hover: Scale slightly (1.0 → 1.05)
- Button hover: Opacity change (1.0 → 0.9)
- Sort arrow: Rotate 180° when direction changes
- Table row hover: Background color transition
```

## 🖥️ Responsive Breakpoints

### Desktop (1440px+)

```
- Full 5-column filter grid
- Table shows all columns
- Stats cards in 4-column grid
```

### Laptop (1024px - 1439px)

```
- 5-column filter grid
- Table shows all columns with adjusted padding
- Stats cards in 4-column grid
```

### Tablet (768px - 1023px)

```
- 3-column filter grid (2 rows)
- Table scrollable horizontally
- Stats cards in 2-column grid
```

### Mobile (< 768px)

```
- Single column filter layout
- Table scrollable horizontally
- Stats cards in 2-column grid
- Reduced padding
```

## 🎯 Interactive Elements

### Sortable Columns

```
┌──────────────────────────┐
│ Element ⬍                │  ← Click to sort
├──────────────────────────┤
│ Full legal name          │
│ Alias                    │
│ Social Security number   │
└──────────────────────────┘

Click 1: Sort A → Z (ascending)
Click 2: Sort Z → A (descending)
Arrow rotates to indicate direction
```

### Filter Badges

```
Active Filters:
[Category: Financial] [Risk: High] [x Clear All]

Each filter shows as a badge
"Clear All" button removes all filters
Individual filters can be removed by changing dropdown
```

### Export Button

```
[Download] Export CSV

Click → Downloads CSV file:
  filename: pii-elements-2025-10-19.csv
  includes: All filtered/visible elements
  format: Standard CSV with headers
```

## 📱 Mobile View Preview

```
┌─────────────────────┐
│ 🛡️ PII Reference    │
│ Data                │
│ [Export CSV]        │
└─────────────────────┘

┌──────────┬──────────┐
│ Total    │ High     │
│ 161      │ 80       │
└──────────┴──────────┘
┌──────────┬──────────┐
│ Regulated│ Cats     │
│ 53       │ 14       │
└──────────┴──────────┘

┌─────────────────────┐
│ 🔍 Filters          │
├─────────────────────┤
│ [Search...]         │
│ [Category ▼]        │
│ [Risk Level ▼]      │
│ [Regulated ▼]       │
│ [Regulation ▼]      │
└─────────────────────┘

┌─────────────────────┐
│ PII Elements (161)  │
│                     │
│ [Scroll →]          │
│ ┌─────────────────┐ │
│ │ Element | Cat   │ │
│ │ ...........     │ │
│ └─────────────────┘ │
└─────────────────────┘
```

## 🎨 Theme Support

### Light Mode

- Background: White/Light gray
- Cards: White with subtle shadows
- Borders: Light gray
- Text: Dark gray/Black
- Badges: Colored with light backgrounds

### Dark Mode

- Background: Dark gray/Black
- Cards: Dark gray with subtle shadows
- Borders: Medium gray
- Text: White/Light gray
- Badges: Colored with dark backgrounds

## 🚀 Performance

### Initial Load

```
1. Page shell renders         → 0ms
2. Loading skeleton appears   → 0ms
3. Firestore query executes   → 50-200ms
4. Data processes and renders → 50-100ms
5. Animations complete        → 300ms

Total: < 650ms for full interactive page
```

### Filter/Search Performance

```
- Search: Instant (client-side)
- Filter: Instant (client-side)
- Sort: Instant (client-side)
- Export: < 100ms for 161 elements
```

## 📋 Accessibility

### Keyboard Navigation

- ✅ Tab through all interactive elements
- ✅ Enter to activate buttons
- ✅ Arrow keys in dropdowns
- ✅ Escape to close dropdowns

### Screen Reader Support

- ✅ ARIA labels on all interactive elements
- ✅ Table headers properly labeled
- ✅ Status messages announced
- ✅ Loading states announced

### Visual Accessibility

- ✅ High contrast colors
- ✅ Clear focus indicators
- ✅ Readable font sizes (14px+)
- ✅ Color not sole indicator (icons + text)

---

**Status**: ✅ Ready for Use  
**Route**: `/admin/reference/pii-elements`  
**Access**: Super Admin, Platform Admin





