import { watch } from 'vue';
import { useModel } from './BrushBarModel';
import { BrushBarService } from './BrushBarService';
import { useBlitzStore } from '../../store/Blitz.store';

const usePresenter = () => {
    const blitz = useBlitzStore();
    const model = useModel();
    const service = new BrushBarService(model);

    blitz.brushConfig.weight = model.brushWeight.value;
    blitz.brushConfig.color = model.brushColor.value;

    const handlePenClicked = () => {
        service.handleItemClicked('pen');
        blitz.brushConfig.weight = model.penConfigs[model.penConfigIndex.value].weight;
        blitz.brushConfig.color = model.penConfigs[model.penConfigIndex.value].color;
    };

    const handleHighlighterClicked = () => {
        service.handleItemClicked('highlighter');
        blitz.brushConfig.weight =
            model.highlighterConfigs[model.highlighterConfigIndex.value].weight;
        blitz.brushConfig.color =
            model.highlighterConfigs[model.highlighterConfigIndex.value].color;
    };

    const handleEraserClicked = () => {
        service.handleItemClicked('eraser');
    };

    const handlePenConfigClicked = (index: number) => {
        service.handleConfigClick(index);
        blitz.brushConfig.weight = model.penConfigs[index].weight;
        blitz.brushConfig.color = model.penConfigs[index].color;
    };

    const handleHighlighterConfigClicked = (index: number) => {
        service.handleConfigClick(index);
        blitz.brushConfig.weight = model.highlighterConfigs[index].weight;
        blitz.brushConfig.color = model.highlighterConfigs[index].color;
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
