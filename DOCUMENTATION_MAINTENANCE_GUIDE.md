# Atraiva Documentation Maintenance Guide

## Overview

This guide explains how to add, update, and maintain documentation in the Atraiva platform. The documentation system uses Next.js with a custom layout and supports both **Public Documentation** (for general users) and **Support Documentation** (for authenticated platform users).

---

## Table of Contents

1. [Documentation Structure](#documentation-structure)
2. [Adding New Documentation Pages](#adding-new-documentation-pages)
3. [Page Format & Template](#page-format--template)
4. [Adding to Sidebar Navigation](#adding-to-sidebar-navigation)
5. [Styling Guidelines](#styling-guidelines)
6. [Content Best Practices](#content-best-practices)
7. [Code Examples](#code-examples)

---

## Documentation Structure

### Directory Layout

```
src/app/(docs)/docs/
├── layout.tsx                    # Root docs layout (pass-through)
├── public/                       # Public-facing documentation
│   ├── layout.tsx               # Public docs layout wrapper
│   ├── page.tsx                 # Public docs home
│   ├── getting-started/
│   │   └── introduction/
│   │       └── page.tsx
│   ├── faq/
│   │   └── page.tsx
│   └── user-guide/
│       └── page.tsx
│
└── support/                      # Authenticated support documentation
    ├── layout.tsx               # Support docs layout (with auth)
    ├── page.tsx                 # Support docs home
    ├── admin-guide/
    │   ├── page.tsx            # Admin guide index
    │   ├── user-management/
    │   │   └── page.tsx
    │   ├── organization-setup/
    │   │   └── page.tsx
    │   └── permissions/
    │       └── page.tsx
    ├── troubleshooting/
    │   ├── page.tsx            # Troubleshooting index
    │   ├── common-issues/
    │   │   └── page.tsx
    │   └── error-codes/
    │       └── page.tsx
    └── api-reference/
        ├── page.tsx            # API reference index
        ├── authentication/
        │   └── page.tsx
        ├── incidents/
        │   └── page.tsx
        ├── determinations/
        │   └── page.tsx
        └── ... (other API endpoints)
```

### Key Components

- **`DocsLayout.tsx`** - Main layout component in `src/components/docs/DocsLayout.tsx`
- **`DocsSidebar.tsx`** - Sidebar navigation component in `src/components/docs/DocsSidebar.tsx`
- **Navigation Config** - Defined in `DocsLayout.tsx` (lines 48-350 approximately)

---

## Adding New Documentation Pages

### Step 1: Create the Page File

Create a new `page.tsx` file in the appropriate directory:

```bash
# For public docs
src/app/(docs)/docs/public/[section-name]/page.tsx

# For support docs
src/app/(docs)/docs/support/[section-name]/page.tsx
```

**Example:** Adding a new "Security Guide" page under Support Docs:

```bash
src/app/(docs)/docs/support/security-guide/page.tsx
```

### Step 2: Use the Page Template

Copy and customize this template for your new page:

```typescript
import React from "react";

export default function YourPageName() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Your Page Title
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Brief description of what this page covers.
        </p>
      </div>

      {/* On This Page Navigation */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#section-1" className="text-primary hover:underline">
              Section 1 Name
            </a>
          </li>
          <li>
            <a href="#section-2" className="text-primary hover:underline">
              Section 2 Name
            </a>
          </li>
          {/* Add more sections */}
        </ul>
      </div>

      {/* Section 1 */}
      <div className="space-y-6" id="section-1">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Section 1 Name
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Your content here...
        </p>

        {/* Subsection */}
        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Subsection Title
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Subsection content...
          </p>
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-6" id="section-2">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Section 2 Name
        </h2>

        <p className="text-sm sm:text-base text-foreground leading-relaxed">
          Your content here...
        </p>
      </div>

      {/* Add more sections as needed */}
    </div>
  );
}

export const metadata = {
  title: "Your Page Title - Atraiva Support",
  description: "Brief description for SEO",
};
```

### Step 3: Add Navigation Entry

Edit `src/components/docs/DocsLayout.tsx` and add your page to the appropriate navigation array:

**For Public Docs** - Edit the `publicNavigation` array (around line 48):

```typescript
const publicNavigation: NavItem[] = [
  // ... existing items
  {
    title: "Your New Section",
    href: "/docs/public/your-section",
    icon: <YourIcon className="w-4 h-4" />,
    children: [
      {
        title: "Subsection 1",
        href: "/docs/public/your-section#subsection-1",
      },
      {
        title: "Subsection 2",
        href: "/docs/public/your-section#subsection-2",
      },
    ],
  },
];
```

**For Support Docs** - Edit the `supportNavigation` array (around line 68):

```typescript
const supportNavigation: NavItem[] = [
  // ... existing items
  {
    title: "Your New Section",
    href: "/docs/support/your-section",
    icon: <YourIcon className="w-4 h-4" />,
    children: [
      {
        title: "Subsection 1",
        href: "/docs/support/your-section#subsection-1",
      },
      {
        title: "Subsection 2",
        href: "/docs/support/your-section#subsection-2",
      },
    ],
  },
];
```

### Step 4: Test Your Changes

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to your new page:**
   - Public: `http://localhost:3000/docs/public/your-section`
   - Support: `http://localhost:3000/docs/support/your-section`

3. **Verify:**
   - Page renders correctly
   - Sidebar navigation shows your page
   - "On This Page" links work
   - Anchor links scroll to correct sections
   - Responsive design works on mobile

---

## Page Format & Template

### Essential Elements

Every documentation page should include:

1. **Header Section** - Title and description
2. **"On This Page" Navigation** - Quick links to sections
3. **Main Content Sections** - With anchor IDs
4. **Metadata** - For SEO and page titles

### Section Structure

```typescript
<div className="space-y-6" id="unique-section-id">
  {/* H2 - Main Section Title */}
  <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
    Section Title
  </h2>

  {/* H3 - Subsection Title */}
  <div className="space-y-4">
    <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
      Subsection Title
    </h3>

    {/* Body Text */}
    <p className="text-sm sm:text-base text-foreground leading-relaxed">
      Your content here...
    </p>
  </div>
</div>
```

### Anchor ID Naming

- Use lowercase with hyphens
- Be descriptive but concise
- Examples:
  - ✅ `#getting-started`
  - ✅ `#user-management`
  - ✅ `#api-authentication`
  - ❌ `#section1`
  - ❌ `#GetStarted`

---

## Adding to Sidebar Navigation

### Navigation Item Structure

```typescript
interface NavItem {
  title: string;           // Display name in sidebar
  href: string;            // Full path to page or section
  icon?: React.ReactNode;  // Optional icon (parent items only)
  children?: NavItem[];    // Nested items
}
```

### Single-Level Item (No Children)

```typescript
{
  title: "FAQ",
  href: "/docs/public/faq",
  icon: <HelpCircle className="w-4 h-4" />,
}
```

### Multi-Level Item (With Children)

```typescript
{
  title: "Admin Guide",
  href: "/docs/support/admin-guide",
  icon: <Shield className="w-4 h-4" />,
  children: [
    {
      title: "User Management",
      href: "/docs/support/admin-guide/user-management",
      children: [
        {
          title: "Adding Users",
          href: "/docs/support/admin-guide/user-management#adding-users",
        },
        {
          title: "Managing Roles",
          href: "/docs/support/admin-guide/user-management#managing-roles",
        },
      ],
    },
  ],
}
```

### Available Icons

Import from Lucide React:

```typescript
import {
  Home,          // 🏠 Home/Dashboard
  BookOpen,      // 📖 Documentation
  HelpCircle,    // ❓ Help/FAQ
  Shield,        // 🛡️ Security/Admin
  Settings,      // ⚙️ Settings
  LogOut,        // 🚪 Logout
  LayoutDashboard, // 📊 Dashboard
} from "lucide-react";
```

---

## Styling Guidelines

### Typography

```typescript
{/* H1 - Page Title */}
<h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">

{/* H2 - Main Section */}
<h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">

{/* H3 - Subsection */}
<h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">

{/* H4 - Minor Heading */}
<h4 className="scroll-m-20 text-lg sm:text-xl font-semibold text-foreground">

{/* Body Text */}
<p className="text-sm sm:text-base text-foreground leading-relaxed">

{/* Muted Text */}
<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
```

### Lists

```typescript
{/* Ordered List */}
<ol className="space-y-2 list-decimal list-inside text-sm sm:text-base text-foreground ml-4">
  <li>First item</li>
  <li>Second item</li>
</ol>

{/* Unordered List */}
<ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground ml-4">
  <li>Bullet item</li>
  <li>Another item</li>
</ul>
```

### Tables

```typescript
<div className="overflow-x-auto rounded-lg border border-border">
  <table className="w-full text-sm">
    <thead className="bg-muted">
      <tr>
        <th className="border-b border-border p-3 text-left font-semibold text-foreground">
          Column 1
        </th>
        <th className="border-b border-border p-3 text-left font-semibold text-foreground">
          Column 2
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-border">
      <tr className="hover:bg-muted/50 transition-colors">
        <td className="p-3 font-medium text-foreground">Value 1</td>
        <td className="p-3 text-muted-foreground">Value 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Callout Boxes

```typescript
{/* Info Box (Blue) */}
<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
  <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 font-semibold mb-2">
    💡 Pro Tip
  </p>
  <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
    Your tip here...
  </p>
</div>

{/* Warning Box (Yellow) */}
<div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 sm:p-6 rounded-r">
  <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 font-semibold mb-2">
    ⚠️ Warning
  </p>
  <p className="text-sm sm:text-base text-yellow-700 dark:text-yellow-300 leading-relaxed">
    Your warning here...
  </p>
</div>

{/* Critical Box (Red) */}
<div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 sm:p-6 rounded-r">
  <p className="text-sm sm:text-base text-red-700 dark:text-red-300 font-semibold mb-2">
    🚨 Critical
  </p>
  <p className="text-sm sm:text-base text-red-700 dark:text-red-300 leading-relaxed">
    Your critical message here...
  </p>
</div>
```

### Cards

```typescript
{/* Single Card */}
<div className="border border-border rounded-lg p-4 space-y-2">
  <h4 className="font-semibold text-foreground">Card Title</h4>
  <p className="text-sm text-muted-foreground">Card description...</p>
</div>

{/* Card Grid */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="border border-border rounded-lg p-4 space-y-2 hover:bg-muted/50 transition-colors">
    <h4 className="font-semibold text-foreground flex items-center gap-2">
      🎯 Card 1
    </h4>
    <p className="text-xs text-muted-foreground">Description</p>
  </div>
  {/* More cards */}
</div>
```

### Code Blocks

```typescript
{/* Inline Code */}
<code className="bg-muted px-2 py-0.5 rounded text-sm">inline code</code>

{/* Code Block */}
<div className="bg-muted rounded-lg p-4 overflow-x-auto">
  <pre className="text-xs sm:text-sm font-mono text-foreground">
    {`Your code here...`}
  </pre>
</div>
```

---

## Content Best Practices

### Writing Style

1. **Be Clear and Concise**
   - Use simple language
   - Avoid jargon where possible
   - Define technical terms on first use

2. **Use Active Voice**
   - ✅ "Click the button to save"
   - ❌ "The button should be clicked to save"

3. **Be Specific**
   - ✅ "Navigate to Settings → API Keys"
   - ❌ "Go to the settings page"

4. **Structure for Scanning**
   - Use headings to break up content
   - Include bullet points and numbered lists
   - Highlight important information

### Content Organization

1. **Start with Overview**
   - What this page covers
   - Who should read it
   - Prerequisites (if any)

2. **Use Logical Flow**
   - Getting Started → Basic Concepts → Advanced Topics
   - Problem → Solution → Best Practices

3. **Include Examples**
   - Code samples
   - Screenshots (if applicable)
   - Real-world scenarios

4. **End with Next Steps**
   - Related documentation
   - Support resources
   - Further reading

### Accessibility

1. **Use Semantic HTML**
   - Proper heading hierarchy (h1 → h2 → h3)
   - Descriptive link text
   - Alt text for images (when added)

2. **Ensure Readability**
   - Sufficient color contrast
   - Responsive text sizing
   - Adequate line spacing

3. **Support Navigation**
   - Skip links work properly
   - Anchor links are descriptive
   - Keyboard navigation functions

---

## Code Examples

### Adding a Complete New Section

Here's a full example of adding a "Security Best Practices" page:

**1. Create the file:**
```bash
src/app/(docs)/docs/support/security/page.tsx
```

**2. Add the content:**
```typescript
import React from "react";

export default function SecurityBestPractices() {
  return (
    <div className="max-w-4xl w-full space-y-8">
      <div className="space-y-4">
        <h1 className="scroll-m-20 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Security Best Practices
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Essential security practices for managing your Atraiva organization.
        </p>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold text-base mb-3 text-foreground">
          On This Page
        </h3>
        <ul className="space-y-2 text-sm">
          <li>
            <a href="#authentication" className="text-primary hover:underline">
              Authentication Security
            </a>
          </li>
          <li>
            <a href="#data-protection" className="text-primary hover:underline">
              Data Protection
            </a>
          </li>
          <li>
            <a href="#access-control" className="text-primary hover:underline">
              Access Control
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-6" id="authentication">
        <h2 className="scroll-m-20 text-2xl sm:text-3xl font-semibold text-foreground border-b pb-2">
          Authentication Security
        </h2>

        <div className="space-y-4">
          <h3 className="scroll-m-20 text-xl sm:text-2xl font-semibold text-foreground">
            Multi-Factor Authentication
          </h3>

          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            Enable MFA for all users, especially those with administrative privileges.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 leading-relaxed">
              <strong>Tip:</strong> Organizations with MFA enabled see 99.9% 
              reduction in account compromise incidents.
            </p>
          </div>
        </div>
      </div>

      {/* More sections... */}
    </div>
  );
}

export const metadata = {
  title: "Security Best Practices - Atraiva Support",
  description: "Essential security practices for managing your Atraiva organization",
};
```

**3. Add to navigation in `DocsLayout.tsx`:**
```typescript
const supportNavigation: NavItem[] = [
  // ... existing items
  {
    title: "Security",
    href: "/docs/support/security",
    icon: <Shield className="w-4 h-4" />,
    children: [
      {
        title: "Authentication Security",
        href: "/docs/support/security#authentication",
      },
      {
        title: "Data Protection",
        href: "/docs/support/security#data-protection",
      },
      {
        title: "Access Control",
        href: "/docs/support/security#access-control",
      },
    ],
  },
];
```

---

## Maintenance Checklist

When adding or updating documentation:

- [ ] File created in correct directory
- [ ] Page uses consistent template
- [ ] "On This Page" navigation included
- [ ] All sections have unique anchor IDs
- [ ] Added to sidebar navigation
- [ ] Metadata (title/description) set
- [ ] Content is clear and concise
- [ ] Code examples formatted properly
- [ ] Callout boxes used appropriately
- [ ] Tables are responsive
- [ ] Links tested (internal and external)
- [ ] Tested on desktop and mobile
- [ ] Dark mode appearance verified
- [ ] No linter errors

---

## Getting Help

If you need assistance with documentation:

- **Review existing pages** for format examples
- **Check this guide** for templates and patterns
- **Test locally** before deploying
- **Contact the development team** for complex changes

---

## Version History

- **v1.0** - Initial documentation system setup (November 2024)
  - Public and Support documentation sections
  - Collapsible tree navigation
  - Responsive design
  - Dark mode support
  - Role-based access for support docs

