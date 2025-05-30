/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#264653',    // Dark teal
        secondary: '#2a9d8f',  // Medium teal
        accent: '#e9c46a',     // Yellow
        highlight: '#f4a261',  // Orange
        warning: '#e76f51',    // Coral
        lightGray: '#f5f5f5',
        darkGray: '#4a4a4a',
        white: '#ffffff',
        black: '#000000',
        gray: {
          200: '#e2e2e2',
          300: '#d0d0d0',
          400: '#a0a0a0',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '2xl': '1440px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      clipPath: {
        'diagonal': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', 
      },
      borderRadius: {
        'xl': '1rem',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
