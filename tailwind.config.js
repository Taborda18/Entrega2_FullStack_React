/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#9333ea',
          600: '#7e22ce',
          700: '#6d28d9',
        },
        pink: {
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
        },
      },
      borderRadius: {
        'dna': '0.5rem',
      },
      boxShadow: {
        'dna': '0 4px 11px rgba(77, 97, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
