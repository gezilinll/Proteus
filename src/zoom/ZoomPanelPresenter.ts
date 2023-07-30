import { watch } from 'vue';
import { useModel } from './ZoomPanelModel';
import { ZoomPanelService } from './ZoomPanelService';
import { useAppStore } from '../App.store';

const usePresenter = () => {
    const appStore = useAppStore();
    const model = useModel();
    appStore.zoom = model.current.value;
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

    watch(
        () => model.current.value,
        () => {
            appStore.zoom = model.current.value;
        }
    );

    return {
        model,
        handleZoomOutClicked,
        handleZoomInClicked,
        handleZoomTo100Clicked,
        handleFitToScreenClicked,
    };
};

export default usePresenter;
