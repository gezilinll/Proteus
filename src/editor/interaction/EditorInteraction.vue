<template>
    <div class="editor-interaction" ref="interaction"></div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';

import { useMousePressed, useMouse } from '@vueuse/core';
import usePresenter from './EditorInteractionPresenter';
import { useBlitzStore } from '../../store/Blitz.store';
import { useWheel } from '@vueuse/gesture';

const blitz = useBlitzStore();
const presenter = usePresenter();
const interaction = ref(null);

const mousePressed = reactive(
    useMousePressed({
        target: interaction,
    })
);
const mouse = reactive(
    useMouse({
        target: interaction,
    })
);
watch(
    () => mousePressed.pressed,
    () => {
        if (mousePressed.pressed) {
            presenter.onMouseDown(blitz.selectedFunction, mouse.x, mouse.y);
        } else {
            presenter.onMouseUp();
        }
    }
);
watch(
    () => [mouse.x, mouse.y],
    () => {
        presenter.onMouseMove(blitz.selectedFunction, mouse.x, mouse.y);
    }
);

const wheelHandler = ({ movement }: any) => {
    for (const hook of blitz.wheelHooks) {
        hook(movement[0], movement[1]);
    }
};
useWheel(wheelHandler, {
    domTarget: interaction,
});
</script>

<style lang="less" scoped>
.editor-interaction {
    position: absolute;
    width: 100vw;
    height: 100vh;
}
</style>
