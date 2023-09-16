<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <FunctionView v-if="userStore.isValidUser() && editorStore.isValidRecord()"></FunctionView>
        <BrushPanelView v-if="selectedFunction === 'brush'"></BrushPanelView>
        <NavigationPanelView
            v-if="userStore.isValidUser() && editorStore.isValidRecord()"
        ></NavigationPanelView>
        <ZoomPanelView
            v-if="userStore.isValidUser() && editorStore.isValidRecord()"
        ></ZoomPanelView>
        <CollabPanelView
            v-if="userStore.isValidUser() && editorStore.isValidRecord()"
        ></CollabPanelView>
        <PlayerPanelView
            v-if="userStore.isValidUser() && editorStore.isValidRecord()"
        ></PlayerPanelView>
        <LoginView v-if="!userStore.isValidUser()"></LoginView>
        <HistoryView v-if="userStore.isValidUser() && !editorStore.isValidRecord()"></HistoryView>
    </v-app>
</template>

<script setup lang="ts">
import { LoginView } from './login';
import { EditorView } from './editor';
import { FunctionView } from './function';
import { HistoryView } from './history';
import { BrushPanelView } from './function/brush';
import { ZoomPanelView } from './zoom';
import { NavigationPanelView } from './navigation';
import { PlayerPanelView } from './player';
import { CollabPanelView } from './collab';
import { useUserStore } from './store/User.store';
import { storeToRefs } from 'pinia';
import { useAppStore } from './store/App.store';
import { useEditorStore } from './store/Editor.store';
import { onUnmounted } from 'vue';
// @ts-expect-error
import { registerSW } from 'virtual:pwa-register';

const appStore = useAppStore();
const userStore = useUserStore();
const editorStore = useEditorStore();

const { selectedFunction } = storeToRefs(appStore);

let swRegister: ServiceWorkerRegistration | null = null;
if ('serviceWorker' in navigator) {
    registerSW();
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('userID') && urlParams.has('token')) {
        document.cookie = `accessToken=${urlParams.get('token')!}`;
        document.cookie = `userID=${urlParams.get('userID')!}`;
        window.location.href = window.location.origin;
    } else {
        const token = document.cookie
            .split('; ')
            .find((row) => row.startsWith('accessToken='))
            ?.split('=')[1];
        const userID = document.cookie
            .split('; ')
            .find((row) => row.startsWith('userID='))
            ?.split('=')[1];
        if (userID) {
            userStore.self.id = userID;
        }
        if (token) {
            userStore.token = token;
        }
    }
}

onUnmounted(() => {
    swRegister?.unregister();
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}

.app-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
}
</style>
./collab/User.store ./model/User.store ./store/App.store
