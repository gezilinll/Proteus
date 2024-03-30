import * as Y from 'yjs';

import { Element } from './base-element';

export class Doc {
    private _liveDoc: Y.Doc;
    private _elementsArray: Element[] = [];
    private _elementsMap: Map<string, Element> = new Map();

    constructor() {
        this._liveDoc = new Y.Doc();
    }

    addElement(element: Element) {
        this._liveDoc.getArray('elements').push([element.liveElement]);

        this._elementsArray.push(element);
        this._elementsMap.set(element.id, element);
    }

    getElement(id: string) {
        return this._elementsMap.get(id);
    }

    get elements() {
        return this._elementsArray;
    }
}
