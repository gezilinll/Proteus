import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        lib: {
            entry: 'src/index.ts',
        },
        minify: false,
        sourcemap: false,
        rollupOptions: {
            input: ['src/index.ts'],
            output: [
                {
                    entryFileNames: 'dist/es/index.mjs',
                    format: 'es',
                },
                {
                    entryFileNames: 'dist/cjs/index.cjs',
                    format: 'cjs',
                },
            ],
        },
    },
});
