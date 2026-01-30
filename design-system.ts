/**
 * Design System Configuration
 * Central source of truth for colors, typography, and design tokens
 */

export const colors = {
  // Primary Dark Blue Palette
  primary: {
    50: '#e6f0ff',
    100: '#b3d1ff',
    200: '#80b3ff',
    300: '#4d94ff',
    400: '#1a75ff',
    500: '#0057e6',  // Main brand color
    600: '#0045b3',
    700: '#003380',
    800: '#00214d',
    900: '#000f1a',
  },
  
  // Background Dark Blues
  background: {
    primary: '#0a0e1a',    // Darkest - main background
    secondary: '#0f1525',  // Card backgrounds
    tertiary: '#151d30',   // Hover states
    elevated: '#1a2438',   // Elevated elements
  },
  
  // Accent Colors
  accent: {
    blue: '#3b82f6',
    cyan: '#06b6d4',
    purple: '#8b5cf6',
    pink: '#ec4899',
  },
  
  // Semantic Colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Text Colors
  text: {
    primary: '#f8fafc',
    secondary: '#cbd5e1',
    tertiary: '#94a3b8',
    muted: '#64748b',
  },
  
  // Border Colors
  border: {
    primary: 'rgba(59, 130, 246, 0.1)',
    secondary: 'rgba(59, 130, 246, 0.2)',
    accent: 'rgba(59, 130, 246, 0.3)',
  },
} as const;

export const typography = {
  fonts: {
    display: '"Bricolage Grotesque", "Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"Fira Code", "JetBrains Mono", monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
} as const;

export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
  '5xl': '8rem',  // 128px
} as const;

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(59, 130, 246, 0.3)',
  glowLg: '0 0 40px rgba(59, 130, 246, 0.4)',
} as const;

export const animations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  
  easings: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;