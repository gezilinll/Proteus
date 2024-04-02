import * as PIXI from 'pixi.js';

export class BackgroundSprite {
    renderObject: PIXI.Sprite;

    private _canvas: HTMLCanvasElement;
    private _zoom: number = 1.0;
    private _moveX: number = 0;
    private _moveY: number = 0;

    constructor(width: number, height: number) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = width * window.devicePixelRatio;
        this._canvas.height = height * window.devicePixelRatio;
        this._canvas.style.width = `${width}px`;
        this._canvas.style.height = `${height}px`;

        this.renderObject = PIXI.Sprite.from(this._canvas, { resolution: window.devicePixelRatio });
        this._render();
    }

    setScale(value: number) {
        this._zoom = value;
        this._render();
    }

    setPosition(x: number, y: number) {
        this._moveX = x;
        this._moveY = y;
        this._render();
    }

    private _render(): void {
        const ctx = this._canvas.getContext('2d')!;

        ctx.fillStyle = 'rgb(240, 240, 240)';
        ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);

        const gridSize = 100 / this._zoom;

        const startX = this._moveX % gridSize;
        const startY = this._moveY % gridSize;

        ctx.strokeStyle = 'rgb(222, 222, 222)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = startY; i <= this._canvas.height; i += gridSize) {
            ctx.moveTo(0, i);
            ctx.lineTo(this._canvas.width, i);
        }
        for (let j = startX; j <= this._canvas.width; j += gridSize) {
            ctx.moveTo(j, 0);
            ctx.lineTo(j, this._canvas.height);
        }
        ctx.stroke();

        this.renderObject.texture.update();
    }
}
