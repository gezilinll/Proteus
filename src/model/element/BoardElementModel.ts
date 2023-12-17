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
}
