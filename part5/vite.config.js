import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend URL
        changeOrigin: true, // if true, Vite will rewrite the Origin header to match the target URL.
        secure: false, // Use this if your backend is not using HTTPS (only for development)
      },
    },
  },
  test: { // cand elete this if not writing tests
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js',
  }
})