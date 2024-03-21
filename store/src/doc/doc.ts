import * as Y from 'yjs';

import { Element } from './base-element';

export class Doc {
    private _liveDoc: Y.Doc;

    constructor() {
        this._liveDoc = new Y.Doc();
    }

    addElement(element: Element) {
        this._liveDoc.getArray('elements').push([element.liveElement]);
    }

    get elements() {
        this._liveDoc.getArray('elements').toArray() as Element[];
    }
}
