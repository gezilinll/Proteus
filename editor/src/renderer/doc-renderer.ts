import * as PIXI from 'pixi.js';

import { Editor } from '../core/editor';
import { BrushSpritePlugin } from './plugins/brush-sprite-plugin';
import { HoveringPlugin } from './plugins/hovering-plugin';
import { ZoomDragPlugin } from './plugins/zoom-drag-plugin';
import { BackgroundSprite } from './sprites/background-sprite';
import { Sprite } from './sprites/base-sprite';

export class DocRenderer {
    private _pixi: PIXI.Application;
    private _background: BackgroundSprite;
    private _viewport: PIXI.Container;
    private _interaction: PIXI.Container;
    private _editor: Editor;

    constructor(editor: Editor, container: HTMLDivElement) {
        this._editor = editor;

        this._pixi = new PIXI.Application({
            hello: true,
            background: '#fff',
            antialias: true,
            autoDensity: true,
            resizeTo: container,
            resolution: window.devicePixelRatio,
        });
        const canvas = this._pixi.view as HTMLCanvasElement;
        container.appendChild(canvas);
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = this._pixi;

        this._background = new BackgroundSprite(
            canvas.width / window.devicePixelRatio,
            canvas.height / window.devicePixelRatio
        );
        this._pixi.stage.addChild(this._background.renderObject);
        this._background.render();

        this._viewport = new PIXI.Container();
        this._pixi.stage.addChild(this._viewport);
        this._editor.registerPlugin(new BrushSpritePlugin(this));
        this._editor.registerPlugin(new ZoomDragPlugin(this));

        this._interaction = new PIXI.Container();
        this._pixi.stage.addChild(this._interaction);
        this._editor.registerPlugin(new HoveringPlugin(this._viewport, this._interaction));
    }

    moveCanvasTo(x: number, y: number) {
        this._background.moveTo(x, y);
        this._background.render();
    }

    zoomCanvasTo(value: number) {
        this._background.zoomTo(value);
        this._background.render();
    }

    addSprite(sprite: Sprite) {
        this._viewport.addChild(sprite.renderObject);
    }

    removeSprite(sprite: Sprite) {
        this._viewport.removeChild(sprite.renderObject);
    }

    get interaction() {
        return this._interaction;
    }
}
