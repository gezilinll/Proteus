import { BrushElement } from '@blitz/store';
import { filter, Subscription } from 'rxjs';

import { Editor } from '../../core/editor';
import { Plugin } from '../../core/plugin';
import { DocRenderer } from '../doc-renderer';
import { BrushSprite } from '../sprites/brush-sprite';

export class BrushSpritePlugin implements Plugin {
    name: string = 'brush-sprite';

    private _sprites: Map<string, BrushSprite> = new Map();
    private _renderer: DocRenderer;
    private _subscriptions: Subscription[] = [];

    constructor(renderer: DocRenderer) {
        this._renderer = renderer;
    }

    mount(editor: Editor): void {
        this._subscriptions.push(
            editor.events.addElement
                .pipe(filter((element) => element.type === 'brush'))
                .subscribe((element) => {
                    const sprite = new BrushSprite(element as BrushElement);
                    sprite.scale = this._renderer.viewportParam.scale;
                    this._sprites.set(element.id, sprite);
                    this._renderer.addSprite(sprite);
                })
        );
        this._subscriptions.push(
            editor.events.changeElement
                .pipe(filter((element) => element.type === 'brush'))
                .subscribe((element) => {
                    this._sprites.get(element.id)!.render();
                })
        );
        this._subscriptions.push(
            editor.events.removeElement
                .pipe(filter((element) => element.type === 'brush'))
                .subscribe((element) => {
                    const sprite = this._sprites.get(element.id)!;
                    this._renderer.removeSprite(sprite);
                    this._sprites.delete(element.id);
                })
        );
    }

    unmount(editor: Editor): void {
        for (const subscription of this._subscriptions) {
            subscription.unsubscribe();
        }
        this._subscriptions = [];
    }
}
