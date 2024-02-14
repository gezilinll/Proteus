<template>
    <div class="app-container">
        <canvas ref="canvas" class="editor-fullscreen"></canvas>
    </div>
    <CreationBar></CreationBar>
    <BrushBar></BrushBar>
</template>

<script setup lang="ts">
import { BlitzRenderer, GraphicsRendererPlugin } from '@blitz/canvas';
import { Editor, GraphicsElement } from '@blitz/core';
import { onMounted, ref } from 'vue';

import { BrushBar, CreationBar } from './creation';

const canvas = ref(null);

onMounted(() => {
    const editor = new Editor();
    const renderer = new BlitzRenderer(canvas.value!);
    const graphicsRendererPlugin = new GraphicsRendererPlugin(renderer);
    editor.registerPlugin(graphicsRendererPlugin);

    (canvas.value! as HTMLCanvasElement).addEventListener('mousedown', () => {
        editor.addElement(new GraphicsElement());
    });
});
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

.editor-fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
