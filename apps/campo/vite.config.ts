import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const shared = (p: string) =>
  fileURLToPath(new URL(`../../packages/shared/${p}`, import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'TermoVida Campo',
        short_name: 'TermoVida',
        description:
          'Lista de visitas prioritárias do agente comunitário de saúde nos dias de calor extremo.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#FFF5EE',
        theme_color: '#0B7466',
        icons: [
          { src: 'icone-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icone-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // O app shell inteiro vai para o precache: abre sem rede.
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-arquivos',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  resolve: {
    alias: [
      { find: '@termovida/shared/tokens.css', replacement: shared('src/tokens.css') },
      { find: '@termovida/shared/base.css', replacement: shared('src/base.css') },
      { find: '@termovida/shared/mapa', replacement: shared('src/mapa.ts') },
      { find: '@termovida/shared/Logo', replacement: shared('src/Logo.tsx') },
      { find: '@termovida/shared', replacement: shared('src/index.ts') },
    ],
  },
  optimizeDeps: { exclude: ['@termovida/shared'] },
  build: { outDir: 'dist', sourcemap: false },
})
