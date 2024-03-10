<template>
    <v-app class="app-container">
        <Workspace></Workspace>
        <CreationBar></CreationBar>
        <BrushBar v-if="store.secondaryPanelType === 'brush'"></BrushBar>
    </v-app>
</template>

<script setup lang="ts">
import { Workspace } from '@blitz/editor';
import { onMounted } from 'vue';

import { BrushBar, CreationBar } from './creation';
import { useCreationStore } from './store/creation';

const store = useCreationStore();
onMounted(() => {
    // const editor = useEditorStore().editor!;
    // editor.events.mouseDown.subscribe((event) => {
    //     console.log(event);
    // });
});
</script>

<style lang="less">
body {
    margin: 0px;
    overflow: hidden;
    -webkit-user-select: none;
}

.app-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0px;
    overflow: hidden;
}

// .fullscreen {
//     position: absolute;
//     width: 100vw;
//     height: 100vh;
// }
</style>
