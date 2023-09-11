import { ElementService } from '../ElementService';
import { BrushElementModel } from './BrushElementModel';
import * as PIXI from 'pixi.js';

export class BrushElementService extends ElementService {
    sprite: PIXI.DisplayObject;

    private _lastPoint: PIXI.Point | null = null;
    private _dirty: boolean = false;

    constructor(model: BrushElementModel) {
        super(model);

        this.sprite = new PIXI.Graphics();
    }

    setColor(color: string) {
        this.model.color = color;
        this._dirty = true;
    }

    setWeight(weight: number) {
        this.model.weight = weight;
        this._dirty = true;
    }

    lineTo(deltaX: number, deltaY: number) {
        if (!this._lastPoint) {
            this._lastPoint = new PIXI.Point(0, 0);
        }
        this._lastPoint = new PIXI.Point(this._lastPoint.x + deltaX, this._lastPoint.y + deltaY);

        this.model.points.push(this._lastPoint);
        this._dirty = true;
    }

    render(): void {
        if (this._dirty && this.model.points.length > 3) {
            this.graphics.clear();
            this.graphics.lineStyle(this.model.weight, this.model.color);
            for (let index = 0; index < this.model.points.length - 1; index++) {
                let control = this.model.points[index];
                let end = new PIXI.Point(
                    (this.model.points[index].x + this.model.points[index + 1].x) / 2,
                    (this.model.points[index].y + this.model.points[index + 1].y) / 2
                );
                this.graphics.quadraticCurveTo(control.x, control.y, end.x, end.y);
            }
            this._dirty = false;
        }
    }

    toJSON() {
        return {
            ...super.toJSON(),
            points: this.model.points,
            color: this.model.color,
            weight: this.model.weight,
        };
    }

    private get model() {
        return this._model as BrushElementModel;
    }

    private get graphics() {
        return this.sprite as PIXI.Graphics;
    }
}
