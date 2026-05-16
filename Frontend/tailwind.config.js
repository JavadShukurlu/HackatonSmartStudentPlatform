/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50:  '#faf3fb',
          100: '#f1e2f3',
          200: '#e3c5e7',
          300: '#d4a8db',
          400: '#c388c6',
          500: '#b06bb5',
          600: '#8e529a',
          700: '#6b3e76',
          800: '#492952',
          900: '#28162e',
        },
        lavender: {
          DEFAULT: '#a899e6',
          soft: '#bfb2ec',
          deep: '#8a78d4',
        },
      },
      boxShadow: {
        soft: '0 6px 24px -8px rgba(0, 0, 0, 0.10)',
        glow: '0 10px 40px -10px rgba(20, 184, 166, 0.65)',
      },
      borderRadius: {
        xl: '0.9rem',
        '2xl': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        silk: {
          '0%, 100%': { transform: 'translate3d(0,0,0) rotate(0deg)' },
          '50%': { transform: 'translate3d(0,-4%,0) rotate(2deg)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        shimmer: 'shimmer 1.6s linear infinite',
        silk: 'silk 16s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
