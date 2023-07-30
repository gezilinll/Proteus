import { useModel as useBackgroundModel } from './background/BackgroundModel';
import { BackgroundService } from './background/BackgroundService';
import * as PIXI from 'pixi.js';
import { FunctionPanelItem } from '../Defines';
import { useModel } from './EditorModel';
import { EditorService } from './EditorService';
import { BrushElementService } from './element/brush/BrushElementService';
import { BrushElementModel } from './element/brush/BrushElementModel';
import { useAppStore } from '../App.store';

const usePresenter = () => {
    const appStore = useAppStore();

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

    const onMouseDown = (type: FunctionPanelItem, x: number, y: number) => {
        mouse.type = 'pressed';
        mouse.lastX = x;
        mouse.lastY = y;
        if (editorService) {
            if (type === 'brush') {
                editorModel.creatingElement = editorService.createElement(type);
                if (editorModel.creatingElement.model && editorModel.creatingElement.service) {
                    editorModel.creatingElement.service.moveTo(x, y);
                    (editorModel.creatingElement.model as BrushElementModel).color =
                        appStore.brushConfig.color;
                    (editorModel.creatingElement.model as BrushElementModel).weight =
                        appStore.brushConfig.weight;
                }
            }
        }
    };

    const onMouseMove = (type: FunctionPanelItem, x: number, y: number) => {
        if (mouse.type === 'pressed') {
            mouse.type = 'dragging';
        }
        if (mouse.type === 'dragging' && type === 'grab') {
            bgService?.move(x - mouse.lastX, y - mouse.lastY);
            editorService?.move(x - mouse.lastX, y - mouse.lastY);
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

    const onMouseUp = (type: FunctionPanelItem) => {
        mouse.type = 'moving';
        editorModel.creatingElement.model = undefined;
        editorModel.creatingElement.service = undefined;
    };

    return { editorModel, setup, onMouseDown, onMouseMove, onMouseUp };
};

export default usePresenter;
