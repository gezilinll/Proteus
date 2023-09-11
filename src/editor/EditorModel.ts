import { reactive } from 'vue';
import { ViewportModel } from './element/viewport/ViewportModel';
import { ElementModel } from './element/ElementModel';
import { ElementService } from './element/ElementService';

export type Element = { model: undefined | ElementModel; service: undefined | ElementService };

export const useModel = () => {
    const viewport = reactive<ViewportModel>({
        canvasWidth: 0,
        canvasHeight: 0,
        elements: [],
        position: { left: 0, top: 0 },
        scale: { x: 1, y: 1 },
    });

    const creatingElement = reactive<Element>({
        model: undefined,
        service: undefined,
    });

    const contentStatus = reactive({
        dirty: false,
        uploading: false,
    });

    return { viewport, creatingElement, contentStatus };
};

export type EditorModel = ReturnType<typeof useModel>;
