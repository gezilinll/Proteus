import { ElementType } from '../../../Defines';
import { ElementModel } from '../ElementModel';
import { v4 as uuidv4 } from 'uuid';
import * as PIXI from 'pixi.js';

export class BrushElementModel extends ElementModel {
    uuid: string;
    type: ElementType = 'brush';

    points: PIXI.Point[] = [];
    color: string = '#000000';
    weight: number = 10;

    constructor() {
        super();
        this.uuid = 'brush_' + uuidv4();
    }
}
