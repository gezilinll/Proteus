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
    Settings,
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
            penTransparency: 100,
            markerColor: '#e7191f',
            markerWeight: 12,
            markerTransparency: 100,
            highlighterColor: '#fff234',
            highlighterWeight: 36,
            highlighterTransparency: 50,
        };
    },
});
