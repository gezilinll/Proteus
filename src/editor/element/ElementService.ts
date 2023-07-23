import { ElementModel } from './ElementModel';
import * as PIXI from 'pixi.js';

export abstract class ElementService {
    abstract sprite: PIXI.DisplayObject;

    protected _model: ElementModel;

    constructor(model: ElementModel) {
        this._model = model;
    }

    move(x: number, y: number) {
        this.sprite.position.x += x;
        this.sprite.position.y += y;

        this._model.position.left = this.sprite.position.x;
        this._model.position.top = this.sprite.position.y;
    }

    moveTo(x: number, y: number) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;

        this._model.position.left = this.sprite.position.x;
        this._model.position.top = this.sprite.position.y;
    }

    abstract render(): void;
}
