# Hero Section Update Guide

## Step-by-Step Process to Match Figma Design

### Step 1: Extract Hero Section Elements from Figma
Open your Figma design and identify these elements in the hero section:

#### Typography Elements
- [ ] Main headline font size, weight, color
- [ ] Subheadline/description font size, weight, color
- [ ] Button text font size, weight
- [ ] Badge/announcement text styling

#### Layout Elements
- [ ] Section padding and margins
- [ ] Text alignment and spacing
- [ ] Button positioning and spacing
- [ ] Stats/metrics layout and spacing

#### Visual Elements
- [ ] Background color/gradient
- [ ] Button colors (primary, secondary, hover states)
- [ ] Badge/pill styling and colors
- [ ] Any decorative elements or shapes

#### Interactive Elements
- [ ] Button hover effects
- [ ] Animation timings
- [ ] Scroll indicators

### Step 2: Update Hero Component

Replace or update your current `src/components/home/Hero.tsx` with the extracted values:

```typescript
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Update with your Figma background */}
      <div className="absolute inset-0" style={{
        background: '[EXACT_BACKGROUND_FROM_FIGMA]', // Replace with Figma value
      }}>
        {/* Add any background shapes or elements from Figma */}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">

          {/* Badge/Announcement - Update styling to match Figma */}
          <div
            className="inline-flex items-center mb-8"
            style={{
              backgroundColor: '[FIGMA_BADGE_BG_COLOR]',
              color: '[FIGMA_BADGE_TEXT_COLOR]',
              padding: '[FIGMA_BADGE_PADDING]',
              borderRadius: '[FIGMA_BADGE_RADIUS]',
              fontSize: '[FIGMA_BADGE_FONT_SIZE]',
              fontWeight: '[FIGMA_BADGE_FONT_WEIGHT]',
              // Add other Figma properties
            }}
          >
            <span>AI-Powered Data Breach Compliance</span>
          </div>

          {/* Main Headline - Update to match Figma exactly */}
          <h1
            className="mb-8 leading-tight"
            style={{
              fontSize: '[FIGMA_H1_FONT_SIZE]',     // e.g., '72px'
              fontWeight: '[FIGMA_H1_FONT_WEIGHT]', // e.g., '700'
              color: '[FIGMA_H1_COLOR]',             // e.g., '#1a202c'
              lineHeight: '[FIGMA_H1_LINE_HEIGHT]', // e.g., '1.1'
              marginBottom: '[FIGMA_H1_MARGIN]',     // e.g., '32px'
              // Add other Figma properties like letter-spacing
            }}
          >
            {/* Update headline text to match Figma */}
            Protect Your Data.
            <br />
            Ensure Compliance.
            <br />
            Automate Everything.
          </h1>

          {/* Subtitle - Update to match Figma */}
          <p
            className="mb-12 mx-auto"
            style={{
              fontSize: '[FIGMA_SUBTITLE_FONT_SIZE]',
              fontWeight: '[FIGMA_SUBTITLE_FONT_WEIGHT]',
              color: '[FIGMA_SUBTITLE_COLOR]',
              maxWidth: '[FIGMA_SUBTITLE_MAX_WIDTH]',
              lineHeight: '[FIGMA_SUBTITLE_LINE_HEIGHT]',
              marginBottom: '[FIGMA_SUBTITLE_MARGIN]',
            }}
          >
            {/* Update subtitle text to match Figma */}
            Streamline data breach notification compliance with AI-powered automation.
          </p>

          {/* CTA Buttons - Update styling to match Figma */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <SignUpButton>
              <Button
                className="group"
                style={{
                  backgroundColor: '[FIGMA_PRIMARY_BTN_BG]',
                  color: '[FIGMA_PRIMARY_BTN_TEXT]',
                  fontSize: '[FIGMA_BTN_FONT_SIZE]',
                  fontWeight: '[FIGMA_BTN_FONT_WEIGHT]',
                  padding: '[FIGMA_BTN_PADDING]',      // e.g., '16px 48px'
                  borderRadius: '[FIGMA_BTN_RADIUS]',   // e.g., '16px'
                  boxShadow: '[FIGMA_BTN_SHADOW]',     // if any
                  minHeight: '[FIGMA_BTN_HEIGHT]',     // e.g., '56px'
                }}
              >
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>

            <Button
              variant="outline"
              className="group"
              style={{
                backgroundColor: '[FIGMA_SECONDARY_BTN_BG]',
                color: '[FIGMA_SECONDARY_BTN_TEXT]',
                borderColor: '[FIGMA_SECONDARY_BTN_BORDER]',
                fontSize: '[FIGMA_BTN_FONT_SIZE]',
                fontWeight: '[FIGMA_BTN_FONT_WEIGHT]',
                padding: '[FIGMA_BTN_PADDING]',
                borderRadius: '[FIGMA_BTN_RADIUS]',
                minHeight: '[FIGMA_BTN_HEIGHT]',
              }}
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats - Update layout and styling to match Figma */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 mx-auto"
            style={{
              maxWidth: '[FIGMA_STATS_MAX_WIDTH]',
              marginBottom: '[FIGMA_STATS_MARGIN]',
            }}
          >
            {/* Update each stat item styling */}
            <div className="text-center">
              <div
                style={{
                  fontSize: '[FIGMA_STAT_NUMBER_SIZE]',
                  fontWeight: '[FIGMA_STAT_NUMBER_WEIGHT]',
                  color: '[FIGMA_STAT_NUMBER_COLOR]',
                  marginBottom: '[FIGMA_STAT_SPACING]',
                }}
              >
                70%
              </div>
              <div
                style={{
                  fontSize: '[FIGMA_STAT_LABEL_SIZE]',
                  fontWeight: '[FIGMA_STAT_LABEL_WEIGHT]',
                  color: '[FIGMA_STAT_LABEL_COLOR]',
                }}
              >
                Faster Response
              </div>
            </div>
            {/* Repeat for other stats with Figma values */}
          </div>

        </div>
      </div>
    </section>
  );
}
```

