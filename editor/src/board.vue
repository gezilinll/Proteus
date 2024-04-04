<template>
    <div class="fullscreen" ref="canvasContainer"></div>
    <Interaction></Interaction>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onUnmounted } from 'vue';

import { useBoardStore } from '.';
import { Interaction } from './interaction';
import { BrushElementPlugin } from './plugins/brush-element-plugin';

const store = useBoardStore();
const editor = store.editor;

const canvasContainer = ref(null);

onMounted(() => {
    store.renderer.init(editor, canvasContainer.value!);

    editor.registerPlugin(new BrushElementPlugin());
});

onUnmounted(() => {
    editor.destroy();
    store.renderer.destroy();
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
