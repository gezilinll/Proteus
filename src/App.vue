<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <FunctionView v-if="userStore.isValidUser() && editorStore.isValidBoard()"></FunctionView>
        <BrushPanelView v-if="selectedFunction === 'brush'"></BrushPanelView>
        <NavigationPanelView
            v-if="userStore.isValidUser() && editorStore.isValidBoard()"
        ></NavigationPanelView>
        <ZoomPanelView v-if="userStore.isValidUser() && editorStore.isValidBoard()"></ZoomPanelView>
        <CollabPanelView
            v-if="userStore.isValidUser() && editorStore.isValidBoard()"
        ></CollabPanelView>
        <PlayerPanelView
            v-if="userStore.isValidUser() && editorStore.isValidBoard()"
        ></PlayerPanelView>
        <LoginView v-if="!userStore.isValidUser()"></LoginView>
        <MyBoardsView v-if="userStore.isValidUser() && !editorStore.isValidBoard()"></MyBoardsView>
    </v-app>
</template>

<script setup lang="ts">
import { LoginView } from './login';
import { EditorView } from './editor';
import { FunctionView } from './function';
import { MyBoardsView } from './board';
import { BrushPanelView } from './function/brush';
import { ZoomPanelView } from './zoom';
import { NavigationPanelView } from './navigation';
import { PlayerPanelView } from './player';
import { CollabPanelView } from './collab';
import { useUserStore } from './store/User.store';
import { storeToRefs } from 'pinia';
import { useAppStore } from './store/App.store';
import { useEditorStore } from './store/Editor.store';
import axios from 'axios';

const appStore = useAppStore();
const userStore = useUserStore();
const editorStore = useEditorStore();

const { selectedFunction } = storeToRefs(appStore);

function initFromCookie() {
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        userStore.token = token;
    }
}

let urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('id')) {
    document.cookie = `id=${urlParams.get('id')!}`;
    initFromCookie();
} else if (urlParams.has('userID') && urlParams.has('token')) {
    document.cookie = `accessToken=${urlParams.get('token')!}`;
    document.cookie = `userID=${urlParams.get('userID')!}`;
    document.cookie = 'id=';
    window.location.href = window.location.origin;
} else {
    document.cookie = 'id=';
    initFromCookie();
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
./collab/User.store ./model/User.store ./store/App.store ./board
