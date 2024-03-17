import { Editor } from '../core/editor';
import { Plugin } from '../core/plugin';
import { useEditorStore } from '../core/store';

export class ZoomDragPlugin implements Plugin {
    name: string = 'zoom-drag';

    mount(editor: Editor): void {
        const store = useEditorStore();

        editor.events.zoomCanvasTo.subscribe((value) => {
            store.backgroundRenderer?.zoomTo(value);
            store.backgroundRenderer?.render();
        });
        editor.events.moveCanvasTo.subscribe((value) => {
            store.backgroundRenderer?.moveTo(value.x, value.y);
            store.backgroundRenderer?.render();
        });
    }

    unmount(editor: Editor): void {}
}
