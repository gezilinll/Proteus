import * as PIXI from 'pixi.js';

export class Background {
    private _sprite: PIXI.Sprite;
    private _canvas: HTMLCanvasElement;
    private _fullWidth: number;
    private _fullHeight: number;
    private _zoom: number = 1.0;
    private _translateX: number = 0.0;
    private _translateY: number = 0.0;

    constructor(pixi: PIXI.Application, width: number, height: number) {
        this._fullWidth = width;
        this._fullHeight = height;

        this._canvas = document.createElement('canvas');
        this._canvas.width = this._fullWidth;
        this._canvas.height = this._fullHeight;
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
        ctx.clearRect(0, 0, this._fullWidth, this._fullHeight);
        ctx.strokeStyle = '#EEEEEE';
        ctx.beginPath();
        const startY = this._fullHeight / 2.0 + this._translateY;
        const startX = this._fullWidth / 2.0 + this._translateX;
        ctx.moveTo(0, startY);
        ctx.lineTo(this._fullWidth, startY);
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, this._fullHeight);
        for (let yIndex = 1; ; yIndex++) {
            const upY = startY - yIndex * rectSize;
            const downY = startY + yIndex * rectSize;
            if (upY < 0 && downY > this._fullHeight) {
                break;
            }
            ctx.moveTo(0, upY);
            ctx.lineTo(this._fullWidth, upY);
            ctx.moveTo(0, downY);
            ctx.lineTo(this._fullWidth, downY);
        }
        for (let xIndex = 1; ; xIndex++) {
            const leftX = startX - xIndex * rectSize;
            const rightX = startX + xIndex * rectSize;
            if (leftX < 0 && rightX > this._fullWidth) {
                break;
            }
            ctx.moveTo(leftX, 0);
            ctx.lineTo(leftX, this._fullHeight);
            ctx.moveTo(rightX, 0);
            ctx.lineTo(rightX, this._fullHeight);
        }
        ctx.stroke();

        this._sprite.texture.update();
    }
}
