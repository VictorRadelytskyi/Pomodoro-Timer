import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { copyFileSync, existsSync } from 'node:fs'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    {
      name: 'copy-extension-files',
      writeBundle() {
        const filesToCopy = [
          { src: 'popup.html', dest: 'dist/popup.html' },
          { src: 'popup.js', dest: 'dist/popup.js' },
          { src: 'popup.css', dest: 'dist/popup.css' },
          { src: 'manifest.json', dest: 'dist/manifest.json' }
        ];

        filesToCopy.forEach(({ src, dest }) => {
          if (existsSync(src)) {
            copyFileSync(src, dest);
            console.log(`✅ Copied ${src} → ${dest}`);
          }
        });
      }
    }
  ],
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    },
    assetsInlineLimit: 0
  }

})
