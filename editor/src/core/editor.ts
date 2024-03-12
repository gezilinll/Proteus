import { Doc, Element } from '@blitz/store';
import { Subject } from 'rxjs';

import { Plugin } from './plugin';

export class Editor {
    private _doc: Doc;

    private _zoom: number = 1.0;
    private _drag: { x: number; y: number } = { x: 0, y: 0 };

    readonly events = {
        addElement: new Subject<Element>(),
        changeElement: new Subject<Element>(),
        removeElement: new Subject<Element>(),
        mouseDown: new Subject<MouseEvent>(),
        mouseMove: new Subject<MouseEvent>(),
        zoom: new Subject<number>(),
        drag: new Subject<{ x: number; y: number }>(),
    };

    constructor(doc?: Doc) {
        this._doc = doc ?? new Doc();
    }

    addElement(element: Element) {
        this._doc.addElement(element);
    }

    zoomTo(value: number) {
        this._zoom = value;
        this.events.zoom.next(this._zoom);
    }

    dragTo(x: number, y: number) {
        this._drag.x = x;
        this._drag.y = y;
        this.events.drag.next(this._drag);
    }

    registerPlugin(plugin: Plugin) {
        plugin.mount(this);
    }
}
