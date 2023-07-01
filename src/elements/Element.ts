import { ElementBox } from '../Editor.store';
import * as PIXI from 'pixi.js';

export abstract class Element {
    abstract sprite: PIXI.DisplayObject;

    move(x: number, y: number): void {
        this.sprite.position.x += x;
        this.sprite.position.y += y;
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
