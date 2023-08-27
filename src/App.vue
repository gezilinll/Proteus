<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <FunctionView v-if="userStore.isSelfValid()"></FunctionView>
        <BrushPanelView v-if="selectedFunction === 'brush'"></BrushPanelView>
        <ZoomPanelView v-if="userStore.isSelfValid()"></ZoomPanelView>
        <CollabPanelView v-if="userStore.isSelfValid()"></CollabPanelView>
        <UserPanelView v-if="userStore.isSelfValid()"></UserPanelView>
        <LoginView></LoginView>
    </v-app>
</template>

<script setup lang="ts">
import { LoginView } from './login';
import { EditorView } from './editor';
import { FunctionView } from './function';
import { BrushPanelView } from './function/brush';
import { ZoomPanelView } from './zoom';
import { CollabPanelView } from './collab';
import { UserPanelView } from './collab';
import { useAppStore } from './App.store';
import { useUserStore } from './collab/User.store';
import { storeToRefs } from 'pinia';

const store = useAppStore();
const { selectedFunction } = storeToRefs(store);

const userStore = useUserStore();
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
./collab/User.store
