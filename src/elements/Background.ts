import * as PIXI from 'pixi.js';

export class Background {
    private _sprite: PIXI.Sprite;
    private _canvas: HTMLCanvasElement;
    private _canvasWidth: number;
    private _canvasHeight: number;
    private _styleWidth: number;
    private _styleHeight: number;
    private _zoom: number = 1.0;
    private _translateX: number = 0.0;
    private _translateY: number = 0.0;

    constructor(pixi: PIXI.Application, width: number, height: number) {
        this._canvasWidth = width;
        this._canvasHeight = height;

        this._canvas = document.createElement('canvas');
        this._canvas.width = this._canvasWidth;
        this._canvas.height = this._canvasHeight;
        this._styleWidth = this._canvasWidth / window.devicePixelRatio;
        this._styleHeight = this._canvasHeight / window.devicePixelRatio;
        this._canvas.style.width = this._styleWidth + 'px';
        this._canvas.style.height = this._styleHeight + 'px';

        this._sprite = PIXI.Sprite.from(this._canvas);
        this._sprite.name = 'background';
        pixi.stage.addChild(this._sprite);

        this._render();
    }

    translate(deltaX: number, deltaY: number) {
        this._translateX += deltaX;
        this._translateY += deltaY;
        this._render();
    }

    zoom(target: number) {
        this._zoom = target;
        this._render();
    }

    private _render() {
        const rectSize = 100 * this._zoom;

        const ctx = this._canvas.getContext('2d')!;
        ctx.clearRect(0, 0, this._styleWidth, this._styleHeight);
        ctx.strokeStyle = '#EEEEEE';
        ctx.beginPath();
        const startY = this._styleHeight / 2.0 + this._translateY;
        const startX = this._styleWidth / 2.0 + this._translateX;
        ctx.moveTo(0, startY);
        ctx.lineTo(this._styleWidth, startY);
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, this._styleHeight);
        for (let yIndex = 1; ; yIndex++) {
            const upY = startY - yIndex * rectSize;
            const downY = startY + yIndex * rectSize;
            if (upY < 0 && downY > this._styleHeight) {
                break;
            }
            ctx.moveTo(0, upY);
            ctx.lineTo(this._styleWidth, upY);
            ctx.moveTo(0, downY);
            ctx.lineTo(this._styleWidth, downY);
        }
        for (let xIndex = 1; ; xIndex++) {
            const leftX = startX - xIndex * rectSize;
            const rightX = startX + xIndex * rectSize;
            if (leftX < 0 && rightX > this._styleWidth) {
                break;
            }
            ctx.moveTo(leftX, 0);
            ctx.lineTo(leftX, this._styleHeight);
            ctx.moveTo(rightX, 0);
            ctx.lineTo(rightX, this._styleHeight);
        }
        ctx.stroke();

        this._sprite.texture.update();
    }
}
