import * as PIXI from 'pixi.js';

import { Editor } from '../core/editor';
import { BrushSpritePlugin } from './plugins/brush-sprite-plugin';
import { HoveringSelectPlugin } from './plugins/hovering-select-plugin';
import { ZoomDragPlugin } from './plugins/zoom-drag-plugin';
import { BackgroundSprite } from './sprites/background-sprite';
import { Sprite } from './sprites/base-sprite';
import { BBoxSprite } from './sprites/bbox-sprite';
import { ViewportSprite } from './sprites/viewport-sprite';

export interface ViewportParam {
    left: number;
    top: number;
    scale: number;
    styleWidth: number;
    styleHeight: number;
    canvasWidth: number;
    canvasHeight: number;
}

export class DocRenderer {
    private _pixi?: PIXI.Application;

    private _background?: BackgroundSprite;

    private _viewportParam: ViewportParam;
    private _viewport?: ViewportSprite;

    private _bbox?: BBoxSprite;

    constructor() {
        this._viewportParam = {
            left: 0,
            top: 0,
            scale: 1.0,
            styleWidth: 0,
            styleHeight: 0,
            canvasWidth: 0,
            canvasHeight: 0,
        };
    }

    init(editor: Editor, container: HTMLDivElement) {
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

        this._viewportParam.styleWidth = canvas.width / window.devicePixelRatio;
        this._viewportParam.styleHeight = canvas.height / window.devicePixelRatio;
        this._viewportParam.canvasWidth = canvas.width;
        this._viewportParam.canvasHeight = canvas.height;

        this._background = new BackgroundSprite(
            this._viewportParam.styleWidth,
            this._viewportParam.styleHeight
        );
        this._pixi.stage.addChild(this._background.renderObject);

        this._viewport = new ViewportSprite();
        this._pixi.stage.addChild(this._viewport.renderObject);
        editor.registerPlugin(new BrushSpritePlugin(this));
        editor.registerPlugin(new ZoomDragPlugin(this));

        this._bbox = new BBoxSprite();
        this._pixi.stage.addChild(this._bbox.renderObject);
        editor.registerPlugin(new HoveringSelectPlugin(this._viewport, this._bbox));
    }

    moveViewport(x: number, y: number) {
        this._viewportParam.left = x;
        this._viewportParam.top = y;
        this._viewport!.setPosition(x, y);
    }

    scaleViewport(target: number) {
        this._viewportParam.scale = target;
        this._viewport!.setScale(target);
    }

    moveBackground(x: number, y: number) {
        this._background!.setPosition(x, y);
    }

    scaleBackground(target: number) {
        this._background!.setScale(target);
    }

    addSprite(sprite: Sprite) {
        this._viewport!.addChild(sprite);
    }

    removeSprite(sprite: Sprite) {
        this._viewport!.removeChild(sprite);
    }

    getSpriteBounds(elementID: string) {
        return this._viewport!.getSpriteBound(elementID);
    }

    get viewportParam() {
        return this._viewportParam;
    }

    get sprites() {
        return this._viewport!.children;
    }
}
