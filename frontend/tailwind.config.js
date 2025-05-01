/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#6f1ab1', 
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
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '2xl': '1440px', 
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
