<template>
    <div
        :style="{
            left: `${model.left - 2}px`,
            top: `${model.top - 2}px`,
            width: `${model.width + 4}px`,
            height: `${model.height + 4}px`,
            position: 'absolute',
            border: '2px solid #1e90ff',
        }"
        ref="resizeView"
    ></div>
</template>

<script setup lang="ts">
import { useEditorStore } from '@blitz/editor';
import { Rect } from '@blitz/store';
import { useDrag, useMove } from '@vueuse/gesture';
import { onMounted, ref } from 'vue';
import { Ref } from 'vue';

import { ResizeModel } from './model';

const editorStore = useEditorStore();
const editor = editorStore.editor;

const model = defineModel<ResizeModel>({
    required: true,
});

const resizeView: Ref<HTMLDivElement | null> = ref(null);

onMounted(() => {
    resizeView.value!.style.cursor = 'move';
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
        event.offsetX >= model.value.width - validDistance &&
        event.offsetY <= validDistance
    ) {
        resizeView.value!.style.cursor = 'nesw-resize';
        cursorType = 'rt';
    } else if (
        event.offsetX <= validDistance &&
        event.offsetY >= model.value.height - validDistance &&
        event.offsetY <= model.value.height
    ) {
        resizeView.value!.style.cursor = 'nesw-resize';
        cursorType = 'lb';
    } else if (
        event.offsetX >= model.value.width - validDistance &&
        event.offsetX <= model.value.width &&
        event.offsetY >= model.value.height - validDistance &&
        event.offsetY <= model.value.height
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
    const element = editor.getElement(model.value.elementId);
    if (element) {
        if (cursorType === 'move') {
            const offsetX = mx - dragState.x;
            const offsetY = my - dragState.y;
            element.left += offsetX;
            element.top += offsetY;
            model.value.left += offsetX;
            model.value.top += offsetY;
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
                    element.left + offsetX,
                    element.top + offsetY,
                    element.width + offsetW,
                    element.height + offsetH
                ),
            });
            model.value.left += offsetX;
            model.value.top += offsetY;
            model.value.width += offsetW;
            model.value.height += offsetH;
        }
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
