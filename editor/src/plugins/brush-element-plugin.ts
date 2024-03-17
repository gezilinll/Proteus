import { BrushElement, Point, Rect } from '@blitz/store';
import { throttleTime } from 'rxjs';

import { Editor } from '../core/editor';
import { Plugin } from '../core/plugin';

interface CreatingState {
    element: BrushElement;
    rect: Rect;
    initPoint: Point;
}
export class BrushElementPlugin implements Plugin {
    name: string = 'brush-element';

    private _creatingState: CreatingState | null = null;

    mount(editor: Editor): void {
        editor.events.dragStart.subscribe((event) => {
            if (event.type === 'brush') {
                this._creatingState = {
                    element: new BrushElement(),
                    rect: new Rect(0, 0, 1, 1),
                    initPoint: new Point(event.x, event.y),
                };
                editor.addElement(this._creatingState.element);
                this._creatingState.element.moveTo = { x: 0, y: 0 };
                this._creatingState.element.left = event.x;
                this._creatingState.element.top = event.y;
                this._creatingState.element.width = this._creatingState.rect.width;
                this._creatingState.element.height = this._creatingState.rect.height;
            }
        });
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
                this._creatingState.element.width = this._creatingState.rect.width;
                this._creatingState.element.height = this._creatingState.rect.height;
                this._creatingState.element.moveTo = {
                    x: Math.abs(
                        Math.min(
                            this._creatingState.element.moveTo.x,
                            this._creatingState.rect.left
                        )
                    ),
                    y: Math.abs(
                        Math.min(this._creatingState.element.moveTo.y, this._creatingState.rect.top)
                    ),
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
        });
        editor.events.dragEnd.subscribe((_event) => {
            this._creatingState = null;
        });
    }

    unmount(editor: Editor): void {}
}
