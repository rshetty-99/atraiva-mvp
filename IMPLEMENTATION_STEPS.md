# Figma Design Implementation Steps

## Phase 1: Extract Design Tokens from Figma

### Step 1: Colors
1. Open your Figma design
2. Select each color element and note exact hex values
3. Update `src/lib/figma-tokens.ts` with actual colors
4. Update `src/app/globals.css` CSS custom properties

### Step 2: Typography
1. Note font families, sizes, weights from Figma text styles
2. Update typography section in `figma-tokens.ts`
3. Add any custom fonts to your project

### Step 3: Spacing and Layout
1. Measure padding, margins, and gaps in Figma
2. Note component spacing and grid structures
3. Update spacing values in `figma-tokens.ts`

### Step 4: Components
1. Extract button styles, card designs, form elements
2. Note hover states and interactions
3. Update component variants in `figma-tokens.ts`

## Phase 2: Update Components Systematically

### Header Component
```bash
# Current file: src/components/home/Header.tsx
```

**Update checklist:**
- [ ] Logo size and positioning
- [ ] Navigation typography and spacing
- [ ] Button styles match Figma
- [ ] Mobile menu design
- [ ] Scroll behavior styling

### Hero Section
```bash
# Current file: src/components/home/Hero.tsx
# Example: src/components/home/HeroModern.tsx (created)
```

**Update checklist:**
- [ ] Headline typography hierarchy
- [ ] CTA button styling
- [ ] Background design/gradients
- [ ] Stats layout and styling
- [ ] Badge/announcement design
- [ ] Trust indicators layout

### Features Section
```bash
# Current file: src/components/home/Features.tsx
```

**Update checklist:**
- [ ] Card design and spacing
- [ ] Icon styles and backgrounds
- [ ] Grid layout adjustments
- [ ] Section header styling
- [ ] Hover states and animations

### Social Proof Section
```bash
# Current file: src/components/home/SocialProof.tsx
```

**Update checklist:**
- [ ] Testimonial card redesign
- [ ] Metrics display styling
- [ ] Customer logo treatments
- [ ] Rating display format

## Phase 3: Implementation Process

### Step 1: Update Global Styles
```css
/* Add to src/app/globals.css */
:root {
  /* Update these with your exact Figma colors */
  --figma-primary: #[EXACT_HEX_FROM_FIGMA];
  --figma-secondary: #[EXACT_HEX_FROM_FIGMA];
  --figma-accent: #[EXACT_HEX_FROM_FIGMA];

  /* Typography */
  --figma-font-primary: '[FONT_FROM_FIGMA]', system-ui, sans-serif;
  --figma-font-secondary: '[SECONDARY_FONT]', sans-serif;

  /* Spacing */
  --figma-space-xs: [VALUE]px;
  --figma-space-sm: [VALUE]px;
  --figma-space-md: [VALUE]px;
  --figma-space-lg: [VALUE]px;
  --figma-space-xl: [VALUE]px;
}
```

### Step 2: Create Component Update Template
```typescript
// Template for updating existing components
"use client";

import { motion } from "framer-motion";
import { figmaTokens } from "@/lib/figma-tokens";

export default function UpdatedComponent() {
  return (
    <section
      className="py-24"
      style={{
        backgroundColor: figmaTokens.colors.neutral[50],
        // Add other Figma-extracted styles
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Update content to match Figma */}
      </div>
    </section>
  );
}
```

### Step 3: Update Each Component
1. **Start with Header**: Most visible, affects all pages
2. **Update Hero**: Primary conversion element
3. **Update Features**: Core value proposition
4. **Update Social Proof**: Trust building
5. **Continue with remaining sections**

### Step 4: Test and Refine
1. Take screenshots of each updated component
2. Compare side-by-side with Figma
3. Adjust any pixel-perfect details
4. Test responsive behavior
5. Validate accessibility

## Phase 4: Quality Assurance

### Visual Comparison
- [ ] Use browser dev tools to measure exact pixels
- [ ] Color picker to verify exact color matches
- [ ] Typography matches exactly (size, weight, spacing)
- [ ] Spacing matches Figma measurements

### Responsive Testing
- [ ] Mobile (375px, 414px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1440px, 1920px)
- [ ] Large screens (2560px+)

### Interactive Testing
- [ ] Hover states match Figma prototypes
- [ ] Button interactions work correctly
- [ ] Animations timing matches prototypes
- [ ] Form interactions as designed

### Performance Check
- [ ] Lighthouse performance score > 90
- [ ] Core Web Vitals pass
- [ ] Images optimized
- [ ] Bundle size reasonable

## Code Examples

### Extracting Exact Colors from Figma
```typescript
// In figma-tokens.ts, replace placeholder values
export const figmaColors = {
  primary: {
    // Replace with exact values from Figma
    50: '#f0f9ff',  // Light variant from Figma
    500: '#3b82f6', // Main primary from Figma
    900: '#1e3a8a', // Dark variant from Figma
  },
  // Continue for all colors...
};
```

### Using Figma Typography
```typescript
// Extract exact typography from Figma
export const figmaTypography = {
  heading1: {
    fontSize: '48px',      // Exact size from Figma
    fontWeight: '700',     // Exact weight from Figma
    lineHeight: '52px',    // Exact line height from Figma
    letterSpacing: '-0.02em', // If specified in Figma
  },
  // Continue for all text styles...
};
```

### Component Update Pattern
```typescript
// Before (current)
<h1 className="text-5xl md:text-7xl font-bold">
  Headline Text
</h1>

// After (Figma-matched)
<h1
  className="font-bold leading-tight"
  style={{
    fontSize: figmaTokens.typography.fontSize['7xl'],
    fontWeight: figmaTokens.typography.fontWeight.bold,
    color: figmaTokens.colors.neutral[900],
    // Add exact spacing and other properties from Figma
  }}
>
  Headline Text
</h1>
```

## Tools and Resources

### Figma Inspection
- Use Figma's "Inspect" panel for exact CSS values
- Copy properties directly when possible
- Note custom easing curves from prototypes

### Browser Developer Tools
- Use pixel ruler for measurements
- Color picker for verification
- Responsive device simulation

### Design Token Management
- Consider using style-dictionary for token management
- Document all design decisions
- Create design system documentation

## Validation Checklist

### Pre-Launch
- [ ] All components match Figma design exactly
- [ ] Responsive behavior works on all devices
- [ ] Performance metrics meet standards
- [ ] Accessibility compliance maintained
- [ ] Cross-browser compatibility verified

### Post-Launch
- [ ] User testing to validate design improvements
- [ ] Analytics to measure conversion improvements
- [ ] Feedback collection on new design
- [ ] Performance monitoring
- [ ] Continuous refinement based on data