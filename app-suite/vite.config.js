import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'vendor-react';
          if (id.includes('src/pages/sales/')) return 'page-sales';
          if (id.includes('src/pages/system/')) return 'page-system';
          if (id.includes('src/pages/modules/') || id.includes('src/pages/inventory/')) return 'page-modules';
        },
      },
    },
  },
})
