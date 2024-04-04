import * as PIXI from 'pixi.js';

import { Sprite } from './base-sprite';

export class BBoxSprite {
    renderObject: PIXI.Container;

    constructor() {
        this.renderObject = new PIXI.Container();
        this.renderObject.name = 'BBOX';
    }

    addChild(sprite: PIXI.DisplayObject) {
        this.renderObject.addChild(sprite);
    }

    removeChild(sprite: Sprite) {
        this.renderObject.removeChild(sprite.renderObject);
    }

    clear() {
        this.renderObject.removeChildren();
    }

    destroy() {
        this.renderObject.destroy(true);
    }
}
