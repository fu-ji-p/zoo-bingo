import type { Config } from 'tailwindcss'

const config: Config = {
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
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        confetti: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        confetti: 'confetti 3s ease-in forwards',
      },
    },
  },
  plugins: [],
}

export default config
