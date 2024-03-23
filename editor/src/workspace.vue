<template>
    <div class="fullscreen" ref="workspaceContainer"></div>
    <Interaction></Interaction>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { DocRenderer, useEditorStore } from '.';
import { Interaction } from './interaction';
import { BrushElementPlugin } from './plugins/brush-element-plugin';

const store = useEditorStore();
const editor = store.editor;

const workspaceContainer = ref(null);

onMounted(() => {
    new DocRenderer(editor, workspaceContainer.value!);

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
