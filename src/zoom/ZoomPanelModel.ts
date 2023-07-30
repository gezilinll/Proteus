import { ref } from 'vue';

export const useModel = () => {
    const targetScale = ref(1.0);

    return {
        targetScale,
    };
};

export type ZoomPanelModel = ReturnType<typeof useModel>;
