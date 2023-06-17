<template>
    <div class="container">
        <div class="top-bar">顶部栏</div>
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
