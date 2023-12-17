import { BaseElementModel } from '../../model/element/BaseElementModel';
import { BoardElementModel } from '../../model/element/BoardElementModel';
import * as PIXI from 'pixi.js';
import { BaseSprite } from './BaseSprite';
import { BrushSprite } from './BrushSprite';
import { BrushElementModel } from '../../model/element/BrushElementModel';

export class BoardSprite {
    sprite: PIXI.Container;

    private _model: BoardElementModel;
    private _sprites: BaseSprite[] = [];
    private _spritesMap: Map<string, BaseSprite> = new Map();
    private _canvasWidth: number;
    private _canvasHeight: number;

    constructor(model: BoardElementModel, canvasWidth: number, canvasHeight: number) {
        this._model = model;
        this._canvasWidth = canvasWidth;
        this._canvasHeight = canvasHeight;
        this._model.registerElementAddedObserver(this._onElementAdded.bind(this));
        this._model.registerElementRemovedObserver(this._onElementRemoved.bind(this));
        this._model.registerObserver(this.update.bind(this));

        this.sprite = new PIXI.Container();
    }

    private _onElementAdded(model: BaseElementModel) {
        if (model.type === 'brush') {
            const brush = new BrushSprite(model as BrushElementModel);
            model.registerObserver(this._onElementUpdated.bind(this));
            this._sprites.push(brush);
            this.sprite.addChild(brush.sprite);
            this._spritesMap.set(model.uuid, brush);
        }
    }

    private _onElementRemoved(model: BaseElementModel) {}

    private _onElementUpdated(model: BaseElementModel) {
        this._spritesMap.get(model.uuid)!.update();
    }

    update() {
        const newW = this._canvasWidth * this._model.scale.x;
        const newH = this._canvasHeight * this._model.scale.y;
        const offsetX = (this._canvasWidth - newW) / 2.0;
        const offsetY = (this._canvasHeight - newH) / 2.0;
        this.sprite.position.x = offsetX + this._model.position.left;
        this.sprite.position.y = offsetY + this._model.position.top;
        this.sprite.scale.set(this._model.scale.x, this._model.scale.y);
    }
}
