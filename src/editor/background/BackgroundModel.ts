import { reactive, ref } from 'vue';

export const useModel = () => {
    const canvasSize = reactive({ width: 0, height: 0 });
    const styleSize = reactive({ width: 0, height: 0 });
    const zoom = ref(1.0);
    const translate = reactive({ x: 0, y: 0 });

    return {
        canvasSize,
        styleSize,
        zoom,
        translate,
    };
};

export type BackgroundModel = ReturnType<typeof useModel>;
