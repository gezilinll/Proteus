<template>
    <div class="editor-container">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue';
import usePresenter from './EditorPresenter';
import { useMousePressed, useMouse } from '@vueuse/core';
import { useWheel } from '@vueuse/gesture';
import { useAppStore } from '../App.store';
import { useEditorStore } from './Editor.store';

const presenter = usePresenter();
const appStore = useAppStore();
const editorStore = useEditorStore();
const canvas = ref(null);

const mousePressed = reactive(
    useMousePressed({
        target: canvas,
    })
);
const mouse = reactive(
    useMouse({
        target: canvas,
    })
);
watch(
    () => mousePressed.pressed,
    () => {
        if (mousePressed.pressed) {
            presenter.onMouseDown(appStore.selectedFunction, mouse.x, mouse.y);
        } else {
            presenter.onMouseUp(appStore.selectedFunction);
        }
    }
);
watch(
    () => [mouse.x, mouse.y],
    () => {
        presenter.onMouseMove(appStore.selectedFunction, mouse.x, mouse.y);
    }
);

const wheelHandler = ({ movement }: any) => {
    for (const hook of editorStore.wheelHooks) {
        hook(movement[0], movement[1]);
    }
};
useWheel(wheelHandler, {
    domTarget: canvas,
});

onMounted(() => {
    presenter.setup(canvas.value! as HTMLCanvasElement);
});
</script>

<style lang="less" scoped>
.editor-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
