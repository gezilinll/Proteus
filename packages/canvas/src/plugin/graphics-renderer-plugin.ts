import { Editor, Plugin } from '@blitz/core';
import * as PIXI from 'pixi.js';
import { Subscription } from 'rxjs';

import { BlitzRenderer } from '../renderer';

export class GraphicsRendererPlugin implements Plugin {
    name: string = 'graphics-renderer-plugin';

    private _renderer: BlitzRenderer;
    private _sprite: PIXI.Graphics;
    private _subscriptions: Subscription[] = [];

    constructor(renderer: BlitzRenderer) {
        this._renderer = renderer;
        this._sprite = new PIXI.Graphics();
    }

    mount(editor: Editor): void {
        this._subscriptions.push(
            editor.events.addElement.subscribe((element) => {
                console.error(element);
            })
        );
    }

    unmount(_editor: Editor): void {
        this._subscriptions.every((item) => item.unsubscribe());
        this._subscriptions = [];
    }
}
