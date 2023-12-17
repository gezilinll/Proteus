import { ElementType } from '../../Defines';
import { BaseElementModel } from './BaseElementModel';

export declare type ElementAddedObserver = (addedElement: BaseElementModel) => void;
export declare type ElementRemovedObserver = (removedElement: BaseElementModel) => void;

export class BoardElementModel extends BaseElementModel {
    uuid: string = '';
    type: ElementType = 'board';

    elements: BaseElementModel[] = [];

    private _addedObserver?: ElementAddedObserver;
    private _removedObserver?: ElementAddedObserver;
    private _movedDistance = {
        x: 0,
        y: 0,
    };

    registerElementAddedObserver(observer: ElementAddedObserver) {
        this._addedObserver = observer;
    }

    registerElementRemovedObserver(observer: ElementRemovedObserver) {
        this._removedObserver = observer;
    }

    addElement(element: BaseElementModel) {
        this.elements.push(element);
        this._addedObserver?.(element);
    }

    removeElement(element: BaseElementModel) {
        this.elements = this.elements.filter((e) => e === element);
        this._removedObserver?.(element);
    }

    // move(deltaX: number, deltaY: number): void {
    //     this.position.left -= this._movedDistance.x;
    //     this.position.top -= this._movedDistance.y;

    //     this._movedDistance.x += deltaX;
    //     this._movedDistance.y += deltaY;

    //     this.position.left += this._movedDistance.x;
    //     this.position.top += this._movedDistance.y;
    // }
}
