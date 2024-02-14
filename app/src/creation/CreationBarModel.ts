import { ref } from 'vue';

import { CreationType } from '../defines';

export const useModel = () => {
    const selected = ref<CreationType>('selector');
    const showPanel = ref<boolean>(false);

    return {
        selected,
        showPanel,
    };
};

export type CreationBarModel = ReturnType<typeof useModel>;
