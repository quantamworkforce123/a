// Onion Pink & Onion Blue Color Palette for N8N Clone
export const colors = {
  // Primary Colors (Onion Pink)
  primary: {
    50: '#fef7f5',
    100: '#feede6',
    200: '#fcd9cc',
    300: '#f9baa8',
    400: '#f59173',
    500: '#ee6447', // Main onion pink
    600: '#d94c2f',
    700: '#b53e24',
    800: '#943623',
    900: '#7a3121',
  },
  
  // Secondary Colors (Onion Blue)
  secondary: {
    50: '#f0f6ff',
    100: '#e0eaff',
    200: '#c7d9ff',
    300: '#a5bfff',
    400: '#8196ff',
    500: '#626eff', // Main onion blue
    600: '#4c46f5',
    700: '#4136e0',
    800: '#362db6',
    900: '#312a90',
  },
  
  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#0a0e1a',
  },
  
  // Status Colors
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    600: '#059669',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    600: '#dc2626',
  },
  
  // Glassmorphism Colors
  glass: {
    primary: 'rgba(238, 100, 71, 0.1)', // Onion pink glass
    secondary: 'rgba(98, 110, 255, 0.1)', // Onion blue glass
    white: 'rgba(255, 255, 255, 0.1)',
    black: 'rgba(0, 0, 0, 0.1)',
  }
};

// Gradient combinations
export const gradients = {
  primary: 'linear-gradient(135deg, #ee6447 0%, #d94c2f 100%)',
  secondary: 'linear-gradient(135deg, #626eff 0%, #4c46f5 100%)',
  glass: 'linear-gradient(135deg, rgba(238, 100, 71, 0.1) 0%, rgba(98, 110, 255, 0.1) 100%)',
  hero: 'linear-gradient(135deg, #ee6447 0%, #626eff 100%)',
};

export default colors;