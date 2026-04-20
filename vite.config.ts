import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // GitHub Pages 需要 base 路径，Vercel 使用根路径
  base: process.env.VERCEL ? '/' : '/md2wechat/',
})
