<template>
    <div class="fullscreen" ref="interactionContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useEditorStore } from '../core/store';

const interactionContainer = ref(null);

const store = useEditorStore();
const editor = store.editor;

onMounted(() => {
    editor.events.selectElement.subscribe((element) => {});
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
