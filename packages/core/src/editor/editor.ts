import { Subject, Subscription } from 'rxjs';
import { Plugin as IPlugin } from '../types';
import { Element, Editor as IEditor } from '../types';

export class Editor implements IEditor {
    readonly events = { changeElement: new Subject<Element>() };

    constructor() {}

    changeElement<T extends Element>(element: T, changed: Partial<T>) {}

    registerPlugin(plugin: IPlugin): void {
        plugin.mount(this);
    }

    unregisterPlugin(plugin: IPlugin): void {
        plugin.unmount(this);
    }
}
