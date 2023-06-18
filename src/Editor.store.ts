import { defineStore } from 'pinia';

export enum FunctionType {
    None,
    Draw,
}

export enum DrawType {
    Pen,
    Marker,
    Highlighter,
    Eraser,
    Selector,
    Color,
    Settings,
}

export const useEditorStore = defineStore('room', {
    state: () => {
        return {
            selectedFunction: FunctionType.None,
            draw: DrawType.Pen,
        };
    },
});
