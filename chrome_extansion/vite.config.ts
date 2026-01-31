import { copyFileSync, cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { URL, fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
        background: resolve(__dirname, 'src/background/index.ts'),
        sidepanel: resolve(__dirname, 'src/sidepanel/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Map each entry to its correct location in dist
          if (chunkInfo.name === 'sidepanel') {
            return 'sidepanel/index.js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name].js',
        format: 'es',
        dir: 'dist',
      },
    },
    target: 'es2020',
    minify: false,
    sourcemap: true,
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    {
      name: 'copy-extension-files',
      closeBundle() {
        // Copy manifest.json
        copyFileSync(resolve(__dirname, 'manifest.json'), resolve(__dirname, 'dist/manifest.json'));

        // Copy sidepanel HTML and CSS
        mkdirSync(resolve(__dirname, 'dist/sidepanel'), { recursive: true });
        copyFileSync(
          resolve(__dirname, 'src/sidepanel/sidepanel.html'),
          resolve(__dirname, 'dist/sidepanel/sidepanel.html')
        );
        copyFileSync(
          resolve(__dirname, 'src/sidepanel/styles.css'),
          resolve(__dirname, 'dist/sidepanel/styles.css')
        );

        // Copy assets directory
        cpSync(resolve(__dirname, 'assets'), resolve(__dirname, 'dist/assets'), {
          recursive: true,
        });

        console.log('✅ Copied manifest.json, HTML, CSS, and assets to dist/');
      },
    },
  ],
});
