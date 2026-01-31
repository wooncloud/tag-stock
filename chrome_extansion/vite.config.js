import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    watch: {},
    rollupOptions: {
      input: resolve(__dirname, 'src/main.js'),
      output: {
        entryFileNames: 'content.js',
        format: 'iife',
        dir: 'dist',
        inlineDynamicImports: true,
      },
      watch: {
        include: ['src/**'],
        exclude: ['node_modules/**'],
        clearScreen: false,
      },
    },
    target: 'es2015',
    minify: false,
    sourcemap: true,
  },
  define: {
    global: 'globalThis',
  },
}); 