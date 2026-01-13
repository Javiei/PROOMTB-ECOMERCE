/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'raymon-black': '#000000',
        'raymon-white': '#ffffff',
        'raymon-gray': '#f5f5f5',
        'raymon-dark-gray': '#333333',
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
