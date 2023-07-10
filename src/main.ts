import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

import '@mdi/font/css/materialdesignicons.css';

import { createGuard } from "@authing/guard-vue3";
import "@authing/guard-vue3/dist/esm/guard.min.css";

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
app.use(
    createGuard({
        appId: "64aa24183e67595b66833fb1",
    })
);
app.mount('#app');
