import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { GesturePlugin } from '@vueuse/gesture';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import FloatingVue from 'floating-vue';
import 'floating-vue/dist/style.css';

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
});

const pinia = createPinia();

const app = createApp(App);
app.use(pinia);
app.use(vuetify);
app.use(FloatingVue);
app.use(GesturePlugin);
app.mount('#app');
