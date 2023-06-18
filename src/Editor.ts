import { YBinding } from './collaborate/YBinding';
import * as Y from 'yjs';
import { Element } from './elements/Element';
import { useEditorStore, FunctionType } from './Editor.store';
import { Graphics } from './elements/Graphics';

export class Editor {
    private _yBinding: YBinding | null = null;
    private _store = useEditorStore();

    currentElement: Element | null = null;

    constructor() {}

    collaborate(document: Y.Doc) {
        this._yBinding = new YBinding(document);
    }

    onMouseDown(e: MouseEvent) {
        if (!this.currentElement) {
            if (this._store.selectedFunction === FunctionType.Draw) {
                this.currentElement = new Graphics();
            }
        }
        this.currentElement?.onMouseDown(e);
    }

    onMouseMove(e: MouseEvent) {
        this.currentElement?.onMouseMove(e);
    }

    onMouseUp(e: MouseEvent) {
        this.currentElement?.onMouseUp(e);
        this.currentElement = null;
    }
}
