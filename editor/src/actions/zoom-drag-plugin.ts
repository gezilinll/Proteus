import { Editor } from '../core/editor';
import { Plugin } from '../core/plugin';
import { useEditorStore } from '../core/store';

export class ZoomDragPlugin implements Plugin {
    name: string = 'zoom-drag';

    mount(editor: Editor): void {
        const store = useEditorStore();

        editor.events.zoom.subscribe((value) => {
            store.backgroundRenderer?.zoomTo(value);
            store.backgroundRenderer?.render();
        });
        editor.events.drag.subscribe((value) => {
            store.backgroundRenderer?.dragTo(value.x, value.y);
            store.backgroundRenderer?.render();
        });
    }

    unmount(editor: Editor): void {}
}
