import { ElementBox } from '../Editor.store';
import { v4 as uuidv4 } from 'uuid';
import * as PIXI from 'pixi.js';

export abstract class Element {
    abstract sprite: PIXI.DisplayObject;
    id: string;

    constructor(uuid?: string) {
        this.id = uuid ?? uuidv4();
    }

    move(x: number, y: number) {
        this.sprite.position.x += x;
        this.sprite.position.y += y;
    }

    moveTo(x: number, y: number) {
        this.sprite.position.x = x;
        this.sprite.position.y = y;
    }

    isInHitArea(x: number, y: number) {
        return this.sprite.getBounds().contains(x, y);
    }

    get bbox(): ElementBox {
        const bounds = this.sprite.getBounds();
        return { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height };
    }

    abstract render(): void;
}
