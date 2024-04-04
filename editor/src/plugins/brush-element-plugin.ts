import { BrushElement, isBrushElement, Point, Rect } from '@blitz/store';
import { filter, Subscription, throttleTime } from 'rxjs';

import { Editor } from '../core/editor';
import { Plugin } from '../core/plugin';
import { useBoardStore } from '../store/board';

interface CreatingState {
    element: BrushElement;
    rect: Rect;
    initPoint: Point;
}
export class BrushElementPlugin implements Plugin {
    name: string = 'brush-element';

    private _creatingState: CreatingState | null = null;

    private _subscriptions: Subscription[] = [];

    mount(editor: Editor): void {
        const store = useBoardStore();

        this._subscriptions.push(
            editor.events.dragStart
                .pipe(filter((event) => event.type === 'brush'))
                .subscribe((event) => {
                    this._creatingState = {
                        element: new BrushElement(),
                        rect: new Rect(0, 0, 1, 1),
                        initPoint: new Point(event.globalX, event.globalY),
                    };
                    editor.addElement(this._creatingState.element);
                    this._creatingState.element.moveTo = { x: 0, y: 0 };
                    this._creatingState.element.left = event.globalX;
                    this._creatingState.element.top = event.globalY;
                    this._creatingState.element.weight = store.brushParam.weight;
                    this._creatingState.element.color = store.brushParam.color;
                    this._creatingState.element.width = this._creatingState.rect.width;
                    this._creatingState.element.height = this._creatingState.rect.height;
                })
        );
        this._subscriptions.push(
            editor.events.dragging.pipe(throttleTime(25)).subscribe((event) => {
                if (this._creatingState) {
                    this._creatingState.rect.left = Math.min(
                        this._creatingState.rect.left,
                        event.movementX
                    );
                    this._creatingState.rect.right = Math.max(
                        this._creatingState.rect.right,
                        event.movementX
                    );
                    this._creatingState.rect.top = Math.min(
                        this._creatingState.rect.top,
                        event.movementY
                    );
                    this._creatingState.rect.bottom = Math.max(
                        this._creatingState.rect.bottom,
                        event.movementY
                    );
                    this._creatingState.element.width = this._creatingState.rect.width + 2;
                    this._creatingState.element.height = this._creatingState.rect.height + 2;
                    this._creatingState.element.moveTo = {
                        x:
                            Math.abs(
                                Math.min(
                                    this._creatingState.element.moveTo.x,
                                    this._creatingState.rect.left
                                )
                            ) + 1,
                        y:
                            Math.abs(
                                Math.min(
                                    this._creatingState.element.moveTo.y,
                                    this._creatingState.rect.top
                                )
                            ) + 1,
                    };
                    this._creatingState.element.left =
                        this._creatingState.initPoint.x - this._creatingState.element.moveTo.x;
                    this._creatingState.element.top =
                        this._creatingState.initPoint.y - this._creatingState.element.moveTo.y;
                    this._creatingState.element.lineTo({
                        x: event.movementX,
                        y: event.movementY,
                    });
                    editor.events.changeElement.next(this._creatingState.element);
                }
            })
        );
        this._subscriptions.push(
            editor.events.dragEnd.subscribe((_event) => {
                this._creatingState = null;
            })
        );

        this._subscriptions.push(
            editor.events.resizeElement.subscribe((data) => {
                if (isBrushElement(data.target)) {
                    const oldW = data.target.width;
                    const oldH = data.target.height;
                    const scaleX = data.newRect.width / oldW;
                    const scaleY = data.newRect.height / oldH;
                    const moveTo = data.target.moveTo;
                    moveTo.x *= scaleX;
                    moveTo.y *= scaleY;
                    const lineToPoints = data.target.lineToPoints;
                    for (const lineTo of lineToPoints) {
                        lineTo.x *= scaleX;
                        lineTo.y *= scaleY;
                    }
                    data.target.left = data.newRect.left;
                    data.target.top = data.newRect.top;
                    data.target.width = data.newRect.width;
                    data.target.height = data.newRect.height;
                    editor.events.changeElement.next(data.target);
                }
            })
        );
    }

    unmount(editor: Editor): void {
        for (const subscription of this._subscriptions) {
            subscription.unsubscribe();
        }
        this._subscriptions = [];
    }
}
