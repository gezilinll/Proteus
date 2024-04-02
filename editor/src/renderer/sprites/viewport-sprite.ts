import * as PIXI from 'pixi.js';

import { Sprite } from './base-sprite';

export class ViewportSprite {
    renderObject: PIXI.Container;

    private _children: Sprite[] = [];

    private _originW: number;
    private _originH: number;

    constructor(originW: number, originH: number) {
        this._originW = originW;
        this._originH = originH;
        this.renderObject = new PIXI.Container();
    }

    addChild(sprite: Sprite) {
        this.renderObject.addChild(sprite.renderObject);
        this._children.push(sprite);
    }

    removeChild(sprite: Sprite) {
        this.renderObject.removeChild(sprite.renderObject);
        this._children = this._children.filter((item) => item.element.id !== sprite.element.id);
    }

    setScale(value: number) {
        this.renderObject.scale.set(value, value);
    }

    setPosition(x: number, y: number) {
        this.renderObject.position.set(x, y);
    }

    get children() {
        return this._children;
    }
}
