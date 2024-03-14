import { defineStore } from 'pinia';

import { BackgroundRenderer } from '../renderer/background-renderer';
import { DocRenderer } from '../renderer/doc-renderer';
import { Editor } from './editor';

interface State {
    editor: Editor;
    docRenderer: DocRenderer | null;
    backgroundRenderer: BackgroundRenderer | null;
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editor: new Editor(),
            docRenderer: null,
            backgroundRenderer: null,
        } as State;
    },
    actions: {
        setupRenderer(docRenderer: DocRenderer, bgRenderer: BackgroundRenderer) {
            this.backgroundRenderer = bgRenderer;
            this.docRenderer = docRenderer;
        },
    },
});
