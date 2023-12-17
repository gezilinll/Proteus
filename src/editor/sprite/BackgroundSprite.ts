import { CanvasModel } from '../../model/CanvasModel';
import * as PIXI from 'pixi.js';

export class BackgroundSprite {
    sprite: PIXI.Sprite;
    private _canvas: HTMLCanvasElement;
    private _model: CanvasModel;

    constructor(model: CanvasModel) {
        this._model = model;

        this._canvas = document.createElement('canvas');
        this._canvas.width = this._model.width;
        this._canvas.height = this._model.height;
        this._canvas.style.width = `${this._model.styleWidth}px`;
        this._canvas.style.height = `${this._model.styleHeight}px`;

        this.sprite = PIXI.Sprite.from(this._canvas, { resolution: window.devicePixelRatio });
        this.sprite.name = 'background';

        this._model.registerObserver(this.update.bind(this));
        this.update();
    }

    update() {
        const zoom = this._model.zoom;
        const canvasWidth = this._model.width;
        const canvasHeight = this._model.height;

        const rectSize = 100 * zoom;

        const ctx = this._canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgb(240, 240, 240)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = 'rgb(224, 224, 224)';
        ctx.beginPath();
        const startY = canvasHeight / 2.0 + this._model.translateY;
        const startX = canvasWidth / 2.0 + this._model.translateX;
        ctx.moveTo(0, startY);
        ctx.lineTo(canvasWidth, startY);
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, canvasHeight);
        for (let yIndex = 1; ; yIndex++) {
            const upY = startY - yIndex * rectSize;
            const downY = startY + yIndex * rectSize;
            if (upY < 0 && downY > canvasHeight) {
                break;
            }
            ctx.moveTo(0, upY);
            ctx.lineTo(canvasWidth, upY);
            ctx.moveTo(0, downY);
            ctx.lineTo(canvasWidth, downY);
        }
        for (let xIndex = 1; ; xIndex++) {
            const leftX = startX - xIndex * rectSize;
            const rightX = startX + xIndex * rectSize;
            if (leftX < 0 && rightX > canvasWidth) {
                break;
            }
            ctx.moveTo(leftX, 0);
            ctx.lineTo(leftX, canvasHeight);
            ctx.moveTo(rightX, 0);
            ctx.lineTo(rightX, canvasHeight);
        }
        ctx.closePath();
        ctx.stroke();

        this.sprite.texture.update();
    }
}
