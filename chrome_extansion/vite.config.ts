import tailwindcss from '@tailwindcss/vite';
import { copyFileSync, cpSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { URL, fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const target = process.env.BUILD_TARGET;

// Content script 빌드 (IIFE - ES module 지원 안함)
const contentConfig = defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
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
});

// Background & Sidepanel 빌드 (ES module)
const mainConfig = defineConfig({
  build: {
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        background: resolve(__dirname, 'src/background/index.ts'),
        sidepanel: resolve(__dirname, 'src/sidepanel/index.ts'),
        local: resolve(__dirname, 'src/local/index.ts'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'sidepanel') {
            return 'sidepanel/index.js';
          }
          if (chunkInfo.name === 'local') {
            return 'local/index.js';
          }
          return '[name].js';
        },
        chunkFileNames: 'chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'sidepanel/styles.css';
          }
          return 'assets/[name][extname]';
        },
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
    tailwindcss(),
    {
      name: 'copy-extension-files',
      closeBundle() {
        copyFileSync(resolve(__dirname, 'manifest.json'), resolve(__dirname, 'dist/manifest.json'));

        mkdirSync(resolve(__dirname, 'dist/sidepanel'), { recursive: true });
        copyFileSync(
          resolve(__dirname, 'src/sidepanel/sidepanel.html'),
          resolve(__dirname, 'dist/sidepanel/sidepanel.html')
        );

        mkdirSync(resolve(__dirname, 'dist/local'), { recursive: true });
        copyFileSync(
          resolve(__dirname, 'src/local/local.html'),
          resolve(__dirname, 'dist/local/local.html')
        );

        cpSync(resolve(__dirname, 'assets'), resolve(__dirname, 'dist/assets'), {
          recursive: true,
        });

        console.log('✅ Copied manifest.json, HTML, CSS, and assets to dist/');
      },
    },
  ],
});

export default target === 'content' ? contentConfig : mainConfig;
