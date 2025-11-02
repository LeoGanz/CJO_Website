import { defineConfig } from 'vite';
import { resolve } from 'path';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        impressum: resolve(__dirname, 'impressum.html'),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    ViteImageOptimizer({
      // Only process specific image formats
      test: /\.(jpe?g|png)$/i,
      // Sharp options for compression
      jpeg: {
        quality: 85,
        mozjpeg: true,
      },
      jpg: {
        quality: 85,
        mozjpeg: true,
      },
      png: {
        quality: 85,
        compressionLevel: 9,
      },
    }),
  ],
});

