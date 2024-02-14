import { defineStore } from 'pinia';

import { CreationType } from '../defines';

export declare type OnWheelListener = (moveX: number, moveY: number) => void;
export declare type UnregisterListener = () => void;

export const useBlitzStore = defineStore('blitz', {
    state: () => {
        return {
            selectedFunction: 'selector' as CreationType,
            brushConfig: {
                color: '#000000',
                weight: 2,
            },
        };
    },
    actions: {},
});
