<template>
    <div class="app-container">
        <div class="app-header"></div>
        <div class="app-main">
            <canvas
                id="renderTarget"
                class="app-content"
                @mousedown="onMouseDown"
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
            ></canvas>
            <LeftPanel class="app-sidebar"></LeftPanel>
        </div>
        <div class="app-footer">
            <Room></Room>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { HocuspocusProvider } from '@hocuspocus/provider';
import paper from 'paper';
import { YBinding } from './collaborate/YBinding';
import { Graphics } from './elements/Graphics';
import { Room, LeftPanel } from './components';

const provider = new HocuspocusProvider({
    url: 'ws://47.119.150.226:3000',
    name: 'example-document',
});
const binding = new YBinding(provider.document);

let currentElement: Graphics | null = null;

function onMouseDown(e: MouseEvent) {
    currentElement = new Graphics();
    currentElement.addPoint(e.offsetX, e.offsetY);
    binding.addElement(currentElement);
}

function onMouseMove(e: MouseEvent) {
    if (currentElement) {
        currentElement.addPoint(e.offsetX, e.offsetY);
        binding.updateElement(currentElement, false);
    }
}

function onMouseUp(e: MouseEvent) {
    if (currentElement) {
        currentElement.addPoint(e.offsetX, e.offsetY);
        binding.updateElement(currentElement, true);
    }
    currentElement = null;
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

.app-container {
    display: flex;
    flex-direction: column;
}

.app-header {
    background: linear-gradient(70deg, #ced4f0, #8d9ef2);
    flex-basis: 32px;
}

.app-main {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    flex-direction: row;
}

.app-content {
    height: 100%;
}

.app-sidebar {
    flex-basis: 80px;
    min-width: 80px;
    background-color: #242527;
    order: -1;
}

.app-footer {
    background: linear-gradient(70deg, #ced4f0, #8d9ef2);
    height: 220px;
}
</style>
