import { v4 as uuidv4 } from 'uuid';
import paper from 'paper';

export class Graphics {
    id: string;

    private _path: paper.Path;
    private _lastPoint: paper.Point | null = null;
    private static MIN_DISTANCE = 5;

    constructor(uuid?: string) {
        this.id = uuid ?? uuidv4();
        this._path = new paper.Path();
        this._path.strokeColor = new paper.Color(Math.random(), Math.random(), Math.random(), 1.0);
        this._path.strokeWidth = Math.random() * 15;
    }

    importData(data: Map<string, any>) {
        this._path.remove();
        this._path = new paper.Path(data.get('path'));
        this._path.strokeColor = new paper.Color(data.get('strokeColor'));
        this._path.strokeWidth = data.get('strokeWidth');
    }

    exportData() {
        const result = new Map();
        result.set('path', this._path.pathData);
        result.set('strokeWidth', this._path.strokeWidth);
        result.set('strokeColor', this._path.strokeColor!.toCSS(false));
        return result;
    }

    addPoint(x: number, y: number) {
        if (
            !this._lastPoint ||
            this._calculateDistance(x, y, this._lastPoint.x, this._lastPoint.y) >=
                Graphics.MIN_DISTANCE
        ) {
            this._lastPoint = new paper.Point(x, y);
            this._path.add(this._lastPoint);
            this._path.smooth();
        }
    }

    private _calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
        const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        return distance;
    }
}
