import { defineConfig } from 'cypress';

import { defineConfig as defineViteConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import istanbul from 'vite-plugin-istanbul';
//bugfix: https will cause always 'your tests are loading'
//https://github.com/cypress-io/cypress/issues/24564
const customViteConfig = defineViteConfig({
    base: '/',
    plugins: [
        vue(),
        istanbul({
            cypress: true,
            requireEnv: false,
        }),
    ],
});

export default defineConfig({
    fixturesFolder: false,
    env: {
        codeCoverage: {
            exclude: 'cypress/**/*.*',
        },
    },
    video: false,
    e2e: {
        baseUrl: 'http://localhost:7001',
        specPattern: '**/*.spec.ts',
        supportFile: false,
    },
});
