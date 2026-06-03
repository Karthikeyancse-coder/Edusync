import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7C6FFF',
          light: '#6C63FF',
          glow: 'rgba(124,111,255,0.15)',
        },
        secondary: {
          DEFAULT: '#00D4AA',
          light: '#00B894',
        },
        surface: {
          DEFAULT: '#13131A',
          2: '#1C1C28',
          light: '#FFFFFF',
          'light-2': '#EEEEFF',
        },
        role: {
          principal: '#FF4D6D',
          hod: '#FFB800',
          faculty: '#00D4AA',
          student: '#7C6FFF',
        },
        success: '#00C48C',
        warning: '#FFB800',
        error: '#FF4D6D',
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
        input: '10px',
      },
      boxShadow: {
        'card-dark': '0 4px 24px rgba(0,0,0,0.4)',
        'card-light': '0 4px 24px rgba(108,99,255,0.08)',
        'btn-primary': '0 4px 16px rgba(124,111,255,0.3)',
        'modal': '0 8px 48px rgba(0,0,0,0.5)',
      },
      animation: {
        'pulse-dot': 'pulseDot 2s ease infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'pop': 'pop 0.3s spring',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pop: {
          '0%': { transform: 'scale(0)' },
          '60%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
