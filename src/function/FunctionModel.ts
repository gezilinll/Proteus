import { reactive, ref } from 'vue';
import { FunctionItem } from '../Defines';

export const useModel = () => {
    const type = ref<FunctionItem>('selector');
    const showPanel = ref<boolean>(false);

    return {
        type,
        showPanel,
    };
};

export type FunctionModel = ReturnType<typeof useModel>;
