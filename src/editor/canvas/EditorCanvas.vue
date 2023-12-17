<template>
    <div class="editor-canvas-container">
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import usePresenter from './EditorCanvasPresenter';

const presenter = usePresenter();
const canvas = ref(null);

onMounted(() => {
    presenter.setup(canvas.value! as HTMLCanvasElement);
});
</script>

<style lang="less" scoped>
.editor-canvas-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
