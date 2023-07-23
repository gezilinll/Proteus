import * as PIXI from 'pixi.js';
import { BackgroundModel } from './BackgroundModel';

export class BackgroundService {
    private _sprite: PIXI.Sprite;
    private _canvas: HTMLCanvasElement;
    private _model: BackgroundModel;

    constructor(pixi: PIXI.Application, model: BackgroundModel) {
        this._model = model;

        this._model.canvasSize.width = pixi.view.width;
        this._model.canvasSize.height = pixi.view.height;

        this._canvas = document.createElement('canvas');
        this._canvas.width = this._model.canvasSize.width;
        this._canvas.height = this._model.canvasSize.height;
        this._model.styleSize.width = this._model.canvasSize.width / window.devicePixelRatio;
        this._model.styleSize.height = this._model.canvasSize.height / window.devicePixelRatio;
        this._canvas.style.width = this._model.styleSize.width + 'px';
        this._canvas.style.height = this._model.styleSize.height + 'px';

        this._sprite = PIXI.Sprite.from(this._canvas, { resolution: window.devicePixelRatio });
        this._sprite.name = 'background';
        pixi.stage.addChild(this._sprite);

        this._render();
    }

    move(deltaX: number, deltaY: number) {
        this._model.translate.x += deltaX * window.devicePixelRatio;
        this._model.translate.y += deltaY * window.devicePixelRatio;
        this._render();
    }

    zoom(target: number) {
        this._model.zoom.value = target;
        this._render();
    }

    private _render() {
        const zoom = this._model.zoom.value;
        const { width: canvasWidth, height: canvasHeight } = this._model.canvasSize;

        const rectSize = 100 * zoom;

        const ctx = this._canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgb(240, 240, 240)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = 'rgb(224, 224, 224)';
        ctx.beginPath();
        const startY = canvasHeight / 2.0 + this._model.translate.y;
        const startX = canvasWidth / 2.0 + this._model.translate.x;
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

        this._sprite.texture.update();
    }
}
