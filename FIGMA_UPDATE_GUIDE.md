# Figma Design Implementation Guide

## Overview
This guide helps update the Atraiva home page components to match the Figma design exactly.

## Manual Design Extraction Steps

### 1. Extract Design Tokens from Figma
- **Colors**: Note exact hex/RGB values for all colors
- **Typography**: Document font families, sizes, weights, line heights
- **Spacing**: Measure padding, margins, and gaps
- **Border Radius**: Note corner radius values
- **Shadows**: Extract box-shadow values and blur amounts

### 2. Component-by-Component Analysis

#### Header Component Updates Needed:
- Logo size and positioning
- Navigation font weights and spacing
- Button styles and dimensions
- Mobile menu design
- Scroll behavior styling

#### Hero Section Updates Needed:
- Headline typography hierarchy
- CTA button styling and positioning
- Background gradients or images
- Stats layout and styling
- Badge/pill component design

#### Features Section Updates Needed:
- Card design and spacing
- Icon styles and backgrounds
- Grid layout and responsive behavior
- Section header styling
- Hover states and animations

#### Social Proof Updates Needed:
- Testimonial card design
- Metrics display styling
- Customer logo treatments
- Rating display format

### 3. Implementation Process

#### Step 1: Update CSS Variables
Update `src/app/globals.css` with exact Figma colors:

```css
:root {
  --primary: [FIGMA_PRIMARY_COLOR];
  --secondary: [FIGMA_SECONDARY_COLOR];
  --accent: [FIGMA_ACCENT_COLOR];
  /* Add other extracted colors */
}
```

#### Step 2: Update Typography Scale
Add custom font sizes and weights that match Figma:

```css
.figma-h1 { font-size: [EXACT_SIZE]; font-weight: [WEIGHT]; }
.figma-h2 { font-size: [EXACT_SIZE]; font-weight: [WEIGHT]; }
/* Continue for all headings and body text */
```

#### Step 3: Update Components Systematically
- Start with Header
- Move to Hero section
- Update each section in order
- Test responsive behavior at each step

#### Step 4: Verify Exact Match
- Take screenshots of implementation
- Compare side-by-side with Figma
- Adjust pixel-perfect details
- Test across all device sizes

## Common Figma-to-Code Translation Issues

### Typography
- Figma uses different font rendering than browsers
- Line-height values may need adjustment
- Letter spacing might need fine-tuning

### Colors
- Figma RGB values need conversion to CSS format
- Opacity/alpha values need proper CSS syntax
- Gradients require exact angle and stop positions

### Spacing
- Figma's auto-layout needs translation to CSS Grid/Flexbox
- Padding and margins may not match exactly
- Component spacing needs manual adjustment

### Animations
- Figma prototypes need translation to Framer Motion
- Easing curves may need custom CSS cubic-bezier values
- Timing and delays need manual specification

## Validation Checklist

### Visual Accuracy
- [ ] Colors match exactly (use color picker to verify)
- [ ] Typography sizes and weights are identical
- [ ] Spacing matches Figma measurements
- [ ] Border radius values are correct
- [ ] Shadows and effects match

### Responsive Behavior
- [ ] Mobile layout matches Figma mobile frames
- [ ] Tablet behavior is appropriate
- [ ] Desktop layout is pixel-perfect
- [ ] Large screen adaptations work well

### Interactive States
- [ ] Hover effects match Figma prototypes
- [ ] Button states are identical
- [ ] Form interactions work as designed
- [ ] Animation timing matches prototypes

### Accessibility
- [ ] Color contrast meets WCAG standards
- [ ] Focus indicators are visible
- [ ] Screen reader compatibility maintained
- [ ] Keyboard navigation works properly

## Tools for Accurate Implementation

### Browser Developer Tools
- Use pixel ruler for exact measurements
- Color picker for verification
- Responsive testing for breakpoints

### Figma Inspect
- Copy CSS properties directly
- Measure distances accurately
- Extract assets at correct sizes

### Design Tokens
- Create systematic token files
- Use consistent naming conventions
- Document all design decisions