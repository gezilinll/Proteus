import { watch } from 'vue';
import { useModel } from './ZoomPanelModel';
import { ZoomPanelService } from './ZoomPanelService';
import { useEditorStore } from '../editor/Editor.store';

const usePresenter = () => {
    const model = useModel();
    const service = new ZoomPanelService(model);

    const editorStore = useEditorStore();
    model.current.value = editorStore.zoom;
    editorStore.registerWheel((x: number, y: number) => {
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
            editorStore.zoom = model.current.value;
        }
    );
    watch(
        () => editorStore.zoom,
        () => {
            model.current.value = editorStore.zoom;
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
