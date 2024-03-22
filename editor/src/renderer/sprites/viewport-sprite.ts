import * as PIXI from 'pixi.js';

import { Sprite } from './base-sprite';

export class ViewportSprite {
    renderObject: PIXI.Container;

    private _children: Sprite[] = [];

    constructor() {
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

    get children() {
        return this._children;
    }
}
