import { Editor, Plugin } from '@blitz/core';
import * as PIXI from 'pixi.js';
import { Subscription } from 'rxjs';

import { BlitzRenderer } from '../renderer';

export class GraphicsRendererPlugin implements Plugin {
    name: string = 'graphics-renderer-plugin';

    private _renderer: BlitzRenderer;
    private _subscriptions: Subscription[] = [];

    constructor(renderer: BlitzRenderer) {
        this._renderer = renderer;
    }

    mount(editor: Editor): void {
        this._subscriptions.push(
            editor.events.addElement.subscribe((element) => {
                if (element.type === 'graphics') {
                    const sprite = new PIXI.Graphics();
                    sprite.beginFill(0xff0000);
                    sprite.drawRect(0, 0, 200, 100);
                    this._renderer.addSprite(sprite);
                }
            })
        );
    }

    unmount(_editor: Editor): void {
        this._subscriptions.every((item) => item.unsubscribe());
        this._subscriptions = [];
    }
}
