<template>
    <div
        :style="{
            position: 'absolute',
            left: props.box.x + 'px',
            top: props.box.y + 'px',
            width: props.box.width + 'px',
            height: props.box.height + 'px',
            border: '1px solid #000',
        }"
    ></div>
</template>

<script lang="ts" setup>
import { ElementBox } from '../Editor.store';

const props = defineProps<{
    box: ElementBox;
}>();
</script>
