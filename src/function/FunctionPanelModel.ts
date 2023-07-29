import { ref } from 'vue';
import { FunctionPanelItem } from '../Defines';

export const useModel = () => {
    const selected = ref<FunctionPanelItem>('selector');
    const showPanel = ref<boolean>(false);

    return {
        selected,
        showPanel,
    };
};

export type FunctionPanelModel = ReturnType<typeof useModel>;
