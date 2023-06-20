import { defineStore } from 'pinia';
import { Editor } from './Editor';

export enum FunctionType {
    None,
    Draw,
}

export enum DrawType {
    None,
    Pen,
    Marker,
    Highlighter,
    Eraser,
    Selector,
    Color,
    Settings,
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editor: new Editor(),
            selectedFunction: FunctionType.None,
            drawType: DrawType.None,
            penColor: "#2d90eb",
            penWeight: 4,
            penTransparency: 100,
            markerColor: "e7191f",
            markerWeight: 12,
            markerTransparency: 100,
            highlighterColor: "#fff234",
            highlighterWeight: 36,
            highlighterTransparency: 50,
        };
    },
});
