import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This fix solves the 404 by pointing to your specific repo folder
  base: '/', 
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
})
