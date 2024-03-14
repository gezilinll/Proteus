<template>
    <div class="fullscreen" ref="workspaceContainer">
        <canvas class="fullscreen" ref="canvasForBackground"></canvas>
        <canvas class="fullscreen" ref="canvasForDoc"></canvas>
        <canvas class="fullscreen"></canvas>
    </div>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';

import { DocRenderer, useEditorStore } from '.';
import { ZoomDragPlugin } from './actions/zoom-drag-plugin';
import { BackgroundRenderer } from './renderer/background-renderer';

const store = useEditorStore();
const editor = store.editor;

const canvasForBackground: Ref<HTMLCanvasElement | null> = ref(null);
const canvasForDoc: Ref<HTMLCanvasElement | null> = ref(null);
const workspaceContainer = ref(null);

onMounted(async () => {
    const docRenderer = new DocRenderer();
    await docRenderer.init(workspaceContainer.value!, canvasForDoc.value!);

    canvasForBackground.value!.width = canvasForDoc.value!.width;
    canvasForBackground.value!.height = canvasForDoc.value!.height;
    canvasForBackground.value!.style.width = canvasForDoc.value!.style.width;
    canvasForBackground.value!.style.height = canvasForDoc.value!.style.height;

    const bgRenderer = new BackgroundRenderer(canvasForBackground.value!);
    bgRenderer.render();

    store.setupRenderer(docRenderer, bgRenderer);

    editor.registerPlugin(new ZoomDragPlugin());
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
, watch
