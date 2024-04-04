import { useBoardStore } from '@blitz/editor';
import { ref, watch } from 'vue';

import { BrushType, useCreationStore } from '../../store/creation';

const usePresenter = () => {
    const store = useCreationStore();
    const editor = useBoardStore();

    const showConfigPanel = ref(true);

    const handlePenClicked = () => {
        handleItemClicked('pen');
        editor.brushParam.weight =
            store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].weight;
        editor.brushParam.color =
            store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].color;
    };

    const handleHighlighterClicked = () => {
        handleItemClicked('highlighter');
        editor.brushParam.weight =
            store.brushConfig.highlighterConfigs[
                store.brushConfig.currentHighlighterConfigIndex
            ].weight;
        editor.brushParam.color =
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
            editor.brushParam.weight = store.brushConfig.penConfigs[index].weight;
            editor.brushParam.color = store.brushConfig.penConfigs[index].color;
        } else if (type === 'highlighter') {
            sameIndexClicked = store.brushConfig.currentHighlighterConfigIndex === index;

            store.brushConfig.currentHighlighterConfigIndex = index;
            editor.brushParam.weight = store.brushConfig.highlighterConfigs[index].weight;
            editor.brushParam.color = store.brushConfig.highlighterConfigs[index].color;
        }
        if (sameIndexClicked) {
            showConfigPanel.value = !showConfigPanel.value;
        }
    };

    watch(
        () => editor.brushParam.color,
        () => {
            if (store.brushConfig.type === 'pen') {
                store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].color =
                    editor.brushParam.color;
            } else if (store.brushConfig.type === 'highlighter') {
                store.brushConfig.highlighterConfigs[
                    store.brushConfig.currentHighlighterConfigIndex
                ].color = editor.brushParam.color;
            }
        }
    );

    watch(
        () => editor.brushParam.weight,
        () => {
            if (store.brushConfig.type === 'pen') {
                store.brushConfig.penConfigs[store.brushConfig.currentPenConfigIndex].weight =
                    editor.brushParam.weight;
            } else if (store.brushConfig.type === 'highlighter') {
                store.brushConfig.highlighterConfigs[
                    store.brushConfig.currentHighlighterConfigIndex
                ].weight = editor.brushParam.weight;
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
