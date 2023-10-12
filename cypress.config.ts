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
    env: {
        codeCoverage: {
            exclude: 'cypress/**/*.*',
        },
    },
    video: false,
    component: {
        specPattern: '**/*.spec.ts',
        devServer: {
            framework: 'vue',
            bundler: 'vite',
            viteConfig: customViteConfig,
        },
        setupNodeEvents(on, config) {
            require('@cypress/code-coverage/task')(on, config);

            return config;
        },
    },
});
