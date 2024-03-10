<template>
    <div class="app-container">
        <Workspace></Workspace>
    </div>
</template>

<script setup lang="ts">
import { useEditorStore, Workspace } from '@blitz/editor';
import { onMounted } from 'vue';

onMounted(() => {
    const editor = useEditorStore().editor!;

    editor.events.mouseDown.subscribe((event) => {
        console.log(event);
    });
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}

.app-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
}
</style>
