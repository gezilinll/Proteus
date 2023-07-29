import { useModel } from './FunctionPanelModel';
import { FunctionPanelService } from './FunctionPanelService';

const usePresenter = () => {
    const model = useModel();
    const service = new FunctionPanelService(model);

    const handleSelectorClicked = () => {
        service.handleItemClicked('selector');
    };

    const handleGrabClicked = () => {
        service.handleItemClicked('grab');
    };

    const handleBrushClicked = () => {
        service.handleItemClicked('brush');
    };

    return {
        model,
        handleSelectorClicked,
        handleGrabClicked,
        handleBrushClicked,
    };
};

export default usePresenter;
