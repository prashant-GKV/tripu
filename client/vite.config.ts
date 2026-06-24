import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto', // auto-injects SW registration; no main.tsx edit needed
      includeAssets: ['favicon.svg', 'tripu-icon.svg'],
      manifest: {
        name: 'Tripu — AI Trip Planner',
        short_name: 'Tripu',
        description: 'Plan map-backed trips in minutes with AI, and find travel companions.',
        theme_color: '#0b0b1d',
        background_color: '#070711',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/tripu-icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,png,woff2}'],
        // The marketing PNGs are large; allow them to be precached if present.
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
      },
    }),
  ],
})
