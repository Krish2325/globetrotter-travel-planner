/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ─────────────────────────────────────────────────────
        teal: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        sage: {
          50:  '#F1F8EE',
          100: '#E0EDDA',
          200: '#C5DDB8',
          300: '#A7C4A0',   // soft sage green
          400: '#84AB7A',
          500: '#5F8D52',
          600: '#4A7040',
        },
        cream: {
          50:  '#FEFDFB',
          100: '#FAF7F2',   // main background
          200: '#F5EFE6',   // secondary background
          300: '#EDE3D5',
          400: '#D6C8B8',
        },
        // ── Text ──────────────────────────────────────────────────────────────
        ink: {
          900: '#1E293B',   // headings
          700: '#334155',
          500: '#475569',   // body text
          300: '#94A3B8',   // muted/placeholder
          100: '#CBD5E1',
        },
        // ── State Colors ──────────────────────────────────────────────────────
        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
        // ── Border ────────────────────────────────────────────────────────────
        border: '#D6D3D1',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':   '0 4px 20px rgba(0,0,0,0.05)',
        'card-md':'0 8px 30px rgba(0,0,0,0.08)',
        'card-lg':'0 16px 48px rgba(0,0,0,0.1)',
        'teal':   '0 8px 24px rgba(15,118,110,0.25)',
        'teal-lg':'0 12px 32px rgba(15,118,110,0.35)',
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
        'hero-gradient': 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #99F6E4 100%)',
        'teal-gradient': 'linear-gradient(135deg, #0F766E, #14B8A6)',
        'sage-gradient': 'linear-gradient(135deg, #A7C4A0, #5F8D52)',
        'warm-gradient': 'linear-gradient(135deg, #FAF7F2, #F5EFE6)',
      },
    },
  },
  plugins: [],
};
