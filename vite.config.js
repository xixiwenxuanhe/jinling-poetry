import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 启用CSS模块
      localsConvention: 'camelCase'
    }
  },
  server: {
    port: 3000,
    open: true
  }
}) 