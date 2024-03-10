import vue from '@vitejs/plugin-vue';
import fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import viteCompression from 'vite-plugin-compression';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        vue(),
        viteCompression(),
        visualizer(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/components/icons')],
        }),
    ],
    server: {
        https: {
            key: fs.readFileSync('certs/privkey.pem'),
            cert: fs.readFileSync('certs/fullchain.pem'),
        },
    },
});
