import * as PIXI from 'pixi.js';

import { Sprite } from './base-sprite';

export class ViewportSprite {
    renderObject: PIXI.Container;

    private _children: Sprite[] = [];
    private _childrenMap: Map<string, Sprite> = new Map();

    constructor() {
        this.renderObject = new PIXI.Container();
    }

    addChild(sprite: Sprite) {
        this.renderObject.addChild(sprite.renderObject);
        this._children.push(sprite);
        this._childrenMap.set(sprite.element.id, sprite);
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

    getSpriteBound(id: string) {
        return this._childrenMap.get(id)!.renderObject.getBounds();
    }

    destroy() {
        this.renderObject.destroy(true);
    }

    get children() {
        return this._children;
    }
}
