import { reactive, ref } from 'vue';
import { BrushPanelItem } from '../../Defines';

export const useModel = () => {
    const selected = ref<BrushPanelItem>('pen');
    const penConfigs = reactive([
        {
            weight: 2,
            color: 'rgb(0, 0, 0)',
        },
        { weight: 10, color: 'rgb(0, 0, 0)' },
        { weight: 20, color: 'rgb(128, 128, 128)' },
    ]);
    const penConfigIndex = ref(0);
    const highlighterConfigs = reactive([
        {
            weight: 20,
            color: 'rgb(254, 249, 157)',
        },
        { weight: 20, color: 'rgb(252, 223, 136)' },
        { weight: 20, color: 'rgb(227, 241, 156)' },
    ]);
    const highlighterConfigIndex = ref(0);

    const brushColor = ref('');
    const brushWeight = ref(2);
    const showConfigPanel = ref(false);

    return {
        selected,
        penConfigs,
        penConfigIndex,
        highlighterConfigs,
        highlighterConfigIndex,
        brushColor,
        brushWeight,
        showConfigPanel,
    };
};

export type BrushPanelModel = ReturnType<typeof useModel>;
