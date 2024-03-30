<template>
    <div class="fullscreen" ref="canvasContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { DocRenderer, useEditorStore } from '.';
import { BrushElementPlugin } from './plugins/brush-element-plugin';

const store = useEditorStore();
const editor = store.editor;

const canvasContainer = ref(null);

onMounted(() => {
    new DocRenderer(editor, canvasContainer.value!);

    editor.registerPlugin(new BrushElementPlugin());
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
