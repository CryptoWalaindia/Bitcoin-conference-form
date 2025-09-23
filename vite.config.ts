import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep favicon files with their original names for better caching
          if (assetInfo.name && (assetInfo.name.includes('favicon') || assetInfo.name.includes('apple-touch-icon') || assetInfo.name.includes('site.webmanifest'))) {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Ensure static assets are properly served
  publicDir: 'public',
  assetsInclude: ['**/*.ico', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg', '**/*.webmanifest']
});
