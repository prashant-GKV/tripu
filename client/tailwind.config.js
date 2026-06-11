/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(26, 26, 24, 0.08)',
        'card-lg': '0 8px 48px rgba(26, 26, 24, 0.12)',
        'lime-glow': '0 0 60px rgba(200, 230, 60, 0.35)',
        'lime-glow-sm': '0 0 30px rgba(200, 230, 60, 0.25)',
      },
      backgroundImage: {
        'topo': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cpath d='M0 200 Q50 150 100 200 T200 200 T300 200 T400 200' stroke='%23E8E7E2' fill='none' stroke-width='1.5'/%3E%3Cpath d='M0 180 Q50 130 100 180 T200 180 T300 180 T400 180' stroke='%23E8E7E2' fill='none' stroke-width='1'/%3E%3Cpath d='M0 220 Q50 170 100 220 T200 220 T300 220 T400 220' stroke='%23E8E7E2' fill='none' stroke-width='1'/%3E%3Cpath d='M0 160 Q50 110 100 160 T200 160 T300 160 T400 160' stroke='%23E8E7E2' fill='none' stroke-width='0.8'/%3E%3Cpath d='M0 240 Q50 190 100 240 T200 240 T300 240 T400 240' stroke='%23E8E7E2' fill='none' stroke-width='0.8'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
