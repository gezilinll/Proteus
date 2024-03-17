import { Editor } from '../../core/editor';
import { Plugin } from '../../core/plugin';
import { DocRenderer } from '../doc-renderer';

export class ZoomDragPlugin implements Plugin {
    name: string = 'zoom-drag';

    private _renderer: DocRenderer;

    constructor(renderer: DocRenderer) {
        this._renderer = renderer;
    }

    mount(editor: Editor): void {
        editor.events.zoomCanvasTo.subscribe((value) => {
            this._renderer.zoomCanvasTo(value);
        });
        editor.events.moveCanvasTo.subscribe((value) => {
            this._renderer.moveCanvasTo(value.x, value.y);
        });
    }

    unmount(editor: Editor): void {}
}
