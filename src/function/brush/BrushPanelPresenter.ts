import { watch } from 'vue';
import { useModel } from './BrushPanelModel';
import { BrushPanelService } from './BrushPanelService';

const usePresenter = () => {
    const model = useModel();
    const service = new BrushPanelService(model);

    const handlePenClicked = () => {
        service.handleItemClicked('pen');
        model.showColorPanel.value = false;
    };

    const handleHighlighterClicked = () => {
        service.handleItemClicked('highlighter');
        model.showColorPanel.value = false;
    };

    const handleEraserClicked = () => {
        service.handleItemClicked('eraser');
        model.showColorPanel.value = false;
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
