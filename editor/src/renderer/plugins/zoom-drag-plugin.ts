import { Point } from '@blitz/store';
import * as PIXI from 'pixi.js';

import { Editor } from '../../core/editor';
import { Plugin } from '../../core/plugin';
import { useEditorStore, ViewportParam } from '../../core/store';
import { DocRenderer } from '../doc-renderer';

export class ZoomDragPlugin implements Plugin {
    name: string = 'zoom-drag';

    private _renderer: DocRenderer;

    private _store = useEditorStore();
    private _backgroundParam: ViewportParam = { left: 0, top: 0, scale: 1.0 };

    constructor(renderer: DocRenderer) {
        this._renderer = renderer;
    }

    mount(editor: Editor): void {
        editor.events.scale.subscribe((value) => {
            const origin =
                value.origin ??
                new Point(this._renderer.canvasWidth / 2, this._renderer.canvasHeight / 2);
            this._updateViewport(value.target, origin, 0, 0);
            this._updateBackground(value.target, origin, 0, 0);
        });

        editor.events.move.subscribe((value) => {
            const origin =
                this._store.viewport.origin ??
                new Point(this._renderer.canvasWidth / 2, this._renderer.canvasHeight / 2);
            this._updateViewport(
                this._store.viewport.scale,
                origin,
                value.movementX,
                value.movementY
            );
            this._updateBackground(
                this._backgroundParam.scale,
                origin,
                value.movementX,
                value.movementY
            );
        });
    }

    unmount(editor: Editor): void {}

    private _updateViewport(scale: number, origin: Point, movementX: number, movementY: number) {
        const matrix = PIXI.Matrix.IDENTITY.translate(
            -origin.x * window.devicePixelRatio,
            -origin.y * window.devicePixelRatio
        )
            .scale(1 / this._store.viewport.scale, 1 / this._store.viewport.scale)
            .scale(scale, scale)
            .translate(origin.x, origin.y);
        const to = matrix.apply({
            x: this._store.viewport.left + movementX,
            y: this._store.viewport.top + movementY,
        });
        this._renderer.moveViewport(to.x, to.y);
        this._renderer.scaleViewport(scale);
        this._store.viewport.left = to.x;
        this._store.viewport.top = to.y;
        this._store.viewport.scale = scale;
        this._store.viewport.origin = origin;
    }

    private _updateBackground(scale: number, origin: Point, movementX: number, movementY: number) {
        const matrix = PIXI.Matrix.IDENTITY.translate(
            -origin.x * window.devicePixelRatio,
            -origin.y * window.devicePixelRatio
        )
            .scale(this._backgroundParam.scale, this._backgroundParam.scale)
            .scale(1 / scale, 1 / scale)
            .translate(origin.x, origin.y);
        const to = matrix.apply({
            x: this._backgroundParam.left + movementX,
            y: this._backgroundParam.top + movementY,
        });
        this._renderer.moveBackground(to.x, to.y);
        this._renderer.scaleBackground(scale);
        this._backgroundParam.left = to.x;
        this._backgroundParam.top = to.y;
        this._backgroundParam.scale = scale;
        this._backgroundParam.origin = origin;
    }
}
