import { Element } from '@blitz/store';
import * as PIXI from 'pixi.js';

export abstract class Sprite {
    abstract renderObject: PIXI.Container;
    protected _element: Element;
    protected _scale: number = 1.0;

    constructor(element: Element) {
        this._element = element;
    }

    render() {
        this.renderObject.position.x = this._element.left;
        this.renderObject.position.y = this._element.top;
    }

    set scale(value: number) {
        this._scale = value;
    }

    get element() {
        return this._element;
    }
}
