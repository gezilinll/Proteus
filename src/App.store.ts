import { defineStore } from 'pinia';
import { FunctionItem } from './Defines';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            functionType: 'selector' as FunctionItem,
        };
    },
});
