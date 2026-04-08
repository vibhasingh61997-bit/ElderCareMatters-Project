/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:  '#1D4ED8',
          light: '#EFF6FF',
          dark:  '#1E3A5F',
        },
      },
    },
  },
  plugins: [],
}
