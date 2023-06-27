import { v4 as uuidv4 } from 'uuid';
import { Element } from './Element';
import * as PIXI from 'pixi.js';

export class Brush implements Element {
    type: 'graphics' | 'image' = 'graphics';

    id: string;

    private _graphics: PIXI.Graphics;
    private _lastPoint: paper.Point | null = null;
    private static MIN_DISTANCE = 5;

    private _points: PIXI.Point[] = [];
    private _color: string = '#000000';
    private _weight: number = 10;
    private _dirty: boolean = false;

    constructor(pixi: PIXI.Application, uuid?: string) {
        this.id = uuid ?? uuidv4();
        this._graphics = new PIXI.Graphics();
        pixi.stage.addChild(this._graphics);
    }

    onMouseDown(e: MouseEvent) {
        this._addPoint(e.offsetX, e.offsetY);
    }

    onMouseMove(e: MouseEvent) {
        this._addPoint(e.offsetX, e.offsetY);
    }

    onMouseUp(e: MouseEvent) {
        this._addPoint(e.offsetX, e.offsetY);
    }

    set color(color: string) {
        this._color = color;
        this._dirty = true;
    }

    set weight(value: number) {
        this._weight = value;
        this._dirty = true;
    }

    importData(data: Map<string, any>) {
        // this._path.remove();
        // this._path = new paper.Path(data.get('path'));
        // this._path.strokeColor = new paper.Color(data.get('color'));
        // this._path.strokeWidth = data.get('weight');
        // this._path.opacity = data.get('transparency');
    }

    exportData() {
        const result = new Map();
        // result.set('path', this._path.pathData);
        // result.set('weight', this._path.strokeWidth);
        // result.set('transparency', this._path.opacity);
        // result.set('color', this._path.strokeColor!.toCSS(false));
        return result;
    }

    private _addPoint(x: number, y: number) {
        if (
            !this._lastPoint ||
            this._calculateDistance(x, y, this._lastPoint.x, this._lastPoint.y) >=
                Brush.MIN_DISTANCE
        ) {
            this._points.push(new PIXI.Point(x, y));
            this._dirty = true;
        }
    }

    private _calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return distance;
    }

    render(): void {
        if (this._dirty && this._points.length > 3) {
            console.log(this._weight, this._color);
            this._graphics.lineStyle(this._weight, this._color);
            this._graphics.moveTo(this._points[0].x, this._points[0].y);
            for (let index = 1; index < this._points.length - 1; index++) {
                let control = this._points[index];
                let end = new PIXI.Point(
                    (this._points[index].x + this._points[index + 1].x) / 2,
                    (this._points[index].y + this._points[index + 1].y) / 2
                );
                this._graphics.quadraticCurveTo(control.x, control.y, end.x, end.y);
            }
            this._dirty = false;
        }
    }
}
