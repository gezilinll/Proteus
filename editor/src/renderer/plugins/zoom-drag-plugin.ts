import { Point } from '@blitz/store';
import * as PIXI from 'pixi.js';
import { Subscription } from 'rxjs';

import { Editor } from '../../core/editor';
import { Plugin } from '../../core/plugin';
import { ViewportParam } from '../../store/board';
import { DocRenderer } from '../doc-renderer';

export class ZoomDragPlugin implements Plugin {
    name: string = 'zoom-drag';

    private _renderer: DocRenderer;

    private _backgroundParam: ViewportParam = { left: 0, top: 0, scale: 1.0 };

    private _subscriptions: Subscription[] = [];

    constructor(renderer: DocRenderer) {
        this._renderer = renderer;
    }

    mount(editor: Editor): void {
        this._subscriptions.push(
            editor.events.scale.subscribe((value) => {
                const origin =
                    value.origin ??
                    new Point(
                        this._renderer.viewportParam.styleWidth / 2,
                        this._renderer.viewportParam.styleHeight / 2
                    );
                this._updateViewport(value.target, origin, 0, 0);
                this._updateBackground(value.target, origin, 0, 0);
                for (const child of this._renderer.sprites) {
                    child.scale = value.target;
                    child.render();
                }
                editor.events.viewportChanged.next({ ...this._renderer.viewportParam });
            }),
            editor.events.move.subscribe((value) => {
                this._updateViewport(
                    this._renderer.viewportParam.scale,
                    new Point(0, 0),
                    value.movementX,
                    value.movementY
                );
                this._updateBackground(
                    this._backgroundParam.scale,
                    new Point(0, 0),
                    value.movementX,
                    value.movementY
                );
                editor.events.viewportChanged.next({ ...this._renderer.viewportParam });
            })
        );
    }

    private _updateViewport(scale: number, origin: Point, movementX: number, movementY: number) {
        const matrix = PIXI.Matrix.IDENTITY.translate(-origin.x, -origin.y)
            .scale(1 / this._renderer.viewportParam.scale, 1 / this._renderer.viewportParam.scale)
            .scale(scale, scale)
            .translate(origin.x, origin.y);
        const to = matrix.apply({
            x: this._renderer.viewportParam.left + movementX,
            y: this._renderer.viewportParam.top + movementY,
        });
        this._renderer.moveViewport(to.x, to.y);
        this._renderer.scaleViewport(scale);
    }

    private _updateBackground(scale: number, origin: Point, movementX: number, movementY: number) {
        const matrix = PIXI.Matrix.IDENTITY.translate(-origin.x, -origin.y)
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

    unmount(editor: Editor): void {
        for (const subscription of this._subscriptions) {
            subscription.unsubscribe();
        }
        this._subscriptions = [];
    }
}
