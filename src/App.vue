<template>
    <v-app class="app-container">
        <Editor></Editor>
        <BoardBar v-if="userStore.isValidUser() && editorStore.isValidBoard()"></BoardBar>
        <CreationBar v-if="userStore.isValidUser() && editorStore.isValidBoard()"></CreationBar>
        <BrushBar v-if="selectedFunction === 'brush'"></BrushBar>
        <ToolsBar v-if="userStore.isValidUser() && editorStore.isValidBoard()"></ToolsBar>
        <CollabBar v-if="userStore.isValidUser() && editorStore.isValidBoard()"></CollabBar>
        <CreatorBar v-if="userStore.isValidUser() && editorStore.isValidBoard()"></CreatorBar>
        <VideoChatPanel v-if="appStore.showVideoChatPanel"></VideoChatPanel>
        <LoginPanel v-if="!userStore.isValidUser()"></LoginPanel>
        <BoardPanel v-if="userStore.isValidUser() && !editorStore.isValidBoard()"></BoardPanel>
    </v-app>
</template>

<script setup lang="ts">
import { Editor } from './editor';
import { BoardPanel, BoardBar } from './board';
import { CreationBar, BrushBar } from './creation';
import { ToolsBar } from './tools';
import { CollabBar, CreatorBar, LoginPanel, VideoChatPanel } from './collab';
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
