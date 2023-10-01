import { defineStore } from 'pinia';
import { FunctionPanelItem } from '../Defines';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            selectedFunction: 'selector' as FunctionPanelItem,
            brushConfig: {
                color: '#000000',
                weight: 2,
            },
            showVideoChatPanel: false,
        };
    },
});
