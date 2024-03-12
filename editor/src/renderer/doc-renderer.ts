import * as PIXI from 'pixi.js';

export class DocRenderer {
    private _pixi: PIXI.Application;

    constructor() {
        this._pixi = new PIXI.Application();
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = this._pixi;
    }

    async init(container: HTMLDivElement, canvas?: HTMLCanvasElement) {
        await this._pixi.init({
            canvas,
            hello: true,
            background: '#fff',
            backgroundAlpha: 0,
            antialias: true,
            autoDensity: true,
            resizeTo: container,
            resolution: window.devicePixelRatio,
        });
    }

    get canvas(): HTMLCanvasElement {
        return this._pixi.canvas;
    }
}
