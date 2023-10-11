import { defineConfig } from 'cypress';
import { defineConfig as defineViteConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

//bugfix: https will cause always 'your tests are loading'
//https://github.com/cypress-io/cypress/issues/24564
const customViteConfig = defineViteConfig({
    base: '/',
    plugins: [vue()],
});
export default defineConfig({
    video: false,
    component: {
        specPattern: '**/*.spec.ts',
        devServer: {
            framework: 'vue',
            bundler: 'vite',
            viteConfig: customViteConfig,
        },
    },
});
