<template>
    <div
        :style="{
            left: `${model.left - 2}px`,
            top: `${model.top - 2}px`,
            width: `${model.width + 4}px`,
            height: `${model.height + 4}px`,
            position: 'absolute',
            border: '2px solid #1e90ff',
        }"
        ref="resizeView"
    ></div>
</template>

<script setup lang="ts">
import { useMove } from '@vueuse/gesture';
import { onMounted, ref } from 'vue';

import { ResizeModel } from './model';

const model = defineModel<ResizeModel>({
    required: true,
});

const resizeView = ref(null);

onMounted(() => {});

const moveHandler = ({
    event: { clientX, clientY },
}: {
    event: { clientX: number; clientY: number };
}) => {
    console.log('AAA', clientX, clientY);
};
useMove(moveHandler, {
    domTarget: resizeView,
});
</script>

<style lang="less">
.fullscreen {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
