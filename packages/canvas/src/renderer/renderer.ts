import * as PIXI from 'pixi.js';

export class BlitzRenderer {
    private _pixi: PIXI.Application;

    constructor(canvas: HTMLCanvasElement) {
        this._pixi = new PIXI.Application({
            view: canvas,
            background: '#fff',
            antialias: true,
            autoDensity: true,
            resizeTo: canvas.parentElement!,
            resolution: window.devicePixelRatio,
        });
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = this._pixi;
    }
}
