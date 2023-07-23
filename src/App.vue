<template>
    <div class="app-container">
        <EditorView></EditorView>
        <FunctionView></FunctionView>
    </div>
</template>

<script setup lang="ts">
import { EditorView } from './editor';
import { FunctionView } from './function';
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
}
</style>
