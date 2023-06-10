<template>
    <div class="app-container">
        <div class="app-header">Header</div>
        <div class="app-main">
            <canvas
                id="renderTarget"
                class="app-content"
                @mousedown="onMouseDown"
                @mousemove="onMouseMove"
                @mouseup="onMouseUp"
            ></canvas>
            <div class="app-sidebar app-sidebar-left">Left Sidebar</div>
            <div class="app-sidebar app-sidebar-right">Right Sidebar</div>
        </div>
        <div class="app-footer">Footer</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { HocuspocusProvider } from '@hocuspocus/provider';
import paper from 'paper';
import { YBinding } from './collaborate/YBinding';
import { Graphics } from './elements/Graphics';

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
        console.log('onMouseUp');
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
    min-height: 100vh;
}

.app-header {
    background-color: #ddd;
    flex-basis: 32px;
}

.app-main {
    flex-grow: 1;
    display: flex;
    align-items: stretch;
}

.app-content {
    flex-grow: 1;
}

.app-sidebar {
    flex-basis: 200px;
    background-color: #eee;
}

.app-sidebar-left {
    order: -1;
}

.app-footer {
    background-color: #ddd;
    flex-basis: 80px;
}
</style>
