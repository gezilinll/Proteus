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
const userStore = useUserStore();
const { selectedFunction } = storeToRefs(store);

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
    console.log('cookie', token, userID);
    if (userID) {
        userStore.self.id = userID;
    }
    if (token) {
        userStore.token = token;
    }
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
