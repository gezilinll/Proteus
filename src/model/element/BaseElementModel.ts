import { ElementType } from '../../Defines';

export declare type OnElementUpdated = (element: BaseElementModel) => void;

export abstract class BaseElementModel {
    abstract uuid: string;

    abstract type: ElementType;

    position = {
        left: 0,
        top: 0,
    };

    scale = {
        x: 1,
        y: 1,
    };

    private _observer?: OnElementUpdated;

    registerObserver(observer: OnElementUpdated) {
        this._observer = observer;
    }

    notifyUpdated() {
        this._observer?.(this);
    }

    moveTo(x: number, y: number) {
        this.position.left = x;
        this.position.top = y;
    }

    move(deltaX: number, deltaY: number) {
        this.position.left += deltaX;
        this.position.top += deltaY;
    }

    scaleTo(target: number) {
        this.scale.x = target;
        this.scale.y = target;
    }
}
