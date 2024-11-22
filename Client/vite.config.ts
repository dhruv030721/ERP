import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/': 'http://37.27.81.8:4000',
      // '/api/': 'http://localhost:4000',
    },
  },
})
