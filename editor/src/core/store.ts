import { ElementType, Point } from '@blitz/store';
import { defineStore } from 'pinia';

import { Editor } from './editor';

export type MouseType = 'grab' | 'select' | 'brush' | 'text' | 'shape';

export interface BrushParam {
    weight: number;
    color: string;
}

export interface ViewportParam {
    left: number;
    top: number;
    scale: number;
    origin?: Point;
}

interface State {
    mouseType: MouseType;

    brushParam: BrushParam;

    viewport: ViewportParam;
}

const _editor = new Editor();

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            mouseType: 'select',

            brushParam: { weight: 2, color: 'rgb(0, 0, 0)' },

            viewport: { left: 0, top: 0, scale: 1.0 },
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
