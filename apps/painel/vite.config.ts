import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const shared = (p: string) =>
  fileURLToPath(new URL(`../../packages/shared/${p}`, import.meta.url))

export default defineConfig({
  plugins: [react()],
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
