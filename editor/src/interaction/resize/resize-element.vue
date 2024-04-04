<template>
    <div
        :style="{
            left: `${bbox.left - 2}px`,
            top: `${bbox.top - 2}px`,
            width: `${bbox.width + 4}px`,
            height: `${bbox.height + 4}px`,
            position: 'absolute',
            border: '2px solid #1e90ff',
        }"
        ref="resizeView"
    ></div>
</template>

<script setup lang="ts">
import { useBoardStore } from '@blitz/editor';
import { Rect } from '@blitz/store';
import { useDrag, useMove } from '@vueuse/gesture';
import { Subscription } from 'rxjs';
import { onUnmounted } from 'vue';
import { watch } from 'vue';
import { onMounted, ref } from 'vue';
import { Ref } from 'vue';

const editorStore = useBoardStore();
const editor = editorStore.editor;

const selectedElements = defineModel<string[]>({
    required: true,
});

watch(
    () => selectedElements.value,
    () => {
        updateBBOX();
    }
);

const bbox = ref<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
});

function updateBBOX() {
    const bounds = editorStore.renderer.getSpriteBounds(selectedElements.value[0]);
    bbox.value.left = bounds.left;
    bbox.value.top = bounds.top;
    bbox.value.width = bounds.width;
    bbox.value.height = bounds.height;
}

updateBBOX();

const resizeView: Ref<HTMLDivElement | null> = ref(null);

let subscription: Subscription | null = null;

onMounted(() => {
    resizeView.value!.style.cursor = 'move';

    subscription = editor.events.viewportChanged.subscribe(() => {
        updateBBOX();
    });
});

onUnmounted(() => {
    subscription?.unsubscribe();
    subscription = null;
});

let cursorType: 'move' | 'lt' | 'rt' | 'lb' | 'rb' = 'move';
const moveHandler = ({ event }: { event: PointerEvent }) => {
    event?.stopPropagation();
    if (dragState.resizing) {
        return;
    }
    const validDistance = 12;
    if (event.offsetX <= validDistance && event.offsetY <= validDistance) {
        resizeView.value!.style.cursor = 'nwse-resize';
        cursorType = 'lt';
    } else if (
        event.offsetX >= bbox.value.width - validDistance &&
        event.offsetY <= validDistance
    ) {
        resizeView.value!.style.cursor = 'nesw-resize';
        cursorType = 'rt';
    } else if (
        event.offsetX <= validDistance &&
        event.offsetY >= bbox.value.height - validDistance &&
        event.offsetY <= bbox.value.height
    ) {
        resizeView.value!.style.cursor = 'nesw-resize';
        cursorType = 'lb';
    } else if (
        event.offsetX >= bbox.value.width - validDistance &&
        event.offsetX <= bbox.value.width &&
        event.offsetY >= bbox.value.height - validDistance &&
        event.offsetY <= bbox.value.height
    ) {
        resizeView.value!.style.cursor = 'nwse-resize';
        cursorType = 'rb';
    } else {
        resizeView.value!.style.cursor = 'move';
        cursorType = 'move';
    }
};
useMove(moveHandler, {
    domTarget: resizeView,
});

const dragState: { x: number; y: number; resizing: boolean } = { x: 0, y: 0, resizing: false };
const dragHandler = ({
    last,
    movement: [mx, my],
}: {
    first: boolean;
    last: boolean;
    initial: [x: number, y: number];
    movement: [x: number, y: number];
}) => {
    if (last) {
        dragState.x = 0;
        dragState.y = 0;
        dragState.resizing = false;
        return;
    }
    const element = editor.getElement(selectedElements.value[0]);
    if (element) {
        if (cursorType === 'move') {
            const offsetX = mx - dragState.x;
            const offsetY = my - dragState.y;
            element.left += offsetX / editorStore.renderer.viewportParam.scale;
            element.top += offsetY / editorStore.renderer.viewportParam.scale;
            editor.events.changeElement.next(element);
        } else {
            dragState.resizing = true;
            let offsetW = 0;
            let offsetH = 0;
            let offsetX = 0;
            let offsetY = 0;
            if (cursorType === 'lt') {
                offsetX = mx - dragState.x;
                offsetY = my - dragState.y;
                offsetW = -offsetX;
                offsetH = -offsetY;
            }

            editor.events.resizeElement.next({
                target: element,
                newRect: Rect.fromLTWH(
                    element.left + offsetX / editorStore.renderer.viewportParam.scale,
                    element.top + offsetY / editorStore.renderer.viewportParam.scale,
                    element.width + offsetW / editorStore.renderer.viewportParam.scale,
                    element.height + offsetH / editorStore.renderer.viewportParam.scale
                ),
            });
        }

        updateBBOX();
    }

    dragState.x = mx;
    dragState.y = my;
};
useDrag(dragHandler, {
    domTarget: resizeView,
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
