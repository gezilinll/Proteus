<template>
    <div class="editor-container" ref="app">
        <EditorCanvas></EditorCanvas>
        <EditorInteraction></EditorInteraction>
    </div>
</template>

<script lang="ts" setup>
import { EditorCanvas } from './canvas';
import { EditorInteraction } from './interaction';
import { reactive, ref, watch } from 'vue';
</script>

<style lang="less" scoped>
.editor-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
