import * as PIXI from 'pixi.js';

import { Editor } from '../core/editor';
import { BrushSpritePlugin } from './plugins/brush-sprite-plugin';
import { Sprite } from './sprites/base-sprite';

export class DocRenderer {
    private _pixi: PIXI.Application;
    private _viewport: PIXI.Container;
    private _editor: Editor;

    constructor(editor: Editor, canvas: HTMLCanvasElement, container: HTMLDivElement) {
        this._editor = editor;

        this._pixi = new PIXI.Application({
            view: canvas,
            hello: true,
            background: '#fff',
            backgroundAlpha: 0,
            antialias: true,
            autoDensity: true,
            resizeTo: container,
            resolution: window.devicePixelRatio,
        });
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = this._pixi;

        this._viewport = new PIXI.Container();
        this._pixi.stage.addChild(this._viewport);

        this._editor.registerPlugin(new BrushSpritePlugin(this));
    }

    addSprite(sprite: Sprite) {
        this._viewport.addChild(sprite.renderObject);
    }

    removeSprite(sprite: Sprite) {
        this._viewport.removeChild(sprite.renderObject);
    }
}
