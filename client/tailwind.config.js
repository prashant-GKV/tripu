/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Aurora Glass design system (new primary theme) ──────────────
        aurora: {
          void: '#070711',      // deepest background
          deep: '#0b0b1d',      // base surface / page
          night: '#11122b',     // raised panel
          glass: 'rgba(255,255,255,0.06)', // frosted surface fill
          line: 'rgba(255,255,255,0.10)',  // glass border
          teal: '#2dd4bf',      // aurora gradient stop 1
          violet: '#8b5cf6',    // aurora gradient stop 2
          magenta: '#ec4899',   // aurora gradient stop 3
          cyan: '#22d3ee',      // primary electric accent
          coral: '#ff7a59',     // warm secondary accent
          text: '#eef0ff',      // high-emphasis text
          muted: '#a6abccff',   // secondary text
          dim: '#6b7099',       // tertiary text
        },

        // ─── Legacy Traw tokens (kept for not-yet-migrated marketing sections) ──
        'traw-bg': '#F5F4F0',
        'traw-surface': '#FFFFFF',
        'traw-primary': '#1A1A18',
        'traw-secondary': '#5A5A52',
        'traw-muted': '#9A9A92',
        'traw-green': '#1D3B2F',
        'traw-lime': '#C8E63C',
        'traw-border': '#E8E7E2',
        'traw-card': '#F0EFE9',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        '10xl': ['10rem', { lineHeight: '1' }],
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.5s ease-out forwards',
        'aurora-drift': 'auroraDrift 18s ease-in-out infinite',
        'aurora-drift-slow': 'auroraDrift 28s ease-in-out infinite',
        'float-y': 'floatY 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        auroraDrift: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)', opacity: '0.85' },
          '33%': { transform: 'translate3d(6%,-4%,0) scale(1.12)', opacity: '1' },
          '66%': { transform: 'translate3d(-5%,5%,0) scale(1.05)', opacity: '0.9' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(26, 26, 24, 0.08)',
        'card-lg': '0 8px 48px rgba(26, 26, 24, 0.12)',
        'lime-glow': '0 0 60px rgba(200, 230, 60, 0.35)',
        'lime-glow-sm': '0 0 30px rgba(200, 230, 60, 0.25)',
        // Aurora Glass depth + glow
        'glass': '0 8px 32px rgba(3, 4, 18, 0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 24px 64px rgba(3, 4, 18, 0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
        'glow-cyan': '0 0 40px rgba(34, 211, 238, 0.35)',
        'glow-violet': '0 0 50px rgba(139, 92, 246, 0.40)',
        'glow-coral': '0 0 40px rgba(255, 122, 89, 0.35)',
      },
      backgroundImage: {
        'topo': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cpath d='M0 200 Q50 150 100 200 T200 200 T300 200 T400 200' stroke='%23E8E7E2' fill='none' stroke-width='1.5'/%3E%3Cpath d='M0 180 Q50 130 100 180 T200 180 T300 180 T400 180' stroke='%23E8E7E2' fill='none' stroke-width='1'/%3E%3Cpath d='M0 220 Q50 170 100 220 T200 220 T300 220 T400 220' stroke='%23E8E7E2' fill='none' stroke-width='1'/%3E%3C/svg%3E\")",
        'aurora-grad': 'linear-gradient(120deg, #2dd4bf 0%, #8b5cf6 50%, #ec4899 100%)',
        'aurora-text': 'linear-gradient(120deg, #22d3ee 0%, #8b5cf6 55%, #ff7a59 100%)',
      },
    },
  },
  plugins: [],
}
