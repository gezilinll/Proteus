import { watch } from 'vue';
import { useModel } from './ToolsBarModel';
import { ToolsBarService } from './ToolsBarService';
import { useBlitzStore } from '../store/Blitz.store';

const usePresenter = () => {
    const model = useModel();
    const service = new ToolsBarService(model);

    const blitz = useBlitzStore();
    model.current.value = blitz.zoom;
    blitz.registerWheel((x: number, y: number) => {
        if (y > 0) {
            service.zoomOut(10);
        } else if (y < 0) {
            service.zoomIn(10);
        }
    });

    const handleZoomOutClicked = () => {
        service.zoomOut(25);
    };

    const handleZoomInClicked = () => {
        service.zoomIn(25);
    };

    const handleZoomTo100Clicked = () => {
        service.zoomTo100();
    };

    const handleFitToScreenClicked = () => {};

    watch(
        () => model.current.value,
        () => {
            blitz.zoom = model.current.value;
        }
    );
    watch(
        () => blitz.zoom,
        () => {
            model.current.value = blitz.zoom;
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
