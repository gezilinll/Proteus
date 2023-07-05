<template>
    <div
        :style="{
            position: 'absolute',
            pointerEvents: 'none',
            left: (props.box.x - 5) + 'px',
            top: (props.box.y - 5) + 'px',
            width: (props.box.width + 8) + 'px',
            height: (props.box.height + 8) + 'px',
            border: '2px solid #00F',
        }"
    ></div>
</template>

<script lang="ts" setup>
import { ElementBox } from '../../Editor.store';

const props = defineProps<{
    box: ElementBox;
}>();
</script>
