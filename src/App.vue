<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <FunctionView></FunctionView>
        <BrushPanelView v-if="selectedFunction === 'brush'"></BrushPanelView>
        <ZoomPanelView></ZoomPanelView>
    </v-app>
</template>

<script setup lang="ts">
import { EditorView } from './editor';
import { FunctionView } from './function';
import { BrushPanelView } from './function/brush';
import { ZoomPanelView } from './zoom';
import { useAppStore } from './App.store';
import { storeToRefs } from 'pinia';

const store = useAppStore();
const { selectedFunction } = storeToRefs(store);
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
