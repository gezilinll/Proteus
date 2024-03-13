import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import 'virtual:svg-icons-register';

import { SvgIcon } from '@blitz/components';
import { GesturePlugin } from '@vueuse/gesture';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import App from './App.vue';

const pinia = createPinia();

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

const app = createApp(App);
app.use(pinia);
app.use(vuetify);
app.use(GesturePlugin);
app.component('svg-icon', SvgIcon);
app.mount('#app');
