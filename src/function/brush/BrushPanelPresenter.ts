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
        model.penConfigIndex.value = index;
    };

    const handleHighlighterConfigClicked = (index: number) => {
        model.highlighterConfigIndex.value = index;
    };

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
