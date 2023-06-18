<template>
    <div class="container">
        <div class="top-bar"></div>
        <div class="content">
            <LeftPanel class="left-sidebar"></LeftPanel>
            <canvas
                id="renderTarget"
                class="right-content"
                @mousedown="onMouseDown"
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
            ></canvas>
        </div>
        <div class="bottom-bar">
            <Room></Room>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import paper from 'paper';
import { Room, LeftPanel } from './components';
import { useEditorStore } from './Editor.store';

const store = useEditorStore();

function onMouseDown(e: MouseEvent) {
    store.editor.onMouseDown(e);
}

function onMouseMove(e: MouseEvent) {
    store.editor.onMouseMove(e);
}

function onMouseUp(e: MouseEvent) {
    store.editor.onMouseUp(e);
}

onMounted(() => {
    const _paper = new paper.PaperScope();
    _paper.setup(document.getElementById('renderTarget') as HTMLCanvasElement);
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
}
.container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.top-bar {
    height: 88px;
    background-color: #fff;
}

.bottom-bar {
    height: 200px;
    background: linear-gradient(70deg, #ced4f0, #8d9ef2);
}

.content {
    flex: 1;
    display: flex;
}

.left-sidebar {
    width: 68px;
    background-color: #1e1c1c;
}

.right-content {
    flex: 1;
    background-color: #f0f0f0;
}
</style>
