import * as Y from 'yjs';
import { Brush } from '../elements/Brush';
import { v4 as uuidv4 } from 'uuid';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { Element } from '../elements/Element';
import * as PIXI from 'pixi.js';

export declare type OnNewElementCallback = (element: Element) => void;

export class WhiteBoard {
    ID: string;
    private _yjsProvider: HocuspocusProvider | undefined = undefined;

    private _origin: string;
    private _doc: Y.Doc;
    private _yElementMap: Y.Map<unknown>;
    private _elementMap: Map<string, Element> = new Map();
    private _callback: OnNewElementCallback | undefined = undefined;

    constructor() {
        this.ID = '';
        this._origin = uuidv4();
        this._doc = new Y.Doc();
        this._yElementMap = this._doc.getMap('elements');
        this._yElementMap.observe((_event, transaction) => {
            if (transaction.origin !== this._origin) {
                console.log(transaction.changed);
                transaction.changed.forEach((value, _key) => {
                    value.forEach((value) => {
                        let element = this._elementMap.get(value!);
                        if (!element) {
                            const yElement = this._yElementMap.get(value!)! as Y.Map<unknown>;
                            if (yElement.get('type') === 'brush') {
                                element = new Brush(value!);
                                this._yToBrush(yElement, element as Brush);
                            }
                            this._yToElement(yElement, element!);
                            this._elementMap.set(element!.id, element!);
                            this._observeElementUpdated(yElement, element!);
                            this._callback?.(element!);
                        }
                    });
                });
            }
        });
    }

    join(roomID: string) {
        this.ID = roomID;
        console.log(roomID);

        this._yjsProvider = new HocuspocusProvider({
            url: 'wss://47.119.150.226:3000',
            name: roomID,
            parameters: { userID: uuidv4(), userName: uuidv4() },
            document: this._doc,
        });
    }

    addElement(element: Element) {
        this._elementMap.set(element.id, element);
        this._doc.transact(() => {
            const yElement = new Y.Map();
            this._elementToY(element, yElement);
            if (element instanceof Brush) {
                this._brushToY(element, yElement);
            }
            this._observeElementUpdated(yElement, element);
            this._yElementMap.set(element.id, yElement);
        }, this._origin);
    }

    updateElement(element: Element) {
        if (!this._doc) {
            return;
        }
        const yElement = this._yElementMap.get(element.id) as Y.Map<unknown>;
        this._doc.transact(() => {
            this._elementToY(element, yElement);
        }, this._origin);
    }

    onNewElement(cb: OnNewElementCallback) {
        this._callback = cb;
    }

    private _elementToY(element: Element, y: Y.Map<unknown>) {
        y.set('id', element.id);
        y.set('left', element.sprite.position.x);
        y.set('top', element.sprite.position.y);
    }

    private _brushToY(element: Brush, y: Y.Map<unknown>) {
        y.set('type', 'brush');
        y.set('color', element.color);
        y.set('weight', element.weight);
        const points = [];
        for (const point of element.points) {
            const yPoint = new Y.Map();
            yPoint.set('x', point.x);
            yPoint.set('y', point.y);
            points.push(yPoint);
        }
        const yPoints = new Y.Array<Y.Map<unknown>>();
        yPoints.push(points);
        y.set('points', yPoints);
    }

    private _yToElement(y: Y.Map<unknown>, element: Element) {
        element.moveTo(y.get('left') as number, y.get('top') as number);
    }

    private _yToBrush(y: Y.Map<unknown>, element: Brush) {
        element.color = y.get('color') as string;
        element.weight = y.get('weight') as number;
        const points = y.get('points') as Y.Array<Y.Map<unknown>>;
        const result: PIXI.Point[] = [];
        for (const point of points) {
            result.push(new PIXI.Point(point.get('x') as number, point.get('y') as number));
        }
        element.points = result;
    }

    private _observeElementUpdated(yElement: Y.Map<unknown>, element: Element) {
        yElement.observe((_event, transaction) => {
            if (transaction.origin !== this._origin) {
                element.moveTo(yElement.get('left') as number, yElement.get('top') as number);
            }
        });
    }
}
