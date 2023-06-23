import { YBinding } from './collaborate/YBinding';
import * as Y from 'yjs';
import { Element } from './elements/Element';
import { useEditorStore, FunctionType, BrushType } from './Editor.store';
import { Brush } from './elements/Brush';
import paper from 'paper';
import * as PIXI from 'pixi.js';
import { Background } from './elements/Background';
export class Editor {
    private _yBinding: YBinding | null = null;
    private _store = useEditorStore();

    private _pixi: PIXI.Application | null = null;
    private _background: Background;
    private _paper: paper.PaperScope | null = null;

    currentElement: Element | null = null;

    constructor() {}

    collaborate(document: Y.Doc) {
        this._yBinding = new YBinding(document);
    }

    pixi(canvas: HTMLCanvasElement) {
        this._pixi = new PIXI.Application({
            view: canvas,
            background: '#fff',
            antialias: true,
            resizeTo: window,
            resolution: window.devicePixelRatio,
        });
        // @ts-ignore
        globalThis.__PIXI_APP__ = app;
        console.log(canvas.width, canvas.height);
        this._background = new Background(this._pixi, canvas.width, canvas.height);
    }

    paper(canvas: HTMLCanvasElement) {
        this._paper = new paper.PaperScope();
        this._paper.setup(canvas);
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
