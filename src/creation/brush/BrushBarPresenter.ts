import { watch } from 'vue';
import { useModel } from './BrushBarModel';
import { useBlitzStore } from '../../store/Blitz.store';
import { BrushPanelItem } from '../../Defines';

const usePresenter = () => {
    const blitz = useBlitzStore();
    const model = useModel();

    blitz.brushConfig.weight = model.brushWeight.value;
    blitz.brushConfig.color = model.brushColor.value;

    const handlePenClicked = () => {
        handleItemClicked('pen');
        blitz.brushConfig.weight = model.penConfigs[model.penConfigIndex.value].weight;
        blitz.brushConfig.color = model.penConfigs[model.penConfigIndex.value].color;
    };

    const handleHighlighterClicked = () => {
        handleItemClicked('highlighter');
        blitz.brushConfig.weight =
            model.highlighterConfigs[model.highlighterConfigIndex.value].weight;
        blitz.brushConfig.color =
            model.highlighterConfigs[model.highlighterConfigIndex.value].color;
    };

    const handleEraserClicked = () => {
        handleItemClicked('eraser');
    };

    const handlePenConfigClicked = (index: number) => {
        handleConfigClick(index);
        blitz.brushConfig.weight = model.penConfigs[index].weight;
        blitz.brushConfig.color = model.penConfigs[index].color;
    };

    const handleHighlighterConfigClicked = (index: number) => {
        handleConfigClick(index);
        blitz.brushConfig.weight = model.highlighterConfigs[index].weight;
        blitz.brushConfig.color = model.highlighterConfigs[index].color;
    };

    const handleItemClicked = (type: BrushPanelItem) => {
        model.selected.value = type;
        model.showConfigPanel.value = false;
    };

    const handleConfigClick = (index: number) => {
        if (model.selected.value === 'pen') {
            if (model.penConfigIndex.value === index) {
                model.showConfigPanel.value = !model.showConfigPanel.value;
            }
            model.penConfigIndex.value = index;
            model.brushColor.value = model.penConfigs[index].color;
            model.brushWeight.value = model.penConfigs[index].weight;
        } else if (model.selected.value === 'highlighter') {
            if (model.highlighterConfigIndex.value === index) {
                model.showConfigPanel.value = !model.showConfigPanel.value;
            }
            model.highlighterConfigIndex.value = index;
            model.brushColor.value = model.highlighterConfigs[index].color;
            model.brushWeight.value = model.highlighterConfigs[index].weight;
        }
    };

    watch(
        () => model.brushColor.value,
        () => {
            if (model.selected.value === 'pen') {
                model.penConfigs[model.penConfigIndex.value].color = model.brushColor.value;
            } else if (model.selected.value === 'highlighter') {
                model.highlighterConfigs[model.highlighterConfigIndex.value].color =
                    model.brushColor.value;
            }
            blitz.brushConfig.color = model.brushColor.value;
        }
    );

    watch(
        () => model.brushWeight.value,
        () => {
            if (model.selected.value === 'pen') {
                model.penConfigs[model.penConfigIndex.value].weight = model.brushWeight.value;
            } else if (model.selected.value === 'highlighter') {
                model.highlighterConfigs[model.highlighterConfigIndex.value].weight =
                    model.brushWeight.value;
                blitz.brushConfig.weight = model.brushWeight.value;
            }
        }
    );

    return {
        model,
        handlePenClicked,
        handleHighlighterClicked,
        handleEraserClicked,
        handlePenConfigClicked,
        handleHighlighterConfigClicked,
    };
};

export default usePresenter;
