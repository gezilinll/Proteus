import { defineStore } from 'pinia';

import { BackgroundRenderer } from '../renderer/background-renderer';
import { DocRenderer } from '../renderer/doc-renderer';
import { Editor } from './editor';

interface State {
    editor: Editor | null;
    docRenderer: DocRenderer | null;
    backgroundRenderer: BackgroundRenderer | null;
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editor: null,
            docRenderer: null,
            backgroundRenderer: null,
        } as State;
    },
    actions: {
        setupEditor(editor: Editor) {
            this.editor = editor;
        },
        setupRenderer(docRenderer: DocRenderer, bgRenderer: BackgroundRenderer) {
            this.backgroundRenderer = bgRenderer;
            this.docRenderer = docRenderer;
        },
    },
});
