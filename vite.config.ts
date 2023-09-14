import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        vue(),
        viteCompression(),
        visualizer(),
        mkcert(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'ServiceWorker.js',
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
                type: 'module',
            },
            workbox: {
                cleanupOutdatedCaches: false,
            },
        }),
    ],
    server: {
        https: true,
    },
});
