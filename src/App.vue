<template>
    <v-app class="app-container">
        <Editor></Editor>
        <BoardBar v-if="blitz.isValidUser() && blitz.isValidBoard()"></BoardBar>
        <CreationBar v-if="blitz.isValidUser() && blitz.isValidBoard()"></CreationBar>
        <BrushBar v-if="selectedFunction === 'brush'"></BrushBar>
        <ToolsBar v-if="blitz.isValidUser() && blitz.isValidBoard()"></ToolsBar>
        <CollabBar v-if="blitz.isValidUser() && blitz.isValidBoard()"></CollabBar>
        <CreatorBar v-if="blitz.isValidUser() && blitz.isValidBoard()"></CreatorBar>
        <VideoChatPanel v-if="blitz.showVideoChatPanel"></VideoChatPanel>
        <LoginPanel v-if="!blitz.isValidUser()"></LoginPanel>
        <BoardPanel v-if="blitz.isValidUser() && !blitz.isValidBoard()"></BoardPanel>
    </v-app>
</template>

<script setup lang="ts">
import { Editor } from './editor';
import { BoardPanel, BoardBar } from './board';
import { CreationBar, BrushBar } from './creation';
import { ToolsBar } from './tools';
import { CollabBar, CreatorBar, LoginPanel, VideoChatPanel } from './collab';
import { storeToRefs } from 'pinia';
import axios from 'axios';
import { useBlitzStore } from './store/Blitz.store';

const blitz = useBlitzStore();

const { selectedFunction } = storeToRefs(blitz);

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
        blitz.self.id = userID;
    }
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        blitz.token = token;
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
