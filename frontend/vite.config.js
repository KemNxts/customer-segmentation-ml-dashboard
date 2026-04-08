import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Restarting server to clear PostCSS cache loop
  plugins: [react()],
})
