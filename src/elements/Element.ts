import { ElementBox } from '../Editor.store';
import * as PIXI from 'pixi.js';

export abstract class Element {
    protected abstract _sprite: PIXI.DisplayObject;

    move(x: number, y: number): void {
        this._sprite.position.x += x;
        this._sprite.position.y += y;
    }

    isInHitArea(x: number, y: number) {
        return this._sprite.getBounds().contains(x, y);
    }

    get bbox(): ElementBox {
        const bounds = this._sprite.getBounds();
        return { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height };
    }

    abstract render(): void;
}
