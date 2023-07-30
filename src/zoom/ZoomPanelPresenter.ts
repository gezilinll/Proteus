import { watch } from 'vue';
import { useModel } from './ZoomPanelModel';
import { ZoomPanelService } from './ZoomPanelService';
import { useAppStore } from '../App.store';

const usePresenter = () => {
    const appStore = useAppStore();
    const model = useModel();
    const service = new ZoomPanelService(model);

    const handleZoomOutClicked = () => {
        service.zoomOut();
    };

    const handleZoomInClicked = () => {
        service.zoomIn();
    };

    const handleZoomTo100Clicked = () => {
        service.zoomTo100();
    };

    const handleFitToScreenClicked = () => {};

    return {
        model,
        handleZoomOutClicked,
        handleZoomInClicked,
        handleZoomTo100Clicked,
        handleFitToScreenClicked,
    };
};

export default usePresenter;
