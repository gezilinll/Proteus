import { defineStore } from 'pinia';

import { Editor } from './editor';

export interface State {}

const _editor = new Editor();

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {} as State;
    },

    getters: {
        editor: () => {
            return _editor as Editor;
        },
    },
    actions: {},
});
