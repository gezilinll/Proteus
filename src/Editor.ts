import { Element } from './elements/Element';
import { useEditorStore, FunctionType, BrushType } from './Editor.store';
import { Brush } from './elements/Brush';
import * as PIXI from 'pixi.js';
import { Background } from './elements/Background';
import { Viewport } from './elements/Viewport';
import { useRoomStore } from './collaborate/Room.store';
export class Editor {
    private _store = useEditorStore();
    private _room = useRoomStore().room;

    private _pixi: PIXI.Application | null = null;
    private _viewport: Viewport | null = null;
    private _background: Background | null = null;
    private _vpDirty: boolean = false;

    currentElement: Element | null = null;
    selectedElement: Element | undefined = undefined;
    private _selectedElementDouble: Element | undefined = undefined;

    constructor() {
        this._room.onNewOnlineElement((element) => {
            this._viewport!.addChild(element);
        });
        this._room.onWhiteboardConnected(() => {
            for (const element of this._viewport!.elements) {
                this._room.syncNewElement(element);
            }
        });
    }

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
        (globalThis as any).__PIXI_APP__ = this._pixi;
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
        this._vpDirty = true;
    }

    zoom(target: number) {
        this._background!.zoom(target);
        this._viewport!.zoom(target);
        this._vpDirty = true;
    }

    onMouseDown(e: MouseEvent) {
        this._store.useCanvas();
        if (this._store.brushType === BrushType.Selector) {
            this._selectElement(e.offsetX, e.offsetY, false);
        } else {
            this._store.showElementBox = false;
            this._selectedElementDouble = undefined;
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
            } else {
                this._store.showElementBox = true;
                this.selectedElement = undefined;
            }
        }
        if (this.currentElement instanceof Brush) {
            this.currentElement.moveTo(
                (e.offsetX - this._viewport!.position.x) / (this._store.zoom / 100.0),
                (e.offsetY - this._viewport!.position.y) / (this._store.zoom / 100.0)
            );
        }
    }

    onMouseMove(e: MouseEvent) {
        if (this._selectedElementDouble) {
            this._selectedElementDouble.move(
                e.movementX / (this._store.zoom / 100.0),
                e.movementY / (this._store.zoom / 100.0)
            );
            this._store.elementBox.x += e.movementX;
            this._store.elementBox.y += e.movementY;
        } else if (this.currentElement instanceof Brush) {
            this.currentElement.lineTo(
                e.movementX / (this._store.zoom / 100.0),
                e.movementY / (this._store.zoom / 100.0)
            );
        } else if (this._store.brushType == BrushType.Selector && !this.selectedElement) {
            this._selectElement(e.offsetX, e.offsetY, true);
        }
    }

    onMouseUp(e: MouseEvent) {
        if (this.currentElement instanceof Brush) {
            this.currentElement.lineTo(
                e.movementX / (this._store.zoom / 100.0),
                e.movementY / (this._store.zoom / 100.0)
            );
            this._room.syncNewElement(this.currentElement);
        } else if (this.selectedElement) {
            this._room.syncModifiedElement(this.selectedElement);
        }
        this._selectedElementDouble = undefined;
        this.currentElement = null;
        this._store.disablePanelEvents = false;
    }

    private _onPixiRender() {
        const dirtyElements = this._viewport!.render();
        if (this.selectedElement && dirtyElements.length > 0) {
            for (const element of dirtyElements) {
                if (element.id === this.selectedElement.id) {
                    this._store.elementBox = this.selectedElement.bbox;
                }
            }
        } else if (this.selectedElement && this._vpDirty) {
            this._store.elementBox = this.selectedElement.bbox;
            this._vpDirty = false;
        }
    }

    private _selectElement(x: number, y: number, onlyShowBox: boolean) {
        const element = this._viewport!.findElement(x, y);
        if (element) {
            if (!onlyShowBox) {
                this.selectedElement = element;
                this._selectedElementDouble = this.selectedElement;
                this._store.disablePanelEvents = true;
            }
            this._store.showElementBox = true;
            this._store.elementBox = element.bbox;
        } else {
            this.selectedElement = undefined;
            this._store.showElementBox = false;
            this._store.disablePanelEvents = false;
        }
    }
}
