import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'


// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    dedupe: ['react', 'react-dom'],
  },
  plugins: [react(),
  tailwindcss()
  ],
  server: {
    // SPA fallback for dev server
    historyApiFallback: true,
  },
  preview: {
    // SPA fallback for preview server
    historyApiFallback: true,
  },
})
