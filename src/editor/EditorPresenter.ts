import { useModel as useBackgroundModel } from './background/BackgroundModel';
import { BackgroundService } from './background/BackgroundService';
import * as PIXI from 'pixi.js';
import { FunctionPanelItem } from '../Defines';
import { useModel } from './EditorModel';
import { EditorService } from './EditorService';
import { BrushElementService } from './element/brush/BrushElementService';
import { BrushElementModel } from './element/brush/BrushElementModel';
import { useAppStore } from '../store/App.store';
import { useEditorStore } from '../store/Editor.store';
import { watch } from 'vue';
import { useUserStore } from '../store/User.store';

const usePresenter = () => {
    const appStore = useAppStore();
    const editorStore = useEditorStore();
    const userStore = useUserStore();

    const mouse = {
        type: 'moving' as 'pressed' | 'dragging' | 'moving',
        lastX: 0,
        lastY: 0,
    };

    let bgService: BackgroundService | undefined = undefined;
    const editorModel = useModel();
    let editorService: EditorService | undefined = undefined;

    const uploadContent = () => {
        if (!editorModel.contentStatus.uploading && editorModel.contentStatus.dirty) {
            editorModel.contentStatus.uploading = true;
            editorModel.contentStatus.dirty = false;
            editorService!
                .uploadContent(editorStore.boardID, editorService!.exportContent(), userStore.token)
                .then(() => {
                    editorModel.contentStatus.uploading = false;
                });
        }
        requestAnimationFrame(uploadContent);
    };

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
            () => editorStore.zoom,
            () => {
                bgService!.zoomTo(editorStore.zoom / 100);
                editorService!.zoomTo(editorStore.zoom / 100);
            }
        );

        watch(
            () => editorStore.boardContent,
            () => {
                if (editorStore.boardContent) {
                    editorService!.loadFromContent(editorStore.boardContent);
                }
            },
            { immediate: true }
        );

        requestAnimationFrame(uploadContent);
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
        if (editorModel.creatingElement.model) {
            editorModel.contentStatus.dirty = true;
        }
        editorModel.creatingElement.model = undefined;
        editorModel.creatingElement.service = undefined;
    };

    return { editorModel, setup, onMouseDown, onMouseMove, onMouseUp };
};

export default usePresenter;
