/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Onion Pink (Primary)
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
        
        // Onion Blue (Secondary)
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
        
        // Success, Warning, Error
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
      },
      
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #ee6447 0%, #d94c2f 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #626eff 0%, #4c46f5 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(238, 100, 71, 0.1) 0%, rgba(98, 110, 255, 0.1) 100%)',
        'gradient-hero': 'linear-gradient(135deg, #ee6447 0%, #626eff 100%)',
      },
      
      backdropBlur: {
        xs: '2px',
      },
      
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'slide-in-left': 'slideInFromLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-right': 'slideInFromRight 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-bottom': 'slideInFromBottom 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'micro-bounce': 'micro-bounce 0.3s ease-in-out',
        'connection-flow': 'connectionFlow 1s linear infinite',
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(238, 100, 71, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(238, 100, 71, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        slideInFromLeft: {
          from: { transform: 'translateX(-100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromRight: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideInFromBottom: {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'micro-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        connectionFlow: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-primary': '0 8px 32px rgba(238, 100, 71, 0.2), inset 0 1px 0 rgba(238, 100, 71, 0.3)',
        'glass-secondary': '0 8px 32px rgba(98, 110, 255, 0.2), inset 0 1px 0 rgba(98, 110, 255, 0.3)',
        '3d': '0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
        '3d-hover': '0 20px 40px rgba(0, 0, 0, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};