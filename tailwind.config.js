/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        maru: ['"Zen Maru Gothic"', 'sans-serif'],
      },
      colors: {
        'zoo-bg': '#FFF9F0',
        'zoo-primary': '#4CAF50',
        'zoo-secondary': '#FF9800',
        'zoo-accent': '#E91E8C',
        'zoo-found': '#81C784',
        'zoo-line': '#FFD700',
        'zoo-text': '#3E2723',
      },
    },
  },
  plugins: [],
}

