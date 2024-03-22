<template>
    <div class="fullscreen" ref="interactionContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const interactionContainer = ref(null);

onMounted(async () => {});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
