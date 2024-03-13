<template>
    <div class="fullscreen" ref="workspaceContainer">
        <canvas class="fullscreen" ref="canvasForBackground"></canvas>
        <canvas class="fullscreen" ref="canvasForDoc"></canvas>
        <canvas class="fullscreen"></canvas>
        <div class="fullscreen" ref="userLayer"></div>
    </div>
</template>

<script setup lang="ts">
import { usePinch } from '@vueuse/gesture';
import { onMounted, Ref, ref } from 'vue';

import { DocRenderer, Editor, useEditorStore } from '.';
import { ZoomDragPlugin } from './actions/zoom-drag-plugin';
import { BackgroundRenderer } from './renderer/background-renderer';

const editor = new Editor();
useEditorStore().setupEditor(editor);

const canvasForBackground: Ref<HTMLCanvasElement | null> = ref(null);
const canvasForDoc: Ref<HTMLCanvasElement | null> = ref(null);
const userLayer: Ref<HTMLDivElement | null> = ref(null);
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

    useEditorStore().setupRenderer(docRenderer, bgRenderer);

    editor.registerPlugin(new ZoomDragPlugin());

    userLayer.value!.addEventListener('mousedown', (event) => {
        editor.events.mouseDown.next(event);
    });
    userLayer.value!.addEventListener('mousemove', (event) => {
        editor.events.mouseMove.next(event);
    });
});

const pinchHandler = ({
    offset: [d, _a],
    previous: [pd, _pa],
}: {
    offset: [d: number, a: number];
    previous: [d: number, a: number];
}) => {
    const zoomOffset = ((d - pd) / 50 / 10) * editor.zoom;
    const result = Math.max(0.1, Math.min(4, editor.zoom + zoomOffset));
    editor.zoomTo(result);
};

usePinch(pinchHandler, {
    domTarget: userLayer,
    eventOptions: {
        capture: true,
        passive: false,
    },
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
