import * as PIXI from 'pixi.js';
import { Element } from './Element';

export class Viewport {
    private _vp: PIXI.Container;
    private _oriWidth: number;
    private _oriHeight: number;
    elements: Element[] = [];

    constructor(app: PIXI.Application) {
        console.log(app.view.width, app.view.height, app.renderer.events);
        this._oriWidth = app.view.width / window.devicePixelRatio;
        this._oriHeight = app.view.height / window.devicePixelRatio;
        this._vp = new PIXI.Container();
        app.stage.addChild(this._vp);
    }

    move(deltaX: number, deltaY: number) {
        this._vp.position.x += deltaX;
        this._vp.position.y += deltaY;
    }

    zoom(target: number) {
        this._vp.scale.set(target, target);
        const targetW = this._oriWidth * target;
        const targetH = this._oriHeight * target;
        console.log(
            targetW,
            targetH,
            this._oriWidth,
            this._oriHeight,
            target,
            (this._oriWidth - targetW) / 2.0,
            (this._oriHeight - targetH) / 2.0
        );
        this._vp.position.x = (this._oriWidth - targetW) / 2.0;
        this._vp.position.y = (this._oriHeight - targetH) / 2.0;
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

    render() {
        for (const element of this.elements) {
            element.render();
        }
    }
}
