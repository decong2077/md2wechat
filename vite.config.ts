import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 必须设置 base 路径，否则 GitHub Pages 无法加载 JS/CSS
  base: '/md2wechat/',
})
