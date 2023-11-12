import { useModel as useBackgroundModel } from './background/BackgroundModel';
import { BackgroundService } from './background/BackgroundService';
import * as PIXI from 'pixi.js';
import { FunctionPanelItem } from '../Defines';
import { useModel } from './EditorModel';
import { EditorService } from './EditorService';
import { BrushElementService } from './element/brush/BrushElementService';
import { BrushElementModel } from './element/brush/BrushElementModel';
import { watch } from 'vue';
import { throttle } from 'lodash';
import { storeToRefs } from 'pinia';
import { useBlitzStore } from '../store/Blitz.store';
import { UserAwareness } from '../service/collab/Whiteboard';

const usePresenter = () => {
    const blitz = useBlitzStore();
    const { others } = storeToRefs(blitz);

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
        editorModel.viewport.canvasWidth = pixi.view.width / window.devicePixelRatio;
        editorModel.viewport.canvasHeight = pixi.view.height / window.devicePixelRatio;
        editorService = new EditorService(pixi, editorModel);
        watch(
            () => blitz.zoom,
            () => {
                bgService!.zoomTo(blitz.zoom / 100);
                editorService!.zoomTo(blitz.zoom / 100);
            }
        );
        watch(
            () => blitz.currentBoard.content,
            () => {
                if (blitz.currentBoard.content) {
                    editorService!.loadFromContent(blitz.currentBoard.content);
                }
            },
            { immediate: true }
        );
    };

    const onMouseDown = (type: FunctionPanelItem, x: number, y: number) => {
        mouse.type = 'pressed';
        mouse.lastX = x;
        mouse.lastY = y;
        if (editorService) {
            if (type === 'brush') {
                editorModel.creatingElement = editorService.createElement(type);
                if (editorModel.creatingElement.model && editorModel.creatingElement.service) {
                    const position = editorService.calculateGlobalPosition(x, y);
                    editorModel.creatingElement.service.moveTo(position.x, position.y);
                    (editorModel.creatingElement.model as BrushElementModel).color =
                        blitz.brushConfig.color;
                    (editorModel.creatingElement.model as BrushElementModel).weight =
                        blitz.brushConfig.weight;
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
                    (x - mouse.lastX) / editorService!.zoom,
                    (y - mouse.lastY) / editorService!.zoom
                );
            }
        }
        mouse.lastX = x;
        mouse.lastY = y;

        if (editorService) {
            updateUserMousePosition(x, y);
        }
    };

    const onMouseUp = (type: FunctionPanelItem) => {
        mouse.type = 'moving';
        if (editorModel.creatingElement.model) {
            editorModel.contentStatus.dirty = true;
        }
        editorModel.creatingElement.model = undefined;
        editorModel.creatingElement.service = undefined;
    };

    const updateUserMousePosition = throttle(function (x: number, y: number) {
        if (editorService) {
            const globalPosition = editorService.calculateGlobalPosition(x, y);
            blitz.self.mouseX = globalPosition.x;
            blitz.self.mouseY = globalPosition.y;
        }
    }, 50);

    watch(
        () => others.value,
        () => {
            if (editorService) {
                for (const user of others.value) {
                    editorService.updateUserAwareness(user as unknown as UserAwareness);
                }
            }
        },
        { immediate: true, deep: true }
    );

    return { editorModel, setup, onMouseDown, onMouseMove, onMouseUp };
};

export default usePresenter;
