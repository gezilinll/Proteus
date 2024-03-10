<template>
    <div class="workspace-container">
        <canvas class="fullscreen" ref="canvasForDoc"></canvas>
        <canvas class="fullscreen"></canvas>
        <div class="fullscreen" ref="userLayer"></div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { DocRenderer, Editor, useEditorStore } from '.';

const editor = new Editor();
useEditorStore().setEditor(editor);

const canvasForDoc = ref(null);
const userLayer = ref(null);

onMounted(() => {
    const renderer = new DocRenderer(canvasForDoc.value!);
    (userLayer.value! as HTMLDivElement).addEventListener('mousedown', (event) => {
        editor.events.mouseDown.next(event);
    });
    (userLayer.value! as HTMLDivElement).addEventListener('mousemove', (event) => {
        editor.events.mouseMove.next(event);
    });
});
</script>

<style lang="less">
.workspace-container {
    position: absolute;
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
