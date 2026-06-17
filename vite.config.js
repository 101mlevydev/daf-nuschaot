import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static, CSP-friendly build. base:'./' so the bundle works inside the BGU
// sandbox iframe regardless of the mount path. KaTeX fonts are bundled
// locally (imported CSS → Vite fingerprints the woff2 into /assets), no CDN.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // keep fonts as real files so font-src 'self' is enough
  },
})
