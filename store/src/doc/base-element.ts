import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs';

import { ElementType } from './types';

export class Element {
    protected _liveElement: Y.Map<unknown>;

    constructor() {
        this._liveElement = new Y.Map();
        this._liveElement.set('id', uuidv4() as string);
        this._liveElement.set('type', 'invalid' as ElementType);
        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;
    }

    get id() {
        return this._liveElement.get('id') as string;
    }

    get type() {
        return this._liveElement.get('type') as ElementType;
    }

    set left(value: number) {
        this._liveElement.set('left', value);
    }
    get left() {
        return this._liveElement.get('left') as number;
    }

    set top(value: number) {
        this._liveElement.set('top', value);
    }
    get top() {
        return this._liveElement.get('top') as number;
    }

    set width(value: number) {
        this._liveElement.set('width', value);
    }
    get width() {
        return this._liveElement.get('width') as number;
    }

    set height(value: number) {
        this._liveElement.set('height', value);
    }
    get height() {
        return this._liveElement.get('height') as number;
    }

    get liveElement() {
        return this._liveElement;
    }
}
