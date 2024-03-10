<template>
    <svg
        aria-hidden="true"
        :width="width"
        :height="height"
        :viewBox="viewBox"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        :fill="fill"
        :color="color"
    >
        <use :href="symbolId" />
    </svg>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    name: 'SvgIcon',
    props: {
        prefix: {
            type: String,
            default: 'icon',
        },
        name: {
            type: String,
            required: true,
        },
        stroke: {
            type: String,
            default: 'currentColor',
        },
        strokeWidth: {
            type: [Number, String],
            default: 0,
        },
        color: {
            type: String,
            default: 'currentColor',
        },
        fill: {
            type: String,
            default: 'currentColor',
        },
        width: {
            type: [Number, String],
            default: '30px',
        },
        height: {
            type: [Number, String],
            default: '30px',
        },
        viewBox: {
            type: String,
            default: '0 0 24 24',
        },
    },
    setup(props) {
        const symbolId = computed(() => `#${props.prefix}-${props.name}`);
        return { symbolId };
    },
});
</script>
