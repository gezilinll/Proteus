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
import { useBlitzStore } from './store/Blitz.store';

const blitz = useBlitzStore();

const { selectedFunction } = storeToRefs(blitz);

blitz.cookieService.initFromCookie();
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
