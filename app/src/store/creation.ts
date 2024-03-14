import { ElementType } from '@blitz/store';
import { defineStore } from 'pinia';

export type SecondaryPanelType = 'none' | 'brush';
export type BrushType = 'pen' | 'highlighter' | 'eraser';
export type MouseType = 'grab' | 'select' | 'brush' | 'text' | 'shape';

export interface BrushConfig {
    type: BrushType;
    penConfigs: { weight: number; color: string }[];
    currentPenConfigIndex: number;
    highlighterConfigs: { index: number; weight: number; color: string }[];
    currentHighlighterConfigIndex: number;
    currentWeight: number;
    currentColor: string;
}

interface State {
    mouseType: MouseType;
    secondaryPanelType: SecondaryPanelType;
    brushConfig: BrushConfig;
}

export const useCreationStore = defineStore('creation', {
    state: () => {
        return {
            mouseType: 'select',

            secondaryPanelType: 'none',

            brushConfig: {
                type: 'pen',
                penConfigs: [
                    {
                        weight: 2,
                        color: 'rgb(0, 0, 0)',
                    },
                    { weight: 10, color: 'rgb(0, 0, 0)' },
                    { weight: 20, color: 'rgb(128, 128, 128)' },
                ],
                currentPenConfigIndex: 0,
                highlighterConfigs: [
                    {
                        weight: 20,
                        color: 'rgba(254, 249, 157, 0.6)',
                    },
                    { weight: 20, color: 'rgba(240, 185, 20, 0.6)' },
                    { weight: 20, color: 'rgba(227, 241, 156, 0.6)' },
                ],
                currentHighlighterConfigIndex: 0,
                currentWeight: 0,
                currentColor: 'rgba(0, 0, 0, 0)',
            },
        } as State;
    },
    actions: {
        mouseTypeToElementType(): ElementType {
            return this.mouseType === 'grab' || this.mouseType === 'select'
                ? 'none'
                : this.mouseType;
        },
    },
});
