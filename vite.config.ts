import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative assets for GitHub Pages
  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: false,
      ignored: ['**/dist/**', '**/*.jpg', '**/*.png', '**/*.git/**']
    }
  }
})
