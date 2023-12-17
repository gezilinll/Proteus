import * as PIXI from 'pixi.js';
import { BaseElementModel } from '../../model/element/BaseElementModel';

export abstract class BaseSprite {
    abstract sprite: PIXI.DisplayObject;
    protected _model: BaseElementModel;

    constructor(model: BaseElementModel) {
        this._model = model;
        model.registerObserver(this.update.bind(this));
    }

    update() {
        this.sprite.position.x = this._model.position.left;
        this.sprite.position.y = this._model.position.top;
    }
}
