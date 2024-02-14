<template>
    <div class="app-container">
        <canvas ref="canvas" class="editor-fullscreen"></canvas>
    </div>
</template>

<script setup lang="ts">
import { BlitzRenderer, GraphicsRendererPlugin } from '@blitz/canvas';
import { Editor } from '@blitz/core';
import { onMounted, ref } from 'vue';

const canvas = ref(null);

onMounted(() => {
    const editor = new Editor();
    const renderer = new BlitzRenderer(canvas.value!);
    const graphicsRendererPlugin = new GraphicsRendererPlugin(renderer);
    editor.registerPlugin(graphicsRendererPlugin);
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
