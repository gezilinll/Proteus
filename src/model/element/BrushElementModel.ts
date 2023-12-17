import { v4 as uuidv4 } from 'uuid';
import { ElementType } from '../../Defines';
import { BaseElementModel } from './BaseElementModel';
import { Point } from '../base/Point';

export class BrushElementModel extends BaseElementModel {
    uuid: string;
    type: ElementType = 'brush';

    points: Point[] = [];
    color: string = '#000000';
    weight: number = 10;

    private _lastPoint: Point | null = null;

    constructor() {
        super();
        this.uuid = `brush_${uuidv4()}`;
    }

    lineTo(deltaX: number, deltaY: number) {
        if (!this._lastPoint) {
            this._lastPoint = { x: 0, y: 0 };
        }
        this._lastPoint = { x: this._lastPoint.x + deltaX, y: this._lastPoint.y + deltaY };

        this.points.push(this._lastPoint);
    }
}
