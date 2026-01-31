import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath, URL } from 'url';

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
                    // Put sidepanel.js in sidepanel directory
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
});
