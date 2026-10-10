import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' permite publicar en GitHub Pages (subcarpeta) o en Vercel/Netlify
// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
})
