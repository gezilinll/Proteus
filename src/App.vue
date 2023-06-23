<template>
    <v-app>
        <div class="container">
            <div class="top-bar"></div>
            <div class="main-area">
                <div class="canvas-container">
                    <canvas
                        id="renderTarget"
                        style="width: 100%; height: 100%"
                        @mousedown="onMouseDown"
                        @mousemove="onMouseMove"
                        @mouseup="onMouseUp"
                    ></canvas>
                </div>
                <LeftPanel class="function-sidebar"></LeftPanel>
                <BrushPanel v-if="selectedFunction === FunctionType.Brush"></BrushPanel>
            </div>
            <div class="bottom-bar">
                <Room></Room>
            </div>
        </div>
    </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import paper from 'paper';
import { Room, LeftPanel, BrushPanel } from './components';
import { useEditorStore, FunctionType } from './Editor.store';
import { storeToRefs } from 'pinia';

const store = useEditorStore();
const { selectedFunction } = storeToRefs(store);

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
    -webkit-user-select: none;
}
img {
    -webkit-user-drag: none;
}

.container {
    position: absolute;
    width: 100vw;
    height: 100vh;
}

.top-bar {
    width: 100vw;
    height: 46px;
    background: linear-gradient(70deg, #ced4f0, #8d9ef2);
    position: absolute;
}

.bottom-bar {
    height: 120px;
    background-color: #fff;
    box-shadow: inset 0px 0 0 4px #000;
    position: absolute;
    bottom: 0px;
    width: 100vw;
}

.main-area {
    position: absolute;
    top: 46px;
    bottom: 120px;
    width: 100vw;
}

.function-sidebar {
    position: absolute;
    width: 68px;
    height: 100%;
    background-color: #1e1c1c;
}

.canvas-container {
    position: absolute;
    left: 68px;
    right: 0px;
    height: 100%;
}
</style>
