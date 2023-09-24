import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [vue(), viteCompression(), visualizer()],
    server: {
        https: {
            key: fs.readFileSync('certs/privkey.pem'),
            cert: fs.readFileSync('certs/fullchain.pem'),
        },
    },
});
