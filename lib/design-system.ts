// Itqan Design System
// Inspired by clean, modern Quran learning platforms

export const colors = {
  // Primary - Deep green (Islamic theme)
  primary: {
    50: '#e8f5e9',
    100: '#c8e6c9',
    200: '#a5d6a7',
    300: '#81c784',
    400: '#66bb6a',
    500: '#1b5e20', // Main green
    600: '#145018',
    700: '#0d3f10',
    800: '#072f08',
    900: '#021f03',
  },
  
  // Secondary - Teal/Turquoise
  secondary: {
    50: '#e0f7fa',
    100: '#b2ebf2',
    200: '#80deea',
    300: '#4dd0e1',
    400: '#26c6da',
    500: '#00bcd4',
    600: '#00acc1',
    700: '#0097a7',
    800: '#00838f',
    900: '#006064',
  },

  // Neutral grays
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Semantic colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',

  // Background
  background: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#f0f4f8',
    dark: '#1a1a1a',
  },

  // Text
  text: {
    primary: '#1a1a1a',
    secondary: '#4a5568',
    tertiary: '#718096',
    inverse: '#ffffff',
    muted: '#a0aec0',
  },

  // Borders
  border: {
    light: '#e2e8f0',
    default: '#cbd5e0',
    dark: '#a0aec0',
  },
} as const;

export const typography = {
  fonts: {
    sans: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    arabic: 'var(--font-amiri), "Noto Naskh Arabic", "Scheherazade New", serif',
    mono: 'var(--font-geist-mono), "Courier New", monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },

  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeights: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
} as const;

export const spacing = {
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
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  base: '0.5rem',  // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// Component-specific styles
export const components = {
  // Card styles
  card: {
    base: 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
    hover: 'hover:shadow-md transition-shadow duration-200',
    clickable: 'cursor-pointer hover:shadow-lg hover:border-primary-300 transition-all duration-200',
  },

  // Button styles
  button: {
    base: 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    sizes: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
    variants: {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-sm',
      outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      ghost: 'text-primary-500 hover:bg-primary-50 focus:ring-primary-500',
      danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm',
    },
  },

  // Badge styles
  badge: {
    base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
    variants: {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
      neutral: 'bg-gray-100 text-gray-800',
      primary: 'bg-primary-100 text-primary-800',
    },
  },

  // Input styles
  input: {
    base: 'block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
  },

  // Stats card (like in the screenshots)
  statsCard: {
    container: 'bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow',
    icon: 'w-12 h-12 rounded-full flex items-center justify-center mb-4',
    iconPrimary: 'bg-primary-100 text-primary-600',
    iconSecondary: 'bg-secondary-100 text-secondary-600',
    iconSuccess: 'bg-green-100 text-green-600',
    iconWarning: 'bg-yellow-100 text-yellow-600',
    title: 'text-sm font-medium text-gray-600 mb-1',
    value: 'text-3xl font-bold text-gray-900',
  },

  // Feature card (like the 6 cards in screenshot 1)
  featureCard: {
    container: 'text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1',
    icon: 'w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center',
    iconBg: 'bg-primary-500',
    title: 'text-xl font-bold text-gray-900 mb-3',
    description: 'text-gray-600 leading-relaxed',
  },

  // Surah card (like in screenshot 2)
  surahCard: {
    container: 'bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-primary-300',
    header: 'flex items-center justify-between mb-2',
    badge: 'w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold',
    title: 'text-lg font-bold text-gray-900',
    subtitle: 'text-sm text-gray-500',
    favorite: 'text-gray-400 hover:text-red-500 transition-colors',
  },

  // Navigation
  nav: {
    link: 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200',
    linkActive: 'bg-primary-50 text-primary-600 font-medium',
  },
} as const;

// Animation variants
export const animations = {
  fadeIn: 'animate-in fade-in duration-200',
  slideIn: 'animate-in slide-in-from-bottom duration-300',
  scaleIn: 'animate-in zoom-in duration-200',
} as const;

// Breakpoints (for consistency with Tailwind)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;
