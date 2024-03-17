import { defineStore } from 'pinia';

import { BackgroundRenderer } from '../renderer/background-renderer';
import { DocRenderer } from '../renderer/doc-renderer';
import { Editor } from './editor';

export interface State {
    docRenderer: DocRenderer | null;
    backgroundRenderer: BackgroundRenderer | null;
}

const _editor = new Editor();

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            docRenderer: null,
            backgroundRenderer: null,
        } as State;
    },

    getters: {
        editor: () => {
            return _editor as Editor;
        },
    },
    actions: {
        setupRenderer(docRenderer: DocRenderer, bgRenderer: BackgroundRenderer) {
            this.backgroundRenderer = bgRenderer;
            this.docRenderer = docRenderer;
        },
    },
});
