<template>
    <div class="fullscreen" ref="interactionContainer">
        <ResizeElement v-model="resizeModel" v-if="resizeModel.enabled"></ResizeElement>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@blitz/editor';
import { useDrag, useMove, usePinch, useWheel } from '@vueuse/gesture';
import { onMounted, Ref, ref } from 'vue';

import { ResizeElement, ResizeModel } from './resize';

const interactionContainer: Ref<HTMLDivElement | null> = ref(null);

const editorStore = useEditorStore();
const editor = editorStore.editor;

const resizeModel = ref<ResizeModel>({ enabled: false, width: 0, height: 0, left: 0, top: 0 });

onMounted(() => {
    interactionContainer.value!.addEventListener('click', (event) => {
        editor.events.click.next({
            x: editor.drag.x + event.clientX,
            y: editor.drag.y + event.clientY,
        });
    });

    editor.events.selectElement.subscribe((element) => {
        resizeModel.value.enabled = true;
        resizeModel.value.left = element.left;
        resizeModel.value.top = element.top;
        resizeModel.value.width = element.width;
        resizeModel.value.height = element.height;
    });
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
    domTarget: interactionContainer,
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
        editor.moveCanvasTo(editor.drag.x + (x - px), editor.drag.y + (y - py));
    }
};
useWheel(wheelHandler, {
    domTarget: interactionContainer,
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
        if (editorStore.mouseType !== 'grab') {
            editor.events.dragEnd.next({ type: editorStore.mouseTypeToElementType() });
        }
        return;
    }
    if (editorStore.mouseType === 'grab') {
        editor.moveCanvasTo(
            editor.drag.x + (mx - lastDragState.x),
            editor.drag.y + (my - lastDragState.y)
        );
    } else if (!first) {
        if (!lastDragState.dragging) {
            lastDragState.dragging = true;
            editor.events.dragStart.next({
                x: editor.drag.x + ix,
                y: editor.drag.y + iy,
                type: editorStore.mouseTypeToElementType(),
            });
        }
        editor.events.dragging.next({
            movementX: mx,
            movementY: my,
            type: editorStore.mouseTypeToElementType(),
        });
    }

    lastDragState.x = mx;
    lastDragState.y = my;
};
useDrag(dragHandler, {
    domTarget: interactionContainer,
});

const moveHandler = ({
    event: { clientX, clientY },
}: {
    event: { clientX: number; clientY: number };
}) => {
    editor.events.hovering.next({ x: editor.drag.x + clientX, y: editor.drag.y + clientY });
};
useMove(moveHandler, {
    domTarget: interactionContainer,
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
