import { ref, watch } from 'vue';

import { BrushType, useCreationStore } from '../../store/creation';

const usePresenter = () => {
    const store = useCreationStore();

    const showConfigPanel = ref(true);

    const handlePenClicked = () => {
        handleItemClicked('pen');
        store.brushConfig.currentWeight =
            store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].weight;
        store.brushConfig.currentColor =
            store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].color;
    };

    const handleHighlighterClicked = () => {
        handleItemClicked('highlighter');
        store.brushConfig.currentWeight =
            store.brushConfig.highlighterConfigs[
                store.brushConfig.currentHighlighterConfigIndex
            ].weight;
        store.brushConfig.currentColor =
            store.brushConfig.highlighterConfigs[
                store.brushConfig.currentHighlighterConfigIndex
            ].color;
    };

    const handleEraserClicked = () => {
        handleItemClicked('eraser');
    };

    const handlePenConfigClicked = (index: number) => {
        handleConfigClick('pen', index);
    };

    const handleHighlighterConfigClicked = (index: number) => {
        handleConfigClick('highlighter', index);
    };

    const handleItemClicked = (type: BrushType) => {
        store.brushConfig.type = type;
    };

    const handleConfigClick = (type: 'pen' | 'highlighter', index: number) => {
        let sameIndexClicked = false;
        if (type === 'pen') {
            sameIndexClicked = store.brushConfig.currentPenConfigIndex === index;
            store.brushConfig.currentPenConfigIndex = index;
            store.brushConfig.currentWeight = store.brushConfig.penConfigs[index].weight;
            store.brushConfig.currentColor = store.brushConfig.penConfigs[index].color;
        } else if (type === 'highlighter') {
            sameIndexClicked = store.brushConfig.currentHighlighterConfigIndex === index;

            store.brushConfig.currentHighlighterConfigIndex = index;
            store.brushConfig.currentWeight = store.brushConfig.highlighterConfigs[index].weight;
            store.brushConfig.currentColor = store.brushConfig.highlighterConfigs[index].color;
        }
        if (sameIndexClicked) {
            showConfigPanel.value = !showConfigPanel.value;
        }
    };

    watch(
        () => store.brushConfig.currentColor,
        () => {
            if (store.brushConfig.type === 'pen') {
                store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].color =
                    store.brushConfig.currentColor;
            } else if (store.brushConfig.type === 'highlighter') {
                store.brushConfig.highlighterConfigs[
                    store.brushConfig.currentHighlighterConfigIndex
                ].color = store.brushConfig.currentColor;
            }
        }
    );

    watch(
        () => store.brushConfig.currentWeight,
        () => {
            if (store.brushConfig.type === 'pen') {
                store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].weight =
                    store.brushConfig.currentWeight;
            } else if (store.brushConfig.type === 'highlighter') {
                store.brushConfig.highlighterConfigs[
                    store.brushConfig.currentHighlighterConfigIndex
                ].weight = store.brushConfig.currentWeight;
            }
        }
    );

    return {
        handlePenClicked,
        handleHighlighterClicked,
        handleEraserClicked,
        handlePenConfigClicked,
        handleHighlighterConfigClicked,
        showConfigPanel,
    };
};

export default usePresenter;
