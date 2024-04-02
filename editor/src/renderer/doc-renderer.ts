import * as PIXI from 'pixi.js';

import { Editor } from '../core/editor';
import { BrushSpritePlugin } from './plugins/brush-sprite-plugin';
import { HoveringSelectPlugin } from './plugins/hovering-select-plugin';
import { ZoomDragPlugin } from './plugins/zoom-drag-plugin';
import { BackgroundSprite } from './sprites/background-sprite';
import { Sprite } from './sprites/base-sprite';
import { BBoxSprite } from './sprites/bbox-sprite';
import { ViewportSprite } from './sprites/viewport-sprite';

export class DocRenderer {
    private _pixi: PIXI.Application;
    private _background: BackgroundSprite;
    private _viewport: ViewportSprite;
    private _bbox: BBoxSprite;
    private _editor: Editor;
    private _styleWidth: number;
    private _styleHeight: number;

    constructor(editor: Editor, container: HTMLDivElement) {
        this._editor = editor;

        this._pixi = new PIXI.Application({
            hello: true,
            background: '#fff',
            antialias: false,
            autoDensity: true,
            resizeTo: container,
            resolution: window.devicePixelRatio,
        });
        const canvas = this._pixi.view as HTMLCanvasElement;
        container.appendChild(canvas);
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        (globalThis as any).__PIXI_APP__ = this._pixi;

        this._styleWidth = canvas.width / window.devicePixelRatio;
        this._styleHeight = canvas.height / window.devicePixelRatio;

        this._background = new BackgroundSprite(this._styleWidth, this._styleHeight);
        this._pixi.stage.addChild(this._background.renderObject);

        this._viewport = new ViewportSprite(this._styleWidth, this._styleHeight);
        this._pixi.stage.addChild(this._viewport.renderObject);
        this._editor.registerPlugin(new BrushSpritePlugin(this));
        this._editor.registerPlugin(new ZoomDragPlugin(this));

        this._bbox = new BBoxSprite();
        this._pixi.stage.addChild(this._bbox.renderObject);
        this._editor.registerPlugin(new HoveringSelectPlugin(this._viewport, this._bbox));
    }

    moveViewport(x: number, y: number) {
        this._viewport.setPosition(x, y);
    }

    scaleViewport(target: number) {
        this._viewport.setScale(target);
    }

    moveBackground(x: number, y: number) {
        this._background.setPosition(x, y);
    }

    scaleBackground(target: number) {
        this._background.setScale(target);
    }

    addSprite(sprite: Sprite) {
        this._viewport.addChild(sprite);
    }

    removeSprite(sprite: Sprite) {
        this._viewport.removeChild(sprite);
    }

    get viewportPosition() {
        return this._viewport.renderObject.position;
    }

    get styleWidth() {
        return this._styleWidth;
    }

    get styleHeight() {
        return this._styleHeight;
    }
}
