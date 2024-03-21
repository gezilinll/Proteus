import * as PIXI from 'pixi.js';

import { Editor } from '../../core/editor';
import { Plugin } from '../../core/plugin';
import { useEditorStore } from '../../core/store';

export class HoveringPlugin implements Plugin {
    name: string = 'hover-plugin';

    private _viewport: PIXI.Container;
    private _container: PIXI.Container;
    private _bbox: PIXI.Graphics;

    constructor(viewport: PIXI.Container, container: PIXI.Container) {
        this._viewport = viewport;
        this._container = container;
        this._bbox = new PIXI.Graphics();
        this._bbox.visible = false;
        this._container.addChild(this._bbox);
    }

    mount(editor: Editor): void {
        editor.events.hovering.subscribe((event) => {
            const store = useEditorStore();
            if (store.mouseType !== 'select') {
                return;
            }
            for (const child of this._viewport.children) {
                const bounds = child.getBounds();
                if (bounds.contains(event.x, event.y)) {
                    this._bbox.clear();
                    this._bbox.lineStyle(2, 0x1e90ff, 1);
                    this._bbox.drawRect(0, 0, bounds.width + 2, bounds.height + 2);
                    this._bbox.position.x = bounds.left - 1;
                    this._bbox.position.y = bounds.top - 1;
                    this._bbox.visible = true;
                    return;
                }
            }
            this._bbox.visible = false;
        });
    }

    unmount(editor: Editor): void {
        throw new Error('Method not implemented.');
    }
}
