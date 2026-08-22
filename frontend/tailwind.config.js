/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ─────────────────────────────────────────────────────
        teal: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        sage: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',   // soft indigo
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
        },
        cream: {
          50:  '#FCFCFF',
          100: '#F5F5FC',   // main background
          200: '#ECECF7',   // secondary background
          300: '#DEDEF0',
          400: '#C7C7E0',
        },
        // ── Text ──────────────────────────────────────────────────────────────
        ink: {
          900: '#1E1B4B',   // headings
          700: '#332F63',
          500: '#4C4880',   // body text
          300: '#9795B5',
          100: '#CFCEE0',
        },
        // ── State Colors ──────────────────────────────────────────────────────
        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
        // ── Border ────────────────────────────────────────────────────────────
        border: '#D8D8E8',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':   '0 4px 20px rgba(30,27,75,0.05)',
        'card-md':'0 8px 30px rgba(30,27,75,0.08)',
        'card-lg':'0 16px 48px rgba(30,27,75,0.1)',
        'teal':   '0 8px 24px rgba(180,83,9,0.25)',
        'teal-lg':'0 12px 32px rgba(180,83,9,0.35)',
      },
      animation: {
        'fade-in':   'fadeIn 0.4s ease-out',
        'slide-up':  'slideUp 0.4s ease-out',
        'float':     'float 6s ease-in-out infinite',
        'pulse-slow':'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #C7D2FE 100%)',
        'teal-gradient': 'linear-gradient(135deg, #B45309, #F59E0B)',
        'sage-gradient': 'linear-gradient(135deg, #A5B4FC, #4F46E5)',
        'warm-gradient': 'linear-gradient(135deg, #FCFCFF, #ECECF7)',
      },
    },
  },
  plugins: [],
};
