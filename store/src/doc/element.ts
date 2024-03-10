import * as Y from 'yjs';

import { Json } from './types';

export class Element {
    protected _liveElement: Y.Map<Json>;

    constructor() {
        this._liveElement = new Y.Map();
    }

    get left() {
        return this._liveElement.get('left') as number;
    }

    set left(value: number) {
        this._liveElement.set('left', value);
    }

    get liveElement() {
        return this._liveElement;
    }
}
