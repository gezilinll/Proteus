import { Point } from '../model/base/Point';
import { IBaseElement } from './IBaseElement';

export interface IBrushElement extends IBaseElement {
    type: 'brush';

    points: Point[];
    color: string;
    weight: number;
}
