import { ElementModel } from '../ElementModel';
import * as PIXI from 'pixi.js';

export class BrushElementModel extends ElementModel {
    points: PIXI.Point[] = [];
    color: string = '#000000';
    weight: number = 10;
}
