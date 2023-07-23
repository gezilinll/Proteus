import { ElementModel } from '../ElementModel';
import { ElementService } from '../ElementService';
import { BrushElementModel } from './BrushElementModel';
import * as PIXI from 'pixi.js';

export class BrushElementService extends ElementService {
    sprite: PIXI.DisplayObject;

    private _dirty: boolean = false;

    constructor(model: ElementModel) {
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

    lineTo(x: number, y: number) {
        this._dirty = true;
    }

    render(): void {
        throw new Error('Method not implemented.');
    }

    private get model() {
        return this._model as BrushElementModel;
    }
}
