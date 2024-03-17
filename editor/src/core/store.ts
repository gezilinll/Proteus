import { ElementType } from '@blitz/store';
import { defineStore } from 'pinia';

import { Editor } from './editor';

export type MouseType = 'grab' | 'select' | 'brush' | 'text' | 'shape';

export interface BrushParam {
    weight: number;
    color: string;
}

interface State {
    mouseType: MouseType;

    brushParam: BrushParam;
}

const _editor = new Editor();

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            mouseType: 'select',

            brushParam: { weight: 10, color: 'rgb(128, 128, 128)' },
        } as State;
    },

    getters: {
        editor: () => {
            return _editor as Editor;
        },
    },
    actions: {
        mouseTypeToElementType(): ElementType {
            return this.mouseType === 'grab' || this.mouseType === 'select'
                ? 'invalid'
                : this.mouseType;
        },
    },
});
