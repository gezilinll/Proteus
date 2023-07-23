import { watch } from 'vue';
import { useModel as useBackgroundModel } from './background/BackgroundModel';
import { BackgroundService } from './background/BackgroundService';
import * as PIXI from 'pixi.js';
import { FunctionItem } from '../Defines';

const usePresenter = () => {
    const mouse = {
        type: 'moving' as 'pressed' | 'dragging' | 'moving',
        lastX: 0,
        lastY: 0,
    };

    let bgService: BackgroundService | undefined = undefined;

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
    };

    const onMouseDown = (type: FunctionItem, x: number, y: number) => {
        mouse.type = 'pressed';
        mouse.lastX = x;
        mouse.lastY = y;
    };

    const onMouseMove = (type: FunctionItem, x: number, y: number) => {
        if (mouse.type === 'pressed') {
            mouse.type = 'dragging';
        }
        if (mouse.type === 'dragging' && type === 'grab') {
            bgService?.move(x - mouse.lastX, y - mouse.lastY);
            mouse.lastX = x;
            mouse.lastY = y;
        }
    };

    const onMouseUp = (type: FunctionItem) => {
        mouse.type = 'moving';
    };

    return { setup, onMouseDown, onMouseMove, onMouseUp };
};

export default usePresenter;
