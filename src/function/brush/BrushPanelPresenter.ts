import { watch } from 'vue';
import { useModel } from './BrushPanelModel';
import { BrushPanelService } from './BrushPanelService';

const usePresenter = () => {
    const model = useModel();
    const service = new BrushPanelService(model);

    const handlePenClicked = () => {
        service.handleItemClicked('pen');
    };

    const handleHighlighterClicked = () => {
        service.handleItemClicked('highlighter');
    };

    const handleEraserClicked = () => {
        service.handleItemClicked('eraser');
    };

    const handlePenConfigClicked = (index: number) => {
        service.handleConfigClick(index);
    };

    const handleHighlighterConfigClicked = (index: number) => {
        service.handleConfigClick(index);
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
