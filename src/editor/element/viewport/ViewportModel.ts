import { ElementModel } from '../ElementModel';

export class ViewportModel {
    canvasWidth = 0;
    canvasHeight = 0;

    position = {
        left: 0,
        top: 0,
    };

    scale = {
        x: 1,
        y: 1,
    };

    elements: ElementModel[] = [];
}
