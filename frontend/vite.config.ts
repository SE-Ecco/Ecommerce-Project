// WHAT: Build tool config — compiles React+TS, serves in dev, proxies API calls
// USED BY: pnpm dev (runs this automatically)
// KEY SETTINGS: @tailwind/vite plugin, @ alias for src/, proxy /api → backend
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: { port: 3000, proxy: { '/api': 'http://localhost:5000' } }
})
