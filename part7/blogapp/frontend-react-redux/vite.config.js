import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Your backend URL
        changeOrigin: true, // To ensure the target server sees the correct Origin header
        secure: false, // Use this if your backend is not using HTTPS (only for development)
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  },
})
