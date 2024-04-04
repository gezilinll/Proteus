import { BrushElement } from '@blitz/store';

import { Editor } from '../../core/editor';
import { Plugin } from '../../core/plugin';
import { DocRenderer } from '../doc-renderer';
import { BrushSprite } from '../sprites/brush-sprite';

export class BrushSpritePlugin implements Plugin {
    name: string = 'brush-sprite';

    private _sprites: Map<string, BrushSprite> = new Map();
    private _renderer: DocRenderer;

    constructor(renderer: DocRenderer) {
        this._renderer = renderer;
    }

    mount(editor: Editor): void {
        editor.events.addElement.subscribe((element) => {
            if (element.type === 'brush') {
                const sprite = new BrushSprite(element as BrushElement);
                sprite.scale = this._renderer.viewportParam.scale;
                this._sprites.set(element.id, sprite);
                this._renderer.addSprite(sprite);
            }
        });
        editor.events.changeElement.subscribe((element) => {
            if (element.type === 'brush') {
                this._sprites.get(element.id)!.render();
            }
        });
        editor.events.removeElement.subscribe((element) => {
            if (element.type === 'brush') {
                const sprite = this._sprites.get(element.id)!;
                this._renderer.removeSprite(sprite);
                this._sprites.delete(element.id);
            }
        });
    }

    unmount(editor: Editor): void {}
}
