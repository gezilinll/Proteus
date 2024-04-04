import { BrushElement } from '@blitz/store';
import * as PIXI from 'pixi.js';

import { Sprite } from './base-sprite';

export class BrushSprite extends Sprite {
    renderObject: PIXI.Container;

    private _canvas: HTMLCanvasElement;
    private _texture: PIXI.Texture;
    private _lastScale: number = 1.0;

    constructor(element: BrushElement) {
        super(element);
        this._canvas = document.createElement('canvas');
        this._texture = PIXI.Texture.from(this._canvas);
        this.renderObject = PIXI.Sprite.from(this._texture);
    }

    render() {
        super.render();

        const element = this.brushElement;

        const ratio = window.devicePixelRatio * this._scale;
        if (
            this._canvas.width !== element.width ||
            this._canvas.height !== element.height ||
            this._lastScale !== this._scale
        ) {
            this._canvas.width = Math.ceil(element.width * ratio);
            this._canvas.height = Math.ceil(element.height * ratio);
            this._lastScale = this._scale;
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
        ctx.moveTo(moveTo.x * ratio, moveTo.y * ratio);
        for (let index = 0; index < points.length - 1; index++) {
            const firstPoint = { x: moveTo.x + points[index].x, y: moveTo.y + points[index].y };
            const secondPoint = {
                x: moveTo.x + points[index + 1].x,
                y: moveTo.y + points[index + 1].y,
            };
            ctx.quadraticCurveTo(
                firstPoint.x * ratio,
                firstPoint.y * ratio,
                ((firstPoint.x + secondPoint.x) / 2) * ratio,
                ((firstPoint.y + secondPoint.y) / 2) * ratio
            );
        }
        ctx.stroke();

        this._texture.baseTexture.update();
        this._texture.update();
        this.renderObject.width = this._element.width;
        this.renderObject.height = this._element.height;
    }

    destroy(): void {
        this._canvas.width = 0;
        this._canvas.height = 0;
    }

    private get brushElement() {
        return this._element as BrushElement;
    }
}
