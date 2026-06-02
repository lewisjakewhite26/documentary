/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'netflix-bg': '#141414',
        'netflix-red': '#E50914',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        netflix: ['"Bebas Neue"', 'Arial Narrow', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        hover: '0 8px 30px rgba(0,0,0,0.8)',
      },
    },
  },
  plugins: [],
};
