<template>
    <v-app class="app-container">
        <EditorView></EditorView>
        <Interaction></Interaction>
        <CreationBar></CreationBar>
        <BrushBar v-if="store.secondaryPanelType === 'brush'"></BrushBar>
        <ToolboxBar></ToolboxBar>
    </v-app>
</template>

<script setup lang="ts">
import { EditorView, useEditorStore } from '@blitz/editor';
import { onMounted, watch } from 'vue';

import { BrushBar, CreationBar } from './creation';
import { Interaction } from './interaction';
import { useCreationStore } from './store/creation';
import { ToolboxBar } from './toolbox';

const store = useCreationStore();
const editorStore = useEditorStore();

onMounted(() => {
    watch(
        () => editorStore.mouseType,
        () => {
            if (editorStore.mouseType === 'select') {
                document.getElementsByTagName('body')[0].style.cursor = 'auto';
            } else if (editorStore.mouseType === 'grab') {
                document.getElementsByTagName('body')[0].style.cursor = 'grab';
            } else if (editorStore.mouseType === 'brush') {
                document.getElementsByTagName('body')[0].style.cursor =
                    'url("cursor-brush.png") 0 10, auto';
            } else if (editorStore.mouseType === 'shape') {
                document.getElementsByTagName('body')[0].style.cursor = 'crosshair';
            } else if (editorStore.mouseType === 'text') {
                document.getElementsByTagName('body')[0].style.cursor = 'text';
            }
        }
    );
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}

.app-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
}
</style>
