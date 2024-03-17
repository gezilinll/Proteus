import { Element } from '@blitz/store';
import * as PIXI from 'pixi.js';

export abstract class Sprite {
    abstract renderObject: PIXI.Container;

    render(element: Element) {
        this.renderObject.position.x = element.left;
        this.renderObject.position.y = element.top;
    }
}
