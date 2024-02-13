import { Subject } from 'rxjs';

import { Element } from '../element';
import { Plugin } from '../plugin';

export class Editor {
    private _elements: Element[] = [];

    readonly events = {
        addElement: new Subject<Element>(),
        changeElement: new Subject<Element>(),
        removeElement: new Subject<Element>(),
        mouseDown: new Subject<MouseEvent>(),
        mouseMove: new Subject<MouseEvent>(),
        mouseUp: new Subject<MouseEvent>(),
    };

    constructor() {}

    addElement<T extends Element>(element: T) {
        this._elements.push(element);
        this.events.addElement.next(element);
    }

    changeElement<T extends Element>(element: T, changed: Partial<T>) {
        Object.assign(element, changed);
        this.events.changeElement.next(element);
    }

    removeElement<T extends Element>(element: T) {
        this._elements = this._elements.filter((item) => item.id);
        this.events.removeElement.next(element);
    }

    handleMouseDown() {}

    handleMouseMove() {}

    registerPlugin(plugin: Plugin): void {
        plugin.mount(this);
    }

    unregisterPlugin(plugin: Plugin): void {
        plugin.unmount(this);
    }
}
