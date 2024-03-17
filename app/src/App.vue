<template>
    <v-app class="app-container">
        <Workspace></Workspace>
        <div class="fullscreen" ref="userLayer"></div>
        <CreationBar></CreationBar>
        <BrushBar v-if="store.secondaryPanelType === 'brush'"></BrushBar>
        <ToolboxBar></ToolboxBar>
    </v-app>
</template>

<script setup lang="ts">
import { useEditorStore, Workspace } from '@blitz/editor';
import { useDrag, usePinch, useWheel } from '@vueuse/gesture';
import { onMounted, Ref, ref, watch } from 'vue';

import { BrushBar, CreationBar } from './creation';
import { useCreationStore } from './store/creation';
import { ToolboxBar } from './toolbox';

const store = useCreationStore();
const editor = useEditorStore().editor!;

const userLayer: Ref<HTMLDivElement | null> = ref(null);

onMounted(() => {
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
    if (!pinching) {
        return;
    }
    const zoomOffset = ((d - pd) / 50 / 10) * editor.zoom;
    const result = Math.max(0.1, Math.min(4, editor.zoom + zoomOffset));
    editor.zoomCanvasTo(result);
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
        editor.moveCanvasTo(
            editor.drag.x + (x - px) * window.devicePixelRatio,
            editor.drag.y + (y - py) * window.devicePixelRatio
        );
    }
};
useWheel(wheelHandler, {
    domTarget: userLayer,
});

const lastDragState: { x: number; y: number; dragging: boolean } = { x: 0, y: 0, dragging: false };
const dragHandler = ({
    first,
    last,
    initial: [ix, iy],
    movement: [mx, my],
}: {
    first: boolean;
    last: boolean;
    initial: [x: number, y: number];
    movement: [x: number, y: number];
}) => {
    if (last) {
        lastDragState.x = 0;
        lastDragState.y = 0;
        lastDragState.dragging = false;
        if (store.mouseType !== 'grab') {
            editor.events.dragEnd.next({ type: store.mouseTypeToElementType() });
        }
        return;
    }
    if (store.mouseType === 'grab') {
        editor.moveCanvasTo(
            editor.drag.x + (mx - lastDragState.x) * window.devicePixelRatio,
            editor.drag.y + (my - lastDragState.y) * window.devicePixelRatio
        );
    } else if (!first) {
        if (!lastDragState.dragging) {
            lastDragState.dragging = true;
            editor.events.dragStart.next({
                x: editor.drag.x + ix,
                y: editor.drag.y + iy,
                type: store.mouseTypeToElementType(),
            });
        }
        editor.events.dragging.next({
            movementX: mx,
            movementY: my,
            type: store.mouseTypeToElementType(),
        });
    }

    lastDragState.x = mx;
    lastDragState.y = my;
};
useDrag(dragHandler, {
    domTarget: userLayer,
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}

.app-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
}

.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
