import { Doc, Element, ElementType } from '@blitz/store';
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
        zoomCanvasTo: new Subject<number>(),
        moveCanvasTo: new Subject<{ x: number; y: number }>(),
        dragStart: new Subject<{ x: number; y: number; type: ElementType }>(),
        dragging: new Subject<{ movementX: number; movementY: number; type: ElementType }>(),
        dragEnd: new Subject<{ type: ElementType }>(),
    };

    constructor(doc?: Doc) {
        this._doc = doc ?? new Doc();
    }

    addElement(element: Element) {
        this._doc.addElement(element);
        this.events.addElement.next(element);
    }

    zoomCanvasTo(value: number) {
        this._zoom = value;
        this.events.zoomCanvasTo.next(this._zoom);
    }

    moveCanvasTo(x: number, y: number) {
        this._drag.x = x;
        this._drag.y = y;
        this.events.moveCanvasTo.next(this._drag);
    }

    registerPlugin(plugin: Plugin) {
        plugin.mount(this);
    }

    get zoom() {
        return this._zoom;
    }

    get drag() {
        return this._drag;
    }
}
