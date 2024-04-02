import { Doc, Element, ElementType, Point, Rect } from '@blitz/store';
import { Subject } from 'rxjs';

import { Plugin } from './plugin';

export class Editor {
    private _doc: Doc;

    private _selectedElements: Element[] = [];

    readonly events = {
        addElement: new Subject<Element>(),
        changeElement: new Subject<Element>(),
        removeElement: new Subject<Element>(),
        resizeElement: new Subject<{ target: Element; newRect: Rect }>(),
        selectElement: new Subject<Element[]>(),
        unselectElement: new Subject<Element[]>(),
        scale: new Subject<{ target: number; origin?: Point }>(),
        move: new Subject<{ movementX: number; movementY: number }>(),
        dragStart: new Subject<{ globalX: number; globalY: number; type: ElementType }>(),
        dragging: new Subject<{ movementX: number; movementY: number; type: ElementType }>(),
        dragEnd: new Subject<{ type: ElementType }>(),
        hovering: new Subject<{ globalX: number; globalY: number }>(),
        click: new Subject<{ globalX: number; globalY: number }>(),
    };

    constructor(doc?: Doc) {
        this._doc = doc ?? new Doc();
    }

    addElement(element: Element) {
        this._doc.addElement(element);
        this.events.addElement.next(element);
    }

    getElement(id: string) {
        return this._doc.getElement(id);
    }

    selectElement(element: Element) {
        this._selectedElements = [element];
        this.events.selectElement.next(this._selectedElements);
    }

    unselectElement(element?: Element) {
        this.events.unselectElement.next(this._selectedElements);
        this._selectedElements = [];
    }

    scale(value: number, origin?: Point) {
        this.events.scale.next({ target: value, origin });
    }

    move(movementX: number, movementY: number) {
        this.events.move.next({ movementX, movementY });
    }

    registerPlugin(plugin: Plugin) {
        plugin.mount(this);
    }
}
