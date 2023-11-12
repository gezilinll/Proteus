import { ref } from 'vue';

export const useModel = () => {
    const current = ref(100);
    const target = ref(100);

    return {
        current,
        target,
    };
};

export type ToolsBarModel = ReturnType<typeof useModel>;
