import { Element } from './elements/Element';
import { useEditorStore, FunctionType, BrushType } from './Editor.store';
import { Brush } from './elements/Brush';
import * as PIXI from 'pixi.js';
import { Background } from './elements/Background';
import { Viewport } from './elements/Viewport';
export class Editor {
    private _store = useEditorStore();

    private _pixi: PIXI.Application | null = null;
    private _viewport: Viewport | null = null;
    private _background: Background | null = null;

    currentElement: Element | null = null;
    selectedElement: Element | undefined = undefined;

    constructor() {}

    pixi(canvas: HTMLCanvasElement) {
        this._pixi = new PIXI.Application({
            view: canvas,
            background: '#fff',
            antialias: true,
            autoDensity: true,
            resizeTo: canvas.parentElement!,
            resolution: window.devicePixelRatio,
        });
        this._pixi.stage.cullable = true;
        this._pixi.stage.eventMode = 'static';
        // @ts-ignore
        globalThis.__PIXI_APP__ = app;
        console.log(
            window.devicePixelRatio,
            canvas.width,
            canvas.height,
            canvas.style.width,
            canvas.style.height
        );
        this._background = new Background(this._pixi, canvas.width, canvas.height);
        this._viewport = new Viewport(this._pixi);
        this._pixi.ticker.add(this._onPixiRender, this);
    }

    move(deltaX: number, deltaY: number) {
        this._background!.move(deltaX, deltaY);
        this._viewport!.move(deltaX, deltaY);
    }

    zoom(target: number) {
        this._background!.zoom(target);
        this._viewport!.zoom(target);
    }

    onMouseDown(e: MouseEvent) {
        this.selectedElement = this._viewport?.findElement(e.offsetX, e.offsetY);
        if (this.selectedElement) {
            this._store.showElementBox = true;
            this._store.elementBox = this.selectedElement.bbox;
        } else {
            this._store.showElementBox = false;
            if (!this.currentElement) {
                if (this._store.selectedFunction === FunctionType.Brush) {
                    this._store.disablePanelEvents = true;
                    this.currentElement = new Brush();
                    this._viewport!.addChild(this.currentElement);
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
        }
        if (this.currentElement instanceof Brush) {
            this.currentElement.addPoint(e.offsetX, e.offsetY);
        }
    }

    onMouseMove(e: MouseEvent) {
        if (this.selectedElement) {
            this.selectedElement.move(e.movementX, e.movementY);
            this._store.elementBox.x += e.movementX;
            this._store.elementBox.y += e.movementY;
        }
        if (this.currentElement instanceof Brush) {
            this.currentElement.addPoint(e.offsetX, e.offsetY);
        }
    }

    onMouseUp(e: MouseEvent) {
        this.selectedElement = undefined;
        if (this.currentElement instanceof Brush) {
            this.currentElement.addPoint(e.offsetX, e.offsetY);
        }
        this.currentElement = null;
        this._store.disablePanelEvents = false;
    }

    private _onPixiRender() {
        this._viewport!.render();
    }
}
