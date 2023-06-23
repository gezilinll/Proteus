import * as PIXI from 'pixi.js';

export class Background {
    private _sprite: PIXI.TilingSprite;
    private _texture: PIXI.Texture;
    private _canvas: HTMLCanvasElement;
    private _appWidth: number;
    private _appHeight: number;

    constructor(pixi: PIXI.Application, width: number, height: number) {
        this._appWidth = width;
        this._appHeight = height;

        this._canvas = document.createElement('canvas');
        this._texture = PIXI.Texture.from(this._canvas);
        this._sprite = new PIXI.TilingSprite(this._texture, this._appWidth, this._appWidth);
        this._sprite.name = 'background';
        this.renderTexture();

        pixi.stage.addChild(this._sprite);
    }

    private renderTexture() {
        const size = 1;
        const gap = 16;

        this._canvas.width = gap;
        this._canvas.height = gap;
        const context = this._canvas.getContext('2d')!;
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, gap, gap);
        context.fillStyle = '#CCCCCC';
        context.beginPath();
        context.arc(gap / 2, gap / 2, size, 0, Math.PI * 2);
        context.fill();

        this._texture.frame.width = this._texture.orig.width = this._canvas.width;
        this._texture.frame.height = this._texture.orig.height = this._canvas.height;
        console.log(this._appWidth, this._appHeight);
        this._texture.baseTexture.setRealSize(this._canvas.width, this._canvas.height);

        this._texture.updateUvs();
        this._texture.update();
    }
}
