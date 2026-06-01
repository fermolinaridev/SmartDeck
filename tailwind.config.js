/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eff5ff',
          100: '#dbe7fe',
          200: '#bfd4fe',
          300: '#94b8fd',
          400: '#6191fa',
          500: '#3d6df5',
          600: '#264fea',
          700: '#1f3dd6',
          800: '#1f33ad',
          900: '#1e2f88',
          950: '#171f54',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,.04), 0 4px 24px -8px rgba(15,23,42,.08)',
        glow: '0 0 0 1px rgba(38,79,234,.15), 0 8px 32px -12px rgba(38,79,234,.35)',
      },
      animation: {
        'fade-in': 'fade-in .35s cubic-bezier(.2,.8,.2,1) both',
        'pulse-soft': 'pulse-soft 1.4s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%,100%': { opacity: 0.35 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