### Step 3: Replace Placeholder Values

For each `[FIGMA_*]` placeholder, replace with the exact value from your Figma design:

#### Color Examples
```typescript
// Replace placeholders like:
'[FIGMA_H1_COLOR]'
// With exact Figma values like:
'#1a202c'  // or whatever your Figma design shows
```

#### Size Examples
```typescript
// Replace placeholders like:
'[FIGMA_H1_FONT_SIZE]'
// With exact Figma values like:
'72px'  // or whatever your Figma design shows
```

#### Spacing Examples
```typescript
// Replace placeholders like:
'[FIGMA_BTN_PADDING]'
// With exact Figma values like:
'16px 48px'  // or whatever your Figma design shows
```

### Step 4: Test and Refine

1. **Save the file** and view the updated hero section
2. **Take a screenshot** of your implementation
3. **Compare side-by-side** with your Figma design
4. **Adjust any values** that don't match exactly
5. **Test responsive behavior** on different screen sizes

### Step 5: Common Adjustments

After the initial update, you might need to fine-tune:

- **Line heights** might need adjustment for better text rendering
- **Colors** might look different due to browser rendering
- **Spacing** might need pixel-perfect adjustments
- **Font rendering** might vary between Figma and browser

### Quick Extraction Tips

When inspecting your Figma design:

1. **Right-click** any element → "Inspect"
2. **Copy CSS** properties directly when available
3. **Note responsive variants** for different screen sizes
4. **Document hover states** and animations
5. **Extract exact asset sizes** for images/icons

### Validation Checklist

- [ ] Headline matches Figma typography exactly
- [ ] Buttons match Figma styling and sizing
- [ ] Background matches Figma design
- [ ] Spacing between elements is accurate
- [ ] Colors are exact matches
- [ ] Mobile responsive behavior works
- [ ] Hover states match Figma prototypes