import { DisplayObject } from 'pixi.js';
import { BaseSprite } from './BaseSprite';
import * as PIXI from 'pixi.js';
import { BrushElementModel } from '../../model/element/BrushElementModel';
import { BaseElementModel } from '../../model/element/BaseElementModel';

export class BrushSprite extends BaseSprite {
    sprite: DisplayObject;

    constructor(model: BrushElementModel) {
        console.log('BrushSprite', model);
        super(model);

        this.sprite = new PIXI.Graphics();
    }

    update() {
        super.update();
        if (this.model.points.length > 3) {
            this.graphics.clear();
            this.graphics.lineStyle(this.model.weight, this.model.color);
            for (let index = 0; index < this.model.points.length - 1; index++) {
                const control = this.model.points[index];
                const end = new PIXI.Point(
                    (this.model.points[index].x + this.model.points[index + 1].x) / 2,
                    (this.model.points[index].y + this.model.points[index + 1].y) / 2
                );
                this.graphics.quadraticCurveTo(control.x, control.y, end.x, end.y);
            }
        }
    }

    private get graphics() {
        return this.sprite as PIXI.Graphics;
    }

    private get model() {
        return this._model as BrushElementModel;
    }
}
