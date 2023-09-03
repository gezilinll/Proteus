<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <FunctionView v-if="userStore.isValidUser()"></FunctionView>
        <BrushPanelView v-if="selectedFunction === 'brush'"></BrushPanelView>
        <ZoomPanelView v-if="userStore.isValidUser()"></ZoomPanelView>
        <CollabPanelView v-if="userStore.isValidUser()"></CollabPanelView>
        <PlayerPanelView v-if="userStore.isValidUser()"></PlayerPanelView>
        <LoginView v-if="!userStore.isValidUser()"></LoginView>
    </v-app>
</template>

<script setup lang="ts">
import { LoginView } from './login';
import { EditorView } from './editor';
import { FunctionView } from './function';
import { BrushPanelView } from './function/brush';
import { ZoomPanelView } from './zoom';
import { PlayerPanelView } from './player';
import { CollabPanelView } from './collab';
import { useUserStore } from './store/User.store';
import { storeToRefs } from 'pinia';
import { useAppStore } from './store/App.store';

const store = useAppStore();
const { selectedFunction } = storeToRefs(store);

const userStore = useUserStore();

let urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('id')) {
    userStore.self.id = urlParams.get('id')!;
}
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
