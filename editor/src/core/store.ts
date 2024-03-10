import { defineStore } from 'pinia';

import { Editor } from './editor';

interface State {
    editor: Editor | null;
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editor: null,
        } as State;
    },
    actions: {
        setEditor(value: Editor) {
            this.editor = value;
        },
    },
});
