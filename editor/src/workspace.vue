<template>
    <div class="fullscreen" ref="workspaceContainer">
        <canvas class="fullscreen" ref="canvasForBackground"></canvas>
        <canvas class="fullscreen" ref="canvasForDoc"></canvas>
        <canvas class="fullscreen"></canvas>
        <div class="fullscreen" ref="userLayer"></div>
    </div>
</template>

<script setup lang="ts">
import { usePinch, useWheel } from '@vueuse/gesture';
import { onMounted, Ref, ref, watch } from 'vue';

import { DocRenderer, Editor, useEditorStore } from '.';
import { ZoomDragPlugin } from './actions/zoom-drag-plugin';
import { BackgroundRenderer } from './renderer/background-renderer';

const store = useEditorStore();
const editor = new Editor();
store.setupEditor(editor);

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

    store.setupRenderer(docRenderer, bgRenderer);

    editor.registerPlugin(new ZoomDragPlugin());

    userLayer.value!.addEventListener('mousedown', (event) => {
        editor.events.mouseDown.next(event);
    });
    userLayer.value!.addEventListener('mousemove', (event) => {
        editor.events.mouseMove.next(event);
    });

    watch(
        () => store.mouseType,
        () => {
            if (store.mouseType === 'select') {
                document.getElementsByTagName('body')[0].style.cursor = 'auto';
            } else if (store.mouseType === 'grab') {
                document.getElementsByTagName('body')[0].style.cursor = 'grab';
            } else if (store.mouseType === 'brush') {
                document.getElementsByTagName('body')[0].style.cursor =
                    'url("cursor-brush.png") 0 10, auto';
            } else if (store.mouseType === 'shape') {
                document.getElementsByTagName('body')[0].style.cursor = 'crosshair';
            } else if (store.mouseType === 'text') {
                document.getElementsByTagName('body')[0].style.cursor = 'text';
            }
        }
    );
});

const cancelEvent = (e: Event) => e.preventDefault();
window.addEventListener('wheel', cancelEvent, { passive: false });

const gestureState: { pinching: boolean; wheeling: boolean } = { pinching: false, wheeling: false };
const pinchHandler = ({
    offset: [d, _a],
    previous: [pd, _pa],
    pinching,
}: {
    offset: [d: number, a: number];
    previous: [d: number, a: number];
    pinching: boolean;
}) => {
    gestureState.pinching = pinching;
    if (pinching) {
        const zoomOffset = ((d - pd) / 50 / 10) * editor.zoom;
        const result = Math.max(0.1, Math.min(4, editor.zoom + zoomOffset));
        editor.zoomTo(result);
    }
};
usePinch(pinchHandler, {
    domTarget: userLayer,
    eventOptions: {
        capture: true,
        passive: false,
    },
});

const wheelHandler = ({
    offset: [x, y],
    previous: [px, py],
    wheeling,
}: {
    offset: [d: number, a: number];
    previous: [d: number, a: number];
    wheeling: boolean;
}) => {
    gestureState.wheeling = wheeling;
    if (gestureState.wheeling && !gestureState.pinching) {
        editor.dragTo(
            editor.drag.x + (x - px) * window.devicePixelRatio,
            editor.drag.y + (y - py) * window.devicePixelRatio
        );
    }
};
useWheel(wheelHandler, {
    domTarget: userLayer,
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
