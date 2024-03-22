import { Element } from '@blitz/store';
import * as PIXI from 'pixi.js';

export abstract class Sprite {
    abstract renderObject: PIXI.Container;
    protected _element: Element;

    constructor(element: Element) {
        this._element = element;
    }

    render() {
        this.renderObject.position.x = this._element.left;
        this.renderObject.position.y = this._element.top;
    }

    get element() {
        return this._element;
    }
}
