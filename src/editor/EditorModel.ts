import { reactive, ref } from 'vue';

export declare type FunctionItem = 'selector' | 'grab' | 'brush';

export const useModel = () => {
    const type = ref<FunctionItem>('selector');
    const showPanel = ref<boolean>(false);

    return {
        type,
        showPanel,
    };
};

export type FunctionModel = ReturnType<typeof useModel>;
