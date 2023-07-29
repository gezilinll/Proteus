import { useModel as useBackgroundModel } from './background/BackgroundModel';
import { BackgroundService } from './background/BackgroundService';
import * as PIXI from 'pixi.js';
import { FunctionItem } from '../Defines';
import { useModel } from './EditorModel';
import { EditorService } from './EditorService';
import { BrushElementService } from './element/brush/BrushElementService';

const usePresenter = () => {
    const mouse = {
        type: 'moving' as 'pressed' | 'dragging' | 'moving',
        lastX: 0,
        lastY: 0,
    };

    let bgService: BackgroundService | undefined = undefined;
    const editorModel = useModel();
    let editorService: EditorService | undefined = undefined;

    const setup = (canvas: HTMLCanvasElement) => {
        const pixi = new PIXI.Application({
            view: canvas,
            background: '#fff',
            antialias: true,
            autoDensity: true,
            resizeTo: canvas.parentElement!,
            resolution: window.devicePixelRatio,
        });
        pixi.stage.cullable = true;
        pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = pixi;

        const bgModel = useBackgroundModel();
        bgService = new BackgroundService(pixi, bgModel);

        editorModel.viewport.canvasWidth = pixi.view.width;
        editorModel.viewport.canvasHeight = pixi.view.height;
        editorService = new EditorService(pixi, editorModel);
    };

    const onMouseDown = (type: FunctionItem, x: number, y: number) => {
        mouse.type = 'pressed';
        mouse.lastX = x;
        mouse.lastY = y;
        if (editorService) {
            if (type === 'brush') {
                editorModel.creatingElement = editorService.createElement(type);
                editorModel.creatingElement.service?.moveTo(x, y);
            }
        }
    };

    const onMouseMove = (type: FunctionItem, x: number, y: number) => {
        if (mouse.type === 'pressed') {
            mouse.type = 'dragging';
        }
        if (mouse.type === 'dragging' && type === 'grab') {
            bgService?.move(x - mouse.lastX, y - mouse.lastY);
        } else if (mouse.type === 'dragging' && type === 'brush') {
            if (editorModel.creatingElement.service) {
                (editorModel.creatingElement.service as BrushElementService).lineTo(
                    x - mouse.lastX,
                    y - mouse.lastY
                );
            }
        }
        mouse.lastX = x;
        mouse.lastY = y;
    };

    const onMouseUp = (type: FunctionItem) => {
        mouse.type = 'moving';
        editorModel.creatingElement.model = undefined;
        editorModel.creatingElement.service = undefined;
    };

    return { editorModel, setup, onMouseDown, onMouseMove, onMouseUp };
};

export default usePresenter;
