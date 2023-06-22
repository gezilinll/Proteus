import { defineStore } from 'pinia';
import { Editor } from './Editor';

export enum FunctionType {
    None,
    Brush,
}

export enum BrushType {
    Pen,
    Marker,
    Highlighter,
    Eraser,
    Selector,
}

export enum BrushConfig {
    None,
    Color,
    Weight,
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editor: new Editor(),

            selectedFunction: FunctionType.None,
            brushType: BrushType.Pen,
            brushConfig: BrushConfig.None,
            penColor: '#2d90eb',
            penWeight: 4,
            markerColor: '#e7191f',
            markerWeight: 12,
            highlighterColor: '#FFF234CB',
            highlighterWeight: 36,

            disablePanelEvents: false,
        };
    },
});
