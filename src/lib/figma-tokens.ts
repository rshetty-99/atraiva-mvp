/**
 * Figma Design Tokens
 * Update these values based on your exact Figma design
 */

// Extract these exact values from your Figma design
export const figmaTokens = {
  // Colors - Update with exact Figma color values
  colors: {
    primary: {
      50: '#f0fdfc',
      100: '#ccfbf1',
      500: '#4ECDC4', // Current Atraiva teal - update if different
      600: '#2dd4bf',
      700: '#0f766e',
      900: '#134e4a',
    },
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#6C7CE7', // Current Atraiva blue - update if different
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a',
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    // Add any additional colors from your Figma design
  },

  // Typography - Update with exact Figma typography
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
      // Add custom fonts from Figma if different
    },
    fontSize: {
      // Update these with exact Figma font sizes
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem',     // 128px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
  },

  // Spacing - Update with exact Figma spacing values
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    // Add custom spacing values from Figma
  },

  // Border Radius - Update with exact Figma corner radius values
  borderRadius: {
    none: '0',
    sm: '0.125rem',    // 2px
    base: '0.25rem',   // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
    // Add custom border radius from Figma
  },

  // Shadows - Update with exact Figma shadow values
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // Add custom shadows from Figma
  },

  // Animation - Update with exact Figma animation timings
  animation: {
    duration: {
      fast: '150ms',
      base: '300ms',
      slow: '500ms',
      slower: '750ms',
    },
    easing: {
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
      // Custom easing curves from Figma prototypes
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
  },
};

/**
 * Helper function to get color value
 */
export function getColor(colorPath: string): string {
  const paths = colorPath.split('.');
  let value: any = figmaTokens.colors;

  for (const path of paths) {
    value = value?.[path];
  }

  return value || '#000000';
}

/**
 * Helper function to get spacing value
 */
export function getSpacing(key: string): string {
  return figmaTokens.spacing[key as keyof typeof figmaTokens.spacing] || '0';
}

/**
 * Helper function to create CSS custom properties
 */
export function createCSSCustomProperties(): Record<string, string> {
  return {
    // Colors
    '--color-primary-50': getColor('primary.50'),
    '--color-primary-500': getColor('primary.500'),
    '--color-primary-900': getColor('primary.900'),
    '--color-secondary-50': getColor('secondary.50'),
    '--color-secondary-500': getColor('secondary.500'),
    '--color-secondary-900': getColor('secondary.900'),

    // Add more custom properties as needed
    '--border-radius-base': figmaTokens.borderRadius.base,
    '--border-radius-lg': figmaTokens.borderRadius.lg,
    '--border-radius-xl': figmaTokens.borderRadius.xl,

    '--shadow-sm': figmaTokens.boxShadow.sm,
    '--shadow-md': figmaTokens.boxShadow.md,
    '--shadow-lg': figmaTokens.boxShadow.lg,
  };
}

/**
 * Component variant system based on Figma components
 */
export const componentVariants = {
  button: {
    primary: {
      backgroundColor: getColor('primary.500'),
      color: 'white',
      borderRadius: figmaTokens.borderRadius.lg,
      fontSize: figmaTokens.typography.fontSize.base,
      fontWeight: figmaTokens.typography.fontWeight.semibold,
      padding: `${getSpacing('3')} ${getSpacing('6')}`,
      boxShadow: figmaTokens.boxShadow.md,
    },
    secondary: {
      backgroundColor: 'transparent',
      color: getColor('neutral.700'),
      border: `2px solid ${getColor('neutral.300')}`,
      borderRadius: figmaTokens.borderRadius.lg,
      fontSize: figmaTokens.typography.fontSize.base,
      fontWeight: figmaTokens.typography.fontWeight.semibold,
      padding: `${getSpacing('3')} ${getSpacing('6')}`,
    },
  },
  card: {
    default: {
      backgroundColor: 'white',
      borderRadius: figmaTokens.borderRadius['2xl'],
      boxShadow: figmaTokens.boxShadow.lg,
      border: `1px solid ${getColor('neutral.200')}`,
      padding: getSpacing('8'),
    },
  },
  // Add more component variants as needed
};

/**
 * Responsive breakpoints matching Figma design
 */
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  // Add custom breakpoints from Figma if needed
};