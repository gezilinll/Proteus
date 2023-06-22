import { YBinding } from './collaborate/YBinding';
import * as Y from 'yjs';
import { Element } from './elements/Element';
import { useEditorStore, FunctionType, BrushType } from './Editor.store';
import { Brush } from './elements/Brush';

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
            if (this._store.selectedFunction === FunctionType.Brush) {
                this._store.disablePanelEvents = true;
                this.currentElement = new Brush();
                const brush = this.currentElement as Brush;
                if (this._store.brushType === BrushType.Pen) {
                    brush.color = this._store.penColor;
                    brush.weight = this._store.penWeight;
                } else if (this._store.brushType === BrushType.Marker) {
                    brush.color = this._store.markerColor;
                    brush.weight = this._store.markerWeight;
                } else if (this._store.brushType === BrushType.Highlighter) {
                    brush.color = this._store.highlighterColor;
                    brush.weight = this._store.highlighterWeight;
                } else if (this._store.brushType === BrushType.Eraser) {
                }
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
        this._store.disablePanelEvents = false;
    }
}
