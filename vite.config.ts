import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        // ✅ Ensure proper file extensions
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // ✅ Important for Chrome extensions
    assetsInlineLimit: 0,
    target: 'esnext',
    minify: false // Optional: easier debugging
  },
  // ✅ Configure for extension environment
  define: {
    'process.env': {}
  }
})
