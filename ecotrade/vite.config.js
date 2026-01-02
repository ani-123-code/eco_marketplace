import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Minimize code to avoid eval() usage
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        // Use function format instead of eval
        format: 'es',
      },
    },
  },
  // Optimize dependencies to avoid eval
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
