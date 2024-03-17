import * as Y from 'yjs';

import { Point } from '../base/point';
import { Element } from './base-element';
import { ElementType } from './types';

export class BrushElement extends Element {
    constructor() {
        super();

        this._liveElement.set('type', 'brush' as ElementType);
        this._liveElement.set('moveTo', { x: 0, y: 0 });
        this._liveElement.set('lineTo', new Y.Array<Point>());
    }

    set moveTo(point: Point) {
        this._liveElement.set('moveTo', { x: point.x, y: point.y });
    }
    get moveTo() {
        return this.liveElement.get('moveTo')! as Point;
    }

    lineTo(point: Point) {
        (this._liveElement.get('lineTo')! as Y.Array<Point>).push([{ x: point.x, y: point.y }]);
    }

    get lineToPoints() {
        return (this._liveElement.get('lineTo')! as Y.Array<Point>).toArray() as Point[];
    }
}
