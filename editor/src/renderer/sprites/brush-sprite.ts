import { BrushElement } from '@blitz/store';
import * as PIXI from 'pixi.js';

import { Sprite } from './base-sprite';

export class BrushSprite extends Sprite {
    renderObject: PIXI.Container;

    private _canvas: HTMLCanvasElement;

    constructor(element: BrushElement) {
        super(element);
        this._canvas = document.createElement('canvas');
        this.renderObject = PIXI.Sprite.from(this._canvas, { resolution: window.devicePixelRatio });
    }

    render() {
        super.render();

        const element = this.brushElement;

        if (this._canvas.width !== element.width || this._canvas.height !== element.height) {
            this._canvas.width = Math.ceil(element.width * window.devicePixelRatio);
            this._canvas.height = Math.ceil(element.height * window.devicePixelRatio);
            this._canvas.style.width = `${element.width}px`;
            this._canvas.style.height = `${element.height}px`;
        }
        const moveTo = element.moveTo;
        const points = element.lineToPoints;
        if (points.length < 2) {
            return;
        }

        const ctx = this._canvas.getContext('2d')!;
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        ctx.lineWidth = element.weight;
        ctx.strokeStyle = element.color;
        ctx.beginPath();
        ctx.moveTo(moveTo.x * window.devicePixelRatio, moveTo.y * window.devicePixelRatio);
        for (let index = 0; index < points.length - 1; index++) {
            const firstPoint = { x: moveTo.x + points[index].x, y: moveTo.y + points[index].y };
            const secondPoint = {
                x: moveTo.x + points[index + 1].x,
                y: moveTo.y + points[index + 1].y,
            };
            ctx.quadraticCurveTo(
                firstPoint.x * window.devicePixelRatio,
                firstPoint.y * window.devicePixelRatio,
                ((firstPoint.x + secondPoint.x) / 2) * window.devicePixelRatio,
                ((firstPoint.y + secondPoint.y) / 2) * window.devicePixelRatio
            );
        }
        ctx.stroke();

        this._renderObject.texture.update();
    }

    private get _renderObject() {
        return this.renderObject as PIXI.Sprite;
    }

    private get brushElement() {
        return this._element as BrushElement;
    }
}
