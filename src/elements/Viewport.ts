import * as PIXI from 'pixi.js';
import { Element } from './Element';

export class Viewport {
    private _vp: PIXI.Container;
    private _oriWidth: number;
    private _oriHeight: number;
    private _moveX: number = 0;
    private _moveY: number = 0;
    elements: Element[] = [];

    constructor(app: PIXI.Application) {
        this._oriWidth = app.view.width / window.devicePixelRatio;
        this._oriHeight = app.view.height / window.devicePixelRatio;
        this._vp = new PIXI.Container();
        this._vp.name = 'Viewport';
        app.stage.addChild(this._vp);
    }

    move(deltaX: number, deltaY: number) {
        this._vp.position.x -= this._moveX;
        this._vp.position.y -= this._moveY;

        this._moveX += deltaX;
        this._moveY += deltaY;

        this._vp.position.x += this._moveX;
        this._vp.position.y += this._moveY;
    }

    zoom(target: number) {
        this._vp.scale.set(target, target);
        const newW = this._oriWidth * target;
        const newH = this._oriHeight * target;
        const offsetX = (this._oriWidth - newW) / 2.0;
        const offsetY = (this._oriHeight - newH) / 2.0;
        this._vp.position.x = offsetX + this._moveX;
        this._vp.position.y = offsetY + this._moveY;
    }

    addChild(element: Element) {
        this._vp.addChild(element.sprite);
        this.elements.push(element);
    }

    findElement(x: number, y: number) {
        return this.elements.find((element) => {
            return element.isInHitArea(x, y);
        });
    }

    render(): Element[] {
        const dirtyElements = [];
        for (const element of this.elements) {
            if (element.render()) {
                dirtyElements.push(element);
            }
        }
        return dirtyElements;
    }

    get position() {
        return this._vp.position;
    }
}
