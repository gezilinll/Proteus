import { ElementType, Point } from '@blitz/store';
import { defineStore } from 'pinia';

import { Editor } from '../core/editor';
import { DocRenderer } from '../renderer/doc-renderer';

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
}

const _editor = new Editor();
const _renderer = new DocRenderer();

export const useBoardStore = defineStore('board', {
    state: () => {
        return {
            mouseType: 'select',

            brushParam: { weight: 2, color: 'rgb(0, 0, 0)' },
        } as State;
    },

    getters: {
        editor: () => {
            return _editor as Editor;
        },

        renderer: () => {
            return _renderer as DocRenderer;
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
