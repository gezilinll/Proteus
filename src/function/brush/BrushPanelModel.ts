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
            color: 'rgba(254, 249, 157, 0.6)',
        },
        { weight: 20, color: 'rgba(240, 185, 20, 0.6)' },
        { weight: 20, color: 'rgba(227, 241, 156, 0.6)' },
    ]);
    const highlighterConfigIndex = ref(0);

    const brushColor = ref(penConfigs[0].color);
    const brushWeight = ref(penConfigs[0].weight);
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
