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

export enum MouseType {
    Brush,
    Select,
    Drag,
}

export interface ElementBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const useEditorStore = defineStore('editor', {
    state: () => {
        return {
            editor: new Editor(),
            mouseType: MouseType.Select,
            zoom: 100,

            selectedFunction: FunctionType.None,
            brushType: BrushType.Selector,
            brushConfig: BrushConfig.None,
            penColor: '#2d90eb',
            penWeight: 4,
            markerColor: '#e7191f',
            markerWeight: 12,
            highlighterColor: '#FFF234CB',
            highlighterWeight: 36,

            disablePanelEvents: false,
            showElementBox: false,
            elementBox: {} as ElementBox,
        };
    },
    actions: {
        useFunction(type: FunctionType) {
            if (type === FunctionType.Brush) {
                if (this.brushType === BrushType.Selector) {
                    this.useBrush(BrushType.Pen);
                }
                this.mouseType = MouseType.Brush;
            } else {
                this.mouseType = MouseType.Select;
            }
            this.selectedFunction = type;
        },

        useBrush(type: BrushType) {
            if (type !== BrushType.Selector) {
                this.mouseType = MouseType.Brush;
            }
            this.brushConfig = BrushConfig.None;
            this.brushType = type;
        },

        useMouse(type: MouseType) {
            if (type !== MouseType.Brush) {
                this.useBrush(BrushType.Selector);
            }
            this.mouseType = type;
        },

        useCanvas() {
            this.brushConfig = BrushConfig.None;
        }
    },
});
