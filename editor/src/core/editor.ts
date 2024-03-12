import { Doc, Element } from '@blitz/store';
import { Subject } from 'rxjs';

export class Editor {
    private _doc: Doc;

    readonly events = {
        addElement: new Subject<Element>(),
        changeElement: new Subject<Element>(),
        removeElement: new Subject<Element>(),
        mouseDown: new Subject<MouseEvent>(),
        mouseMove: new Subject<MouseEvent>(),
        zoom: new Subject<number>(),
    };

    constructor(doc?: Doc) {
        this._doc = doc ?? new Doc();
    }

    addElement(element: Element) {
        this._doc.addElement(element);
    }
}
